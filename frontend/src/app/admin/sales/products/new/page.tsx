import AddProductForm from "@/components/products/AddProductForm";
import ProductForm from "@/components/products/ProductForm";
import AdminNav from "@/components/ui/admin/panelAdmin/AdminNav";
import Heading from "@/components/ui/admin/panelAdmin/Heading";
import Link from "next/link";

export default function NewProductsPage() {
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

                        <AddProductForm>
                            <ProductForm />
                        </AddProductForm>
                    </div>
                </div>
            </div>
        </>
    );
}
