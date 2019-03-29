let getInfoFromIne = (datos, rostro) => {
  let paramIne = /INSTITUTO NACIONAL ELECTORAL/i;
  let paramIne1 = /CREDENCIAL PARA VOTAR/i;
  let ine = paramIne.test(datos);
  let ine1 = paramIne1.test(datos);

  if ((ine == true && rostro == true) || (ine1 == true && rostro == true)) {
    let exprCp = /\d{5}/;
    let expFecha = /(\d{2}[/|-]\d{2}[/|-]\d{4})/i;
    //extraccion de datos de una ine nacional (no extranjera)
    let posNombre = datos.indexOf('NOMBRE');
    let posClave = datos.indexOf('CLAVE DE ELECTOR');

    let datosRep = datos.slice(posNombre + 7, posClave);
    console.log('====================datos para analizar=====');
    console.log(datosRep);
    console.log('=============================================');

    let posFecha = datosRep.indexOf('FECHA DE NACIMIENTO');
    let posDomi = datosRep.indexOf('DOMICILIO');
    let posCol = datosRep.indexOf('COL');
    let codPost = datosRep.match(exprCp);
    let posCp = datosRep.indexOf(codPost[0]);

    if (posFecha < 15) {
      let nom1 = datosRep.slice(0, posFecha - 1);
      let nom2 = datosRep.slice(posFecha + 30, posDomi);
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
