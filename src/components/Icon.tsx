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

const iconMap = {
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  chevronUp: ChevronUp,
  chevronDown: ChevronDown,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  heart: Heart,
  lock: Lock,
  mail: Mail,
  shoppingCart: ShoppingCart,
  messages: MessagesSquare,
  search: SearchIcon,
  user: User,
  wand: Wand,
  menu: Menu,
  x: X,
  zap: Zap,
  minus: Minus,
  plus: Plus,
  trash: Trash,
  receiptText: ReceiptText,
  ellipsis: Ellipsis,
  shoppingBag: ShoppingBagIcon,
  star: Star,
  xIcon: XIcon,
  paste: ClipboardPaste,
  userPlus: UserPlus,
  ShoppingBag: ShoppingBagIcon,
  alert: TriangleAlert,
  copy: Copy,
  key: KeyRound,
  shieldCheck: LucideShieldCheck,
  type: Type,
  link: Link,
  phoneCall: PhoneCall,
  share: Share,
  landmark: Landmark,
  home: Home
} as const

export type IconName = keyof typeof iconMap

interface IconProps {
  icon: IconName
  className?: string
  fill?: string
}

const Icon: React.FC<IconProps> = ({ icon, className, fill }) => {
  const IconComponent = iconMap[icon]

  if (!IconComponent) {
    console.warn(`Icon "${icon}" not found in iconMap`)
    return null
  }

  return (
    <picture className={className}>
      <IconComponent className={fill} />
    </picture>
  )
}

export default Icon
