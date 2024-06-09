import { Router } from 'express'
import CartManager from '../dao/mongo/carts.mongo.js'

import { authorization } from '../middlewares/auth.middleware.js'
import { passportCall } from '../utils/jwt.utils.js'

import Validate from '../utils/validate.utils.js'

const CartMngr = new CartManager()
const CartsRouter = Router()

CartsRouter.get('/', async (req, res) => {
	try {
		res.status(200).send(await CartMngr.get())
	} catch (error) {
		res.status(500).send({ error: 'Error al obtener carritos' })
	}
})

CartsRouter.get('/:cid', async (req, res, next) => {
	let cid = req.params.cid

	try {
		Validate.id(cid, 'carrito')
		await Validate.existID(cid, CartMngr, 'carrito')
		res.status(200).send(await CartMngr.getById(cid))
	} catch (error) {
		next(error)
	}
})

CartsRouter.post('/', async (req, res) => {
	try {
		let newCart = await CartMngr.create()
		res.status(200).send(newCart)
	} catch (error) {
		res.status(500).send({ error: 'Error al crear carrito' })
	}
})

CartsRouter.post('/:cid/product/:pid', passportCall('current'), authorization('user'), async (req, res, next) => {
	let cid = req.params.cid
	let pid = req.params.pid

	try {
		Validate.id(cid, 'carrito')
		await Validate.existID(cid, CartMngr, 'carrito')
		Validate.id(pid, 'producto')
		await Validate.existID(pid, ProductMngr, 'producto')
		res.status(200).send(await CartMngr.addProductToCart(cid, pid))
	} catch (error) {
		next(error)
	}
})

CartsRouter.delete('/:cid/product/:pid', async (req, res, next) => {
	let cid = req.params.cid
	let pid = req.params.pid

	try {
		Validate.id(cid, 'carrito')
		await Validate.existID(cid, CartMngr, 'carrito')
		Validate.id(pid, 'producto')
		await Validate.existID(pid, ProductMngr, 'producto')
		res.status(200).send(await CartMngr.deleteProductFromCart(cid, pid))
	} catch (error) {
		next(error)
	}
})

CartsRouter.delete('/:cid', async (req, res, next) => {
	let cid = req.params.cid

	try {
		Validate.id(cid, 'carrito')
		await Validate.existID(cid, CartMngr, 'carrito')
		res.status(200).send(await CartMngr.empty(cid))
	} catch (error) {
		next(error)
	}
})

CartsRouter.put('/:cid', async (req, res, next) => {
	let cid = req.params.cid
	let newCartProducts = req.body

	try {
		Validate.id(cid, 'carrito')
		await Validate.existID(cid, CartMngr, 'carrito')
		res.status(200).send(await CartMngr.update(cid, newCartProducts))
	} catch (error) {
		next(error)
	}
})

CartsRouter.put('/:cid/product/:pid', async (req, res, next) => {
	let cid = req.params.cid
	let pid = req.params.pid
	let newQuantity = req.body

	try {
		Validate.id(cid, 'carrito')
		await Validate.existID(cid, CartMngr, 'carrito')
		Validate.id(pid, 'producto')
		await Validate.existID(pid, ProductMngr, 'producto')
		res.status(200).send(await CartMngr.updateProductInCart(cid, pid, newQuantity))
	} catch (error) {
		next(error)
	}
})

CartsRouter.get('/:cid/purchase', async (req, res, next) => {
	let cid = req.params.cid

	try {
		Validate.id(cid, 'carrito')
		await Validate.existID(cid, CartMngr, 'carrito')
		res.status(200).send(await CartMngr.purchaseCart(cid, req.user.user))
	} catch (error) {
		next(error)
	}
})

export default CartsRouter
