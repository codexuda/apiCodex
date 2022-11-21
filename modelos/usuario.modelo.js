const bd = require('./bd')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const configSeguridad = require('../configuracion/seguridad.config');

const Usuario = function () { }

Usuario.obtener = function (correo, respuesta) {
    const basedatos = bd.obtenerBD();

    //***** codigo MONGO para listar los usuarios
    const usuarios = basedatos.collection('usuarios')
        .aggregate([
            { $match: { correo: correo } },
            {
                $project: {
                    nombre: 1,
                    correo: 1,
                    clave: 1,
                    token: 1,
                }
            }
        ]).toArray(
            function (error, resultado) {
                if (error) {
                    console.log('Error buscando usuario usuarios ', error);
                    respuesta(error, null);
                }
                else {
                    if (resultado) {
                        respuesta(null, resultado[0]);
                    }
                    else {
                        respuesta(null, null);
                    }
                }
            });

}

Usuario.listar = function (respuesta) {
    const basedatos = bd.obtenerBD();

    //***** codigo MONGO para listar los usuarios
    basedatos.collection('usuarios')
        .find()
        .project(
            {
                nombre: 1,
                correo: 1,
                clave: 1,
                token: 1,
            }
        )
        //*****
        .toArray(
            function (error, resultado) {
                if (error) {
                    console.log('Error listando los usuarios ', error);
                    respuesta(error, null);
                }
                else {
                    respuesta(null, resultado);
                }
            }
        );
    ;
}

Usuario.agregar = function (usuario, respuesta) {
    const basedatos = bd.obtenerBD();
    //verfificar que el usuario existe
    this.obtener(usuario.correo,
        async function (error, resultado) {
            if (!resultado) {

                //***** codigo MONGO para agregar un Documento usuario
                basedatos.collection('usuarios')
                    .insertOne({
                        nombre: usuario.nombre,
                        correo: usuario.correo,
                        //este metodo es el que encripta la clave que recibe
                        clave: await bcrypt.hash(usuario.clave, 10)
                    }
                        //*****
                        , function (error, resultado) {
                            if (error) {
                                console.log('Error agregando usuario ', error);
                                respuesta(error, null);
                            }
                            else {
                                respuesta(null, usuario);
                            }
                        }

                    );
            }
        });
}

Usuario.modificar = function (usuario, respuesta) {
    const basedatos = bd.obtenerBD();

    //***** codigo MONGO para moidifcar un Documento usuario
    basedatos.collection('usuarios')
        .updateOne(
            { correo: correo },
            {
                $set: {
                    nombre: usuario.nombre,
                }
            }
            //*****
            , function (error, resultado) {
                if (error) {
                    console.log('Error modificando usuario ', error);
                    respuesta(error, null);
                    return;
                }
                //La consulta no afectó registros
                if (resultado.modifiedCount == 0) {
                    //No se encontraron registros
                    respuesta({ mensaje: "Usuario no actualizado" }, null);
                    console.log("No se actualizó el usuario ", pais);
                    return;
                }
                respuesta(null, usuario);

            }

        );
}

Usuario.cambiarClave = async function (correo, clave, respuesta) {
    const basedatos = bd.obtenerBD();

    //***** codigo MONGO para moidifcar un Documento usuario
    basedatos.collection('usuarios')
        .updateOne(
            { correo: correo },
            {
                $set: {
                    clave: await bcrypt.hash(clave, 10)
                }
            }
            //*****
            , function (error, resultado) {
                if (error) {
                    console.log('Error cambiando clave de usuario ', error);
                    respuesta(error, null);
                    return;
                }
                //La consulta no afectó registros
                if (resultado.modifiedCount == 0) {
                    //No se encontraron registros
                    respuesta({ mensaje: "Clave no cambiada" }, null);
                    console.log("No se cambió la clave del usuario ");
                    return;
                }
                respuesta(null, { mensaje: `Clave cambia al usuario ${correo}` });
            }
        );
}

//Metodo para el logueo
Usuario.login = async function (correo, clave, respuesta) {
    const basedatos = bd.obtenerBD();

    //verificar que el usuario exista
    this.obtener(correo,
        async function (error, usuarioEncontrado) {
            if (usuarioEncontrado &&
                //desencriptar la clave y compara con la del usuario
                await bcrypt.compare(clave, usuarioEncontrado.clave)) {
                //crear token si el usuario esta logueado
                const token = jwt.sign(
                    { user_id: correo },
                    configSeguridad.LLAVE_TOKEN,
                    {
                        expiresIn: '12h'
                    }
                );
                usuarioEncontrado.token = token;

                //***** codigo MONGO para cambiar el token  de usuario
                basedatos.collection('usuarios')
                    .updateOne(
                        { correo: correo },
                        {
                            $set: {
                                token: token,
                            }
                        }
                        //***
                        , function (error, resultado) {
                            if (error) {
                                console.log('Error en Login de usuario', error);
                                respuesta(error, null);
                            }
                            else {
                                respuesta(null, usuarioEncontrado);
                            }
                        }
                    );
            }
            else{
                respuesta({mensaje: 'no se puede loguear'}, null);
            }
        });
}

Usuario.eliminar = function (idusuario, respuesta) {
    const basedatos = bd.obtenerBD();

    //***** codigo MONGO para eliminar un Documento usuario
    basedatos.collection('usuarios')
        .deleteOne(
            { id: eval(idusuario) }
            //*****
            , function (error, resultado) {
                if (error) {
                    console.log('Error eliminando usuario ', error);
                    respuesta(error, null);
                }
                else {
                    if (resultado.deleteCount == 0) {
                        console.log('No se eliminó el usuario por no encontrarse');
                        respuesta({ mensaje: "usuario no encontrado" }, null);
                    }
                    else {
                        console.log(`Se eliminó el usuario con id:${idusuario}`);
                        respuesta(null, { mensaje: `Se eliminó el usuario con id:${idusuario}` });
                    }
                }
            }
        );
}



module.exports = Usuario;