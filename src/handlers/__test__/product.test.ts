import request from "supertest"
import server from "../../server"

describe("POST - /api/products", () => {
    it("should create a new product", async () => {
        const response = await request(server).post("/api/products").send({
            name: "Mouse - testing",
            price: 100000,
            availability: true
        })
        expect(response.body).toHaveProperty("data")
        expect(response.status).toBe(201)

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(200)
        
        expect(response.body.data.name).toBe("Mouse - testing")
        expect(response.body.data.price).toBe(100000)
        expect(response.body.data.availability).toBe(true)
    })

    it("should display validations errors", async () => {
        const response = await request(server).post("/api/products").send({})
        expect(response.body).toHaveProperty("errors")
        expect(response.status).toBe(400)
        expect(response.body.errors).toHaveLength(4)
        
        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(200)
        expect(response.status).not.toBe(201)
        expect(response.body.errors).not.toHaveLength(0)

    })
    
    it("should validate that the price is a number and greater than 0", async () => {
        const response = await request(server).post("/api/products").send({
            name: "Mouse - testing",
            price: "hola",
            availability: true
        })
        expect(response.body).toHaveProperty("errors")
        expect(response.status).toBe(400)
        expect(response.body.errors).toHaveLength(2)
        expect(response.body.errors[0].msg).toBe("Precio no valido")
        expect(response.body.errors[1].msg).toBe("El precio debe ser mayor a 0")

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(200)
        expect(response.status).not.toBe(201)
        expect(response.body.errors).not.toHaveLength(1)

    })
})

describe("GET - /api/products", () => {

    test("should check if api/products url exists", async () => {
        const response = await request(server).get("/api/products")
        expect(response.status).not.toBe(404)
    })

    test("should return a list of products in JSON response", async () => {
        const response = await request(server).get("/api/products")
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("data")
        expect(response.body.data).toHaveLength(1)
        expect(response.headers["content-type"]).toMatch(/json/)
    })
})

describe("GET - /api/products/:id", () => {
    test("should check if api/products/:id url exists", async () => {
        const response = await request(server).get("/api/products/1")
        expect(response.status).not.toBe(404)
    })

    test("should return a product in JSON response", async () => {
        const response = await request(server).get("/api/products/1")
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("data")
        expect(response.headers["content-type"]).toMatch(/json/)
    })

    test("should return a 404 error if the product is not found", async () => {
        const productId = 2000
        const response = await request(server).get(`/api/products/${productId}`)
        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty("message")
        expect(response.headers["content-type"]).toMatch(/json/)
    })

    test("should return a 400 error if the product id is not a number", async () => {
        const response = await request(server).get("/api/products/not-valid-url")
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe("Id no valido")
    })
})

describe("PUT - /api/products/:id", () => {
    test("should check if api/products/:id url exists", async () => {
        const response = await request(server).put("/api/products/1")
        expect(response.status).not.toBe(404)
    })

    test("should return a 400 error if the product id is not a number", async () => {
        const response = await request(server).put("/api/products/not-valid-url").send({
            name: "Mouse - testing",
            price: 100000,
            availability: true
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe("Id no valido")
    })

    test("should display validate error messages when updating a product", async() => {
        const response = await request(server).put("/api/products/1").send({})
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toHaveLength(5)
    })

    test("should update a valid product and return a success message", async() => {
        const response = await request(server).put("/api/products/1").send({
            name: "Mouse - testing",
            price: 100000,
            availability: true
        })

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("data")
        expect(response.body.data).toBeInstanceOf(Object)
    })

    test("should return a 404 error if the product is not found", async () => {
        const productId = 2000
        const response = await request(server).put(`/api/products/${productId}`).send({
            name: "Mouse - testing",
            price: 100000,
            availability: true
        })
        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty("message")
        expect(response.body.message).toBe("Producto no encontrado")
    })

    test("should validate that the price is a number and greater than 0", async () => {
        const response = await request(server).put("/api/products/1").send({
            name: "Mouse - testing",
            price: "asdf",
            availability: true
        })
        expect(response.body).toHaveProperty("errors")
        expect(response.status).toBe(400)
        expect(response.body.errors).toHaveLength(2)
        expect(response.body.errors[0].msg).toBe("Precio no valido")
        expect(response.body.errors[1].msg).toBe("El precio debe ser mayor a 0")
    })


})

describe("PATCH - /api/products/:id", () => {

    test("should check if api/products/:id url exists", async () => {
        const response = await request(server).patch("/api/products/1")
        expect(response.status).not.toBe(404)
    })

    test("shuld return a 404 response for a non-existing product", async () => {
        const productId = 2000
        const response = await request(server).patch(`/api/products/${productId}`).send({
            name: "Mouse - testing",
            price: 100000
        })
        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty("message")
        expect(response.body.message).toBe("Producto no encontrado")
    })

    test("should update a valid product and return a success message", async() => {
        const response = await request(server).patch("/api/products/1").send({
            name: "Mouse - testing",
            price: 100000
        })
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("data")
        expect(response.body.data).toBeInstanceOf(Object)
    }) 
})

describe("DELETE - /api/products/:id", () => {

    test("should return a 400 error if the product id is not a number", async () => {
        const response = await request(server).delete("/api/products/not-valid-id")
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe("Id no valido")
    })

    test("should return a 404 error if the product is not found", async () => {
        const productId = 2000
        const response = await request(server).delete(`/api/products/${productId}`)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("message")
        expect(response.body.message).toBe("Producto no encontrado")
      
    })

    test("should delete a valid product and return a success message", async() => {
        const response = await request(server).delete("/api/products/1")
        
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("message")
        expect(response.body.message).toBe("Producto eliminado satisfactoriamente")
    })

    test("should check if api/products/:id url exists", async () => {
        const response = await request(server).delete("/api/products/1")
        expect(response.status).not.toBe(404)
    })

})