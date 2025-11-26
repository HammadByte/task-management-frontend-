import useAuth from '../hooks/useAuth'
import api from '../api/axios'
export default function Navbar(){
  const {user,setUser} = useAuth()
  const logout = async ()=>{ try{ await api.post('/user/logout') }catch(e){} localStorage.removeItem('token'); setUser(null) }
  return (
    <header className="bg-white border-b p-4 flex justify-between items-center">
      <div className="text-lg font-semibold">Task Manager</div>
      <div className="flex items-center gap-4">
        {user && <div className="text-sm">{user.name}</div>}
        {user && <button onClick={logout} className="px-3 py-1 bg-red-500 text-white rounded">Logout</button>}
      </div>
    </header>
  )
}