let export_config = {};

export_config.app = {};
export_config.google = {};

export_config.app["timezone"] = "America/mexico_city";
export_config.app["port"] = 8081;
export_config.google['bucketName'] = 'contenedor-vision-javier1';//nombre del contenedor google donde se cargaran archivos


module.exports = export_config;
