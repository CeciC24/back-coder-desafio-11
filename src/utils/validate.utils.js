import mongoose from 'mongoose'
import CustomError from './customError.utils.js'
import ErrorTypes from './errorTypes.utils.js'
import { generateCodeErrorInfo, generateIDErrorInfo, generateProductErrorInfo } from './infoError.js'

export default class Validate {
	static id = (id, tipo) => {
		if (!id) {
			CustomError.createError({
				name: 'Error al buscar ' + tipo,
				message: generateIDErrorInfo(id),
				code: ErrorTypes.ERROR_INVALID_ARGUMENTS,
				cause: 'No se ha enviado un ID',
			})
		} else if (!mongoose.Types.ObjectId.isValid(id)) {
			CustomError.createError({
				name: 'Error al buscar ' + tipo,
				message: generateIDErrorInfo(id),
				code: ErrorTypes.ERROR_INVALID_ARGUMENTS,
				cause: 'El ID no es un ObjectId válido',
			})
		}
	}

	static existID = async (id, manager, tipo) => {
		if (!await manager.getById(id)) {
			CustomError.createError({
				name: 'Error al buscar ' + tipo,
				message: generateIDErrorInfo(id),
				code: ErrorTypes.ERROR_NOT_FOUND,
				cause: 'ID no encontrado',
			})
		}
	}

	static existCode = async (code, manager) => {
		if (await manager.getByCode(code)) {
			CustomError.createError({
				name: 'Error al registrar producto',
				message: generateCodeErrorInfo(code),
				code: ErrorTypes.ERROR_DATA,
				cause: 'El campo "code" ya existe',
			})
		}
	}

	static productData = (productData) => {
		if (
			!productData.title ||
			!productData.description ||
			!productData.code ||
			!productData.price ||
			!productData.stock ||
			!productData.category
		) {
			CustomError.createError({
				name: 'Error al registrar producto',
				message: generateProductErrorInfo(productData),
				code: ErrorTypes.ERROR_DATA,
				cause: 'Faltan campos requeridos',
			})
		}
	}
}
