export async function POST(request: Request) {
    try {
        const coupon = await request.json();

        const backendResponse = await fetch("http://localhost:3000/cupones", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(coupon),
        });

        const text = await backendResponse.text();

        // Intentar parsear JSON
        let data;
        try {
            data = JSON.parse(text);
        } catch (err) {
            console.error("El backend no devolvió JSON. Respuesta cruda:", text);
            return new Response(
                JSON.stringify({
                    error: "La respuesta del backend no es JSON",
                    raw: text,
                }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        return new Response(JSON.stringify(data), {
            status: backendResponse.status,
            headers: { "Content-Type": "application/json" },
        });

    } catch (err) {
        console.error("Error en el proxy coupones:", err);
        return new Response(
            JSON.stringify({ error: "Error interno en el proxy", details: err }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
