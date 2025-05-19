import bannerImage from '@/assets/images/banner.png'
import PageSection from '@/layouts/PageSection'
interface BannerProps {
  imageSrc?: string
}

const Banner: React.FC<BannerProps> = ({ imageSrc }) => {
  // resolve image src
  const image = bannerImage

  return (
    <PageSection width="wide">
      <picture className="banner rounded-lg aspect-[7/1]">
        <img
          src={image}
          alt="Banner"
          className="object-cover h-full w-full object-[50%_25%]"
        />
      </picture>
    </PageSection>
  )
}

export default Banner
