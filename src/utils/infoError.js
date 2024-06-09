export const generateIDErrorInfo = (pid) => {
    return `

    ID received: ${pid}
    
------------------------------------------------------------------------------------------
    `
}

export const generateProductErrorInfo = (product) => {
	const { title, description, code, price, stock, category, ...others } = product

	return `

    Expected arguments:                 Received values:
    - title: of type String             - ${title}
    - description: of type String       - ${description}
    - code: of type String              - ${code}
    - price: of type Number             - ${price}
    - stock: of type Number             - ${stock}
    - category: of type String          - ${category}

    Optional arguments:
    - thumbnails                        - ${JSON.stringify(others)}

------------------------------------------------------------------------------------------
    `
}

export const generateCodeErrorInfo = (code) => {
    return `

    Code received: ${code}

------------------------------------------------------------------------------------------
    `
}