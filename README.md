# Introducción a los sockets
 - express nos facilita muchisimo la creacion de web-server RestServer
 - Socket.io nos facilita muchisimo manejo de los webs Sockets  
 
 * Resolver preguntas comunes sobre los sockets

 * Instalación de Socket.io
  - 202 tambien tenemos un paquete de socket.io client en caso que el front-end y el backend no estan ubicados en mismo lugar . es bastante comun si un app de movil y tiene que tener comunicacion en tiempo real con backend ..

 * Detectar conexiones y desconexiones de usuarios : clientes : ordenadores : celulares 

 * Emitir mensajes cliente servidor / servidor cliente

 * Escuchar los mensajes servidor cliente / cliente servidor

 * Broadcast

 * Callbacks en los sockets

 * Pruebas en Heroku

 * Pantalla completa


 # Instalaciones en orden :
 $ npm init -y : crera package.json
 $ npm i express cors dotenv 
 $ npm install socket.io 


 ** nodemon.json , ignore : es decir decir si hay cambios en este lugar no Reinicialices : **
 - observe ya nodemon no se cae esta ignorando cambios en archivo db.json que sufra cambios 
 - nodemon  no se reinicia por cambios en archivos de html , pero si por archivos js - json , que se considera archvos de la parte del servidor no del front-end 
