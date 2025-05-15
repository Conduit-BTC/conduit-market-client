import { Card } from '@/components/Cards/CardComponents'
import Skeleton from '@/components/Skeleton'

const SkeletonCard = () => {
  return (
    <Card className="w-full max-w-sm overflow-hidden relative grid gap-2 border-none">
      <Skeleton className="w-full h-50" />
      <Skeleton className="w-full h-6" />
      <Skeleton className="w-[80%] h-6" />
    </Card>
  )
}

export default SkeletonCard
