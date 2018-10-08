const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const _ = require('underscore');
// const { verificaToken, verifica_Permiso } = require('../middlewares/autenticacion');
const funciones = require('../../middlewares/funciones');
const Domicilio = require('../../server_direccion/models/domicilio');
const Persona = require('../../server_persona/models/persona');
const Contacto = require('../../server_contacto/models/contacto');
// const aut = require('../../middlewares/autenticacion');

let Usuario = require('../models/usuario')


// app.post('/usuario/buscar_por_dni/', async function(req, res) {
//     let usuario = await aut.validarToken(req.body.token);

//     if (!usuario) {
//         return res.status(401).json({
//             ok: false,
//             message: 'Usuario no valido'
//         });
//     } else {
//         usuario.url = '/usuario/buscar_por_dni/';
//         let acceso = await aut.verifica_Permiso(usuario);

//         if (!acceso) {
//             return res.status(403).json({
//                 ok: false,
//                 message: 'Acceso denegado'
//             });
//         } else {
//             let dni_ = req.body.dni;
//             let idRol = usuario.precedencia;
//             // console.log("dni buscado: " + dni_);
//             Usuario.find()
//                 .populate('contactos')
//                 .populate({
//                     path: 'rol',
//                     match: { precedencia: { $gt: idRol } }
//                 })
//                 .populate({ path: 'contactos', populate: { path: 'tipoContacto' } })
//                 // .populate('persona')
//                 .populate({
//                     path: 'persona',
//                     match: { dni: { $eq: dni_ } }
//                 })
//                 .populate({
//                     path: 'persona',
//                     populate: { path: 'tipoDni' },
//                     match: { dni: { $eq: dni_ } }
//                 })
//                 .populate({
//                     path: 'persona',
//                     populate: { path: 'domicilio' },
//                     match: { dni: { $eq: dni_ } }
//                 })
//                 .populate('tipoCliente')
//                 .populate({
//                     path: 'persona',
//                     populate: {
//                         path: 'domicilio',
//                         populate: { path: 'estadoCasa' }
//                     },
//                     match: { dni: { $eq: dni_ } }
//                 })
//                 .populate('referencia')
//                 // .populate('comercios')
//                 // .populate({ path: 'comercios', populate: { path: 'referencia' } })
//                 .where({ 'estado': true })
//                 .exec((err, usuario) => {

//                     // console.log(usuarios.length);

//                     if (err) {
//                         return res.status(500).json({
//                             ok: false,
//                             err
//                         });
//                     }

//                     usuario = usuario.filter(function(usuario) {
//                         return usuario.rol != null;
//                     });

//                     usuario = usuario.filter(function(usuario) {
//                         return usuario.persona != null;
//                     });

//                     if (usuario.length == 0) {
//                         return res.status(400).json({
//                             ok: false,
//                             err: {
//                                 message: 'No hay un usuario con ese DNI'
//                             }
//                         });
//                     }



//                     res.json({
//                         ok: true,
//                         recordsTotal: usuario.length,
//                         recordsFiltered: usuario.length,
//                         usuario
//                     });

//                 });
//         }
//     }
// })



app.post('/usuario/ingresar/', function(req, res) {
    let parametros = req.body;


    Usuario.findOne({ nombreUsuario: parametros.nombreUsuario, estado: { $eq: true } })
        .populate('rol', 'precedencia')
        // .where('estado' == true)
        .exec((err, usuarioDb) => {

            if (err) {
                console.log('Error: ' + err.message);
                return res.json({
                    ok: false,
                    err
                });
            }

            if (!usuarioDb) {
                // console.log('No se encontro el usuario');
                return res.json({
                    ok: false,
                    err: {
                        message: 'Nombre de usuario o clave incorrecta'
                    }
                });
            }


            if (!bcrypt.compareSync(parametros.clave, usuarioDb.clave)) {
                // console.log('La clave no coincide');
                return res.json({
                    ok: false,
                    err: {
                        message: 'Nombre de usuario o clave incorrecta'
                    }
                });
            }

            // console.log(process.env.CADUCIDAD_TOKEN);

            let token = jwt.sign({
                usuario: usuarioDb
            }, process.env.SEED, { expiresIn: 2592000 }); //process.env.CADUCIDAD_TOKEN });

            res.json({
                ok: true,
                usuario: usuarioDb,
                token
            });


        })


})





//Este metodo es el que se ejecuta cuando se esta dando de alta el comercio o el proveedor
//a diferencia del anterior, este no realiza validaciones de permisos de acceso
app.post('/usuario/nuevo/', async function(req, res) {
    let objeto = req.body;
    let avanzar = true;
    let contactoGuardado = true;
    var contactos = [];
    var idPersona;
    var email_;

    // console.log("Id de persona: " + req.body.persona._id);
    if (req.body.idPersona == '0') {

        try {
            let persona = new Persona({
                tipoDni: req.body.tipoDni,
                dni: req.body.dni,
                apellidos: req.body.apellidos,
                nombres: req.body.nombres
            });

            let respPersona = await funciones.nuevaPersona(persona);
            // console.log("Ya se dio de alta la persona");
            if (respPersona.ok)
                idPersona = persona._id;
            else
                avanzar = false;


        } catch (e) {
            // console.log('Error al generar la persona ' + e.message);
            avanzar = false;
        }
    }

    if (avanzar) {
        if (req.body.contactos) {
            // console.log("genero los contactos");
            for (var i in req.body.contactos) {
                // console.log(req.body.contactos[i]);
                if (req.body.contactos[i].tipoContacto == 'email')
                    email_ = req.body.contactos[i].email;

                let contacto = new Contacto({
                    tipoContacto: req.body.contactos[i].tipoContacto,
                    codigoPais: req.body.contactos[i].codigoPais,
                    codigoArea: req.body.contactos[i].codigoArea,
                    numeroCelular: req.body.contactos[i].numeroCelular,
                    numeroFijo: req.body.contactos[i].numeroFijo,
                    email: req.body.contactos[i].email
                });
                try {
                    // console.log("Doy de alta los contactos");
                    let respuesta = await funciones.nuevoContacto(contacto);
                    if (respuesta.ok) {
                        contactos.push(contacto._id);
                    }

                    // console.log('array de contactos antes de asignarselo al cliente: ' + contactos);
                } catch (e) {
                    // console.log('Error al guardar el contacto: ' + contacto);
                    // console.log('Error de guardado: ' + e);
                    contactoGuardado = false;
                }
            }
            //
        }

        if (contactoGuardado) {

            //por ultimo, doy de alta al usuario
            // console.log(contactos);
            // console.log("Ahora genero el usuario");
            let usuario = new Usuario({
                // _id: req.body._id,
                persona: idPersona,
                nombreUsuario: email_,
                clave: bcrypt.hashSync(objeto.clave, 10),
                rol: objeto.rol
            });
            // console.log('estos son los id de contacto que le voy cargar al cliente: ' + contactos);
            if (req.body.contactos) {
                for (var i in contactos) {
                    // console.log('el cliente tiene este contacto: ' + contactos[i]);
                    usuario.contactos.push(contactos[i]);
                }
            }
            // console.log("Doy de alta al usuario");
            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }


                res.json({
                    ok: true,
                    usuarioDB
                });
            });
        }

    } else
        res.json({
            ok: false,
            message: 'No se pudo generar el registro'
        });
})


//actualizacion de usuarios
app.post('/usuario/cambiar_clave/', async function(req, res) {


    // let usuario = req.usuario;
    let usuario = await aut.validarToken(req.body.token);

    if (!usuario) {
        return res.status(401).json({
            ok: false,
            message: 'Usuario no valido'
        });
    } else {
        let id = usuario._id;
        let body = _.pick(req.body, ['viejaClave', 'clave']);
        if (bcrypt.compareSync(body.viejaClave, usuario.clave)) {
            //aqui hago el cambio de clave
            body.clave = bcrypt.hashSync(body.clave, 10);
            Usuario.findByIdAndUpdate(id, body, { new: true }, (err, PersonaDB) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        message: 'No se pudo realizar la actualizacion'
                    });
                }
                res.json({
                    ok: true,
                    message: 'La clave se actualizo correctamente'
                });
            })
        } else {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se puede cambiar la clave, permiso denegado'
                }
            });
        }
    }
});

app.post('/usuario/blanquear_claves', async function(req, res) {

    let terminado = true;
    let usuario = await aut.validarToken(req.body.token);

    if (!usuario) {
        return res.status(401).json({
            ok: false,
            message: 'Usuario no valido'
        });
    } else {
        usuario.url = '/usuario/blanquear_claves';
        let acceso = await aut.verifica_Permiso(usuario);
        // console.log('Resultado de la comprobacion de acceso: ' + acceso);
        if (!acceso) {
            return res.status(403).json({
                ok: false,
                message: 'Acceso denegado'
            });
        } else {
            for (var i in req.body.usuarios) {
                let body = {
                    '_id': "",
                    'clave': ""
                };
                body._id = req.body.usuarios[i]._id;
                body.clave = bcrypt.hashSync(req.body.usuarios[i].clave, 10);

                // body.clave = 
                Usuario.findByIdAndUpdate(body._id, body, { new: true }, (err, PersonaDB) => {

                    if (err) {

                        return res.status(400).json({
                            ok: false,
                            message: 'No se pudo realizar la actualizacion'
                        });
                    }
                    res.json({
                        ok: true,
                        message: 'La clave se actualizo correctamente'
                    });
                });
            }
        }
    }
});



// app.put('/usuario', function(req, res) {
//     res.json('Modifica los datos de un usuario')
// })

app.post('/usuario/deshabilitar/', async function(req, res) {
    let id = req.body.idUsuario;
    var fecha = new Date();

    let usuario = await aut.validarToken(req.body.token);

    if (!usuario) {
        return res.status(401).json({
            ok: false,
            message: 'Usuario no valido'
        });
    } else {
        usuario.url = '/usuario/deshabilitar/';
        let acceso = await aut.verifica_Permiso(usuario);
        // console.log('Resultado de la comprobacion de acceso: ' + acceso);
        if (!acceso) {
            return res.status(403).json({
                ok: false,
                message: 'Acceso denegado'
            });
        } else {
            let cambiaEstado = {
                estado: false,
                nombreUsuario: fecha.toString()
            };

            Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                };

                if (!usuarioBorrado) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Usuario no encontrado'
                        }
                    });
                }

                res.json({
                    ok: true,
                    message: 'El usuario fue deshabilitado'
                });

            });
        }
    }
});

app.post('/usuario/pagar_suscripcion/', async function(req, res) {

    let billingPlan = await funciones.crearPlanPayPal('Suscripcion Mensual', 'Pago de suscripcion mensual por el uso de la aplicacion ZING',
        '4032031087659974', 'visa', 9, 2021, 111, 'Fernando', 'Soruco');
    // console.log('billing plan');
    // console.log(billingPlan);

});


app.post('/usuario/pagar_suscripcion/', async function(req, res) {

});


app.post('/paypal/success/', async function(req, res) {

    console.log('El pago de la suscripcion se realizo correctamente');

});



app.post('/paypal/success/', async function(req, res) {

    console.log('El pago de la suscripcion se realizo correctamente');

});


app.post('/paypal/cancel/', async function(req, res) {

    console.log('El pago se cancelo');

});

module.exports = app;