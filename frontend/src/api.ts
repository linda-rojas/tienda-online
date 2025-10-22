import { TransactionsResponseSchema } from "./schemas/schemas"

export async function getSalesByDate(date: string) {
    const url = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/admin/sales/api?transacciondate=${date}`
    const req = await fetch(url)
    const json = await req.json()

    const transactions = TransactionsResponseSchema.parse(json)
    console.log(transactions)
    return transactions
}