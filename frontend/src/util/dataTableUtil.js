const { s3Upload, createCSVFile, getCRC } = require('./fileutil.js');

function parseDataTableVersion(versionInfo) {
    let version = "1.0";
    if (versionInfo) {
        const strVersion = versionInfo.version.toString();

        const versionSplit = strVersion.split('.');
        const majorVersion = parseInt(versionSplit[0]);
        const minorVersion = parseInt(versionSplit[1]) + 1;

        version = (majorVersion + "." + minorVersion);
    }
    
    return version.toString();
}

async function updateDataTable(
    fnGetTableVersion,
    fnUpdateTable,
    fnUpdateTableVersion,
    tableId,
    dataPayload) {

    const response = await fnGetTableVersion({ tableId });

    const versionInfo = response.versionInfo;
    const version = parseDataTableVersion(versionInfo);

    // 1. file 생성
    const file = createCSVFile(Object.values(dataPayload)[0]);
    const fileName = `${tableId}.csv`;
    const afterCRC32 = await getCRC(file);

    // 2. data update
    await fnUpdateTable(dataPayload);

    // 3. s3upload
    await s3Upload(file, `data/${version}/${fileName}`);

    // 4. dataTableVersionUpdate
    await fnUpdateTableVersion({ version, tableId, crc32: afterCRC32 });
}

module.exports = {
    parseDataTableVersion,
    updateDataTable
}