/*  Logica de la pantalla trabajador
 TODO * Aprobar objetos de mesas : a , B , C , en vez de push en ultimos cuatros , embujar en el mismo empujamos de forma condicional depende deltipo de mesa conveniente y mostrando colas en pantalla pub .., 
*/


// Referencias HTML
const lblEscritorio = document.querySelector('h1');
const btnAtender    = document.querySelector('button'); // va ser el primer button que encuentra en en el dom 
const lblTicket     = document.querySelector('small');
const divAlerta     = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes');


/* Ocupamos Leer params  del url  
 * funciona en chrome y firefox , en otros nav no existe esta instruccion
*/
const searchParams = new URLSearchParams( window.location.search );

if ( !searchParams.has('escritorio') ) { // has verifica en el Objeto de params si existe 'escritorio' 
    window.location = 'index.html'; // sacar al ... paraque no Sigua ....
    throw new Error('El escritorio es obligatorio'); //lanzar err sale la consola
}


const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText = escritorio;

// ocultar alerta de entrada , depende de la validacion del servicio podra ser pintada en cualquier momento 
divAlerta.style.display = 'none';


const socket = io();


/* on son : Listenners */

socket.on('connect', () => {
    btnAtender.disabled = false;
});

socket.on('disconnect', () => {
    btnAtender.disabled = true;
});

socket.on('tickets-pendientes', ( pendientes ) => {
    if ( pendientes === 0 ) {
        lblPendientes.style.display = 'none';
    } else {
        lblPendientes.style.display = '';
        
        lblPendientes.innerText = pendientes;
    }
}) // debe actualizar - en framwork gracias a siclo de vida cambios no tendremos prob 





/* necesito decir al back-end : Estar escuchando un evento es decir necesito informacion : Normalmente se hace mediante servico Rest pero hacemos Todo mediante Sockets
 * podemos decir atender-ticket es un servicio 
*/
btnAtender.addEventListener( 'click', () => {
    

    socket.emit( 'atender-ticket', { escritorio }, ({ ok, ticket, msg } ) => { // payload : mando escritorio como Objeto por si acaso ocuupo mando mas informacion despues , 3 arg callback del back-end : desestructurado
        
        //console.log(payload); // puede regresar cualquier cosa , un error etc ... , comentar escritorio : ! , objeto vacio calback de Obligacion
        
        /*  validacion , ok false puede ser por varias razones , lo mas importante paramos aqui : no seguir
         * en '' podemos leer mensaje lo que sea mandar mensaje de de forma condicional especificando tipo de err switch etc ...
         * en este caso dejamos el cliente : trabajador no eliga mesa [ como test ] pero nosotros mandamos mensaje nadie esperando por eso debemos condicionar mensaje de err depende de la excepcion  llegada por callback
         * asi cualquier err se maneja aqui por secuencia , sigueremos si todo bien hay ticket corerctamente asignado
         * porque en este caso el trabajador debe aSIGNAR SU MESA al objeto ticket que va atender , tambien hay otra logica donde de obligar al user cliente de la oficina elegir una opcion y nosotros de forma automatica asignamos que mesa debe ser atendido 
         * y el trabajador debe encargar de atender sin asignar quitar validaciones de asignar : porque la asignacion fue al momento de generacion del ticket
        */
        if ( !ok ) {
            lblTicket.innerText = 'Nadie esperando ...';
            return divAlerta.style.display = '';
        } 

        lblTicket.innerText = 'Ticket ' + ticket.numero;

    });
    // socket.emit( 'siguiente-ticket', null, ( ticket ) => {
    //     lblNuevoTicket.innerText = ticket;
    // });

});





