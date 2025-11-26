export default function TaskTimeline({activity=[]}){ return (
  <div className='mt-4'>
    <h4 className='font-semibold mb-2'>Activity</h4>
    <div className='space-y-2'>{activity.map((a,i)=>(<div key={i} className='p-2 bg-gray-50 rounded border'><div className='text-sm'>{a.action}</div><div className='text-xs text-gray-500'>{new Date(a.createdAt).toLocaleString()}</div></div>))}</div>
  </div>
)}