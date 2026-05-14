import { ClipboardList } from 'lucide-react'

const PRIORITY_STYLES = {
  high: 'bg-red-50 text-red-600 border border-red-200',
  medium: 'bg-yellow-50 text-yellow-600 border border-yellow-200',
  low: 'bg-green-50 text-green-600 border border-green-200',
}

export default function PendingTasks({ tasks, loading, onToggle }) {
  return (
    
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      
      <div className="flex items-center justify-between mb-5">
        
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
            
            <p className="text-sm font-medium text-gray-800">
                Today's pending tasks
            </p>
        </div>

        <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
          {tasks.length}
        </span>

      </div>

      {loading ? (
        <p className="text-sm text-gray-300 text-center py-10">
            Loading...
        </p>
        
        ) : tasks.length === 0 ? (

            <div className="text-center py-10">
                <ClipboardList size={36} className="mx-auto text-gray-200 mb-3" />
                <p className="text-sm font-medium text-gray-300">No pending tasks</p>
                <p className="text-xs text-gray-300 mt-1">
                    Tasks you add will appear here, sorted by priority
                </p>
            </div>

        ) : (
            <ul className="space-y-3">
                {tasks.map(task => (
                <li
                    key={task.id}
                    className="flex items-start justify-between gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition"
                    >
                
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                        <input
                            type="checkbox"
                            checked={false}
                            onChange={() => onToggle(task)}
                            className="mt-0.5 accent-emerald-500 cursor-pointer shrink-0"
                        />
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{task.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{task.category}</p>
                        </div>
                    </div>
                    
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize shrink-0 ${PRIORITY_STYLES[task.priority]}`}>
                        {task.priority}
                    </span>
                </li>
            ))}
        </ul>
      )}
    </div>
  )
}