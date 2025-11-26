import { useEffect, useState } from 'react'
import { getNotifications } from '../services/notification'
import { FiBell } from 'react-icons/fi'
export default function NotificationBell(){
  const [count,setCount]=useState(0)
  useEffect(()=>{ (async ()=>{ try{ const d = await getNotifications(); setCount(d.filter(n=>!n.read).length) }catch(e){} })() },[])
  return <div className='relative'><FiBell size={20}/>{count>0 && <span className='absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 rounded-full'>{count}</span>}</div>
}