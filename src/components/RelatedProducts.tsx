import SkeletonCard from './Cards/SkeletonCard'

const RelatedProducts: React.FC = () => {
  return (
    <div className="border-muted border-1 rounded-lg p-4 basis-1/5">
      <h2 className="voice-lg font-bold">Related Products</h2>

      <ul className="mt-8 grid gap-4">
        {[1, 2, 3, 4, 5].map((num) => (
          <li key={num}>
            <SkeletonCard variant="slide" />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RelatedProducts
