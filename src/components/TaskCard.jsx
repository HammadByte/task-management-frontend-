export default function TaskCard({task, onEdit, onDelete}){ return (
  <div className='p-4 bg-white rounded shadow'>
    <h3 className='font-bold'>{task.title}</h3>
    <p className='text-gray-600'>{task.description}</p>
    <div className='mt-3 flex gap-2'>
      <button onClick={()=>onEdit(task)} className='px-3 py-1 bg-yellow-500 text-white rounded'>Edit</button>
      <button onClick={()=>onDelete(task._id)} className='px-3 py-1 bg-red-500 text-white rounded'>Delete</button>
    </div>
  </div>
)}