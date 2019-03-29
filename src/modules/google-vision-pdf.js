const fs = require('fs');
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();
const {
  Storage
} = require('@google-cloud/storage');

var getInfoDeDocumento = require('./analisis-info.js');
var download = require('../services/downloadFromGS');
const subirArchivo = require('../services/upload2Google.js');
const toDoPublic = require('../services/makeDocPublic.js');

const storage = new Storage();

let flagItem = 0;

module.exports.analisisVisionDoc = async function(archivo, mime, nombreBucket, arrayDocType, callback) {
  const bucketName = nombreBucket;
  const myBucket = storage.bucket(nombreBucket);
  let nombreArch = archivo;
  let posDot = archivo.indexOf('.pdf');
  let posDot1 = archivo.indexOf('.tif');
  if (posDot > 0 || posDot1 > 0) {
    nombreArch = archivo.slice(0, archivo.length - 4); //nombre sin extension
  } else {
    nombreArch = archivo;
  }

  let gcsSourceUri = `gs://${bucketName}/${archivo}`;
  const fileName = archivo; //nombre con extension o sin ella
  const gcsDestinationUri = `gs://${bucketName}/${nombreArch}`;

  const inputConfig = {
    mimeType: mime,
    gcsSource: {
      uri: gcsSourceUri,
    },
  };
  const outputConfig = {
    gcsDestination: {
      uri: gcsDestinationUri,
    },
  };
  const features = [{
    type: 'DOCUMENT_TEXT_DETECTION'
  }];
  const request = {
    requests: [{
      inputConfig: inputConfig,
      features: features,
      outputConfig: outputConfig,
    }, ],
  };
  //se sube el pdf a google storage por especificacion de google
  subirArchivo.upload2Google(archivo, mime, bucketName, async function(err, infoFromUpload) {
    if (err) throw infoFromUpload;

    const [operation] = await client.asyncBatchAnnotateFiles(request);
    const [filesResponse] = await operation.promise();
    console.log('===========filesResponse=================================');
    console.log(JSON.stringify(filesResponse));
    console.log('=========================================================');

    const [files1] = await myBucket.getFiles();
    files1.forEach(filess => {
      if (filess.name.endsWith('.json') && filess.name.includes(nombreArch)) {
        toDoPublic.makeDocPublic(filess.name, bucketName); //hacer publico el documento para su analisis desde el api de google vision
        //se descarga el archivo json con el resultado del ocr
        download.fileDownload(filess.name, bucketName, function(destArchivo) {
          fs.readFile(destArchivo, 'utf-8', function(err, data) {
            if (err) throw err;
            //obtener el texto completo del ocr
            pasarInfo(data, function(objData) {
              if (objData == null) {
                var respVision = '';
              } else {
                var respVision = objData.text;
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
          });
        });
      }
    });

  });

  function pasarInfo(data, callback) {
    //pasar a json la info gardada
    let info = JSON.parse(data);
    let infoArr = info.responses[0].fullTextAnnotation;
    callback(infoArr);
  }
}
