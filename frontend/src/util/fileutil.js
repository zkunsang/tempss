const crc = require('crc');
const AWS = require('aws-sdk');
const saveAs = require('file-saver');
const { unparse, parse } = require('papaparse');
const XLSX = require('xlsx');

const { s3Info, s3Url } = require(`../config/${process.env.NODE_ENV}/s3.json`);
const s3Source = new AWS.S3(s3Info);

const bucketRegion = 'ap-northeast-2';
AWS.config.update({ region: bucketRegion });

async function getCRC(inputFile) {
    const data = await inputFile.arrayBuffer();
    return crc.crc32(data).toString(16);
}

function getS3Url() {
    return s3Url;
}

async function s3Upload(inputFile, key) {
    const param = { Bucket: s3Info.bucket, Key: key, Body: inputFile };

    const s3UploadPromise = new Promise(function (resolve, reject) {
        s3Source.upload(param, function (err, data) {
            if (err) {
                reject(err);
                throw err;
            }

            resolve();
            console.log(`file uploaded successfully, ${data.Location}`)
        });
    });

    await s3UploadPromise;
}

function readFileAsync(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = () => { resolve(reader.result); };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}
function exportTxt(fileContents, fileName) {
    var blob = new Blob([fileContents], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `${fileName}.txt`);
}

function exportPurgeTxt(purge_list, fileName) {
    purge_list = purge_list.map((item) => `story/${item}`);
    purge_list = [...new Set(purge_list)];
    exportTxt(purge_list.join("\r\n"), fileName);
}

function exportExcel(list, sheetName, fileName) {
    var ws = XLSX.utils.json_to_sheet(list);
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, fileName);
}

function importExcel(file, fn) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = (e) => {
        var data = e.target.result;
        var workbook = XLSX.read(data, { type: 'binary' });

        workbook.SheetNames.forEach(async (sheetName) => {
            var jsonObject = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
            await fn(jsonObject);
        })
    };

    reader.onerror = function (ex) { console.log(ex); };

    reader.readAsBinaryString(file);
}

function exportCSV(list, fileName) {
    saveAs(createCSVBlob(list), fileName);
}

function createCSVFile(list, fileName) {
    return new File([createCSVBlob(list)], fileName);
}

function createCSVBlob(list) {
    const fileContents = unparse(list);
    console.log(fileContents);
    return new Blob(["\uFEFF" + fileContents], { type: "text/csv;charset=utf-8" })
}

function importCSV(file, notNullColumns, fn) {
    if (!file) return;
    const reader = new FileReader();

    reader.readAsText(file);

    reader.onload = async (e) => {
        const options = {
            dynamicTyping: true,
            delimiter: ',',
            skipEmptyLines: true,
            header: true,
        };

        const data = parse(e.target.result, options);

        await fn(removeEmptyRow(data.data, notNullColumns))
    }

    function removeEmptyRow(data, notNullColumn) {
        const retList = [];
        for (const row of data) {
            if (row[notNullColumn]) retList.push(row)
        }

        return retList;
    }
}

async function onFileDelimiter( resourceList, fileList ) {
    const ARO = _.keyBy(resourceList, "resourceId");
    const AROC32 = _.keyBy(resourceList, "crc32");

    let insertList = [];
    let updateList = [];
    let conflictList = [];

    for (var i in fileList) {
        let fileObject = {};

        let file = fileList[i];
        fileObject.file = file;
        fileObject.size = file.size;
        fileObject.resourceId = file.name;

        let file_buffer = await readFileAsync(file);
        fileObject.crc32 = crc.crc32(file_buffer).toString(16);

        const crcFile = AROC32[fileObject.crc32];
        if (crcFile) {
            fileObject.vicon = "mdi-emoticon-confused"
            conflictList.push(fileObject)
            continue;
        }

        const updateFile = ARO[fileObject.resourceId];

        if (updateFile) {
            fileObject.version = updateFile.version + 1
            updateList.push(fileObject);
            continue;
        }

        fileObject.version = 1;
        insertList.push(fileObject)
    }

    return { insertList, updateList, conflictList };
}

module.exports = {
    s3Upload,
    readFileAsync,
    exportTxt,
    exportPurgeTxt,
    exportExcel,
    importExcel,
    exportCSV,
    importCSV,
    createCSVFile,
    getCRC,
    onFileDelimiter,
    getS3Url
};