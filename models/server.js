const express = require('express');
const cors = require('cors');

const { socketControlador ,socketController , socketEmissionAllClient } = require('../sockets/controller');


class Server {

    constructor() {

        /* connect webSocket In conjunction with Express server 
         * view docs socket.io - of backend server node.js
        */
        this.app    = express(); // mi servidor de express
        this.port   = process.env.PORT;
        /* http viene en node por eso no hay que importar nada
         * this.server : es el server que tengo que levantar no el de express en este caso
        */
        this.server = require('http').createServer( this.app );

        /* this.io es toda la informacion de los sockets conectados - usamos this.io para mandar mensaejes a todas las personas que se encuentran conectados a este backend : ver cursos especializados en sockets del profesor para entrar mas en detalles sobre el tema .
        * pues asi en this.io esta toda la informacion de los clientes conectados .
        * this.io : podemos decir asi que es nuestro servidor de sockets el cual es diferente al this.app : servidor de express, como tenemos 
        * dos servidores dos mundos conectados vivendo en mismo lado 
        */   
        this.io     = require('socket.io')( this.server );
   


        /* si dia de mañana quiero utulizar rutas a para api - RestServer : definirlas aqui - ver seccion de RestServer con express 
         * 
        */
        this.paths = {};


        /* en caso necesito conexion a db _ ++ configuracion a db aqui con
         * ver seccion de RestServer con express . para la configuracion de conexxion a db 
        */


        /* los middelwares globales 
         * ver seccion de RestServer con express Tenemos ejemplos como se implementa 
        */
        this.middlewares();


        /*Rutas de mi aplicación */
        this.routes();


       /* Sockets 
        * ejecuto los eventos - escuchas emisiones de mis sockets
       */
        this.sockets();

      


    }

    middlewares() {

        /* CORS : siempre es bien configurarlo - no es necesario por la parte de socket.io o web sockets
        * su utulidad es cuando queremos implementar que otros apps externas necesitan hacer peticiones a nuestro servidor 
        * ver ejemplo en doc de cors como se configura los origines de apps  
        */
        this.app.use( cors() );



        /* lectura parseo body : no es necesaria por la parte de los webs Sockets
         * Es necesaria si vamos a implementar RestServer : configuramos que la data viaja atraves de req sera en objeto literal de json     
        */



       /* Directorio Público : si la usamos porque tenemos que establecer algun cliente  
        * no olvidar los socket.io se basan en comunicacion cliente/servidor , servidor/cliente  
        * en el public donde integramos build de react o angular : ver la parte de webServer .  
        *   
       */
        this.app.use( express.static('public') );
     

    }


    /* se utuliza cuando voy a hacer una peticion - usando RestServer 
     * ver la parte de RestServer usando express - crud usando RestServer de express - hay varios ejemplos
    */
    routes() {
        // this.app.use( this.paths.auth, require('../routes/auth'));
    }


   
    sockets() {
      /* escuchando conecciones de la parte de los clientes . 
       * cuando se logra conectar al servidor - se ejeucta la funcion definida como segundo Arg
       * puedo ejecutar todas las funciones que puedo . 
      */
      this.io.on('connection', socketControlador );
      // this.io.on('connection', socketEmissionAllClient );


    } 


 
    
    /* listen :
     * poner ya nuestro servidor de express escuchar peticiones
    */
    listen() {
        this.server.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }



}




module.exports = Server;