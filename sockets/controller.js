

    /* configuracion para todos mis eventos de mi webSockets:  - Configuracion de Sockets
     * ES decir necesito  saber cuando un cliente : se conecta - de desconecta - cuando un cliente emite algun evento perzonalizado  
     * es parecido cuando estamos trabajando con modelos , rutas . exactamenete igual solo en los Sockets no son rutas y son eventos de webSockets
     * webSockets son clientes del backend socketServer
     * nostros tenemos que decirle desde el cliente que se connecte al servidor Sockets
     * eso segnificaria tambien en la conexion podemos mandar JWT - jwt puede llegar en el socket arg
     * ver nota video 203 : tema de id de socket conectado como se debe manipular
     * Recuerda arg socket es el cliente que esta conectado a este servidor : es arg de callback
     * siempre que se conecta un cliente nuevo al servidorSocket obtenemos su Objeto de en arg socket asi  apartir de ese objeto el servidor socket
     * podra estar escuchando los custom events que emita el cliente .
     * this.io refiero al servidor - todo las funciones que se le van a encadenar - son acciones del servidor hacia un cliente o clientes o etc .... 
    */
const socketController =  ( socket )  => {  
  // algo que podemos hacer por el envio de mensajes por comunicacion de sockets , cuando saldra todo bien , ejecutar un callback  o algun tipo de codigo
     
   // aqui podemos hacer una validacion de jwt - si fracasa la validacion desconectamos sockets : lo veremos mas adelante 
     
   // console.log('Cliente Connectado', socket.id );
   

    /* socket : cliente conectado : data/Objeto del cliente conectado a este servidor de socket ,
     * on() funccion se escucha un tipo de evento , en este caso la desconexion .
    */
    socket.on('disconnect', () => { 
      // console.log('Cliente desconectado', socket.id); - implemento lo que quiero 

    });



    /* usando objeto del cliente conectado para escuchar el el evento perzonalizado que esta emitiendo 
     * callback es el espacio donde implemento lo que quiero implementar cuando el cliente conectado emita este evento .
     * primer arg del call back , recibo el payload:data emitida por parte del cliente conectado .
    */
    socket.on( 'enviar-mensaje',/*  async */ (payload , callback ) => {
       //console.log('custom event emitido desde el cliente conectado - recibido en el server de socket') - implemento lo que quiro Observables Rxjs etc ..
       //console.log(payload);

       

       
       /* Example 2 - 207
        * imaginaremos como guardar en db : await - la funcion de (payload)=>  puede ser async perfectamente 
        * hacer grabacion en nuestro modelo - incerte en db el objeto payload .y la db me genera un id : 
        * quiero solo el cliente socket quien emitio el mensaje sepa el id , no todo clientes socket conectados al servidor 
        * callback : es la referencia al tercer arg de la funcion emit de la parte del cliente quien lanzo la emision - no todos clientes conectados a este SocketServer
        * asi logro responder solo al cliente que me emitio mensaje : evento . no a todas instancias del cliente .
       */
         console.log(payload) 
         const id = 132432455648787;
         callback( id );
       // callback({ id , fechaGrabacion: new Date().getTime() }); // tambien puede mandar objeto
      
        /* practicamente la misma instruccion  que Callback - a este socket le emitas el id : es decir solo el cliente sockete quien reciba el id  
         * 
        */
       // socket.emit('enviar-mensaje.from-server', id );  

    });


}

const socketEmissionAllClient = ( socket ) =>{
  // console.log('conectado')
  //  console.log(socket.id)
  
   /* el servidor escuchando  */
   socket.on('enviar-mensaje', ( payload ) => {
       console.log(payload) 

       /* el servidor emite a todos los clientes conectados - navigadores instanciados en este caso - clientes instanciados 
        * en este caso el servidor emite custom event -  el cliente debe estar Escuchando el evento .
        * usar socket.broadcast _ resuelta el servidor emita a todos clientes conectados menos el cliente socket conectado de manera directa que ha sido usado para esta emission
        * en caso tambien emitir a todos clientes sin excepcion instanciamos el Server y usamos io.emit : que es propiedad del servidor : esto es todo 
       */
       //this.io.emit('enviar-mensaje.from-server', payload );  
       socket.broadcast.emit('enviar-mensaje.from-server', payload );
      
   
   });

}


module.exports = {
    socketController,
    socketEmissionAllClient
}











