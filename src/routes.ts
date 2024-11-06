import { Router, Request, Response } from "express"
import { createProduct, deleteProduct, getProductById, getProducts, updateAvailability, updateProduct } from "./handlers/product"
import { handleInputErrors } from "./middleware"
import { body, param } from "express-validator"
import emailRegistro from "./helpers/emails"

const router = Router()

/**
 * @swagger
 * components:
 *      schemas:
 *          Product:
 *              type: object
 *              properties: 
 *                    id:
 *                       type: integer
 *                       description: The Product ID
 *                       example: 1
 *                    name:
 *                       type: string
 *                       description: The Product name
 *                       example: "Monitor Curvo 27 pulgadas"
 *                    price:
 *                       type: number
 *                       description: The Product price
 *                       example: 2000  
 *                    availability:  
 *                      type: boolean
 *                      description: The Product availability
 *                      example: true
 */

/**
 * @swagger
 * /api/products:
 *      get:
 *        summary: Get all list of products
 *        tags: 
 *            - Products
 *        description: Return a list of products
 *        responses:
 *           200:
 *               description: Success response
 *               content:
 *                   application/json:
 *                       schema:
 *                          type: array
 *                          items: 
 *                            type: object
 *                            $ref: '#/components/schemas/Product'
 */
router.get('/', getProducts)

/**
 * @swagger
 * /api/products/{id}:
 *      get:
 *          summary: Get a product by id
 *          tags: 
 *             - Products
 *          description: Return a product by id
 *          parameters:
 *             - in: path
 *               name: id
 *               description: Product id
 *               required: true
 *               schema:
 *                   type: integer
 *          responses:
 *           200:
 *              description: Success response
 *              content:
 *                 application/json:
 *                    schema:
*                           $ref: '#/components/schemas/Product' 
 *           404:
 *               description: Product not found    
 *           400: 
 *               description: Bad request - Invalid ID                           
 */

router.get('/:id', 
    param('id').isInt().withMessage("Id no valido"),
    handleInputErrors,
    getProductById
)

/**
 * @swagger
 * /api/products:
 *      post:
 *           summary: Create a new product
 *           tags: 
 *              - Products
 *           description: Returns a new record in the database
 *           requestBody:
 *                     required: true
 *                     content:
 *                        application/json:
 *                          schema:
 *                            properties: 
 *                              name:
 *                                type: string
 *                                example: "Nombre del nuevo producto"
 *                              price:
 *                                type: number
 *                                example: 1500
 *           responses:
 *                  201:
 *                     description: Product updated successfully
 *                     content:
 *                       application/json:
 *                          schema:
 *                            $ref: '#/components/schemas/Product'
 *                  400:
 *                     description: Bad request - Invalid input data
 * 
 */

router.post('/', 

    body('name')
        .notEmpty().withMessage("El nombre del producto es requerido"),
        
    body('price')
        .isNumeric().withMessage("Precio no valido")
        .notEmpty().withMessage("El precio del producto es requerido")
        .custom(value => value > 0).withMessage("El precio debe ser mayor a 0"),
    handleInputErrors,
    createProduct
)

/**
 * @swagger
 * /api/products/{id}:
 *      patch:
 *          summary: Update the availability of a product by id
 *          tags: 
 *              - Products
 *          description: Update the availability of a product by id
 *          parameters:
 *             - in: path
 *               name: id
 *               description: Product id
 *               required: true
 *               schema:
 *                   type: integer
 *          responses:
 *                  201:
 *                     description: Product updated successfully
 *                     content:
 *                       application/json:
 *                          schema:
 *                            $ref: '#/components/schemas/Product'
 * 
 *                  400:
 *                     description: Bad request - Invalid ID
 *                  404: 
 *                     description: Product not found
 * 
 */


router.patch('/:id', 
    param('id').isInt().withMessage("Id no valido"),
    handleInputErrors,
    updateAvailability
)

/**
 * @swagger
 * /api/products/{id}:
 *      put:
 *          summary: Update a product by id
 *          tags: 
 *               - Products
 *          description: Update a product by id
 *          parameters:
 *             - in: path
 *               name: id
 *               description: Product id
 *               required: true
 *               schema:
 *                   type: integer
 *          requestBody:
 *               required: true
 *               content:
 *                   application/json:
 *                          schema:
 *                            properties: 
 *                              name:
 *                                type: string
 *                                example: "El nombre nuevo del producto"
 *                              price:
 *                                type: number
 *                                example: 1500
 *                              availibity:
 *                                type: boolean
 *                                example: true
 *          responses:
 *                  201:
 *                     description: Product updated successfully
 *                     content:
 *                       application/json:
 *                          schema:
 *                            $ref: '#/components/schemas/Product'
 * 
 *                  400:
 *                     description: Bad request - Invalid ID or input data
 *                  404: 
 *                     description: Product not found
 * 
 * 
 * 
 */

router.put('/:id', 
    param('id').isInt().withMessage("Id no valido"),
    body('name')
        .notEmpty().withMessage("El nombre del producto es requerido"),
        
    body('price')
        .isNumeric().withMessage("Precio no valido")
        .notEmpty().withMessage("El precio del producto es requerido")
        .custom(value => value > 0).withMessage("El precio debe ser mayor a 0"),
    body('availability')
        .isBoolean().withMessage("Valor de disponibilidad no valido"),
    handleInputErrors,
    updateProduct
)

/**
 * @swagger
 * /api/products/{id}:
 *      delete:
 *             summary: Delete a product by id
 *             tags: 
 *                - Products
 *             description: Delete a product by id
 *             parameters:
 *                        - in: path
 *                          name: id
 *                          description: Product id to Delete
 *                          required: true
 *                          schema:
 *                              type: integer
 *             responses:
 *                  200:
 *                     description: Product Delete Successfully
 *                     content:
 *                       application/json:
 *                          schema:
 *                            properties: 
 *                              message:
 *                                type: string
 *                                example: "Producto eliminado satisfactoriamente"
 * 
 *                  400:
 *                     description: Bad request - Invalid ID
*/ 

router.delete('/:id', 
    param('id').isInt().withMessage("Id no valido"),
    handleInputErrors,
    deleteProduct)

router.post("/contact", async(req: Request, res: Response)  => {
    try {
        const response = await emailRegistro(req.body)
        console.log(response);
        res.json({msg: "ok"})
        return 
    } catch (error) {
        console.log(error);
        
    }
})

export default router
