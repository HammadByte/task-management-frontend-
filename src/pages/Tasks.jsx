import { useEffect, useState } from 'react'
import { getTasks, createTask, updateTask, deleteTask } from '../services/task'
import TaskCard from '../components/TaskCard'
export default function Tasks(){
  const [tasks,setTasks]=useState([])
  const [form,setForm]=useState({title:'',description:''})
  const [editId,setEditId]=useState(null)
  const load=async()=>{ try{ const d = await getTasks(); setTasks(d) }catch(e){} }
  useEffect(()=>{ load() },[])
  const submit = async e=>{ e.preventDefault(); try{ if(editId) await updateTask(editId,form); else await createTask(form); setForm({title:'',description:''}); setEditId(null); load() }catch(e){ alert('Error') } }
  const remove = async id=>{ if(confirm('Delete?')){ await deleteTask(id); load() }}
  const edit = t=>{ setForm({title:t.title, description:t.description}); setEditId(t._id) }
  return (
    <div>
      <h2 className='text-3xl font-bold mb-4'>Tasks</h2>
      <form onSubmit={submit} className='bg-white p-4 rounded shadow mb-4 w-full md:w-2/3'>
        <input className='w-full p-2 border mb-2' placeholder='Title' value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
        <textarea className='w-full p-2 border mb-2' placeholder='Description' value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
        <button className='px-4 py-2 bg-blue-600 text-white rounded'>{editId? 'Update':'Add Task'}</button>
      </form>
      <div className='grid gap-4'>
        {tasks.map(t=> <TaskCard key={t._id} task={t} onEdit={edit} onDelete={remove} />)}
      </div>
    </div>
  )
}