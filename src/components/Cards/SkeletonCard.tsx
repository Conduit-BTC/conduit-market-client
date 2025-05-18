import { Card } from '@/components/Cards/CardComponents'
import Skeleton from '@/components/Skeleton'

const SkeletonCard = () => {
  return (
    <Card className="w-full overflow-hidden relative grid gap-2 border-none">
      <Skeleton className="h-50" />
      <Skeleton className="h-6" />
      <Skeleton className="max-w-[80%] h-6" />
    </Card>
  )
}

export default SkeletonCard
