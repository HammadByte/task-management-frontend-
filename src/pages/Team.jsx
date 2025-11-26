import { useEffect, useState } from 'react'
import { getTeam } from '../services/user'
export default function Team(){
  const [team,setTeam]=useState([])
  useEffect(()=>{ (async()=>{ const d = await getTeam(); setTeam(d) })() },[])
  return (
    <div>
      <h2 className='text-3xl font-bold mb-4'>Team</h2>
      <div className='grid md:grid-cols-3 gap-4'>
        {team.map(u=> (
          <div key={u._id} className='p-4 bg-white rounded shadow'>
            <div className='font-semibold'>{u.name}</div>
            <div className='text-sm text-gray-500'>{u.email}</div>
            <div className='text-xs text-gray-400 mt-2'>Role: {u.isAdmin? 'Admin':'User'}</div>
          </div>
        ))}
      </div>
    </div>
  )
}