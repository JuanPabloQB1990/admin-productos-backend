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
    try {

        if (process.env.NODE_ENV !== 'test') {
            await db.authenticate()
            await db.sync({ alter: true })
            console.log(colors.blue.bold("Conexión exitosa a DB de Desarrollo"));

        }else{
            console.log(colors.magenta.bold("Datos de TEST reiniciados"));
            // En tests, borramos y recreamos para que esté limpia
            await db.sync({ force: true });
        }
    } catch (error) {
        //console.log(error);
        console.log(colors.red.bold("Ha ocurrido un error al conectar a la base de datos"));
        
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