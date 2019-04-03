const exprNaci = /NAC[I1l][O0]NALIDAD/i;
const expAntg = /ANT[I1]G[UÜ]EDAD/i;
const expLicCond = /L[I1l]CENC[I1l]A\sDE\sC[O0]NDUC[I1l]R/i;
const expLicCond1 = /L[I1l]CENC[I1l]A\sPARA\sC[O0]NDUC[I1l]R/i;
const expExped = /EXPED[I1l]C[I1l][OÓ]n/i;
const expLic = /L[I1l]CENC[I1l]A/i;
const expNombre = /([A-Z]{2,20}\s){2,5}/;
const expRfc = /RFC/i;
const expCdmx = /CDMX/i;
const sL = /\n/g;


let getInfoFromLicDeCondCdmx = (info, rostro) => {
  var datos = info.replace(sL, ' '); //quitar los saltos de linea
  let licCond = expLicCond.test(datos);
  let licCond1 = expLicCond1.test(datos);

  if ((licCond == true && rostro == true)) {

    let arrLice = datos.match(expLic);
    let posLice = datos.indexOf(arrLice[0]);

    let arrAntg = datos.match(expAntg);
    let posAntg = datos.indexOf(arrAntg[0]);

    let datosRep0 = datos.slice(posLice + 9, posAntg);
    arrLice = datosRep0.match(expLic);
    posLice = datosRep0.indexOf(arrLice[0]);
    let datosRep1 = datosRep0.slice(posLice, datosRep0.length - 1);

    let extractName = datosRep1.match(expNombre);
    let nombre = extractName[0].split(' ');
    nombre.pop(nombre.length - 1);

    var secondname = (nombreArr => {
      if (nombreArr[3]) return nombreArr[1];
      else return '';
    });

    let datosDoc = {
      idTypeDoc: 1,
      nombre: {
        fullName: extractName[0],
        ape1: nombre[nombre.length - 2],
        ape2: nombre[nombre.length - 1],
        name1: nombre[0],
        name2: secondname(nombre)
      },
      domicilio: '',
      cp: '',
      wichOne: 'Licencia de conducir',
      typeDoc: 'identificación personal',
      faceDetected: rostro
    };
    return datosDoc;
  } else {
    if ((licCond1 == true && rostro == true)) {
      let arrRfc = datos.match(expRfc);
      let posRfc = datos.indexOf(arrRfc[0]);

      let datosRep0 = datos.slice(posRfc + 9, datos.length - 1);

      let arrCdmx = datosRep0.match(expCdmx);
      let posCdmx = datosRep0.indexOf(arrCdmx[0]);

      let datosRep1 = datosRep0.slice(0, posCdmx);

      let extractName = datosRep1.match(expNombre);
      let nombre = extractName[0].split(' ');
      nombre.pop(nombre.length - 1);

      var secondname = (nombreArr => {
        if (nombreArr[3]) return nombreArr[1];
        else return '';
      });

      let datosDoc = {
        idTypeDoc: 1,
        nombre: {
          fullName: extractName[0],
          ape1: nombre[nombre.length - 2],
          ape2: nombre[nombre.length - 1],
          name1: nombre[0],
          name2: secondname(nombre)
        },
        domicilio: '',
        cp: '',
        wichOne: 'Licencia de conducir',
        typeDoc: 'identificación personal',
        faceDetected: rostro
      };
      return datosDoc;
    } else {
      return false;
    }
  }
}

module.exports.getInfoFromLicDeCondCdmx = getInfoFromLicDeCondCdmx;
