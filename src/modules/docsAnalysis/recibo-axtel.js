let getInfoFromAxt = (datos, rostro) => {
  let axtelComp = /axtel/i.test(datos);

  if (axtelComp == true) {
    let exprCp = /[C.P.|CP]\s\d{5}/i;
    let exprCp1 = /\d{5}/i;
    let exprdir = /[CALLE|CDA]|[AV]/i;

    let posMesFac = datos.indexOf('Mes de Factura');
    let posEdoCta = datos.indexOf('Estado de cuenta');
    let datosRep = datos.slice(posMesFac + 13, posEdoCta);
    let exprName = /([A-Z]{2,15})\s([A-Z]{2,15})\s([A-Z]{2,15})/;

    let axtN = datosRep.match(exprName);
    let posName = datos.indexOf(axtN[0]);
    let nombre = axtN[0];
    let nombreArr = nombre.split(' ');

    let lasPosName = datosRep.lastIndexOf(nombre);
    let datosRep1 = datosRep.slice(lasPosName, datosRep.length - 1);
    let codPost = datosRep1.match(exprCp);
    let lasPosName1 = datosRep1.lastIndexOf(nombre);
    let posCp = datosRep1.indexOf(codPost[0]);
    let codPost1 = codPost[0].match(exprCp1);
    let direccion = datosRep1.slice(nombre.length + 1, posCp - 1);

    let datosDoc = {
      idTypeDoc: 2,
      nombre: {
        fullName: nombre,
        ape1: nombreArr[1],
        ape2: nombreArr[2],
        name1: nombreArr[0],
        name2: ''
      },
      domicilio: direccion,
      cp: codPost1[0],
      wichOne: 'Recibo de teléfono Axtel',
      typeDoc: 'comprobante domicilio',
      faceDetected: rostro
    };
    return datosDoc;
  } else {
    return false;
  }
}

module.exports.getInfoFromAxt = getInfoFromAxt;
