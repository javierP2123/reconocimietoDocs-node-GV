const fs = require('fs');
const {
  Storage
} = require('@google-cloud/storage');

const storage = new Storage();
module.exports.deleteObject = async function(fileName, bucketName) {
  await storage.bucket(bucketName).file(fileName).delete();
  console.log(fileName + ' borrado de google storage!')

}

module.exports.deleteAllObjInServ = async function(serverFiles) {
  console.log(serverFiles);
  serverFiles.forEach(function(fileName) {
    fs.unlink('./docs/docsReceived/' + fileName, function(err) {
      if (err) throw err;

      console.log('Archivo ' + fileName + ' borrado localmente!');
    })
  });
}
