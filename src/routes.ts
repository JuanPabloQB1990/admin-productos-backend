import { Router } from "express"
import { createProduct } from "./handlers/product"
import { handleInputErrors } from "./middleware"

const router = Router()

Router
router.get('/', (req, res) => {
    res.json('desde metodo GET')
})

router.post('/', handleInputErrors, createProduct)

router.patch('/', (req, res) => {
    res.json('desde metodo PATCH')
})

router.put('/', (req, res) => {
    res.json('desde metodo PUT')
})

router.delete('/', (req, res) => {
    res.json('desde metodo DELETE')
})

export default router
