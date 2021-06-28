 * puede que tendremos varios eventos :
 - enviar mensajes
 - crear productos
 - notificaciones
 - : nosotros necesitamos la class server sea limpio sin importar cuantos eventos tengamos
 * asi crear archivo independiente para manejar toda la comunicacion de sockets :
 - puede ser un o varios archivos - depende como queremos trabajar  .
 - los eventos por parte de socketServer puede tener controller igual a las rutas : 
   crear archivo reciba payload , callback y la definimos en el evento y alli tenemos el controller del mismo .