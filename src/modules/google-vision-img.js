const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();
var getInfoDeDocumento = require('./analisis-info.js');
const fs = require('fs');

let flagItem = 0;

module.exports.analisisVisionDoc = async function(archivo, mime, nombreBucket, arrayDocType, callback) {
  let bucketName = nombreBucket;
  var rostro, facedetection, rostroDetectado, resultado;

  let request = './docs/docsReceived/' + archivo;
  
  const [result] = await client.documentTextDetection(request);
  const fullTextAnnotation = result.fullTextAnnotation;
  const respVision = fullTextAnnotation.text;
  var re = /\n/g;
  resultado = respVision.replace(re, ' ');

  facedetection = await client.faceDetection(request);
  rostroDetectado = facedetection[0].faceAnnotations[0].detectionConfidence;
  if (rostroDetectado > 0.90) {
    rostro = true;
    console.log('Rostro detectado, confianza: ' + rostroDetectado);
  } else {
    console.log('rostro no detectado, o imagen con poca calidad');
    rostro = false;
  }

  let infoDeDocumento = getInfoDeDocumento.getInfoDeDocumento(resultado, rostro); //identificar el tipo de doc
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
}


// let gcsSourceUri = `gs://${bucketName}/${archivo}`;

// const request = {
//   image: {
//     source: {
//       imageUri: gcsSourceUri
//     }
//   }
// };

// client
//   .textDetection(request)
//   .then(response => {
//     if (response[0].fullTextAnnotation == null) {
//       var respVision = '';
//     }else{
//       var respVision = response[0].fullTextAnnotation.text;
//     }
//     var re = /\n/g;
//     var resultado = respVision.replace(re, ' ');
//
//     let infoDeDocumento = getInfoDeDocumento.getInfoDeDocumento(resultado); //identificar el tipo de doc
//     let idDoc = infoDeDocumento.idTypeDoc;
//     let tipoDeDocumento = infoDeDocumento.wichOne;
//
//
//     let docOjb = {
//       idTypeDoc: idDoc,
//       typeDoc: tipoDeDocumento,
//       dataDoc: respVision,
//       dataAnalized: infoDeDocumento
//     };
//
//     docOjb.numDoc = 1;
//     arrayDocType.data.push(docOjb);
//
//     callback(arrayDocType);
//
//   })
//   .catch(err => {
//     console.error(err);
//     return false;
//   });
