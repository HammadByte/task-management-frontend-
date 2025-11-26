import { useEffect, useState } from 'react'
import { getNotifications, markAllRead } from '../services/notification'
export default function Notifications(){
  const [noti,setNoti]=useState([])
  useEffect(()=>{ (async()=>{ const d = await getNotifications(); setNoti(d) })() },[])
  const mark=async()=>{ await markAllRead(); const d = await getNotifications(); setNoti(d) }
  return (
    <div>
      <h2 className='text-3xl font-bold mb-4'>Notifications</h2>
      <button onClick={mark} className='mb-4 px-3 py-1 bg-blue-600 text-white rounded'>Mark all read</button>
      <div className='space-y-3'>
        {noti.map(n=> (
          <div key={n._id} className={`p-3 rounded border ${n.read? 'bg-gray-50':'bg-blue-50'}`}>
            <div className='font-medium'>{n.title || n.message || 'Notification'}</div>
            <div className='text-sm text-gray-500'>{new Date(n.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  )
}