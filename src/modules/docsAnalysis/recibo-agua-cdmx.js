const expSl = /\n/g,
  exp1 = /S[uúUÚüÜ]M[I1líÍ]N[I1líÍ]STR[O0óÓ]\sDE\sAG[uúUÚüÜ]A/ig,
  exp2 = /SACMEX/ig,
  expFecha = /\d{2}-[A-Z]{3}-\d{4}/g,
  exprCpNum = /\d{5}/g,
  exprCp = /C\.?P\.?/ig,
  expNumCta = /N[uúUÚüÜ]MER[O0óÓ]\sDE\sC[uúUÚüÜ]ENTA/ig,
  expDatToma = /DAT[O0óÓ]S\sDE\sLA\sT[O0óÓ]MA/ig,
  expContbte = /C[O0óÓ]NTR[I1íÍl]B[uúUÚüÜ]YENTE:/ig,
  expInfMay = /[A-Z]{2,15}/g,
  expUbic = /[uúUÚüÜ]B[I1íÍl]CAC[I1íÍl][O0óÓ]N/g;

let getInfoFromRecibAguaCdmx = async function(datos, rostro) {
  var cond1, con2, nombre, direccion1, direccion2, direccion3,
    datosRep, datosRep1, datosRep2, datosRep3, arrSumAgua, arrNumCta,
    posSumAgua, posNumCta, arrContbte, posContbte, subNom, nombreArr, secondname, codPost;

  cond1 = exp1.test(datos);
  cond2 = exp2.test(datos);
  if (cond1 == true && cond2 == true) {

    arrSumAgua = datos.match(exp1);
    posSumAgua = datos.indexOf(arrSumAgua[0]);
    arrDatToma = datos.match(expDatToma);
    posDatToma = datos.indexOf(arrDatToma[0]);
    datosRep = datos.slice(posSumAgua + arrSumAgua[0].length, posDatToma);
    datosRep1 = datosRep.split(expSl);
    datosRep2 = await limparArr(datosRep1);
    console.log('===========');
    console.log(datosRep2);
    console.log('==============');

    nombre = datosRep2[0]; //lo mas probable es que venga el nombre en la pos 0
    nombreArr = nombre.split(' ');
    direccion = datosRep2[1] + ' ' + datosRep2[2];//lo mismo para la direccion
    codPost = datosRep.match(exprCpNum); //obtener el codigo postal

    secondname = (nombreArr) => {
      if (nombreArr[3]) return nombreArr[3];
      else return '';
    };

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
      wichOne: 'Recibo de agua SACMEX',
      typeDoc: 'comprobante domicilio',
      faceDetected: rostro
    };
    return datosDoc;
  } else {
    return false;
  }
}

function limparArr(arr) {
  let arrClean = [];
  let valExp1, valExp2, valExp3;
  for (var i = 0; i < arr.length; i++) {
    valExp1 = expInfMay.test(arr[i]) && !(expNumCta.test(arr[i])); //puras palabras en mayusculas y que no incluyan "numero de cuenta"
    valExp2 = exprCpNum.test(arr[i]); //el cp y que no contenga "ubicacion"
    valExp3 = valExp1 && !(exp2.test(arr[i])) && !(expFecha.test(arr[i])); //lo anterior y que no tenga sacmex o una fecha
    if (valExp3 || valExp2) {
      arrClean.push(arr[i]);
    }
  }
  return arrClean;
}

module.exports.getInfoFromRecibAguaCdmx = getInfoFromRecibAguaCdmx;
