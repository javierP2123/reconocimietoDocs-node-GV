let getInfoFromTelmx = (datos, rostro) => {
  let tmxCompDom = /TELEFONOS DE MEXICO/i.test(datos);

  if (tmxCompDom == true) {
    let exprCp = /[C.P.|CP]/i;
    let exprCp1 = /\d{5}/i;

    let exprTel = /\(\d{2}\)\s\d{4}\s\d{4}/g;
    let exprPass = /[A-Z]{2,15}\s[A-Z]{2,15}?\s[A-Z]{2,15}\s[A-Z]{2,15}/;

    let name = datos.match(exprPass);
    let posName = datos.indexOf(name[0]);
    let posNameArr = name[0].split(' ');
    let posEdoCuenta = datos.indexOf('estado de cuenta');

    let datosRep = datos.slice(posName, posEdoCuenta);
    console.log('===================extraccion de datos===================');
    console.log(datosRep);
    console.log('=============================================');

    let lastInDNam = datosRep.lastIndexOf(name[0]);
    let cp = datosRep.match(exprCp);
    let poscp = datosRep.indexOf(cp[0]);
    let cp1 = datosRep.match(exprCp1);
    let poscp1 = datosRep.indexOf(cp1[0]);

    var direccion = datosRep.slice(name[0].length, poscp1 - 5);

    var cpValue = datosRep.slice(poscp1, poscp1 + 5);
    let datosDoc = {
      idTypeDoc: 2,
      nombre: {
        fullName: posNameArr[0] + ' ' + posNameArr[1] + ' ' + posNameArr[2],
        ape1: posNameArr[0],
        ape2: posNameArr[1],
        name1: posNameArr[2],
        name2: ''
      },
      domicilio: direccion,
      cp: cpValue,
      wichOne: 'Recibo de teléfono Telmex',
      typeDoc: 'comprobante domicilio',
      faceDetected: rostro
    };
    return datosDoc;
  } else {
    return false;
  }
}

module.exports.getInfoFromTelmx = getInfoFromTelmx;
