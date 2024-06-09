import { Router } from 'express'
import CategoryManager from '../dao/mongo/categories.mongo.js'
import CategoryDTO from '../dao/DTOs/category.dto.js'

import Validate from '../utils/validate.utils.js'

const CategoriesRouter = Router()
const categoryMngr = new CategoryManager()

CategoriesRouter.get('/', async (req, res) => {
	try {
		const categories = await categoryMngr.get()
		res.status(201).json(categories)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
})

CategoriesRouter.get('/:id', async (req, res, next) => {
	try {
		const categoryId = req.params.id
		Validate.id(categoryId, 'categoría')
		Validate.existID(categoryId, categoryMngr, 'categoría')

		res.status(201).json(await categoryMngr.getById(categoryId))
	} catch (error) {
		next(error)
	}
})

CategoriesRouter.post('/', async (req, res) => {
	const categoryData = req.body

	try {
		const newCategory = new CategoryDTO(categoryData)
		res.status(201).json(await categoryMngr.create(newCategory))
	} catch (error) {
		res.status(400).json({ message: error.message })
	}
})

CategoriesRouter.put('/:id', async (req, res, next) => {
	try {
		const categoryId = req.params.id
		Validate.id(categoryId, 'categoría')
		Validate.existID(categoryId, categoryMngr, 'categoría')

		res.status(201).json(await categoryMngr.update(categoryId, req.body))
	} catch (error) {
		next(error)
	}
})

CategoriesRouter.delete('/:id', async (req, res, next) => {
	try {
		const categoryId = req.params.id
		Validate.id(categoryId, 'categoría')
		Validate.existID(categoryId, categoryMngr, 'categoría')

		res.status(201).json(await categoryMngr.delete(categoryId))
	} catch (error) {
		next(error)
	}
})

export default CategoriesRouter
