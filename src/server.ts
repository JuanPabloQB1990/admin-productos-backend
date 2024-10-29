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
        await db.authenticate()
        db.sync()
        //console.log(colors.blue.bold("Conexion exitosa a la base de datos"));
    } catch (error) {
        //console.log(error);
        console.log(colors.red.bold("Ha ocurrido un error al conectar a la base de datos"));
        
    }
}

connectDatabase()

const server = express()

const corsOptions: CorsOptions = {
    origin: function(origin, callback) {
        
        if(origin === process.env.FRONTEND_URL) {
            callback(null, true)
        }else{
            callback(new Error("Error de cors"))
        }
    }
}

server.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
server.use(cors(corsOptions))
server.use(express.json())
server.use(morgan('dev'))
server.use("/api/products", productsRouter)

export default server