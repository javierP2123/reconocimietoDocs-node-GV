const sL = /\n/g;
let getInfoFromPasspMX = (info, rostro) => {
  var datos = info.replace(sL, ' '); //quitar los saltos de linea
  let pasapComp = /PASAPORTE/i.test(datos);
  let pasapCompMEX = /Estados Unidos Mexicanos/i.test(datos);
  let formMigraComp = /FORMA MIGRATORIA/i.test(datos);//comprobar que no es una forma migratoria


  if (pasapComp && pasapCompMEX && !formMigraComp && rostro) {
    let exprPass = /([A-Z]{2,15})\s([A-Z]{2,15})\s([A-Z]{2,15})/;

    let passN = datos.match(exprPass);
    let posName = datos.indexOf(passN[0]);
    let nombre = passN[0];
    let nombreArr = nombre.split(' ');
    let datosDoc = {
      idTypeDoc: 1,
      nombre: {
        fullName: nombre,
        ape1: nombreArr[0],
        ape2: nombreArr[1],
        name1: nombreArr[2],
        name2: ''
      },
      domicilio: '',
      cp: '',
      wichOne: 'Pasaporte',
      typeDoc: 'identificación personal',
      faceDetected: rostro
    };
    return datosDoc;
  } else {
    return false;
  }
}
module.exports.getInfoFromPasspMX = getInfoFromPasspMX;
