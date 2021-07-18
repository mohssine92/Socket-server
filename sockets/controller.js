  /* La idea cuando se ejecuta server class se ejcuta todo lo que esta inicializado en el server - asi este controller archivo  se encuentra required en el archiv server :
   * : es decir este archivo se ejecuta a una altura en el archivo de server : por lo cual resuelta la inicializacion de la class new TicketControl()
   * este es un lugar perfecto para inicializar mi classe . y crear una instancia : asi el constructor de la misma ya esta disparado 
   * 
  */
  const TicketControl = require('../models/ticket-control');
  const ticketControl = new TicketControl(); 
  
  /* nodemon cuando detecta cambios en desarollo reinicia mis servidor .como es caso de  socket.emit( 'siguiente-ticket' .. resuela la reinicializacion de mi servidor :// cliente
   * para evitar este comportamiento en desarollo con nodemon añadimos un archivo de configuracion de nodemon : nodemon.json
   * esto sucede solo con nodemon , al levantar servidor con node app tal cual como hace heroku en produccion : no tendremos problemas es decir observemos que la parte de sockets 
   * jamas reinicia el servidor por haber estar basada en observable : escucha de eventos y emisiones . eso segnificaria que la instancia de la class TicketControl se insatancia solo la primera vez 
   * al levantar el servidor  .
  */ 
  console.log('nueva instancia');





  /* este es mi Controlador de sockets en este ejecicio 
   * Recuerda tenemos la Liberad de nombrar los eventos tanto de la parte del servidor como por parte del cliente (el que va estar instanciado en navigadores) 
  */
  const socketControlador = ( socket ) => {

    /*  Recueda estos 3 eventos se emiten solo cando en clientes e coneccta
     * el servidor va emitir solo a la instancia del cliente conectado representado como socket - es decir solo a la persona que se esta conectanado desde una instancia de un cliente navigador
     * puedo mandar string payload lo que yo quiera
     * tambien se Obtiene mediante <ultimo-ticket> mediante un servicio Rest : pero en este caso queremos practicar la parte de los sockets 
    */
    socket.emit( 'ultimo-ticket', ticketControl.ultimo );
    socket.emit( 'estado-actual', ticketControl.ultimos4 ); // para pantalla publica
    socket.emit( 'tickets-pendientes', ticketControl.tickets.length); // cuando se conecta un trabajador ...notifico


    // <-----Otro Evento : Otro servicio ---->
    
    socket.on('siguiente-ticket', ( payload , callback ) => { // siguiente-ticket : este evento se recibe de la parte del cliente . 
        
      const siguiente = ticketControl.siguiente(); // Model class ... se puede remplazar por cualquier modelo : segun logica del negocio
      callback( siguiente ); // responder al mismo cliente quien lazo el evento - No a todos :en este mando un string reurnado por metodo de la class - puede mandar objeto o lo que sea
      
       // TODO : Notificar Nuevo ticket pendiente de asignar ,

      /* tambien puedo notificar a todos clientes cual es el numero sigiente donde vamos , usando emision this.io hacia cliente : se notificara a todos sin excepcion
       * seria util cuando tenemos varias pantallas dende se crean varios tickets
      */


      /*  Notificar que hay un ticket pendiente . justamante en la generacion de los tickets - notifico pantallas de los trabajadores que hay gente en la cola 
      TODO * puedo notificar a la pantalla publica Tambien  
      */
       socket.broadcast.emit( 'tickets-pendientes', ticketControl.tickets.length); // recuerda este referencia cuando se atiende uno se saca de la refrencia a este array

    });


    // <-----Otro Evento : Otro servicio ---->

    socket.on('atender-ticket', ( { escritorio }/*  payload :desectructuracion */ , callback ) => {

        // validacion : aqui sera err del frontend del cliente user, debe elegir mesa depende de lo que quiera hacer en la oficina se ingresar o informacion etc ... o impadronamiento
        // TODO : entonces aqui hay cosas donde tenemos que pensar como queremos que funcione esto .
        if ( !escritorio ) { 
            return callback({ // en caso se recibe Objeto vacio de escritorio 
                ok: false,
                msg: 'Es escritorio es obligatorio'
            });
        }

       
        /* asignacion de directorio que ve atender 
        TODO * podra sufrir cambios en caso de asignacion automatica depende del empadronamiento etc ...  
        */
        const ticket = ticketControl.atenderTicket( escritorio ); // returna el ticket Tocante en la cola 

      
        
       /* Notificamos a la pantalla los tickets pendientes - el evento esta en escucha en el cliente */
        socket.broadcast.emit( 'estado-actual', ticketControl.ultimos4 ); // se escucha en diferentes pantallas

        /* asi logramos notificar a Todos sockets - o hay otra forma  donde es el servidor socket quien emita a todos clientes usando referencia de model server */
        socket.emit( 'tickets-pendientes', ticketControl.tickets.length);  // notificar el mismo socket connectado
        socket.broadcast.emit( 'tickets-pendientes', ticketControl.tickets.length);  // notificar tofodossockets menos el mismo - 
         

        /* validaciion en caso de que no haya genete esperando */
        if ( !ticket ) { // excepcion 
            callback({
                ok: false,
                msg: 'Ya no hay tickets pendientes'
            });
        } else {
            callback({
                ok: true,
                ticket // ticket asignado ya el escritorio donde tiene que atenderse asignado : en orden de generacion o de llegada de la persona a la oficina
            })
        } 


    })



  }





     // no occupo en este ejecico lo mantengo como docs
    /* configuracion para todos mis eventos de mi webSockets:  - Configuracion de Sockets
     * ES decir necesito  saber cuando un cliente : se conecta - de desconecta - cuando un cliente emite algun evento perzonalizado  
     * es parecido cuando estamos trabajando con modelos , rutas . exactamenete igual solo en los Sockets no son rutas y son eventos de webSockets
     * webSockets son clientes del backend socketServer
     * nostros tenemos que decirle desde el cliente que se connecte al servidor Sockets
     * eso segnificaria tambien en la conexion podemos mandar JWT - jwt puede llegar en el socket arg
     * ver nota video 203 : tema de id de socket conectado como se debe manipular
     * Recuerda arg socket es el cliente que esta conectado a este servidor : asi cada cliente nuevo se conecta el servidor recibe su Objeto en socket arg
     * siempre que se conecta un cliente nuevo al servidorSocket obtenemos su Objeto de en arg socket asi  apartir de ese objeto el servidor socket
     * podra estar escuchando los custom events que emita el cliente .
     * this.io refiero al servidor - todo las funciones que se le van a encadenar - son acciones del servidor hacia un cliente o clientes o etc .... 
     * Recuerda que esta funccion es controlador que va manejar toda la informacion del socket de la parte del Servidor_back_socket
    */
const socketController =  ( socket )  => {  
   // console.log('Cliente Connectado', socket.id );
   
    /* cuando el socket cliente se desconecta
    */ 
    //socket.on('disconnect', () => { });


    /* usando objeto del cliente conectado para escuchar el el evento perzonalizado que esta emitiendo 
     * callback es el espacio donde implemento lo que quiero implementar cuando el cliente conectado emita este evento .
     * primer arg del call back , recibo el payload:data emitida por parte del cliente conectado .
     * async . si quiero implementar un await en el cuerpo de callback  como comunicar un Db atraves del modelo . 
    */
    socket.on( 'enviar-mensaje',/*  async */ (payload , callback ) => {
       //console.log('custom event emitido desde el cliente conectado - recibido en el server de socket') - implemento lo que quiro Observables Rxjs etc ..
       //console.log(payload);


       /* Example 2 - 207
        * imaginaremos como guardar en db : await - la funcion de (payload , callback )=>  puede ser async perfectamente 
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
         */
         // socket.emit('enviar-mensaje.from-server', id );  



        /* el servidor emite a todos los clientes conectados - navigadores instanciados en este caso - clientes instanciados 
         * en este caso el servidor emite custom event -  el cliente debe estar Escuchando el evento .
         * usar socket.broadcast _ resuelta el servidor emita a todos clientes conectados menos el cliente socket conectado de manera directa que ha sido usado para esta emission
         * en caso tambien emitir a todos clientes sin excepcion instanciamos el Server y usamos io.emit : que es propiedad del servidor : esto es todo 
        */
         //this.io.emit('enviar-mensaje.from-server', payload );  
          socket.broadcast.emit('enviar-mensaje.from-server', payload );



    });


}

/* No occcupo easta funcion en este ejecico 
 *
*/
const socketEmissionAllClient = ( socket ) =>{
  //  console.log('conectado')
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
  socketController, // ejemplo con espilacion con mas detalles de la seccion pàsada 
  socketEmissionAllClient,  // ejemplo de con esplicacion mas detalles de la seccion pasada 
  socketControlador // lo occupo en este ejercicio 
  
}   











