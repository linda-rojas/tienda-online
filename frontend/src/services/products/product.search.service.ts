import { ProductResponseSchema } from "@/schemas/schemas";

export async function searchProducts(q: string, take = 8, skip = 0) {
    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/productos`);
    url.searchParams.set("q", q);
    url.searchParams.set("take", String(take));
    url.searchParams.set("skip", String(skip));

    const res = await fetch(url.toString(), { cache: "no-store" });
    const json = await res.json();

    return ProductResponseSchema.parse(json); // { productos, total }
}
