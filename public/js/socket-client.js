//console.log('configurcion de mis websSockets:clientes:celulara:computadoras con <-> mi servidor:backend:consola:nodemon')


// Referencias del HTML - objetos de elementosa html
const lblOnline  = document.querySelector('#lblOnline');
const lblOffline = document.querySelector('#lblOffline');
const txtMensaje = document.querySelector('#txtMensaje');
const btnEnviar  = document.querySelector('#btnEnviar'); 



/* para ver el cliente conectado  
 * ese es el socket del cliente , que esta usando : appweb - appMovil es el cliente . 
 * socket es el mismo objeto sera recibido como callback al lograr conectar al socketServer - su data es unica para cada cliente - su interfaz es la misma para todos clientes
 * nada mas llamar la funcion ,el servidor Socket sera notificado que hay un cliente conectado 
 * socket es un objeto contiene : muchas props , observables , funciones : como para escuchar conexion a servidor - desconexion al mismo , emission de data al servidor ,
 * socket mantiene la comunicacion con nuestro servidor siempre esta notificado si estamos conectado o desconectados , o intercambio de data ... etc
*/
const socket = io();




/* Listeners no son mas que Observables : estan escuchando cambios o Eventos .  
 * on() funcion para estar escuchando algun evento
 * hay eventos predeterminados en socket.io uno de ellos connect 
 * event connect se va a disparar cuando tenemos una conexion a SocketServer : back de node.js
 * si piensas porque no recibimos arg , pues tenemos todo en socket constante : Objeto : toda la informacion que necesitaremos .
*/
socket.on('connect', () => {
   //console.log('Conectado');
   //console.log( socket )

   // manipulaciones de html ,css 
   lblOffline.style.display = 'none';
   lblOnline.style.display  = '';
 
});


/* depende del evento desconexion . asi al desconectar del SocketServer - puedo implementar lo que meda la gana de la parte del cliente
 * on() es una funcion seria para escuchar tipo de evento 
*/
socket.on('disconnect', () => {
  //console.log('Desconectado del servidor');

   // manipulaciones de html , css 
  lblOnline.style.display  = 'none'
  lblOffline.style.display = ''; 

});



/* escuhando un custom Event en este caso el evento emitido de la parte del SocketServer : backend 
 * 1 arg del callback capta la data emitida del backend 
 * unico iconviniente en este caso el cliente que emita mensaje esta escuchando su mensaje !! - whatsapp si se puede en caso de chat -pero otro temas de notificaciones no es 
 * necesario : ver mas sobre el tema . 
*/
socket.on('enviar-mensaje.from-server', (payload) => {
    const { mensaje } = payload; 
    
    console.log( mensaje );

  /*  setInterval(() => {
    lblOnline.style.display  = 'none'
    lblOffline.style.display = ''; 
   }, 1000);

   setInterval(() => {
    lblOffline.style.display = 'none';
    lblOnline.style.display  = '';
   }, 2000); */

}); 




/* escuchando evento click en la Refrencia 
 * asi cada click - dispara callback
*/
btnEnviar.addEventListener( 'click', () => {

    const mensaje = txtMensaje.value;
   
    /* informacion que voy a emittir en una peticion al backend - usualmente se manda objetos contienen toda la informacion
     * asi un objeto mando toda la informacion - obviamente no voy a estar emitiendo peticiones al backend con mensajes planos  
    */
    const payload = { 
        mensaje,
        id: '123ABC',
        fecha: new Date().getTime()
    }


    /* emit() : es para emitir un Evento 
     * primer arg es el evento que vamos a emitir : emitir lo que te da la gana : Recomendacion no usar mayus o minis - Camelcase o espacio como nombre del custom event
    * no olvidar configurar la escucha de dicho evento por la parte del servidor .
    * 2 arg data a emitir - 3 arg callback : esperando recibir algo como respuesta de esta emission por parte del servidor en este caso espero el id 
    * 3 arg : callback - la funcion del servidor que esta en escucha de este evento : es quien que tiene que mandar a ejecutarlo cuando todo termino .
    */
    console.log(payload);
    socket.emit( 'enviar-mensaje', payload , ( id ) => {
       
      console.log('Socket-server respondio' , id );
         
    });
 
});