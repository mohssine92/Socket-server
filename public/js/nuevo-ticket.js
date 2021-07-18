
/*  para mas detalles de la configuracion , ver : socket-client.js */



// Referencias HTML
const lblNuevoTicket = document.querySelector('#lblNuevoTicket');
const btnCrear = document.querySelector('button');


const socket = io();


socket.on('connect', () => {
  // console.log('Conectado');
  // console.log( socket ) // informacion del cliente conectado

  btnCrear.disabled = false;
});

socket.on('disconnect', () => {
  btnCrear.disabled = true;
});

/*  escuchar - ultimo ticket  : (ultimo) => es payload 
 * Tambien podemos emitir en tiempo real a todas las pantallas , o las pantallas que deseamos , que cumplan con Role que damos ... , el Ultimo Ticket 
*/
socket.on('ultimo-ticket', (ultimo) => {

  setTimeout(() => {
    lblNuevoTicket.innerText = 'Ticket ' + ultimo;
    //console.log(1 );
  }, 2000 );
 

})


/* Evento click como vemos podemos Implementar evento dentro del scope del evento click , o cualquier tipo de evento ..
 * payload : null , no voy a emitir data al backend 
 * terecer arg recibe lo que emite servidorSockets ATRAVES DE UN FUNCIon callback como resulucion de esta emisison : en este caso me responde con numero de un ticket en : (ticket) => {} ,  
*/
btnCrear.addEventListener( 'click', () => {
 
  /* Evento  siguiente-ticket : se emite desde el  servidor y se escucha aqui en el cliente con Objetivo de Pintar en pantalla  del user algun mensaje  */
  socket.emit( 'siguiente-ticket', null, ( ticket ) => {
      lblNuevoTicket.innerText = ticket;
  }); 

});
