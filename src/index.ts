import server, { connectDatabase } from "./server";
import colors from "colors"

const PORT = Number(process.env.PORT) || 3000

async function startServer() {
  try {
    await connectDatabase()
    server.listen(PORT, "0.0.0.0", () => {
      console.log(colors.cyan.bold(`http://localhost:${PORT}`));
    })
    
  } catch (error) {
    
  }
}

startServer()
