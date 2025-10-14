import OffersCarousel from '@/components/ui/carousel/offersCarousel'
import FooterServer from '@/components/footer/foooterServer'
import HeaderServer from '@/components/ui/mainNav/HeaderServer'
import CategoryProductSoportes from '@/components/carousel/CategoryProductSoportes'
import CategoryProductSuspension from '@/components/carousel/CategoryProductSuspension'

export default function Home() {
    return (
        <>
            <HeaderServer />
            <OffersCarousel />
            <CategoryProductSoportes />
            <CategoryProductSuspension />
            <FooterServer />
        </>
    )
}
