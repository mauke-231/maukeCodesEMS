import Footer from './pages/Footer'
import Header from './pages/Header'
import {Outlet} from "react-router-dom"

export default function Layout() {
  console.log("Layout is rendering");
  return (
    <div className='flex flex-col min-h-screen bg-white'>
      <Header />
      <main className="flex-grow p-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
