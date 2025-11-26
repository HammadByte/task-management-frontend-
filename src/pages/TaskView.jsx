import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getTaskById, updateTaskStage, updateSubTaskStage, createSubTask } from '../services/task'
import TaskTimeline from '../components/TaskTimeline'
export default function TaskView(){
  const { id } = useParams()
  const [task,setTask]=useState(null)
  const [subTitle,setSubTitle]=useState('')
  const load=async()=>{ const d = await getTaskById(id); setTask(d) }
  useEffect(()=>{ load() },[])
  if(!task) return <div>Loading...</div>
  const addSub = async ()=>{ await createSubTask(id,{title: subTitle}); setSubTitle(''); load() }
  const changeStage = async s=>{ await updateTaskStage(id,{stage:s}); load() }
  const changeSub = async (subId,status)=>{ await updateSubTaskStage(id,subId,{status}); load() }
  return (
    <div>
      <h2 className='text-3xl font-bold mb-4'>{task.title}</h2>
      <p className='mb-4'>{task.description}</p>
      <div className='mb-4'>
        <label className='mr-2'>Stage:</label>
        <select value={task.stage} onChange={e=>changeStage(e.target.value)} className='border p-1'>
          <option value='backlog'>backlog</option>
          <option value='in-progress'>in-progress</option>
          <option value='completed'>completed</option>
        </select>
      </div>
      <div className='mb-4'>
        <h4 className='font-semibold mb-2'>Subtasks</h4>
        {task.subtasks?.map(s=> (
          <div key={s._id} className='p-2 bg-gray-50 rounded mb-2 flex justify-between'>
            <div>{s.title}</div>
            <select value={s.status} onChange={e=>changeSub(s._id,e.target.value)} className='border p-1'>
              <option value='pending'>pending</option>
              <option value='in-progress'>in-progress</option>
              <option value='completed'>completed</option>
            </select>
          </div>
        ))}
        <div className='flex gap-2 mt-2'>
          <input value={subTitle} onChange={e=>setSubTitle(e.target.value)} className='border p-2 flex-1' placeholder='Subtask title' />
          <button onClick={addSub} className='px-3 py-1 bg-blue-600 text-white rounded'>Add</button>
        </div>
      </div>
      <TaskTimeline activity={task.activity || []} />
    </div>
  )
}