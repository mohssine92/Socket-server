const path = require('path'); // para construit elpath donde voy a grabar 
const fs   = require('fs'); // referncia al file system para poder grabar data en un file de cualquier extension en este caso file de extencion .json





/* crear otra class pequena para controlar el objeto de 1 ticket  
 * este objeto nos dice nuemro del ticket y que escritorio se le ha establecido : mesa : etc .. 
 * esto es todo lo que quiero que sea una instancia de esta clase de Ticket .
 * es decir todos tickets luzcan igual : la misma interfaz : siguiente el patron de este modelo 
*/
class Ticket {
    numero: Number;
    escritorio : any; 

    constructor( numero : number, escritorio : any ) {
        this.numero = numero;
        this.escritorio = escritorio;
        // tengo toda la libertad de añadir mas prop a un ticket que podre usar como referencia en validacion o comprobaciones
    } 
}




/* Crear una clase para controlar la logica de esta aplicacion de tickes de cola .
 * 
*/
class TicketControl {
  
    ultimo: any   = 0;
    hoy: Number = new Date().getDate(); // 02: dia de hoy , podemos manejar toda la  fecha mes año dia etc ...
    tickets : Array<Number>  = []; // Representa la coleccion de tickets de 1 dia en este caso  
    ultimos4 : Array<Number> = [];  // Los tickets a mostrar en la pantalla 

    
    // usualmente en las clases de js se pone todas las props que vamos a occupar : para que sea facilmente Reconocidos para programadores 
    constructor() {
        this.ultimo   = 0; 
        this.hoy      = new Date().getDate(); // 02: dia de hoy , podemos manejar toda la  fecha mes año dia etc ...
        this.tickets  = []; // Representa la coleccion de tickets de 1 dia en este caso  
        this.ultimos4 = [];  // Los tickets a mostrar en la pantalla

        this.init(); // db - json 
    }



    /* un Getter 
     * Genera el Objeto que tengo que Grabar en mi json DB
     * Recuerda un getter me debe iniviar data como se fuera prop de la classe 
    */
    get toJson() {
        return {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4,
        }
    }


    /*  la idea es leer archivo db json y establecer propiedades : data del dia persistente
     * como es json imediatemente lo va a transformar a un objeto literal de js : asi con la desestructuracion : estamos haciendo Lectura del mismo .
     * la idea si la fecha es de hoy recargo el servidor sino ... es decir los tickets de un dia , a a las 12 de la noche se borran los tickets , empezemos de zero .
    */
    init() {
        const { hoy, tickets, ultimo, ultimos4 }/* data */ = require('../db/data.json');
       // console.log(data);
       // console.log(this.hoy);
        if ( hoy === this.hoy ) { 
            this.tickets  = tickets;
            this.ultimo   = ultimo;
            this.ultimos4 = ultimos4;
        } else {
            /*  Es otro dia _ Reescritura del Db json : es decir se rescribe encima de la data del dia anterior :
             * trabajamos asi cuando necesitemos mantener db solo un periodo de un dia o 2 o una semana : depende lo que ponemos en la condicion if( < > == || ) etc ..  
            */
            this.guardarDB();
        } 
    }

    guardarDB() {
        
        /* __dirname : esto va apuntar a la carpeta donde estoy ubicado : en este caso models -
         * Obviamente asegurar si Tenemos permiso de Escritura a este directorio db : poder generar un archivo 
         * recuerda al Recrear archivo la data lo inserta como string : es decir convertir objeto literal a un JSON.stringify
        */
        const dbPath = path.join( __dirname, '../db/data.json' ); 
        fs.writeFileSync( dbPath, JSON.stringify( this.toJson ) );
    

    }


    /* instancio Objeto de 1 ticket , le asigno un numero y lo empujo en la coleccion diaria que a su vez se almacenara en db.json  
     * forma de asignar el siguente ticket 
    */
    siguiente() {
        this.ultimo += 1; // forma corta de hacer un accumulado 
       
        /* mi objeto de 1 ticket a rellenarlo  
         * es decir cada vez se llama siguiente en esta linea se crea nueva instancia : nuevo Objeto a rellenar
        */
        const ticket = new Ticket( this.ultimo, null ); 
        this.tickets.push( ticket );

        this.guardarDB();
        return 'Ticket ' + ticket.numero;
    }



    /* el escritio o la mesa es el cual va atender el ticket Respectivo  
     * requiere recibir un escritorio : 
     * una forma de atender un ticket
    */ 
    atenderTicket( escritorio ) {

        // validacion :  imaginemos que No tenemos tickets
        if ( this.tickets.length === 0 ) {
            return null; // nada no hay tiket que puede atender
        } 

        const ticket = this.tickets.shift(); // this.tickets[0];

        /* const ticket : es el ticket el que fue borrado del array de tikcets del dia : tickets en cola de espera, que  ya no tiene ningun relacion con la coleccion
         * le asigno al objeto Ticket el directorio quien le atendio 
         * pues el ticket es el ticket que necesito atender ahora // escriterio pasa de ser null a un directorio asignado 
         */
        ticket.escritorio = escritorio;

        this.ultimos4.unshift( ticket ); // empujar en posicion index 0  

        if ( this.ultimos4.length > 4 ) { // verificar que siempre sean 4
            this.ultimos4.splice(-1,1); // * -1 : la ultima posicion del array , 1 : quiero que cortar un elemento nada mas , puedo cortar 2 0 3 etc..
        }

        this.guardarDB();

        return ticket;
    }


}



module.exports = TicketControl;