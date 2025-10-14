import TitleCarousel from "@/components/ui/carousel/TitleCarousel";
import CategorySoportesProductCarousel from "../ui/carousel/CategorySoportesProductCarousel";



export default function CategoryProductSoportes() {
    return (
        <section className="my-14 mx-8 md:mx-14 lg:mx-15">
            <TitleCarousel title={'Destacados'} />
            <CategorySoportesProductCarousel categoryId={5} />
        </section>
    )
}
