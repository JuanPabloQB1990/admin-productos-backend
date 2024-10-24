import express from 'express'
import productsRouter from './routes'
import db from './config/db'
import colors from 'colors'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './config/swagger'

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

server.use(express.json())
server.use("/api/products", productsRouter)
server.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

export default server