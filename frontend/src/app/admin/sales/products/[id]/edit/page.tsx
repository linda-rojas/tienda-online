import EditProductForm from "@/components/ui/products/EditProductForm";
import ProductForm from "@/components/ui/products/ProductForm";
import AdminNav from "@/components/ui/admin/panelAdmin/AdminNav";
import Heading from "@/components/ui/admin/panelAdmin/Heading";
import { ProductSchema } from "@/schemas/schemas";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getProduct(id: string) {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/productos/${id}`
    const req = await fetch(url)
    const json = await req.json()

    if (!req.ok) {
        notFound()
    }

    const product = ProductSchema.parse(json)
    return product
}

type Params = Promise<{ id: string }>

export default async function EditProductPage({ params }: { params: Params }) {
    const { id } = await params
    const product = await getProduct(id)

    return (
        <>
            <div className="bg-gray-100">
                <AdminNav />
                <div className="lg:min-h-screen container mx-auto mt-10 px-10 lg:px-0">
                    <div className="bg-gray-50 shadow w-full mx-auto p-10 my-10 lg:w-3/5">
                        <Link
                            href='/admin/sales/products?page=1'
                            className='rounded bg-green-400 font-bold py-2 px-10 text-gray-700'
                        >
                            Volver
                        </Link>

                        <Heading>Editar Producto: {product.nombre}</Heading>

                        <EditProductForm>
                            <ProductForm
                                product={product}
                            />
                        </EditProductForm>
                    </div>
                </div>
            </div>
        </>
    );
}
