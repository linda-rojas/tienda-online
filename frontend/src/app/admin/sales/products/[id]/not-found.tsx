import AdminNav from "@/components/ui/admin/panelAdmin/AdminNav";
import Heading from "@/components/ui/admin/panelAdmin/Heading";
import Link from "next/link";

export default function NotFound() {
    return (
        <>
            <div className="bg-gray-100">
                <AdminNav />
                <div className="lg:min-h-screen container mx-auto mt-10 px-10 lg:px-0">
                    <div className="bg-gray-50 shadow w-full mx-auto p-10 my-10 lg:w-3/5">
                        <div className='text-center'>
                            <Heading>Producto No Encontrado</Heading>

                            <p>
                                Tal vez quieras volver a {' '}
                                <Link className='text-green-600' href={'/admin/sales/products?page=1'}>Productos</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
