const express = require('express');
const fs = require('fs');
const path = require('path');
const util = require('util');
const visionIMG = require('../modules/google-vision-img.js');
var getInfoDeDocumento = require('../modules/analisis-info.js');
const nombreBucket = 'contenedor-vision-javier1';

const router = express.Router();

let numKeys;
let flagItem = 0;
var objVacio = {
  data: [{
    idTypeDoc: 0,
    typeDoc: '',
    dataDoc: '',
    dataAnalized: {
      idTypeDoc: 0,
      nombre: {
        fullName: '',
        ape1: '',
        ape2: '',
        name1: '',
        name2: ''
      },
      domicilio: '',
      cp: '',
      wichOne: '',
      typeDoc: ''
    }
  }]
};
router.post('/', (req, res) => { //se pasa el archivo a la peticion post
  // console.log('========req=========');
  // console.log(req);
  // console.log('=================');

  if (req.files == 'undefined' || req.files == null) {
    res.send(objVacio);
  } else {
    var arrayDocType = {
      data: []
    };
    let response = '';
    let fileObj = req.files;
    numKeys = Object.keys(fileObj).length;
    console.log('========fileObj=========');
    console.log(fileObj);
    console.log('=================');

    for (item in fileObj) {
      let nombreDoc = fileObj[item].name;
      let typeMime = fileObj[item].mimetype;
      let datos = fileObj[item].data;

      fs.writeFile('./docs/' + nombreDoc, datos, (err) => { //se guarda el archivo en el server
        if (err) throw err;
        console.log('Archivo guardado localmente!');
        if (typeMime == 'image/jpeg') {
          visionIMG.analisisVisionDoc(nombreDoc, typeMime, nombreBucket, arrayDocType, function(respuesta) {
            console.log(arrayDocType);
            console.log('=============================================');
            res.send(respuesta);
          });
        }
      });
    }
  }
});

// http://servidorcmc.sytes.net:8081
// http://localhost:8081

module.exports = router;
