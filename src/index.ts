import server from "./server";
import colors from "colors"


const PORT = process.env.PORT || 3000
server.listen(4000, () => {
    console.log(colors.cyan.bold(`http://localhost:${PORT}`));
    
})