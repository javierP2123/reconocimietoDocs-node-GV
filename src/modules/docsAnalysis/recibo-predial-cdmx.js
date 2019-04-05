const expSl = /\n/g,
  exp1 = /SECRETAR[I1líÍ]A/ig,
  exp2 = /ADM[I1líÍ]N[I1líÍ]STRAC[I1íÍl][O0óÓ]N/ig,
  exp3 = /Y\sF[I1íÍl]NANZAS/ig,
  exprCpNum = /\d{5}/g,
  exprCp = /C\.?P\.?/ig,
  expNumCta = /N[uúUÚüÜ]MER[O0óÓ]\sDE\sC[uúUÚüÜ]ENTA/ig,
  expEntFed = /ENT[I1íÍl]DAD\sFEDT[I1íÍl]VA/ig,
  expContbte = /C[O0óÓ]NTR[I1íÍl]B[uúUÚüÜ]YENTE:/ig,
  expInfMay = /[A-Z]{2,15}/g,
  expUbic = /[uúUÚüÜ]B[I1íÍl]CAC[I1íÍl][O0óÓ]N/g;


let getInfoFromRecibPredialCdmx = async function(datos, rostro) {
  var cond1, con2, con3, nombre, direccion1, direccion2, direccion3,
    datosRep, datosRep1, datosRep2, datosRep3, arrEntFed, arrNumCta,
    posEntFed, posNumCta, arrContbte, posContbte, subNom, nombreArr, secondname, codPost;

  cond1 = exp1.test(datos);
  cond2 = exp2.test(datos);
  cond3 = exp3.test(datos);

  if (cond1 == true && cond2 == true && cond3 == true) {
    arrNumCta = datos.match(expNumCta);
    posNumCta = datos.indexOf(arrNumCta[0]);
    arrEntFed = datos.match(expEntFed);
    posEntFed = datos.indexOf(arrEntFed[0]);
    datosRep = datos.slice(posNumCta, posEntFed);
    arrContbte = datosRep.match(expContbte);
    posContbte = datosRep.indexOf(arrContbte[0]);
    datosRep1 = datosRep.slice(posContbte, datosRep.length - 1);
    datosRep2 = datosRep1.split(expSl);
    datosRep3 = await limparArr(datosRep2); //obtener puras palabras en mayuscula
    subNom = datosRep3[0];

    posContbte = subNom.indexOf(':');
    nombre = subNom.slice(posContbte + 2, subNom.length - 1); //lo mas probable es que venga el nombre en la pos 0
    nombreArr = nombre.split(' ');
    direccion = datosRep3[1] + ' ' + datosRep3[2];
    codPost = datosRep1.match(exprCpNum); //obtener el codigo postal

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
      wichOne: 'Recibo de Predial',
      typeDoc: 'comprobante domicilio',
      faceDetected: rostro
    };
    console.log('====datos de predial=======');
    console.log(datosDoc);
    console.log('==============');
    return datosDoc;
  } else {
    return false;
  }
}

function limparArr(arr) {
  let arrClean = [];
  let valExp1, valExp2;
  for (var i = 0; i < arr.length; i++) {
    valExp1 = expInfMay.test(arr[i]) && !(expUbic.test(arr[i])); //puras palabras en mayusculas y que no incluyan "ubicacion"
    valExp2 = exprCpNum.test(arr[i]) && !(expUbic.test(arr[i])); //el cp y que no contenga "ubicacion"

    if (valExp1 || valExp2) {
      arrClean.push(arr[i]);
    }
  }
  return arrClean;
}


module.exports.getInfoFromRecibPredialCdmx = getInfoFromRecibPredialCdmx;
