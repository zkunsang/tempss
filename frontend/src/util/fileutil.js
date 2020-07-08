const crc = require('crc');
const AWS = require('aws-sdk');
const saveAs = require('file-saver');

const { s3_info } = require(location.host.match(/^manage-storykr.qpyou.cn/g) ? '../config/s3_qa.json' : '../config/s3_dev.json');
const s3_source = new AWS.S3(s3_info);

const bucketRegion = 'ap-northeast-2';
AWS.config.update({ region: bucketRegion });

async function get_crc(input_file) {
    return crc.crc32(input_file);
}

async function s3_upload(input_file, key) {
    console.log('s3_info: ', s3_info);

    const param = { Bucket: s3_info.bucket, Key: key, Body: input_file };

    const s3UploadPromise = new Promise(function (resolve, reject) {
        s3_source.upload(param, function (err, data) {
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
    var blob = new Blob([fileContents], {type: "text/plain;charset=utf-8"});
    saveAs(blob, `${fileName}.txt`);
}

function exportPurgeTxt(purge_list, fileName ) {
    purge_list = purge_list.map((item) => `story/${item}`);
    purge_list = [...new Set(purge_list)];
    exportTxt(purge_list.join("\r\n"), fileName);
}

module.exports = { s3_upload, readFileAsync, exportTxt, exportPurgeTxt};