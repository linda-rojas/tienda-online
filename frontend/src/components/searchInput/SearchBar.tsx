// 'use client'
// import { useState, useEffect } from 'react'
// import { FaSearch } from 'react-icons/fa'
// import { Product } from '@/schemas/schemas'
// import ProductCard from '../products/productCards'

// const SearchBar = () => {
//     const [searchTerm, setSearchTerm] = useState('')
//     const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
//     const [isSearching, setIsSearching] = useState(false)
//     const [allProducts, setAllProducts] = useState<Product[]>([])

//     const url = process.env.NEXT_PUBLIC_BACKEND_URL

//     // Llamada a la API para obtener los productos
//     const fetchProducts = async () => {
//         try {
//             const response = await fetch(`${url}/productos/`)  // Usamos la URL base + el endpoint
//             const data = await response.json()
//             setAllProducts(data)  // Almacenamos los productos obtenidos
//         } catch (err) {
//             console.error('Error al obtener productos:', err)
//         }
//     }

//     // Obtener productos al cargar el componente (se ejecuta solo una vez)
//     useEffect(() => {
//         fetchProducts()  // Realiza la llamada solo una vez al cargar el componente
//     }, [])  // Array vacío, por lo que solo se ejecuta una vez al montar

//     // Maneja el cambio en el input de búsqueda
//     const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setSearchTerm(event.target.value)
//     }

//     // Filtra los productos basados en el texto que el usuario ingresa
//     useEffect(() => {
//         if (searchTerm.trim() === '') {
//             setFilteredProducts([])  // Si el término de búsqueda está vacío, no mostrar productos
//             return
//         }

//         const timer = setTimeout(() => {
//             setIsSearching(true)  // Indicamos que estamos buscando

//             const filtered = allProducts.filter((product) =>
//                 product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || // Filtrar por nombre
//                 product.subtitulo.toLowerCase().includes(searchTerm.toLowerCase()) // Filtrar por subtítulo
//             )

//             setFilteredProducts(filtered)  // Actualizamos los productos filtrados
//             setIsSearching(false)  // Terminamos la búsqueda
//         }, 300)  // 300ms debounce para evitar llamadas rápidas e innecesarias

//         return () => clearTimeout(timer)  // Limpiamos el timeout en caso de un cambio rápido
//     }, [searchTerm, allProducts])  // Dependemos de `searchTerm` y `allProducts` para actualizar los productos filtrados

//     return (
//         <div className={`color-gray-md-bg relative rounded-[10px] w-[60%] md:hidden lg:hidden`}>
//             <input
//                 type="text"
//                 placeholder="Buscar producto"
//                 className={`color-gray-md color-gray-sm w-full rounded-[10px] p-[5px] pl-6 focus:outline-blue-500 bg-white md:w-[400px] lg:hidden`}
//                 value={searchTerm}
//                 onChange={handleSearch}
//             />
//             <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 underline" />

//             {/* Aquí mostramos las cards relacionadas */}
//             {isSearching && <div>Buscando...</div>} {/* Mensaje mientras se busca */}
//             <div className="mt-2">
//                 {filteredProducts.length > 0 ? (
//                     <div className="grid grid-cols-3 gap-4">
//                         {filteredProducts.map((product) => (
//                             <ProductCard key={product.id} product={product} />
//                         ))}
//                     </div>
//                 ) : (
//                     <div>No se encontraron productos relacionados</div>
//                 )}
//             </div>
//         </div>
//     )
// }

// export default SearchBar
