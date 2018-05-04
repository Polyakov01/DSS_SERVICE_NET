'use strict';
let Config = function(){
    let title = 'Targeted Surveys and Audit';
    let logo = 'Content/assets/image/tsa.png';
    let serverAddress = 'http://localhost:57484';
    let rootFolder = '/';
    let exportFolder = '/csv';
    let helpFile = '/help/HELP.html';
    let reportBackupFolder = 'reports/templates/backup/';
    let services = 'http://localhost:57484/api/';
 

    let serverDiskArray = ['C', 'D', 'E'];
    let nodeServer = 'http://89.218.7.214:3000';

    return {
        reportBackupFolder: reportBackupFolder,
        serverAddress: serverAddress,
        services: services,
        rootFolder: rootFolder,
        exportFolder: exportFolder,
        helpFile: helpFile,
        title: title,
        logo: logo,
        serverDiskArray: serverDiskArray,
        nodeServer: nodeServer,
        useBody: true
    };
}();
try {
    module.exports = Config;
} catch (error) {}