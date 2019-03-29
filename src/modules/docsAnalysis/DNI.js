let getInfoFromDni = (datos, rostro) => {
  let dniComp = /(documento nacional de identidad)|(c[e|é]dula de identidad)|dni/i.test(datos);

  if (dniComp == true && rostro == true) {
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
      typeDoc: 'identificación personal',
      faceDetected: rostro
    };
    return datosDoc;
  } else {
    return false;
  }
}

module.exports.getInfoFromDni = getInfoFromDni;
