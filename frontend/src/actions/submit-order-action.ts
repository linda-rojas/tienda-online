'use server'
import { ErrorResponseSchema, OrderSchema, SuccessResponseSchema } from "@/schemas/schemas"
import { revalidatePath, revalidateTag } from "next/cache"

export async function submitOrder(data: unknown) {
	const order = OrderSchema.parse(data)
	const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/transacciones`
	const req = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ ...order })
	})
	const json = await req.json()

	// message: z.array(z.string()),
	// 		error: z.string(),
	// 		statusCode: z.number()
	console.log('Response from submitOrder:', json);


	if (!req.ok) {
		const errors = ErrorResponseSchema.parse(json)
		return {
			errors: errors.message.map(issue => issue),
			success: ''
		}
	}

	const success = SuccessResponseSchema.parse(json)
	revalidateTag('products-by-category')
	// revalidatePath('/(store)/[categoryId]', 'page')
	return {
		errors: [],
		success: success.message
	}

}