
/*  Pantalla publica manejamos al logica de  cada cliente visita la officina debe saber que mesa : escritorio debe derigirse  ver nota video 218 */


console.log('Público HTML')


// Referencias HTML
const lblTicket1 = document.querySelector('#lblTicket1');
const lblEscritorio1 = document.querySelector('#lblEscritorio1');

const lblTicket2 = document.querySelector('#lblTicket2');
const lblEscritorio2 = document.querySelector('#lblEscritorio2');

const lblTicket3 = document.querySelector('#lblTicket3');
const lblEscritorio3 = document.querySelector('#lblEscritorio3');

const lblTicket4 = document.querySelector('#lblTicket4');
const lblEscritorio4 = document.querySelector('#lblEscritorio4');


const socket = io();


/* Escuchar custom event 
 * necesito dispararlo : emitir from back en dos lugares : cuando sockets se coneecte y cuando se asigna a un ticket un directorio !! 
 * los ultimos cuatros pueden representar objetos de mesas segun programos
*/
socket.on('estado-actual', ( payload ) => {
   
     // cuanda vez se dispare este evento del back quiero Reproducir el audio .  V : 221
     const audio = new Audio('./audio/new-ticket.mp3');
     audio.play(); // firefox funciona : googl eage tambien


    const [ ticket1, ticket2, ticket3, ticket4 ] = payload; // desestructutacion de array 

    if( ticket1 ){ // si empecemos el dia validamos si estos objetos existen , manejar la excepcion debido a la limpieza de db .
        lblTicket1.innerText = 'Ticket ' + ticket1.numero;
        lblEscritorio1.innerText = ticket1.escritorio;
    }
    
    if( ticket2 ){
        lblTicket2.innerText = 'Ticket ' + ticket2.numero;
        lblEscritorio2.innerText = ticket2.escritorio;
    }
    
    if( ticket3 ){
        lblTicket3.innerText = 'Ticket ' + ticket3.numero;
        lblEscritorio3.innerText = ticket3.escritorio;
    }
    
    if( ticket4 ){
        lblTicket4.innerText = 'Ticket ' + ticket4.numero;
        lblEscritorio4.innerText = ticket4.escritorio;
    }
    


});