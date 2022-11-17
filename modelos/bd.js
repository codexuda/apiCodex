const mongo = require('mongodb').MongoClient;

const configBD = require('../configuracion/bd.config');

//Crear cadena de conexion
const url = `mongodb+srv://${configBD.USUARIO}:${configBD.CLAVE}@${configBD.SERVIDOR}/${configBD.BASEDATOS}`;

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
                console.log('se ha establecido conexion a la base de datos',url);
            });
    },

    obtenerBD: function () {
        return basedatos;
    }

}

//mongodb+srv://CodexUDA:Codex2022*@codex.sdbfl4l.mongodb.net/CodexGameShop
//const url = `mongodb+srv://${configBD.SERVIDOR}:${configBD.PUERTO}`;