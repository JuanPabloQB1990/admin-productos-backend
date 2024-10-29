import { Request, Response } from "express"
import Product from "../models/Product.model";

export const getProducts = async (req : Request, res : Response) => {
    try {
        const products = await Product.findAll({
            order: [
                ['id', 'DESC']
            ]
        })
        if (!products) {
            res.status(404).json({message: "No hay productos en la lista"})
            return 
        }
        res.json({data:products})
    } catch (error) {
        console.log(error)
    }
}

export const getProductById = async (req : Request, res : Response) => {
    
    try {
        const product = await Product.findByPk(req.params.id)
        if (!product) {
            res.status(404).json({message: "Producto no encontrado"})
            return 
        }
        res.json({data:product})
    } catch (error) {
        console.log(error);
        
    }
}

export const createProduct = async(req : Request, res : Response) => {
    
    try {
        const saveProdcuct = await Product.create(req.body)
        res.status(201).json({data: saveProdcuct})
        
    } catch (error) {
        console.log(error);
        
    }
    
}

export const updateProduct = async (req : Request, res : Response) => {
    const { id } = req.params
    try {
        const product = await Product.findByPk(id)
        if (!product) {
            res.status(404).json({message: "Producto no encontrado"})
            return 
        }
        
        await product.update(req.body)
        await product.save()
        res.status(200).json({data: product})
    } catch (error) {
        console.log(error);
        
    }
    
}

export const updateAvailability = async (req : Request, res : Response) => {
    const { id } = req.params
    console.log(id);
    
    try {
        const product = await Product.findByPk(id)
        if (!product) {
            res.status(404).json({message: "Producto no encontrado"})
            return 
        }
        
        product.availability = !product.dataValues.availability
        await product.save()
        res.status(200).json({data : product})
    } catch (error) {
        console.log(error);
        
    }
    
}

export const deleteProduct = async (req : Request, res : Response) => {
    
    const { id } = req.params
    try {
        const product = await Product.findByPk(id)
        if (!product) {
            res.json({message: "Producto no encontrado"})
            return 
        }
        
        await product.destroy()
        res.json({message: "Producto eliminado satisfactoriamente"})
    } catch (error) {
        console.log(error);
        
    }
    
}