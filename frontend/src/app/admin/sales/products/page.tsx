import ProductsTable from "@/components/products/ProductsTable";
import AdminNav from "@/components/ui/admin/panelAdmin/AdminNav";
import Heading from "@/components/ui/admin/panelAdmin/Heading";
import Pagination from "@/components/ui/Pagination";
import { ProductResponseSchema } from "@/schemas/schemas";
import { isValidPage } from "@/utils/isValidPage";
import Link from "next/link";
import { redirect } from 'next/navigation';

export async function getProducts(take: number, skip: number) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/productos?take=${take}&skip=${skip}`
  const req = await fetch(url)
  const json = await req.json()

  const data = ProductResponseSchema.parse(json)
  return {
    products: data.productos,
    total: data.total
  }
}

type SearchParams = Promise<{ page: string }>

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {

  const { page } = await searchParams
  if (!isValidPage(+page)) redirect('/admin/sales/products?page=1')


  const productsPerPage = 10
  const skip = (+page - 1) * productsPerPage
  const { products, total } = await getProducts(productsPerPage, skip)

  const totalPages = Math.ceil(total / productsPerPage)
  if (+page > totalPages) redirect('/admin/sales/products?page=1')

  return (
    <div className="bg-gray-100">
      <AdminNav />
      <div className="lg:min-h-screen container mx-auto mt-10 px-10 lg:px-0">
        <div className="bg-gray-50 shadow w-full mx-auto p-10 my-10 lg:w-3/5">

          <Link
            href='/admin/sales/products/new'
            className='rounded bg-green-400 font-bold py-2 px-10 text-gray-700'
          >
            Nuevo Producto
          </Link>

          <Heading>Administrar Productos</Heading>

          <ProductsTable
            products={products as any}
          />

          <Pagination
            page={+page}
            totalPages={totalPages}
            baseUrl='/admin/sales/products'
          />
        </div>
      </div>
    </div>
  );
}
