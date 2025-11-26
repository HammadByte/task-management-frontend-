import { useEffect, useState } from 'react'
import { getProfile, updateProfile } from '../services/auth'
export default function Profile(){
  const [user,setUser]=useState({name:'',email:''})
  useEffect(()=>{ (async()=>{ const d = await getProfile(); setUser(d) })() },[])
  const save=async()=>{ await updateProfile({name:user.name}) ; alert('Saved') }
  return (
    <div>
      <h2 className='text-3xl font-bold mb-4'>Profile</h2>
      <div className='bg-white p-4 rounded shadow w-96'>
        <label className='block text-sm'>Name</label>
        <input className='w-full p-2 border mb-3' value={user.name} onChange={e=>setUser({...user,name:e.target.value})} />
        <label className='block text-sm'>Email</label>
        <input className='w-full p-2 border mb-3' value={user.email} readOnly />
        <button onClick={save} className='px-3 py-1 bg-blue-600 text-white rounded'>Save</button>
      </div>
    </div>
  )
}