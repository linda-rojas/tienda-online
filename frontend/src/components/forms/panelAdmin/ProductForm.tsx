'use client'
import { CategoriesResponseSchemas, Category, Product } from "@/schemas/schemas"
import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { deleteProductImage } from "@/components/actions/product-images-action"
import { DraftImage } from "../../ui/products/image/DraftImagesPicker"
import { ImageManager } from "@/components/ImageManager/ImageManager."
import { uploadImage } from "@/components/actions/upload-images-action"
import SaveButton from "./CRUD/EditProductForm"
import ImageTypeSelect from "../../ui/products/image/ImageTypeSelect.tsx"
import { toast } from "react-toastify"
import ConfirmAceptDialog from "@/components/ui/dialog/ConfirmAceptDialog"

type ImageType = 'primary' | 'secondary' | 'gallery'

type ProductImage = {
    id: number
    url: string
    type: ImageType,
    file?: File
}

const isImageNew = (img: ProductImage) => !!img.file
const isImageOld = (img: ProductImage) => !img.file

export default function ProductForm({
    product,
}: {
    product?: Product
    draftImages?: DraftImage<ImageType>[]
    onDraftImagesChange?: (imgs: DraftImage<ImageType>[]) => void
    disableInternalUploadButton?: boolean
    onImagesRefreshReady?: (fn: () => Promise<void>) => void
}) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [values, setValues] = useState({
        nombre: product?.nombre ?? '',
        subtitulo: product?.subtitulo ?? '',
        descripcion: product?.descripcion ?? '',
        precio: product?.precio ?? 0,
        descuento: product?.descuento ?? 0,
        stock: product?.stock ?? 0,
        categoriaId: product?.categoriaId ?? '',
    });
    const [images, setImages] = useState<ProductImage[]>(product?.imagenes ?? []);
    const [confirmOpen, setConfirmOpen] = useState(false);  // Estado para controlar si el modal está abierto
    const [loadingSave, setLoadingSave] = useState(false);  // Estado para manejar el estado de carga (loading)

    const blockPrimary = false;
    const blockSecondary = false;

    const router = useRouter();

    const fetchCategories = useCallback(
        async () => {
            const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/categorias`;
            const res = await fetch(url);
            const json = await res.json();
            const categories = CategoriesResponseSchemas.parse(json);
            setCategories(categories);
        },
        [setCategories]
    );

    // Cargar categorías al montar el componente
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Función para refrescar las imágenes
    const handleRefreshImages = useCallback(
        async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload-images/${product?.id}`);
            const imagesData = await response.json();
            setImages(imagesData); // Actualizar el estado con las imágenes del backend
        },
        [product?.id, setImages]
    );

    const removeImage = useCallback(
        async (index: number) => {
            const imageToRemove = images[index];

            if (isImageNew(imageToRemove)) {
                URL.revokeObjectURL(imageToRemove.url); // Libera la URL temporal
            }

            if (isImageOld(imageToRemove)) {
                await deleteProductImage(product?.id ?? 0, imageToRemove.id);
            }

            const updatedImages = images.filter((_, imageIndex) => imageIndex !== index);
            setImages(updatedImages);
        },
        [images, setImages]
    );

    const saveImages = useCallback(
        async (productId = product?.id) => {
            if (!productId) {
                return;
            }

            const imagesToSave = images
                .filter(isImageNew)
                .map(img => ({ file: img.file!, type: img.type }));

            if (imagesToSave.length === 0) {
                return;
            }

            await uploadImage(productId, imagesToSave);
            handleRefreshImages();
        },
        [handleRefreshImages, images, product],
    );

    const addImages = useCallback(
        (newImages: Omit<ProductImage, 'type'>[]) => {
            const imagesToSave: ProductImage[] = newImages.map(img => ({
                id: img.id,
                url: img.url,
                type: 'gallery',
                file: img.file
            }));

            setImages((images) => ([
                ...images,
                ...imagesToSave,
            ]));
        },
        [setImages]
    );

    const createFetchOptions = useCallback(
        () => ({
            method: 'POST',
            url: '/productos'
        }),
        []
    );
    const updateFetchOptions = useCallback(
        () => ({
            method: 'PATCH',
            url: `/productos/${product?.id}`
        }),
        [product]
    );

    const saveProduct = useCallback(
        async (productData: typeof values & { images: ProductImage[] }) => {
            const fetchOptions = product?.id
                ? updateFetchOptions()
                : createFetchOptions();

            const url = process.env.NEXT_PUBLIC_BACKEND_URL + fetchOptions.url;

            const res = await fetch(url, {
                method: fetchOptions.method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });

            if (!res.ok) {
                throw new Error('Error al guardar el producto');
            }

            return await res.json() as Product;
        },
        [product?.id, updateFetchOptions, createFetchOptions]
    );

    // Validación de imágenes antes de guardar el producto
    const validateImages = () => {
        if (images.length === 0) {
            return true;
        }

        const primaries = images.filter(i => i.type === 'primary').length;
        const secondaries = images.filter(i => i.type === 'secondary').length;
        const galleries = images.filter(i => i.type === 'gallery').length;

        if (primaries === 0) {
            toast.error("Debe haber al menos 1 imagen principal.");
            return false;
        }

        if (primaries > 1) {
            toast.error("Solo puede haber 1 imagen principal.");
            return false;
        }

        if (images.length > 1 && secondaries === 0) {
            toast.error("Debe haber al menos 1 imagen secundaria.");
            return false;
        }

        if (secondaries > 1) {
            toast.error("Solo puede haber 1 imagen secundaria.");
            return false;
        }

        if (images.length > 2) {
            const expectedGalleries = images.length - 2;

            if (galleries !== expectedGalleries) {
                toast.error("Las imágenes adicionales deben ser de tipo 'gallery'.");
                return false;
            }
        }

        return true;
    };

    const updateExistingImageTypes = useCallback(
        async (productId: number) => {
            const originalImages = product?.imagenes ?? [];

            const changedImages = images
                .filter(isImageOld)
                .map((currentImage) => {
                    const originalImage = originalImages.find(
                        (img) => img.id === currentImage.id
                    );

                    if (!originalImage) return null;
                    if (originalImage.type === currentImage.type) return null;

                    return {
                        id: currentImage.id,
                        from: originalImage.type,
                        to: currentImage.type,
                    };
                })
                .filter(Boolean) as { id: number; from: ImageType; to: ImageType }[];

            if (changedImages.length === 0) {
                return;
            }

            const demotions = changedImages.filter((img) => img.to === 'gallery');
            const promotions = changedImages.filter((img) => img.to !== 'gallery');

            const orderedChanges = [...demotions, ...promotions];

            for (const image of orderedChanges) {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload-images/${productId}/${image.id}/type`,
                    {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ type: image.to }),
                    }
                );

                if (!res.ok) {
                    throw new Error(`Error al actualizar el tipo de la imagen ${image.id}`);
                }
            }

            await handleRefreshImages();
        },
        [images, product?.imagenes, handleRefreshImages]
    );

    // const handleSave = useCallback(async () => {
    //     if (!validateImages()) {
    //         return; // Si las imágenes no son válidas, no guardamos el producto
    //     }

    //     const productData = {
    //         ...values,
    //         images,
    //     };

    //     productData.categoriaId = +(productData.categoriaId)

    //     const fetchOptions = product?.id
    //         ? updateFetchOptions()
    //         : createFetchOptions();

    //     console.log("Guardando producto:", productData);

    //     try {
    //         const url = process.env.NEXT_PUBLIC_BACKEND_URL + fetchOptions.url;
    //         const res = await fetch(url, {
    //             method: fetchOptions.method,
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(productData),
    //         });

    //         if (!res.ok) {
    //             throw new Error('Error al guardar el producto');
    //         }

    //         const responseData: Product = await res.json();
    //         console.log('Producto guardado exitosamente:', responseData);

    //         await saveImages(responseData.id);

    //         alert('Producto guardado con éxito!');
    //         router.push('/admin/sales/products');
    //     } catch (error) {
    //         console.error('Error al guardar el producto:', error);
    //         alert('Hubo un error al guardar el producto.');
    //     }
    // }, [values, images, product?.id, saveImages, router]);

    const handleOpenConfirm = useCallback(() => {
        if (!validateImages()) {
            return;
        }

        setConfirmOpen(true);  // Abre el diálogo de confirmación
    }, [images]);  // Dependencia para que se reevalúe cuando las imágenes cambien

    const handleSave = useCallback(async () => {
        if (loadingSave) {
            return;  // Evita que se pueda hacer otro clic mientras se guarda
        }

        if (!validateImages()) {
            return;
        }

        const productData = {
            ...values,
            images,
        };

        productData.categoriaId = +(productData.categoriaId);

        try {
            setLoadingSave(true);

            const responseData = await saveProduct(productData);

            await updateExistingImageTypes(responseData.id);
            await saveImages(responseData.id);

            setConfirmOpen(false);  // Cierra el modal después de guardar
            router.push('/admin/sales/products');
        } catch (error) {
            alert('Hubo un error al guardar el producto.');
            setConfirmOpen(false);  // También cierra el modal si ocurre un error
        } finally {
            setLoadingSave(false);  // Desactiva el loading
        }
    }, [values, images, saveProduct, updateExistingImageTypes, saveImages, router, loadingSave]);

    const handleTypeChange = (index: number, newType: ImageType) => {
        const updatedImages = images.map((img, i) => {
            if (i === index) {
                return { ...img, type: newType };
            }
            return img;
        });
        setImages(updatedImages);
        console.log('Updated images after type change:', updatedImages);
    };

    return (
        <>
            <div className="space-y-2 ">
                <label
                    htmlFor="nombre"
                    className="block font-bold text-gray-600"
                >Nombre</label>
                <input
                    id="nombre"
                    type="text"
                    placeholder="Nombre Producto"
                    className="border border-gray-300 w-full p-2"
                    name="nombre"
                    value={values.nombre}
                    onChange={(e) => setValues(v => ({ ...v, nombre: e.target.value }))}
                />
            </div>

            <div className="space-y-2 ">
                <label
                    htmlFor="subtitulo"
                    className="block font-bold text-gray-600"
                >Subtitulo</label>
                <input
                    id="subtitulo"
                    type="text"
                    placeholder="Subtitulo Producto"
                    className="border border-gray-300 w-full p-2"
                    name="subtitulo"
                    value={values.subtitulo} onChange={(e) => setValues(v => ({ ...v, subtitulo: e.target.value }))}
                />
            </div>

            <div className="space-y-2 ">
                <label
                    htmlFor="descripcion"
                    className="block font-bold text-gray-600"
                >Descripcion</label>
                <textarea
                    id="descripcion"
                    placeholder="Descripcion Producto"
                    className="border border-gray-300 w-full p-2 resize-none min-h-[10rem]"
                    name="descripcion"
                    value={values.descripcion} onChange={(e) => setValues(v => ({ ...v, descripcion: e.target.value }))}
                />
            </div>

            <div className="space-y-2 ">
                <label
                    htmlFor="precio"
                    className="block font-bold text-gray-600"
                >Precio</label>
                <input
                    id="precio"
                    type="number"
                    placeholder="Precio Producto"
                    className="border border-gray-300 w-full p-2"
                    name="precio"
                    min={0}
                    value={values.precio} onChange={(e) => setValues(v => ({ ...v, precio: Number(e.target.value) }))}
                />
            </div>

            <div className="space-y-2 ">
                <label
                    htmlFor="descuento"
                    className="block font-bold text-gray-600"
                >Descuento</label>
                <input
                    id="descuento"
                    type="number"
                    placeholder="Descuento Producto"
                    className="border border-gray-300 w-full p-2"
                    name="descuento"
                    min={0}
                    value={values.descuento} onChange={(e) => setValues(v => ({ ...v, descuento: Number(e.target.value) }))}
                />
            </div>

            <div className="space-y-2 ">
                <label
                    htmlFor="stock"
                    className="block font-bold text-gray-600"
                >Inventario</label>
                <input
                    id="stock"
                    type="number"
                    placeholder="Cantidad Disponible"
                    className="border border-gray-300 w-full p-2"
                    name="stock"
                    min={0}
                    value={values.stock} onChange={(e) => setValues(v => ({ ...v, stock: Number(e.target.value) }))}
                />
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="categoryId"
                    className="block font-bold text-gray-600"
                >Categoría</label>
                <select
                    id="categoryId"
                    className="border border-gray-300 w-full p-2 bg-white"
                    name="categoryId"
                    value={values.categoriaId} onChange={(e) => setValues(v => ({ ...v, categoriaId: e.target.value }))}
                >
                    <option value=''>Seleccionar Categoría</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.nombre}</option>
                    ))}
                </select>
            </div>

            <ImageManager<ProductImage>
                images={images}
                handleUpload={saveImages}
                uploading={false}
                removeImage={removeImage}
                addImages={addImages}
                // select de las imagenes
                renderCard={(image: ProductImage) => {
                    const index = images.indexOf(image);
                    return (
                        <ImageTypeSelect
                            value={image.type}
                            onChange={(newType) => handleTypeChange(index, newType)}
                            blockPrimary={blockPrimary}
                            blockSecondary={blockSecondary}
                        />
                    );
                }}
            />
            {/* Botón de guardar */}
            <SaveButton onSave={handleOpenConfirm} />

            <ConfirmAceptDialog
                open={confirmOpen}  // Controla si el modal está abierto o cerrado
                title={product?.id ? 'Confirmar actualización' : 'Confirmar creación'}
                message={
                    product?.id
                        ? 'Se guardarán los cambios realizados en este producto.'
                        : 'Se guardará este nuevo producto.'
                }
                confirmText={product?.id ? 'Guardar cambios' : 'Guardar producto'}
                loading={loadingSave}  // Muestra el estado de carga
                onConfirm={handleSave}  // Llama a handleSave cuando se confirma
            />
        </>
    )
}