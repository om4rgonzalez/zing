const axios = require('axios');
const paypal = require('paypal-rest-sdk');
const uuid = require('node-uuid');
const creditCardType = require('credit-card-type');

// var clientId = 'YOUR APPLICATION CLIENT ID';
// var secret = 'YOUR APPLICATION SECRET';

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AVrDr6JBUhvi6W3Cg0SN3qPYAQJn_yFGUMZ-dboVJxj5ywZU9rM0lk0ghWsaj0gwFUmeFXokOuXtw71R',
    'client_secret': 'EPDpOv9uf7P15k5Mrnm1yF-3vbdcG2W4X7NXG4WV7H0Ydyr6C9kFcJJfPprdWVb4pxdE33TFd-goNhXM'
});




let nuevaEntidad = async(entidad, domicilio) => {

    // console.log('Entidad recibida');
    // console.log(entidad);

    let URL = process.env.URL_SERVICE + process.env.PORT + '/entidad/nueva_/';
    // console.log('URL a conectarse: ' + URL);
    let resp = await axios.post(URL, {

        pais: domicilio.pais,
        provincia: domicilio.provincia,
        localidad: domicilio.localidad,
        barrio: domicilio.barrio,
        calle: domicilio.calle,
        numeroCasa: domicilio.numeroCasa,
        piso: domicilio.piso,
        numeroDepartamento: domicilio.numeroDepartamento,
        latitud: domicilio.latitud,
        longitud: domicilio.longitud,
        codigoPostal: domicilio.codigoPostal,
        idEntidad: entidad._id,
        cuit: entidad.cuit,
        razonSocial: entidad.razonSocial,
        actividadPrincipal: entidad.actividadPrincipal,
        tipoPersoneria: entidad.tipoPersoneria

    });


    return {
        ok: true,
        domicilio: resp.data.entidadDB.domicilio
    }

};

let nuevoPuntoVenta = async(punto) => {

    let URL = process.env.URL_SERVICE + process.env.PORT + '/proveedor/nuevo_punto_venta/';
    // console.log('URL a conectarse: ' + URL);
    let resp = await axios.post(URL, {
        _id: punto._id,
        nombrePuntoVenta: punto.nombrePuntoVenta,
        domicilio: punto.domicilio
    });


    return {
        ok: true
    }

};



const nuevoDetalle = async(detalle) => {

    let URL = process.env.URL_SERVICE + process.env.PORT + '/pedido/nuevo_detalle';
    // console.log('URL a conectarse: ' + URL);
    let resp = await axios.post(URL, {
        _id: detalle._id,
        producto: detalle.producto,
        unidadMedida: detalle.unidadMedida,
        cantidad: detalle.cantidad
    });

    return {
        ok: true
    }

}

let nuevoDomicilio = async(domicilio) => {

    let URL = process.env.URL_SERVICE + process.env.PORT + '/domicilio/nuevo';
    // console.log('URL a conectarse: ' + URL);
    let resp = await axios.post(URL, {
        _id: domicilio._id,
        pais: domicilio.pais,
        provincia: domicilio.provincia,
        localidad: domicilio.localidad,
        barrio: domicilio.barrio,
        calle: domicilio.calle,
        numeroCasa: domicilio.numeroCasa,
        piso: domicilio.piso,
        numeroDepartamento: domicilio.numeroDepartamento,
        latitud: domicilio.latitud,
        longitud: domicilio.longitud,
        codigoPostal: domicilio.codigoPostal
    });

    return {
        ok: true
    }

};


let nuevaPersona = async(persona) => {

    let URL = process.env.URL_SERVICE + process.env.PORT + '/persona/nueva/';
    let resp = await axios.post(URL, {
        _id: persona._id,
        tipoDni: persona.tipoDni,
        dni: persona.dni,
        apellidos: persona.apellidos,
        nombres: persona.nombres,
        domicilio: persona.domicilio,
        fechaNacimiento: persona.fechaNacimiento
    });
    // console.log('termino la ejecucion del axios');
    // console.log('Respuesta del servicio: ' + resp.contactoDB._id);

    return {
        ok: true
    }

};

const nuevoContacto = async(contacto) => {

    let URL = process.env.URL_SERVICE + process.env.PORT + '/contacto/nuevo/';
    // console.log('URL a conectarse: ' + URL);
    let resp = await axios.post(URL, {
        _id: contacto._id,
        tipoContacto: contacto.tipoContacto,
        codigoPais: contacto.codigoPais,
        codigoArea: contacto.codigoArea,
        numeroCelular: contacto.numeroCelular,
        numeroFijo: contacto.numeroFijo,
        email: contacto.email
    });
    // console.log('termino la ejecucion del axios');
    // console.log('Respuesta del servicio: ' + resp.contactoDB._id);

    return {
        ok: true
    }

};

const nuevoUsuario = async(usuario) => {
    let URL = process.env.URL_SERVICE + process.env.PORT + '/usuario/nuevo_usuario_arranque/';
    // console.log(usuario);
    let resp = await axios.post(URL, {
        _id: usuario._id,
        idPersona: 0,
        tipoDni: usuario.persona.tipoDni,
        dni: usuario.persona.dni,
        apellidos: usuario.persona.apellidos,
        nombres: usuario.nombres,
        // 'persona.fechaNacimiento': usuario.persona.fechaNacimiento,
        // 'domicilio.pais': usuario.persona.domicilio.pais,
        // 'domicilio.provincia': usuario.persona.domicilio.provincia,
        // 'domicilio.localidad': usuario.persona.domicilio.localidad,
        // 'domicilio.barrio': usuario.persona.domicilio.barrio,
        // 'domicilio.calle': usuario.persona.domicilio.calle,
        // 'domicilio.numeroCasa': usuario.persona.domicilio.numeroCasa,
        // "contactos":[{"tipoContacto": "Telefono Celular",
        //     "codigoPais": "+549",
        //     "codigoArea": "388",
        //     "numeroCelular": "6011979"},
        //     {"tipoContacto": "Email",
        //     "email": "ismael_14@gmail.com"}
        //     ],
        nombreUsuario: usuario.nombreUsuario,
        clave: usuario.clave,
        rol: usuario.rol
    });
    // console.log('termino la ejecucion del axios');
    // console.log('Respuesta del servicio: ' + resp.contactoDB._id);

    return {
        ok: true
    }
};





let login = async(usuario) => {
    let URL = process.env.URL_SERVICE + process.env.PORT + '/usuario/ingresar/';
    // console.log(usuario);
    let resp = await axios.post(URL, {

        nombreUsuario: usuario.nombreUsuario,
        clave: usuario.clave
    });
    if (resp.data.ok) {
        return {
            ok: true,
            _id: resp.data.usuario._id,
            token: resp.data.token
        };
    } else {
        return {
            ok: false,
            message: 'Usuario o clave incorrecta'
        };
    }
};

let buscarComercioUsuario = (usuario) => {

};


let verificarExistenciaProveedorEnRedComercio = async(proveedor, comercio) => {
    let URL = process.env.URL_SERVICE + process.env.PORT + '/comercio/buscar_proveedor/';
    let resp = await axios.post(URL, {
        proveedor: proveedor,
        comercio: comercio
    });

    // console.log('la funcion devolvio ' + resp.data.ok);
    // console.log(resp.data.message);

    if (resp.data.ok) {
        return {
            ok: false,
            message: 'El proveedor ya es parte de la red'
        };
    }
    return {
        ok: true,
        message: 'El proveedor no es parte de la red'
    };

};



///////////// REGION PAYPAL ///////////////////////////
let crearPlanPayPal = async(planName, description, cardNumber, cardType, expireMonth, expireYear, cvv2, name, lastName) => {
    var billingPlanAttribs = {
        "name": planName,
        "description": description,
        "type": "infinite", //'FIXED': para un número fijo de pagos periódicos, o 'INFINITE' para un plan que se repite hasta que es cancelado manualmente.
        "payment_definitions": [{
            "name": "Standard Plan",
            "type": "REGULAR", //TRIAL o REGULAR. TRIAL se usa cuando queremos cobrar con descuento un numero pequeño de cuotas.
            "frequency_interval": "1",
            "frequency": "DAY",
            "cycles": "0", //el valor cero indica que el ciclo de cobro es infinito hasta que el usuario cancele la suscripcion
            "amount": {
                "currency": "USD",
                "value": "1.99"
            }
        }],
        "merchant_preferences": {
            "setup_fee": {
                "currency": "USD",
                "value": "0"
            },
            "cancel_url": process.env.URL_SERVICE + "/paypal/cancel/",
            "return_url": process.env.URL_SERVICE + "/paypal/success/",
            "max_fail_attempts": "0",
            "auto_bill_amount": "YES",
            "initial_fail_amount_action": "CONTINUE"
        }
    };

    var billingPlanUpdateAttributes = [{
        "op": "replace",
        "path": "/",
        "value": {
            "state": "ACTIVE"
        }
    }];



    await paypal.billingPlan.create(billingPlanAttribs, async function(error, billingPlan) {
        if (error) {
            console.log(error);
            throw error;
        } else {
            // Activate the plan by changing status to Active
            await paypal.billingPlan.update(billingPlan.id, billingPlanUpdateAttributes, async function(error, response) {
                if (error) {
                    console.log(error);
                    throw error;
                } else {
                    console.log('Billing plan created under ID: ' + billingPlan.id);
                    crearAcuerdoPaypal(billingPlan.id, description, cardNumber, cardType, expireMonth, expireYear, cvv2, name, lastName);
                    // return {
                    //     id: billingPlan.id
                    //         // res.send('Billing plan created under ID: ' + billingPlan.id)
                    // }

                }
            });
        }
    });
};

let crearAcuerdoPaypal = (idPlan, description, cardNumber, cardType, expireMonth, expireYear, cvv2, name, lastName) => {

    var billingPlan = idPlan;
    // const card = creditCardType('4111111111111111');

    var isoDate = new Date();
    isoDate.setSeconds(isoDate.getSeconds() + 4);
    isoDate.toISOString().slice(0, 19) + 'Z';

    var billingAgreementAttributes = {
        "name": "Suscripcion standar",
        "description": description,
        "start_date": isoDate,
        "plan": {
            "id": billingPlan
        },

        'payer': {
            'payment_method': 'credit_card',
            'funding_instruments': [{
                'credit_card': {
                    'number': cardNumber,
                    'type': cardType,
                    'expire_month': expireMonth,
                    'expire_year': expireYear,
                    'cvv2': cvv2,
                    'first_name': name,
                    'last_name': lastName
                }
            }]
        }
    };

    // Use activated billing plan to create agreement
    paypal.billingAgreement.create(billingAgreementAttributes, function(error, billingAgreement) {
        if (error) {
            console.error(error);
            throw error;
        } else {
            //capture HATEOAS links
            var links = {};
            billingAgreement.links.forEach(function(linkObj) {
                console.log('Links');
                console.log(linkObj);
                links[linkObj.rel] = {
                    'href': linkObj.href,
                    'method': linkObj.method
                };
            });

            //if redirect url present, redirect user
            console.log('link hasOwnPropoerty: ' + links);
            if (links.hasOwnProperty('self')) {
                //cambiar res por axios
                res.redirect(links['self'].href);
            } else {
                console.error('no redirect URI present');
            }
        }
    });

};


/////////////////////////////////////////////////////




module.exports = {
    nuevoDetalle,
    nuevoDomicilio,
    nuevaEntidad,
    nuevoPuntoVenta,
    nuevaPersona,
    nuevoContacto,
    nuevoUsuario,
    login,
    verificarExistenciaProveedorEnRedComercio,
    crearPlanPayPal,
    crearAcuerdoPaypal
}