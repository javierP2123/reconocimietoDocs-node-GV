const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();
var getInfoDeDocumento = require('../modules/analisis-info.js');

let flagItem = 0;

module.exports.analisisVisionDoc = function(archivo, mime, nombreBucket, arrayDocType, callback) {
  let bucketName = nombreBucket;

  // let gcsSourceUri = `gs://${bucketName}/${archivo}`;
  let request = './docs/' + archivo;
  // const request = {
  //   image: {
  //     source: {
  //       imageUri: gcsSourceUri
  //     }
  //   }
  // };

  client
    .textDetection(request)
    .then(response => {
      if (response[0].fullTextAnnotation == null) {
        var respVision = '';
      }else{
        var respVision = response[0].fullTextAnnotation.text;
      }
      var re = /\n/g;
      var resultado = respVision.replace(re, ' ');

      let infoDeDocumento = getInfoDeDocumento.getInfoDeDocumento(resultado); //identificar el tipo de doc
      let idDoc = infoDeDocumento.idTypeDoc;
      let tipoDeDocumento = infoDeDocumento.wichOne;


      let docOjb = {
        idTypeDoc: idDoc,
        typeDoc: tipoDeDocumento,
        dataDoc: respVision,
        dataAnalized: infoDeDocumento
      };

      docOjb.numDoc = 1;
      arrayDocType.data.push(docOjb);

      callback(arrayDocType);

    })
    .catch(err => {
      console.error(err);
      return false;
    });
}
