const mongo = require('mongodb').MongoClient;

const configBD = require('../configuracion/bd.config');

//Crear cadena de conexion
const url = `mongodb://${configBD.SERVIDOR}:${configBD.PUERTO}`;

//objeto para hacer las consultas a la bd
let basedatos;

module.exports = {
    conectar: function () {
        mongo.connect(url,
            function (error, cliente) {
                if (error || !cliente) {
                    console.log(error);
                    return error;
                }
                basedatos = cliente.db(configBD.BASEDATOS);
                console.log('se ha establecido conexion a la base de datos');
            });
    },

    obtenerBD: function () {
        return basedatos;
    }

}