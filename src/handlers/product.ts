import { Request, Response } from "express";
import Product from "../models/Product.model";

/**
 * Helper para manejar errores
 */
const handleError = (res: Response, error: unknown, message = "Error interno del servidor") => {
    console.error(error);
    return res.status(500).json({ error: message });
};

/**
 * GET /api/products
 */
export const getProducts = async (_req: Request, res: Response) => {
    try {
        const products = await Product.findAll({
            order: [["id", "DESC"]],
        });

        res.status(200).json({
            success: true,
            count: products.length,
            data: products,
        });
        return 
    } catch (error) {
        handleError(res, error, "Error al obtener los productos");
        return 
    }
};

/**
 * GET /api/products/:id
 */
export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const product = await Product.findByPk(id);

        if (!product) {
            res.status(404).json({
                success: false,
                message: "Producto no encontrado",
            });
            return;

        }

        res.status(200).json({
            success: true,
            data: product,
        });
        return
    } catch (error) {
        handleError(res, error, "Error al obtener el producto");
        return 
    }
};

/**
 * POST /api/products
 */
export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, price, availability } = req.body;

        // ✅ Validación básica
        if (!name || price == null) {
            res.status(400).json({
                success: false,
                message: "Nombre y precio son obligatorios",
            });
            return;
        }

        const product = await Product.create({
            name,
            price,
            availability: availability ?? true,
        });

        res.status(201).json({
            success: true,
            data: product,
        });
        return
    } catch (error) {
        handleError(res, error, "Error al crear el producto");
        return
    }
};

/**
 * PUT /api/products/:id
 */
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const product = await Product.findByPk(id);

        if (!product) {
            res.status(404).json({
                success: false,
                message: "Producto no encontrado",
            });
            return;

        }

        await product.update(req.body);

        res.status(200).json({
            success: true,
            data: product,
        });
        return 
    } catch (error) {
        handleError(res, error, "Error al actualizar el producto");
        return 
    }
};

/**
 * PATCH /api/products/:id/availability
 */
export const updateAvailability = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const product = await Product.findByPk(id);

        if (!product) {
            res.status(404).json({
                success: false,
                message: "Producto no encontrado",
            });
            return;
        }

        product.availability = !product.availability;

        await product.save();

        res.status(200).json({
            success: true,
            data: product,
        });
        return
    } catch (error) {
        handleError(res, error, "Error al actualizar disponibilidad");
        return 
    }
};

/**
 * DELETE /api/products/:id
 */
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const product = await Product.findByPk(id);

        if (!product) {
            res.status(404).json({
                success: false,
                message: "Producto no encontrado",
            });
            return;

        }

        await product.destroy();

        res.status(200).json({
            success: true,
            message: "Producto eliminado correctamente",
        });
        return
    } catch (error) {
        handleError(res, error, "Error al eliminar el producto");
        return
    }
};