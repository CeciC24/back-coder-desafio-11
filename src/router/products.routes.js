import { Router } from 'express'
import ProductManager from '../dao/mongo/products.mongo.js'
import ProductDTO from '../dao/DTOs/product.dto.js'

import { authorization } from '../middlewares/auth.middleware.js'
import { passportCall } from '../utils/jwt.utils.js'
import Validate from '../utils/validate.utils.js'

const ProductMngr = new ProductManager()
const ProductRouter = Router()

ProductRouter.get('/', async (req, res, next) => {
	let limit = parseInt(req.query.limit)
	let page = parseInt(req.query.page)
	let sort = req.query.sort
	let query = req.query.query ? JSON.parse(req.query.query) : {}
	let populate = 'category'

	try {
		const response = await ProductMngr.getPaginated(page, limit, sort, query, populate)

		return res.status(200).json({ response })
	} catch (error) {
		return res.status(500).send({ error: 'Error al obtener productos' })
	}
})

ProductRouter.get('/:pid', async (req, res, next) => {
	let pid = req.params.pid

	try {
		Validate.id(pid, 'producto')
		await Validate.existID(pid, ProductMngr, 'producto')

		let product = await ProductMngr.getById(pid)
		res.status(200).send(product)
	} catch (error) {
		next(error)
	} 
})

ProductRouter.post('/', passportCall('current'), authorization('admin'), async (req, res, next) => {
	try {
		let productData = req.body

		Validate.productData(productData)
		await Validate.existCode(productData.code, ProductMngr)

		const newProduct = new ProductDTO(productData)
		res.status(200).send(await ProductMngr.create(newProduct))
	} catch (error) {
		next(error)
	}
})

ProductRouter.put('/:pid', passportCall('current'), authorization('admin'), async (req, res, next) => {
	let pid = req.params.pid
	let newField = req.body

	try {
		Validate.id(pid, 'producto')
		await Validate.existID(pid, ProductMngr, 'producto')

		res.status(200).send(await ProductMngr.update(pid, newField))
	} catch (error) {
		next(error)
	}
})

ProductRouter.delete('/:pid', passportCall('current'), authorization('admin'), async (req, res, next) => {
	let pid = req.params.pid

	try {
		Validate.id(pid, 'producto')
		await Validate.existID(pid, ProductMngr, 'producto')
		
		res.status(200).send(await ProductMngr.delete(pid))
	} catch (error) {
		next(error)
	}
})

export default ProductRouter
