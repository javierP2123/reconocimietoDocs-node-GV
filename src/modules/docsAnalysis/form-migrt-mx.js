let getInfoFromFormMigMX = (datos, rostro) => {
  let formMigraComp = /FORMA MIGRATORIA/i.test(datos);
  let pasapCompMEX = /Estados Unidos Mexicanos/i.test(datos);

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
      typeDoc: 'identificación personal',
      faceDetected: rostro
    };
    return datosDoc;
  } else {
    return false;
  }
}

module.exports.getInfoFromFormMigMX = getInfoFromFormMigMX;
