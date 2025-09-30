import { CartItem } from '@/schemas/schemas'
import { useStore } from '@/useStore'
import { formatCOP } from '@/utils/format-currency'
import Image from 'next/image'
import { IoMdCloseCircle } from 'react-icons/io'

export default function ShoppingCartItem({ item }: { item: CartItem }) {
    const updateQuantity = useStore((state) => state.updateQuantity)
    const removeFromCart = useStore((state) => state.removeFromCart)

    const img = item.imagen_url ?? '/product-notFound.png'
    return (
        <li className="flex items-center space-x-6 py-6 relative divide-gray-200 border-t border-gray-200">
            <div className="h-24 w-24">
                <Image
                    src={img}
                    alt={item.nombre}
                    width={100}
                    height={100}
                    className="cursor-pointer"
                    priority
                />
            </div>
            <div className="flex-auto space-y-2">
                <h3 className="text-gray-900">{item.nombre}</h3>
                <p>{formatCOP(item.precio)}</p>
                <select
                    className="w-32 text-center p-2 rounded-lg bg-gray-100 cursor-pointer text-[16px]border  focus:outline-none focus:ring-2 focus:ring-blue-500 "
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.productId, +e.target.value)}
                >
                    {Array.from({ length: item.stock }, (_, index) => index + 1).map((num) => (
                        <option key={num} value={num} className="text-gray-500 text-[16px]">
                            {num}
                        </option>
                    ))}
                </select>
            </div>
            <div className="absolute top-10 -right-0">
                <button type="button" onClick={() => removeFromCart(item.productId)}>
                    <IoMdCloseCircle className="w-8 h-8 text-red-500 cursor-pointer hover:text-red-700" />
                </button>
            </div>
        </li>
    )
}
