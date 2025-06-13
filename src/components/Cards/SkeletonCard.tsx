import { Card } from '@/components/Cards/CardComponents'
import Skeleton from '@/components/Skeleton'

interface SkeletonCardProps {
  variant?: 'card' | 'list' | 'slide'
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ variant = 'card' }) => {
  switch (variant) {
    case 'slide':
      return (
        <Card className="w-full overflow-hidden relative grid gap-2 border-none">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
          </div>
        </Card>
      )
    case 'list':
      return (
        <Card className="w-full overflow-hidden relative grid gap-2 border-none">
          <Skeleton className="h-50" />
        </Card>
      )
    default:
      return (
        <Card className="w-full overflow-hidden relative grid gap-2 border-none">
          <Skeleton className="h-50" />
        </Card>
      )
  }
}

export default SkeletonCard
