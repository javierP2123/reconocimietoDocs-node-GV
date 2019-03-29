const {
  Storage
} = require('@google-cloud/storage');
const storage = new Storage();


module.exports.makeDocPublic = async function(archivo,bucketName) {
  const filename = archivo;
  // Makes the file public
  await storage
    .bucket(bucketName)
    .file(filename)
    .makePublic(function(err, apiResponse) {
      if (err) {
        console.log('error\n' + err);
      } else {
        console.log(`gs://${bucketName}/${filename} is now public.`);
      }
    });
}
