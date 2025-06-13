import type { PropsWithChildren } from 'react'
import Footer from '@/components/Footer'
import Header from '@/components/Header'

const MainLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}

export default MainLayout
