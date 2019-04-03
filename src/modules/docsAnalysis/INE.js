const exprFechNaci = /FECHA\sDE\sNAC[I|1|l]M[I|1|l]ENT[O|0]/i;
const expr1erApe = /PR[I|1|l]MER\sAPELLID[0|O]/i;
const expr2doApe = /SEGUND[O|0]\sAPELLID[O|0]/i;
const exprNomb = /N[O|0]MBRE/i;
const exprNaci = /NAC[I|1|l][O|0]NALIDAD/i;
const exprsex1 = /SEX[O|0]/i;
const paramIne = /INSTITUT[O|0]\sNAC[I|1|l]ONAL\sELECT[O|0]RAL/i;
const paramIne1 = /CREDENC[I|1|l]AL\sPARA\sV[O|0]TAR/i;
const exprCp = /\d{5}/;
const expFecha = /(\d{2}[/|-]\d{2}[/|-]\d{4})/i;
const expClaEle = /CLAVE\sDE\sELECT[O|0]R/i;
const expDomi = /D[O|0]M[I|1|l]C[I|1|l]L[I|1|l][O|0]/i;
const sL = /\n/g;

let getInfoFromIne = (info, rostro) => {
  var datos = info.replace(sL, ' ');//quitar los saltos de linea

  let ine = paramIne.test(datos);
  let ine1 = paramIne1.test(datos);

  if ((ine == true && rostro == true) || (ine1 == true && rostro == true)) {

    //extraccion de datos de una ine nacional (no extranjera)
    let arrNomb = datos.match(exprNomb);
    let posNombre = datos.indexOf(arrNomb[0]);

    let arrClav = datos.match(expClaEle);
    let posClave = datos.indexOf(arrClav[0]);

    let datosRep = datos.slice(posNombre + 7, posClave);

    let arrFech = datosRep.match(exprFechNaci);
    let posFecha = datosRep.indexOf(arrFech[0]);

    let arrDomi = datosRep.match(expDomi);
    let posDomi = datosRep.indexOf(arrDomi[0]);

    let posCol = datosRep.indexOf('COL');
    let codPost = datosRep.match(exprCp);
    let posCp = datosRep.indexOf(codPost[0]);

    let fech = datosRep.match(expFecha);
    let posFechNum = datosRep.indexOf(fech[0]);
    console.log('====================datos para ir limpiando=====');
    console.log(posFechNum);
    console.log('=============================================');

    if (posFecha < 15) {
      let nom1 = datosRep.slice(0, posFecha - 1);
      let nom2 = datosRep.slice(posFechNum + 10, posDomi);
      var nombre = nom1 + nom2;
      let dom0 = datosRep.slice(posDomi + 10, posCp);
      let dom1 = datosRep.slice(posCp + 5, datosRep.length - 1);
      var domicilio = dom0 + dom1;
      var nombreArr = nombre.split(' ');
      var secondname = (nombreArr => {
        if (nombreArr[3]) return nombreArr[3];
        else return '';
      });
    } else {
      let fechaNum = datosRep.match(expFecha);
      let posFechaNum = datosRep.indexOf(fechaNum[0]);
      var nombre = datosRep.slice(0, posDomi);
      var nombreArr = nombre.split(' ');
      let dom0 = datosRep.slice(posDomi + 10, posFecha);
      let dom1 = datosRep.slice(posFechaNum + 10, posCp);
      let dom2 = datosRep.slice(posCp + 5, datosRep.length - 1);
      var domicilio = dom0 + dom1 + dom2;
      var secondname = (nombreArr => {
        if (nombreArr[3]) return nombreArr[3];
        else return '';
      });
    }

    let datosDoc = {
      idTypeDoc: 1,
      nombre: {
        fullName: nombre,
        ape1: nombreArr[0],
        ape2: nombreArr[1],
        name1: nombreArr[2],
        name2: secondname(nombreArr)
      },
      domicilio: domicilio,
      cp: codPost[0],
      wichOne: 'INE',
      typeDoc: 'identificación personal',
      faceDetected: rostro
    };
    return datosDoc;
  } else {
    return false;
  }
}

module.exports.getInfoFromIne = getInfoFromIne;
