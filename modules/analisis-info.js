function getInfoDeDocumento(datos) {
  console.log('====================datos para analizar=====');
  console.log(datos);
  console.log('=============================================');
  let espace = /\s/g;

  let paramIne = /INSTITUTO NACIONAL ELECTORAL/i;
  let paramIne1 = /CREDENCIAL PARA VOTAR/i;
  let ine = paramIne.test(datos);
  let ine1 = paramIne1.test(datos);
  let cfeCompDom = /Suministrador de Servicios Básicos CFE/i.test(datos);
  let cfeCompDom1 = /CFE Suministrador de Servicios Básicos/i.test(datos);
  let cfeCompDom2 = /CFE Suministrador de Servlclos Báslcos/i.test(datos);
  let tmxCompDom = /TELEFONOS DE MEXICO/i.test(datos);
  let pasapComp = /PASAPORTE/i.test(datos);
  let pasapCompMEX = /Estados Unidos Mexicanos/i.test(datos);
  let axtelComp = /axtel/i.test(datos);
  let formMigraComp = /FORMA MIGRATORIA/i.test(datos);
  let dniComp = /(documento nacional de identidad)|(c[e|é]dula de identidad)|dni/i.test(datos);

  if (ine == true || ine1 == true) {
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
      typeDoc: 'identificación personal'
    };
    return datosDoc;
  }

  if (cfeCompDom == true || cfeCompDom1 == true || cfeCompDom2 == true) {
    let exprCp = /\d{5}/;
    let exprCp1 = /[C.P.|CP]/i;

    var posRfc = datos.indexOf('RFC:');
    var posNoServi = datos.indexOf('NO. DE SERVICIO');
    var datosRep = datos.slice(posRfc + 17, posNoServi);
    var posTotal = datosRep.indexOf('TOTAL');
    var posMN = datosRep.indexOf('M.N');
    // var datosRep1 = datosRep.slice(0, sposTotal - 1);
    // let exprPass = /([A-Z]{2,15})\s(\d{2})\s([A-Z]{2,15})\s([A-Z]{2,15})/;
    let exprPass = /[A-Z]{2,15}\s[\d{2}|[A-Z]{2,15}]?\s[A-Z]{2,15}\s[A-Z]{2,15}/;

    var passN = datosRep.match(exprPass);
    var posName = datosRep.indexOf(passN[0]);
    var nombre = passN[0];
    var nombreArr = nombre.split(' ');
    var datosRep1 = datosRep.slice(posName, datosRep.length - 1);
    var posTotal = datosRep1.indexOf('TOTAL');
    var codPost = datosRep1.match(exprCp);
    var posCp = datosRep1.indexOf(codPost[0]);
    var codPost1 = datosRep1.match(exprCp1);
    var posCp1 = datosRep1.indexOf(codPost1[0]);
    if (posTotal > 0) {
      let lastInDNam = datosRep1.lastIndexOf(nombre);
      let dir1 = datosRep1.slice(lastInDNam, posCp1);
      let dir2 = datosRep1.slice(posCp + 5, posTotal - 1);
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
      typeDoc: 'comprobante domicilio'
    };
    return datosDoc;
  }


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

    var direccion = datosRep.slice(name[0].length, poscp1-5);

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
      wichOne: 'Recibo de télefono Telmex',
      typeDoc: 'comprobante domicilio'
    };
    return datosDoc;
  }

  if (pasapComp && pasapCompMEX && !formMigraComp) {
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
      typeDoc: 'identificación personal'
    };
    return datosDoc;
  }

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
      typeDoc: 'comprobante domicilio'
    };
    return datosDoc;
  }

  if (formMigraComp && pasapCompMEX) {
    let posNombre = datos.indexOf('Nombre');
    let posTransp = datos.indexOf('Medio de Transporte');
    let datosRep = datos.slice(posNombre + 6, posTransp);
    let posNombre1 = datosRep.indexOf('1');
    let posNombre2 = datosRep.indexOf('2');
    let posNombre3 = datosRep.indexOf('3');
    let nombre1 = datosRep.slice(posNombre1 + 1, posNombre2);
    let nombre2 = datosRep.slice(posNombre2 + 1, posNombre3);

    let datosDoc = {
      idTypeDoc: 1,
      nombre: {
        fullName: nombre1 + nombre2,
        ape1: nombre2,
        ape2: '',
        name1: nombre1,
        name2: ''
      },
      domicilio: '',
      cp: '',
      wichOne: 'Forma migratoria múltiple',
      typeDoc: 'identificación personal'
    };
    return datosDoc;
  }

  if (dniComp) {
    let posApe = datos.indexOf('APELLIDOS');
    let posNom = datos.indexOf('NOMBRE');
    let posSex = datos.indexOf('SEXO');

    let apellidos = datos.slice(posApe + 10, posNom);
    let nombre = datos.slice(posNom + 7, posSex);
    let apellidosArr = apellidos.split(' ');
    let nombreArr = nombre.split(' ');


    console.log('===================extraccion de datos===================');
    console.log(datos);
    console.log('=============================================');
    let datosDoc = {
      idTypeDoc: 1,
      nombre: {
        fullName: apellidos + nombre,
        ape1: apellidosArr[0],
        ape2: apellidosArr[1],
        name1: nombreArr[0],
        name2: ''
      },
      domicilio: '',
      cp: '',
      wichOne: 'Documento Nacional De Identidad',
      typeDoc: 'identificación personal'
    };
    return datosDoc;
  }

  let datosVacios = {
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
  };
  return datosVacios;
}

module.exports.getInfoDeDocumento = getInfoDeDocumento;
