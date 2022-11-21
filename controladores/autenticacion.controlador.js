const jwt = require ('jsonwebtoken');
const configSeguridad = require('../configuracion/seguridad.config');


exports.autenticarToken = (req, res, next) => {
    //obtener el metodo desde el header de la resp
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, configSeguridad.LLAVE_TOKEN,
        (error, usuario) => {
            if (error){
                console.log(error);
                return res.sendStatus(403);
            }
            req.usuario = usuario;

            next();
        });

}