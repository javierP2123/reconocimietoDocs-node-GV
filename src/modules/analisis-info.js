var ine = require('./docsAnalysis/INE.js');
var cfe = require('./docsAnalysis/recibo-cfe.js');
var telmex = require('./docsAnalysis/recibo-telmex.js');
var axtel = require('./docsAnalysis/recibo-axtel.js');
var passMx = require('./docsAnalysis/pasaporte-mx.js');
var formMigrtMx = require('./docsAnalysis/form-migrt-mx.js');
var dni = require('./docsAnalysis/DNI.js');
var licDeCondCdmxs = require('./docsAnalysis/licencia-manejo-cdmx.js');
var reciboAguaCdmx = require('./docsAnalysis/recibo-agua-cdmx.js');
var reciboPredialCdmx = require('./docsAnalysis/recibo-predial-cdmx.js');



async function getInfoDeDocumento(datos, rostro) {
  // console.log('====================datos para analizar=====');
  // console.log(datos);
  // console.log('=============================================');

  //regresa false si no es el documento, regresa la info analizada si es el documento en cuestion
  let stsIne = ine.getInfoFromIne(datos, rostro);
  let stsCfe = await cfe.getInfoFromCfe(datos, rostro);//funcion asincona, esperar hasta que termine
  let stsTelmex = telmex.getInfoFromTelmx(datos, rostro);
  let stsAxtel = axtel.getInfoFromAxt(datos, rostro);
  let stsPassMx = passMx.getInfoFromPasspMX(datos, rostro);
  let stsFormMigrtMx = formMigrtMx.getInfoFromFormMigMX(datos, rostro);
  let stsDni = dni.getInfoFromDni(datos, rostro);
  let stsLicDeCondCmdx = licDeCondCdmxs.getInfoFromLicDeCondCdmx(datos, rostro);
  let stsRecibPredialCmdx = await reciboPredialCdmx.getInfoFromRecibPredialCdmx(datos, rostro);//funcion asincona, esperar hasta que termine
  let stsRecibAguaCmdx = await reciboAguaCdmx.getInfoFromRecibAguaCdmx(datos, rostro);

  if (stsIne != false) return stsIne;
  if (stsCfe != false) return stsCfe;
  if (stsTelmex != false) return stsTelmex;
  if (stsAxtel != false) return stsAxtel;
  if (stsPassMx != false) return stsPassMx;
  if (stsFormMigrtMx != false) return stsFormMigrtMx;
  if (stsDni != false) return stsDni;
  if (stsLicDeCondCmdx != false) return stsLicDeCondCmdx;
  if (stsRecibPredialCmdx != false) return stsRecibPredialCmdx;
  if (stsRecibAguaCmdx != false) return stsRecibAguaCmdx;

  return getInfoFromUnkn(); //si ningun documento es reconocido se envia vacio
}

module.exports.getInfoDeDocumento = getInfoDeDocumento;

function getInfoFromUnkn() {
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
    typeDoc: '',
    faceDetected: false
  };
  return datosVacios;
}
