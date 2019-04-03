const sL = /\n/g;
let getInfoFromCfe = (info, rostro) => {
  let datos = info.replace(sL, ' '); //quitar los saltos de linea
  let cfeCompDom = /Suministrador de Servicios Básicos CFE/i.test(datos);
  let cfeCompDom1 = /CFE Suministrador de Servicios Básicos/i.test(datos);
  let cfeCompDom2 = /CFE Suministrador de Servlclos Báslcos/i.test(datos);


  if (cfeCompDom == true || cfeCompDom1 == true || cfeCompDom2 == true) {
    let exprCp = /\d{5}/;
    let exprCp1 = /[C.P.|CP]/i;

    var posRfc = datos.indexOf('RFC:');
    var posNoServi = datos.indexOf('NO. DE SERVICIO');
    var datosRep = datos.slice(posRfc + 17, posNoServi);
    var posTotal = datosRep.indexOf('TOTAL');
    // var datosRep1 = datosRep.slice(0, sposTotal - 1);
    // let exprPass = /([A-Z]{2,15})\s(\d{2})\s([A-Z]{2,15})\s([A-Z]{2,15})/;
    let exprPass = /[A-Z]{2,15}\s[\d{2}|[A-Z]{2,15}]?\s[A-Z]{2,15}\s[A-Z]{2,15}/;
    // let expMon = /d{2}\/d{3}\sM.N/i;
    var passN = datosRep.match(exprPass);
    var posName = datosRep.indexOf(passN[0]);
    var nombre = passN[0];
    var nombreArr = nombre.split(' ');
    var datosRep1 = datosRep.slice(posName, datosRep.length - 1);
    var posMN = datosRep1.indexOf('M.N');
    var posTotal = datosRep1.indexOf('TOTAL');
    var codPost = datosRep1.match(exprCp);
    var posCp = datosRep1.indexOf(codPost[0]);
    var codPost1 = datosRep1.match(exprCp1);
    var posCp1 = datosRep1.indexOf(codPost1[0]);

    if (posTotal > 0) {
      let lastInDNam = datosRep1.lastIndexOf(nombreArr[3]);

      let dir1 = datosRep1.slice(lastInDNam, posCp1);
      let dir2 = datosRep1.slice(posMN + 4, datosRep1.length - 1);
      var direccion = dir1 + dir2;
    } else {
      let lastInDNam = datosRep1.lastIndexOf(nombre);
      // let datosRep2 = datosRep.slice(0, posTotal - 1);
      let dir1 = datosRep1.slice(lastInDNam, posCp1 - 1);
      let cash = datosRep1.indexOf('$');
      let dir2 = datosRep1.slice(posCp + 5, cash);
      var direccion = dir1 + dir2;
    }
    var secondname = (nombreArr => {
      if (nombreArr[3]) return nombreArr[3];
      else return '';
    });

    let datosDoc = {
      idTypeDoc: 2,
      nombre: {
        fullName: nombre,
        ape1: nombreArr[0],
        ape2: nombreArr[1],
        name1: nombreArr[2],
        name2: secondname(nombreArr)
      },
      domicilio: direccion,
      cp: codPost[0],
      wichOne: 'Recibo de Luz CFE',
      typeDoc: 'comprobante domicilio',
      faceDetected: rostro
    };
    return datosDoc;
  } else {
    return false;
  }


}

module.exports.getInfoFromCfe = getInfoFromCfe;
