import server, { connectDatabase } from "./server";
import colors from "colors"

const PORT = process.env.PORT || 3000

async function startServer() {
  await connectDatabase()
  server.listen(PORT, () => {
    console.log(colors.cyan.bold(`http://localhost:${PORT}`));
  })
}

startServer()
