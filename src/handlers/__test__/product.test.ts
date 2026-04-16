import request from "supertest";
import server from "../../server";
import Product from "../../models/Product.model";
import db from "../../config/db";

/* ===============================
   API /api/products
================================ */
describe("API /api/products", () => {
  beforeAll(async () => {
    // Esto asegura que la DB de TEST esté sincronizada antes de empezar
    await db.sync({ force: true });
  });

  afterAll(async () => {
    // Cerramos la conexión para evitar el error de "open handles"
    await db.close();
  });

  describe("POST /api/products  - error handling", () => {
    it("should return 500 if an error occurs", async () => {
      jest.spyOn(console, "error").mockImplementation(() => {});
      jest
        .spyOn(Product, "create")
        .mockRejectedValueOnce(new Error("Create error"));

      const response = await request(server).post("/api/products").send({
        name: "Test",
        price: 100,
        availability: true,
      });

      expect(response.status).toBe(500);
    });
  });
  /* ===============================
     POST
  =============================== */
  describe("POST /api/products", () => {
    beforeEach(async () => {
      await Product.destroy({ truncate: true });
    });

    it("should create a new product", async () => {
      const response = await request(server).post("/api/products").send({
        name: "Mouse - testing post",
        price: 100000,
        availability: true,
      });

      expect(response.status).toBe(201);
      expect(response.body.data).toMatchObject({
        name: "Mouse - testing post",
        price: 100000,
        availability: true,
      });
    });

    it("should return validation errors", async () => {
      const response = await request(server).post("/api/products").send({});

      expect(response.status).toBe(400);
      expect(response.body.errors).toHaveLength(4);
    });

    it("should validate that the price is a number and greater than 0", async () => {
      const response = await request(server).post("/api/products").send({
        name: "Invalid price",
        price: "hola",
        availability: true,
      });

      expect(response.status).toBe(400);
      expect(response.body.errors).toHaveLength(2);
    });
  });

  /* ===============================
     GET ALL
  =============================== */

  describe("GET /api/products - error handling", () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });
    it("should return 500 if an error occurs", async () => {
      jest
        .spyOn(Product, "findAll")
        .mockRejectedValueOnce(new Error("DB error"));

      const response = await request(server).get("/api/products");

      expect(response.status).toBe(500);
      //expect(response.body.message).toBe("Error al obtener productos");
    });
  });

  describe("GET /api/products", () => {
    beforeEach(async () => {
      await Product.destroy({ truncate: true });
    });

    it("should return empty array when there are no products", async () => {
      const response = await request(server).get("/api/products");

      expect(response.body.data).toHaveLength(0);
    });

    it("should return a list of products in JSON response", async () => {
      await request(server).post("/api/products").send({
        name: "Product Test list",
        price: 50000,
        availability: true,
      });

      const response = await request(server).get("/api/products");

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it("should check if api/products url exists", async () => {
      const response = await request(server).get("/api/products");
      expect(response.status).not.toBe(404);
    });
  });

  /* ===============================
     GET BY ID
  =============================== */

  describe("GET /api/products - error handling", () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });
    it("should return 500 if an error occurs", async () => {
      jest.spyOn(console, "error").mockImplementation(() => {});
      jest
        .spyOn(Product, "findByPk")
        .mockRejectedValueOnce(new Error("DB error"));

      const response = await request(server).get(`/api/products/5555`);
      
      expect(response.status).toBe(500);
      //expect(response.body.message).toBe("Error al obtener productos");
    });
  });

  describe("GET /api/products/:id", () => {
    let productId: number;

    beforeEach(async () => {
      await Product.destroy({ truncate: true });

      const response = await request(server).post("/api/products").send({
        name: "Product GET ID",
        price: 50000,
        availability: true,
      });

      productId = response.body.data.id;
    });

    it("should return a product by id", async () => {
      const response = await request(server).get(`/api/products/${productId}`);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(productId);
    });

    it("should return 404 if product not found", async () => {
      const response = await request(server).get("/api/products/9999");
      expect(response.status).toBe(404);
    });

    it("should check if api/products/:id url exists", async () => {
      const response = await request(server).get(`/api/products/${productId}`);
      expect(response.status).not.toBe(404);
    });

    it("should return 400 if id is invalid", async () => {
      const response = await request(server).get("/api/products/abc");

      expect(response.status).toBe(400);
      expect(response.body.errors[0].msg).toBe("Id no valido");
    });
  });

  /* ===============================
     PUT
  =============================== */

  describe("PUT /api/products by id - error handling", () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });
    it("should return 500 if an error occurs", async () => {
      jest.spyOn(console, "error").mockImplementation(() => {});
      jest
        .spyOn(Product, "findByPk")
        .mockRejectedValueOnce(new Error("DB error"));

      const response = await request(server).put(`/api/products/5555`).send({
        name: "Test api",
        price: 10000,
        availability: true,
      });
      
      expect(response.status).toBe(500);
      //expect(response.body.message).toBe("Error al obtener productos");
    });
  });

  describe("PUT /api/products/:id", () => {
    let productId: number;

    beforeEach(async () => {
      await Product.destroy({ truncate: true });

      const response = await request(server).post("/api/products").send({
        name: "Product PUT",
        price: 50000,
        availability: true,
      });

      productId = response.body.data.id;
    });

    it("should check if api/products/:id url exists", async () => {
      const response = await request(server).put(`/api/products/${productId}`);
      expect(response.status).not.toBe(404);
    });

    it("should return a 400 error if the product id is not a number", async () => {
      const response = await request(server)
        .put("/api/products/not-valid-url")
        .send({
          name: "Mouse - testing",
          price: 100000,
          availability: true,
        });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errors");
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0].msg).toBe("Id no valido");
    });

    it("should display validate error messages when updating a product", async () => {
      const response = await request(server)
        .put(`/api/products/${productId}`)
        .send({});
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errors");
      expect(response.body.errors).toHaveLength(5);
    });

    it("should update a valid product", async () => {
      const response = await request(server)
        .put(`/api/products/${productId}`)
        .send({
          name: "Updated product",
          price: 80000,
          availability: false,
        });

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe("Updated product");
      expect(response.body.data.price).toBe(80000);
    });

    it("should return a 404 error if the product is not found", async () => {
      const productId = 2000;
      const response = await request(server).put(`/api/products/99999`).send({
        name: "Mouse - testing",
        price: 100000,
        availability: true,
      });
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Producto no encontrado");
    });

    it("should validate that the price is a number", async () => {
      const response = await request(server)
        .put(`/api/products/${productId}`)
        .send({
          name: "Mouse - testing",
          price: "asdf",
          availability: true,
        });
      expect(response.body).toHaveProperty("errors");
      expect(response.status).toBe(400);
      expect(response.body.errors).toHaveLength(2);
      expect(response.body.errors[0].msg).toBe("Precio no valido");
      expect(response.body.errors[1].msg).toBe("El precio debe ser mayor a 0");
    });

    it("should validate that the price is a number greater than 0", async () => {
      const response = await request(server)
        .put(`/api/products/${productId}`)
        .send({
          name: "Mouse - testing",
          price: 0,
          availability: true,
        });

      expect(response.body).toHaveProperty("errors");
      expect(response.status).toBe(400);
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0].msg).toBe("El precio debe ser mayor a 0");
    });
  });

  /* ===============================
     PATCH
  =============================== */

  describe("PATCH /api/products by id - error handling", () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });
    it("should return 500 if an error occurs", async () => {
      jest.spyOn(console, "error").mockImplementation(() => {});
      jest
        .spyOn(Product, "findByPk")
        .mockRejectedValueOnce(new Error("DB error"));

      const response = await request(server).patch(`/api/products/5555`).send({
        availability: true,
      });
     
      expect(response.status).toBe(500);
      //expect(response.body.message).toBe("Error al obtener productos");
    });
  });

  describe("PATCH /api/products/:id", () => {
    let productId: number;

    beforeEach(async () => {
      await Product.destroy({ truncate: true });

      const response = await request(server).post("/api/products").send({
        name: "Product PATCH",
        price: 60000,
        availability: true,
      });

      productId = response.body.data.id;
    });

    it("should check if api/products/:id url exists", async () => {
      const response = await request(server).patch(
        `/api/products/${productId}`,
      );
      expect(response.status).not.toBe(404);
    });

    it("shuld return a 404 response for a non-existing product", async () => {
      const productId = 2000;
      const response = await request(server)
        .patch(`/api/products/999999`)
        .send({
          name: "Mouse - testing",
          price: 100000,
        });
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Producto no encontrado");
    });

    it("should partially update a product", async () => {
      const response = await request(server)
        .patch(`/api/products/${productId}`)
        .send({ availability: false });

      expect(response.status).toBe(200);
      expect(response.body.data.availability).toBe(false);
    });
  });

  /* ===============================
     DELETE
  =============================== */

  describe("DELETE /api/products by id - error handling", () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });
    it("should return 500 if an error occurs", async () => {
      jest.spyOn(console, "error").mockImplementation(() => {});
      jest
        .spyOn(Product, "findByPk")
        .mockRejectedValueOnce(new Error("DB error"));

      const response = await request(server).delete(`/api/products/5555`);
   
      expect(response.status).toBe(500);
      //expect(response.body.message).toBe("Error al obtener productos");
    });
  });

  describe("DELETE /api/products/:id", () => {
    let productId: number;

    beforeEach(async () => {
      await Product.destroy({ truncate: true });

      const response = await request(server).post("/api/products").send({
        name: "Product DELETE",
        price: 40000,
        availability: true,
      });

      productId = response.body.data.id;
    });

    it("should return a 400 error if the product id is not a number", async () => {
      const response = await request(server).delete(
        "/api/products/not-valid-id",
      );
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errors");
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0].msg).toBe("Id no valido");
    });

    it("should check if api/products/:id url exists", async () => {
      const response = await request(server).delete(
        `/api/products/${productId}`,
      );
      expect(response.status).not.toBe(404);
    });

    it("should return a 404 error if the product is not found", async () => {
      const productId = 2000;
      const response = await request(server).delete(`/api/products/999999`);
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Producto no encontrado");
    });

    it("should delete a valid product", async () => {
      const response = await request(server).delete(
        `/api/products/${productId}`,
      );

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        "Producto eliminado correctamente",
      );
    });

    it("should return 404 if product already deleted", async () => {
      await request(server).delete(`/api/products/${productId}`);

      const response = await request(server).delete(
        `/api/products/${productId}`,
      );

      expect(response.status).toBe(404);
    });
  });
});
