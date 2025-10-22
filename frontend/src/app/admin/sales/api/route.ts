import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const transacciondate = searchParams.get('transacciondate')

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/transacciones?transacciondate=${transacciondate}`
    const req = await fetch(url)
    const response = await req.json()
    return Response.json(response)
}