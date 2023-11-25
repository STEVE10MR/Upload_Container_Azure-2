const azureStorage = require('azure-storage');
const fs = require('fs');


const accountName = 'nodesteve';
const accountKey = 'DdU8MBcP6qhXk9UlGp/dYU3JfgT38so9/DaUfXuGu/dQTjW8g+RN7ZABS9evCek/BaQkqRts04e0+AStObl/EA==';

const blobService = azureStorage.createBlobService(accountName, accountKey);


const containerName = 'stevemaster';


function uploadFileToBlob(file) {
  
    const localFilePath = `./file/${file}`;
    const stream = fs.createReadStream(localFilePath);
    blobService.createBlockBlobFromStream(containerName, file, stream, fs.statSync(localFilePath).size, (error, result, response) => {
        if (error) {
        console.error('Error al cargar el archivo en Azure Storage:', error);
        } else {
        console.log('Archivo cargado exitosamente en Azure Storage.');
        }
    });
}

module.exports = {upload:uploadFileToBlob}