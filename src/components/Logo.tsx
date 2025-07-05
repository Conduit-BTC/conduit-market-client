import { cn } from '@/lib/utils'
import { Link } from 'wouter'

interface LogoProps {
  variant?: 'full' | 'bg' | 'icon' | 'word' | 'outline-glow'
  className?: string
}

const Logo: React.FC<LogoProps> = ({ variant = 'full', className }) => {
  let logoSrc = '/images/logo/'

  switch (variant) {
    case 'bg':
      logoSrc += 'logo-full-bg.svg'
      break
    case 'icon':
      logoSrc += 'logo-icon.svg'
      break
    case 'word':
      logoSrc += 'logo-word.svg'
      break
    case 'outline-glow':
      return (
        <picture className={cn(className)}>
          <LogoOutlineGlow />
        </picture>
      )
    default:
      logoSrc += 'logo-full.svg'
      break
  }

  return (
    <Link to="/">
      <picture className={cn(className)}>
        <img src={logoSrc} alt="Logo" />
      </picture>
    </Link>
  )
}

export default Logo

const LogoOutlineGlow = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1440"
      height="1024"
      viewBox="0 0 1440 1024"
      fill="none"
    >
      <g filter="url(#filter0_dddddd_841_61064)">
        <path
          d="M719.999 277.706C730.677 277.706 739.344 286.394 739.344 297.126V504.867C739.344 513.763 746.74 520.939 755.712 520.515C764.175 520.115 770.575 512.828 770.575 504.476V327.134C770.575 316.147 779.447 307.252 790.379 307.252C801.311 307.252 810.184 316.147 810.184 327.134V535.336C810.184 544.232 817.581 551.408 826.553 550.983C835.016 550.583 841.415 543.297 841.415 534.944V498.404C841.415 490.784 842.401 482.558 846.239 474.769C850.062 467.011 856.784 459.548 868.498 453.549C873.359 451.059 879.185 454.643 879.185 460.186V586.117C879.185 674.733 807.756 746.801 719.999 746.801C632.242 746.801 560.813 674.733 560.813 586.117V460.186C560.813 454.643 566.639 451.059 571.5 453.549C583.214 459.548 589.935 467.011 593.758 474.769C597.597 482.558 598.582 490.784 598.582 498.404V535.336C598.582 544.232 605.979 551.408 614.951 550.983C623.415 550.583 629.814 543.297 629.814 534.944V327.134C629.814 316.147 638.687 307.252 649.618 307.252C660.55 307.252 669.423 316.147 669.423 327.134V504.867C669.423 513.763 676.82 520.939 685.792 520.515C694.255 520.114 700.654 512.828 700.654 504.476V297.126C700.655 286.394 709.321 277.706 719.999 277.706ZM731.521 550.377C728.66 549.172 725.348 550.008 723.402 552.427L659.955 631.303C658.844 632.683 657.733 634.064 656.926 635.274C656.156 636.429 654.852 638.564 654.812 641.326C654.765 644.499 656.126 647.59 658.621 649.679C660.817 651.517 663.376 651.858 664.743 651.986C665.821 652.087 667.078 652.112 668.366 652.117L669.66 652.119H713.868L707.698 703.251C707.326 706.332 709.042 709.288 711.902 710.493C714.763 711.698 718.076 710.862 720.021 708.443L783.469 629.566L783.468 629.565C784.578 628.185 785.691 626.806 786.498 625.596C787.268 624.441 788.572 622.307 788.612 619.545C788.659 616.372 787.297 613.28 784.803 611.191C782.607 609.353 780.046 609.012 778.68 608.884C777.242 608.749 775.487 608.751 773.763 608.751H729.556L735.725 557.619C736.096 554.538 734.381 551.582 731.521 550.377Z"
          stroke="#BB00FF"
          strokeWidth="3.63163"
        />
      </g>
      <defs>
        <filter
          id="filter0_dddddd_841_61064"
          x="-397.862"
          y="-680.969"
          width="2235.72"
          height="2386.45"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="11.3912" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.733333 0 0 0 0 0 0 0 0 0 1 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_841_61064"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="22.7824" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.733333 0 0 0 0 0 0 0 0 0 1 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_dropShadow_841_61064"
            result="effect2_dropShadow_841_61064"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="79.7383" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.733333 0 0 0 0 0 0 0 0 0 1 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="effect2_dropShadow_841_61064"
            result="effect3_dropShadow_841_61064"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="159.477" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.733333 0 0 0 0 0 0 0 0 0 1 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="effect3_dropShadow_841_61064"
            result="effect4_dropShadow_841_61064"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="273.389" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.733333 0 0 0 0 0 0 0 0 0 1 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="effect4_dropShadow_841_61064"
            result="effect5_dropShadow_841_61064"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="478.43" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.733333 0 0 0 0 0 0 0 0 0 1 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="effect5_dropShadow_841_61064"
            result="effect6_dropShadow_841_61064"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect6_dropShadow_841_61064"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  )
}
