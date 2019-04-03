const exprEsp = /ESPA[N|Ñ]A/i;
const exprFechNaci = /FECHA\sDE\sNAC[I|1|l]M[I|1|l]ENT[O|0]/i;
const expDni = /(documento nacional de identidad)|(c[e|é]dula de identidad)|dni/i;
const expr1erApe = /PR[I|1|l]MER\sAPELLID[0|O]/i;
const expr2doApe = /SEGUND[O|0]\sAPELLID[O|0]/i;
const exprNomb = /N[O|0]MBRE/i;
const exprNaci = /NAC[I|1|l][O|0]NALIDAD/i;
const exprsex1 = /SEX[O|0]/i;
const sL = /\n/g;

var dniComp, posApe, posNom, posSex, apellidos, nombre, apellidosArr, nombreArr,
  datosDoc, arr1erAp, pos1erApe, arr2doAp, pos2doApe, arrNomb, posNombre, arrNaci,
  posNacion, arrSex1, posSex1, arrFechNaci, posFechNaci, ape1, ape2, nombre, nombreArr, secondname, datos;

let getInfoFromDni = (info, rostro) => {
  datos = info.replace(sL, ' '); //quitar los saltos de linea
  
  dniComp = expDni.test(datos);

  if (dniComp == true && rostro == true) {
    datos1 = datos.replace(exprEsp, '');

    posApe = datos1.indexOf('APELLIDOS');
    posNom = datos1.indexOf('NOMBRE');
    posSex = datos1.indexOf('SEXO');

    if (posApe != -1 && posNom != -1 && posSex != -1) {
      apellidos = datos1.slice(posApe + 10, posNom);
      nombre = datos1.slice(posNom + 7, posSex);
      apellidosArr = apellidos.split(' ');
      nombreArr = nombre.split(' ');

      datosDoc = {
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
    }

    arr1erAp = datos1.match(expr1erApe);
    pos1erApe = datos1.indexOf(arr1erAp[0]);

    arr2doAp = datos1.match(expr2doApe);
    pos2doApe = datos1.indexOf(arr2doAp[0]);

    arrNomb = datos1.match(exprNomb);
    posNombre = datos1.indexOf(arrNomb[0]);

    arrNaci = datos1.match(exprNaci);
    posNacion = datos1.indexOf(arrNaci[0]);

    arrSex1 = datos1.match(exprsex1);
    posSex1 = datos1.indexOf(arrSex1[0]);

    arrFechNaci = datos1.match(exprFechNaci);
    posFechNaci = datos1.indexOf(arrFechNaci[0]);

    ape1 = datos1.slice(pos1erApe + 16, pos2doApe);
    ape2 = datos1.slice(pos2doApe + 17, posNombre);
    nombre = datos1.slice(posNombre + 8, posSex1);
    nombreArr = nombre.split(' ');

    secondname = (nombreArr => {
      if (nombreArr[1]) return nombreArr[1];
      else return '';
    });

    datosDoc = {
      idTypeDoc: 1,
      nombre: {
        fullName: ape1 + ape2 + nombre,
        ape1: ape1,
        ape2: ape2,
        name1: nombreArr[0],
        name2: secondname(nombreArr)
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
