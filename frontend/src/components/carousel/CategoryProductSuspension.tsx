import TitleCarousel from "@/components/ui/carousel/TitleCarousel";
import CategorySuspensionProductCarousel from "../ui/carousel/CategorySuspensionProductCarousel";


export default function CategoryProductSuspension() {
    return (
        <section className="my-10 mx-8 md:mx-14 lg:mx-15">
            <TitleCarousel title={'Nuestras Novedades'} />
            <CategorySuspensionProductCarousel categoryId={3} />
        </section>
    )
}
