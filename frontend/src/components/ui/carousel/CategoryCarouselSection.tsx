import TitleCarousel from "@/components/ui/carousel/TitleCarousel";
import CategoryProductCarousel from "@/components/ui/carousel/CategoryProductCarousel";

type Props = {
    title: string;
    categoryId: number;
    sectionClassName?: string;
    carouselProps?: Partial<React.ComponentProps<typeof CategoryProductCarousel>>;
};

export default function CategoryCarouselSection({
    title,
    categoryId,
    sectionClassName = "my-14 mx-8 md:mx-14 lg:mx-15",
    carouselProps,
}: Props) {
    return (
        <section className={sectionClassName}>
            <TitleCarousel title={title} />
            <CategoryProductCarousel categoryId={categoryId} {...carouselProps} />
        </section>
    );
}
