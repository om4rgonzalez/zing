const axios = require('axios');



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




module.exports = {
    nuevoDetalle,
    nuevoDomicilio,
    nuevaEntidad,
    nuevoPuntoVenta,
    nuevaPersona,
    nuevoContacto,
    nuevoUsuario,
    login,
    verificarExistenciaProveedorEnRedComercio
}