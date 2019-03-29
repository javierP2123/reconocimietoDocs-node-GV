const {
  Storage
} = require('@google-cloud/storage');
const storage = new Storage();

const fs = require('fs');

module.exports.fileDownload = async function(archivo, bucket, callback) {
  const myBucket = storage.bucket(bucket);
  let destArchivo = './docs/jsonResults/' + archivo;
  const file = myBucket.file(archivo);

  file.download().then(function(data) {
    const contents = data[0];
    fs.writeFile(destArchivo, contents, (err) => { //se guarda el archivo en el server
      if (err) throw err;
      // console.log(contents);
      callback(destArchivo);
    });
  });
}
