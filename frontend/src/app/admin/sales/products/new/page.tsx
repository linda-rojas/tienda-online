import AdminNav from "@/components/ui/admin/panelAdmin/AdminNav";
import Heading from "@/components/ui/admin/panelAdmin/Heading";
import Link from "next/link";
import ProductWizardWrapper from "@/components/forms/productsPanelAdmin/ProductWizardWrapper";
import { CategoriesResponseSchemas } from "@/schemas/schemas";
import ProductWizardCreateModal from "@/components/forms/productsPanelAdmin/ProductWizardCreateModal";

async function getCategories() {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/categorias`
    const req = await fetch(url)
    const json = await req.json()
    return CategoriesResponseSchemas.parse(json)
}


export default async function NewProductsPage() {

    const categories = await getCategories()

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
                        <Heading>Nuevo producto</Heading>

                        <ProductWizardCreateModal categories={categories} />
                    </div>
                </div>
            </div>
        </>
    );
}
