/* Variables del entorno  
 *
*/
require('dotenv').config();           

const Server = require('./models/server');

/* crear constante con mi servidor 
 * instancia el servidor
 * configurado : RestServer - webServer - SocketsServer 
*/
const server = new Server();



server.listen();


