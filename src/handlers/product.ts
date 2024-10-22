import { Request, Response } from "express"
import Product from "../models/Product.model";
import { check } from "express-validator";

export const createProduct = async(req : Request, res : Response) => {

    await check('name')
        .notEmpty().withMessage("El nombre del producto es requerido")
        .run(req)
        
    await check('price')
        .isNumeric().withMessage("Precio no valido")
        .notEmpty().withMessage("El precio del producto es requerido")
        .custom(value => value > 0).withMessage("Precio debe ser mayor a 0")
        .run(req)
    
    
    
    const saveProdcuct = await Product.create(req.body)
    
    res.json({data: saveProdcuct})
}