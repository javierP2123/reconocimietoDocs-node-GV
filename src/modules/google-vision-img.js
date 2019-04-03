const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();
var getInfoDeDocumento = require('./analisis-info.js');
const fs = require('fs');

let flagItem = 0;

module.exports.analisisVisionDoc = async function(archivo, mime, nombreBucket, arrayDocType, callback) {
  let bucketName = nombreBucket;
  var rostro, facedetection, rostroDetectado, resultado;

  let request = './docs/docsReceived/' + archivo;

  // const [result] = await client.documentTextDetection(request);
  // const fullTextAnnotation = result.fullTextAnnotation;
  // const respVision = fullTextAnnotation.text;
  // console.log('=============full text annotation===============');
  // console.log(fullTextAnnotation.text); //este metodo si medio reconoce algo lo pone como caracter aunque no lo sea, no es muy confiable a menos que se le meta logica avanzada(o mas tiempo jaja)
  // console.log('===========================================');



  // fullTextAnnotation.pages.forEach(page => {
  //   page.blocks.forEach(block => {
  //     block.paragraphs.forEach(paragraph => {
  //       paragraph.words.forEach(word => {
  //         if (word.confidence > 0.90) {
  //           const wordText = word.symbols.map(s => s.text).join('');
  //           // console.log(`Word text: ${wordText}`);
  //           // console.log(`Word confidence: ${word.confidence}`);
  //           resultado = resultado.concat(' '+wordText);
  //           // word.symbols.forEach(symbol => {
  //           //   console.log(`Symbol text: ${symbol.text}`);
  //           //   console.log(`Symbol confidence: ${symbol.confidence}`);
  //           // });
  //           console.log(resultado);
  //         }
  //       });
  //     });
  //   });
  // });



  const [resultados] = await client.textDetection(request);
  const detections = resultados.textAnnotations;
  // console.log('===============text detection===============');
  // console.log(detections[0].description);
  // console.log('======================================');
  const respVision = detections[0].description;

  // facedetection = await client.faceDetection(request);
  // rostroDetectado = facedetection[0].faceAnnotations[0].detectionConfidence;
  // if (rostroDetectado > 0.90) {
  //   rostro = true;
  //   console.log('Rostro detectado, confianza: ' + rostroDetectado);
  // } else {
  //   console.log('rostro no detectado, o imagen con poca calidad');
  //   rostro = false;
  // }
  rostro = true; //prueba

  let infoDeDocumento = await getInfoDeDocumento.getInfoDeDocumento(respVision, rostro); //identificar el tipo de doc

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
