const sL = /\n/g,
  exp1 = /Sum[I1l]n[I1l]strad[O0]r\sde\sServ[I1l]c[I1l][O0]s\sB[aá]s[I1l]c[O0]s\sCFE/ig,
  exp2 = /CFE\sSum[I1l]n[I1l]strador\sde\sServ[I1l]c[I1l]os\sB[aá]s[I1l]cos/ig,
  expTotal = /T[O0]TAL\sA\sPAGAR/ig,
  expTotal1 = /T[O0]TAL/ig,
  expPerFact = /PER[I1l][O0]D[O0]\sFACTURAD[O0]/ig,
  expRfc = /RFC/ig,
  exprCpNum = /\d{5}/g,
  exprCp = /C\.?P\.?/ig,
  expInfImp = /([A-Z]{2,20}\s){2,5}/g,
  expMn = /M\.?N\.?/g,
  exprCp1 = /C\.?P\.?/i;


let getInfoFromCfe = async function(datos, rostro) {
  var cfeCompDom, cfeCompDom1, cfeCompDom2, posRfc, posNoServi, datosRep,
    posTotal, arrPeriFac, datosRep1, aux, nombre, direccion, direccion0, direccion1, direccion2,direccion3,
    direccion3, nombreArr, arrInfoLimp;
  // let datos = info.replace(sL, ' '); //quitar los saltos de linea

  cfeCompDom = exp1.test(datos);
  cfeCompDom1 = exp2.test(datos);

  if (cfeCompDom == true || cfeCompDom1 == true) {

    arrRfc1 = datos.match(expRfc);
    posRfc1 = datos.indexOf(arrRfc1[0]);

    arrPeriFac = datos.match(expPerFact);
    posPerifac = datos.indexOf(arrPeriFac[0]);

    arrMn = datos.match(expMn);
    posMn = datos.indexOf(arrMn[0]);

    datosRep = datos.slice(posRfc1, posMn);
    console.log('========datos rep==============');
    console.log(datosRep);
    console.log('======================');
    arrRfc1 = datosRep.split(sL);
    aux = arrRfc1[0].length;
    arrInfoLimp = await limpiarArr(arrRfc1);
    console.log('========datos rep==============');
    console.log(arrInfoLimp);
    console.log('======================');

    nombre = arrInfoLimp[0];
    if(arrInfoLimp.length>2){
      direccion1 = arrInfoLimp[1];
      direccion2 = arrInfoLimp[2];
      direccion3 = arrInfoLimp[3];
      direccion = direccion1+' '+direccion2+' '+direccion3;
    }else{
      direccion = arrInfoLimp[1];
    }
    nombreArr = nombre.split(' ');
    var codPost0 = direccion.match(exprCp);
    var posCp0 = direccion.indexOf(codPost0[0]);
    var codPost = direccion.match(exprCpNum);
    var posCp = datosRep.indexOf(codPost[0]);

    var secondname = (nombreArr) => {
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
      wichOne: 'Recibo de Luz CFE',
      typeDoc: 'comprobante domicilio',
      faceDetected: rostro
    };
    return datosDoc;
  } else {
    return false;
  }
}

function limpiarArr(arr) {
  let arrLimp = [];
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].includes('TOTAL') || arr[i].includes('RFC') || arr[i].includes('(') || arr[i].includes('$')) {
      arr[i] = '';
    } else {
      arrLimp.push(arr[i]);
    }
  }
  return arrLimp;
}
module.exports.getInfoFromCfe = getInfoFromCfe;
