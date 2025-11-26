import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'
export default function Layout(){ return (
  <div className="min-h-screen flex">
    <Sidebar />
    <div className="flex-1 flex flex-col">
      <Navbar />
      <main className="p-6"><Outlet/></main>
    </div>
  </div>
)}