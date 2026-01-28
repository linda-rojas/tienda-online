import OffersCarousel from '@/components/ui/carousel/offersCarousel'
import FooterServer from '@/components/footer/foooterServer'
import HeaderServer from '@/components/ui/mainNav/HeaderServer'
import CategoryCarouselSection from '@/components/ui/carousel/CategoryCarouselSection'

export default function Home() {
    const CATEGORY_SUSPENSION_ID = 2
    const CATEGORY_SOPORTES_ID = 5
    return (
        <>
            <HeaderServer />
            <OffersCarousel />
            <CategoryCarouselSection
                title="Nuestras Novedades"
                categoryId={CATEGORY_SUSPENSION_ID}
                sectionClassName="my-10 mx-8 md:mx-14 lg:mx-15"
                carouselProps={{ autoPlayIntervalMs: 5000, autoPlayDelayMs: 1000 }}
            />

            <CategoryCarouselSection
                title="Destacados"
                categoryId={CATEGORY_SOPORTES_ID}
                sectionClassName="my-14 mx-8 md:mx-14 lg:mx-15"
                carouselProps={{ autoPlayIntervalMs: 2000, autoPlayDelayMs: 1000 }}
            />
            <FooterServer />
        </>
    )
}
