import {
  ArrowLeft,
  ArrowRight,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Lock,
  Mail,
  ShoppingCart,
  ShoppingBag,
  MessagesSquare,
  SearchIcon,
  User,
  Wand,
  X,
  Type,
  Menu,
  Zap,
  Minus,
  Plus,
  Trash,
  ReceiptText,
  Ellipsis,
  ShoppingBagIcon,
  Star,
  XIcon,
  ClipboardPaste,
  Copy,
  UserPlus,
  TriangleAlert,
  KeyRound,
  LucideShieldCheck,
  Link,
  PhoneCall,
  Share,
  Landmark,
  Home,
  MessageCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

// custom icon components
const SatoshiIcon: React.ComponentType<any> = ({
  className,
  fill
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 10 17"
    fill={fill}
    className={cn(className)}
    strokeWidth={1}
    stroke="currentColor"
  >
    {/* Top vertical line */}
    <rect x="4.25" y="0" width="1.5" height="2.5" />
    {/* Top horizontal line */}
    <rect x="0" y="4.25" width="10" height="1.5" />
    {/* Middle horizontal line */}
    <rect x="0" y="7.25" width="10" height="1.5" />
    {/* Bottom horizontal line */}
    <rect x="0" y="10.25" width="10" height="1.5" />
    {/* Bottom vertical line */}
    <rect x="4.25" y="13.5" width="1.5" height="2.5" />
  </svg>
)

// Individual icon component interface
interface IconProps {
  className?: string
  fill?: string
}

// Create individual icon components
const createIconComponent = (IconComponent: React.ComponentType<any>) => {
  return ({ className, fill }: IconProps) => (
    <picture className={className}>
      <IconComponent className={fill} />
    </picture>
  )
}

// Icon object with all individual components
const Icon = {
  ArrowLeft: createIconComponent(ArrowLeft),
  ArrowRight: createIconComponent(ArrowRight),
  ChevronUp: createIconComponent(ChevronUp),
  ChevronDown: createIconComponent(ChevronDown),
  ChevronLeft: createIconComponent(ChevronLeft),
  ChevronRight: createIconComponent(ChevronRight),
  Heart: createIconComponent(Heart),
  Lock: createIconComponent(Lock),
  Mail: createIconComponent(Mail),
  ShoppingCart: createIconComponent(ShoppingCart),
  Messages: createIconComponent(MessagesSquare),
  Search: createIconComponent(SearchIcon),
  User: createIconComponent(User),
  Wand: createIconComponent(Wand),
  Menu: createIconComponent(Menu),
  X: createIconComponent(X),
  Zap: createIconComponent(Zap),
  Minus: createIconComponent(Minus),
  Plus: createIconComponent(Plus),
  Trash: createIconComponent(Trash),
  ReceiptText: createIconComponent(ReceiptText),
  Ellipsis: createIconComponent(Ellipsis),
  ShoppingBag: createIconComponent(ShoppingBagIcon),
  Star: createIconComponent(Star),
  XIcon: createIconComponent(XIcon),
  Paste: createIconComponent(ClipboardPaste),
  UserPlus: createIconComponent(UserPlus),
  Alert: createIconComponent(TriangleAlert),
  Copy: createIconComponent(Copy),
  Key: createIconComponent(KeyRound),
  ShieldCheck: createIconComponent(LucideShieldCheck),
  Type: createIconComponent(Type),
  Link: createIconComponent(Link),
  PhoneCall: createIconComponent(PhoneCall),
  Share: createIconComponent(Share),
  Landmark: createIconComponent(Landmark),
  Home: createIconComponent(Home),
  MessageCircle: createIconComponent(MessageCircle),
  Satoshi: createIconComponent(SatoshiIcon)
}

export default Icon
