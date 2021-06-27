require('dotenv').config();        

const Server = require('./models/server');

/* crear constante con mi servidor 
 * instancia el servidor
*/
const server = new Server();



server.listen();


