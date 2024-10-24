import { connectDatabase } from "../server"
import db from "../config/db"


describe("GET - /api", () => {
    
    jest.mock("../config/db")

    describe("connectDatabase", () => {
        test("should handle database connection error", async () => {
            jest.spyOn(db, "authenticate").mockRejectedValueOnce(new Error("Ha ocurrido un error al conectar a la base de datos"))
            const consoleSpy = jest.spyOn(console, "log")
    
            await connectDatabase()
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Ha ocurrido un error al conectar a la base de datos"))
        })

    })

    
})