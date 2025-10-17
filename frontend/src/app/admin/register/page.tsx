import Register from '@/components/ui/admin/register'
import { Nav } from '@/components/ui/mainNav/Nav'
import { Category } from '@/schemas/schemas'
import 'react-toastify/dist/ReactToastify.css'

interface HeaderProps {
    categories: Category[]
}

export default function RegisterPage({ categories }: HeaderProps) {
    return (
        <div className="flex flex-col gap-20">
            <Nav categories={categories} />
            <div className="bg-gray-200 shadow w-full mx-auto p-3 sm:p-10 lg:p-8 lg:w-3/5 items-center mt-26">
                <Register />
            </div>
        </div>
    )
}
