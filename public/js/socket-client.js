console.log('configurcion de mis websSockets:clientes:celulara:computadoras con <-> mi servidor:backend:consola:nodemon')


// Referencias del HTML - objetos de elementosa html
const lblOnline  = document.querySelector('#lblOnline');
const lblOffline = document.querySelector('#lblOffline');
const txtMensaje = document.querySelector('#txtMensaje');
const btnEnviar  = document.querySelector('#btnEnviar'); 

/* para ver el cliente conectado  
 * ese es el socket del cliente , que esta usando : appweb - appMovil es el cliente . 
 * nada mas llamar la funcion ,el servidor Socket sera notificado que hay un cliente conectado 
*/
const socket = io();


/* Listeners no son mas que Observables : estan escuchando cambios o Eventos .  
 * on() funcion para estar escuchando algun evento
 * hay eventos predeterminados en socket.io uno de ellos connect 
 * event connect se va a disparar cuando tenemos una conexion a SocketServer : back de node.js
 * si piensas porque no recibimos arg , pues tenemos todo en socket constante : Objeto : toda la informacion que necesitaremos .
*/
socket.on('connect', () => {
   console.log('Conectado');
   console.log( socket )

   lblOffline.style.display = 'none';
   lblOnline.style.display  = '';
 
});


/* event Desconnect se va a disparar cuando tenemos una desconection a SocketServer : back de node.js
 *
*/
socket.on('disconnect', () => {
  console.log('Desconectado del servidor');

  lblOnline.style.display  = 'none'
  lblOffline.style.display = ''; 

});


/* socket.on('enviar-mensaje', (payload) => {
    console.log( payload )
})


btnEnviar.addEventListener( 'click', () => {

    const mensaje = txtMensaje.value;
    const payload = {
        mensaje,
        id: '123ABC',
        fecha: new Date().getTime()
    }
    
    socket.emit( 'enviar-mensaje', payload, ( id ) => {
        console.log('Desde el server', id );
    });

}); */