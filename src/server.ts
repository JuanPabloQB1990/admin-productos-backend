import express from 'express'
import productsRouter from './routes'
import db from './config/db'
import colors from 'colors'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './config/swagger'
import cors, { CorsOptions } from 'cors'
import morgan from 'morgan'

// conectar a base de datos
export async function connectDatabase() {
    const maxRetries = 5;
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            if (process.env.NODE_ENV !== 'test') {
                await db.authenticate();
                await db.sync({ alter: true });
                console.log(colors.blue.bold("✅ Conexión exitosa a DB"));
            } else {
                console.log(colors.magenta.bold("Datos de TEST reiniciados"));
                await db.sync({ force: true });
            }
            return; // éxito → salir
        } catch (error) {
            attempt++;
            console.error(colors.red.bold(`❌ Error DB (intento ${attempt}):`), error.message);

            if (attempt >= maxRetries) {
                console.error("💥 No se pudo conectar a la DB después de varios intentos");
                process.exit(1); // opcional (reinicia contenedor)
            }

            // esperar antes de reintentar
            await new Promise(res => setTimeout(res, 5000));
        }
    }
}


const server = express()

const corsOptions: CorsOptions = {
    origin: function(origin, callback) {
        
        if(origin === process.env.FRONTEND_URL || "*") {
            callback(null, true)
        }else{
            callback(new Error("Error de cors"))
        }
    }
}

server.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
server.use(cors(corsOptions))
server.use(express.json())
if (process.env.NODE_ENV !== 'test') {
    server.use(morgan('dev'));
}
server.use("/api/products", productsRouter)

export default server