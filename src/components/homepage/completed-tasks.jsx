import { ClipboardCheck } from 'lucide-react'

export default function CompletedTasks({ tasks, loading, onToggle }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">

        <div className="flex items-center justify-between mb-5">
            
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                <p className="text-sm font-medium text-gray-800">
                    Completed tasks
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
                <ClipboardCheck size={36} className="mx-auto text-gray-200 mb-3" />
                <p className="text-sm font-medium text-gray-300">
                    Nothing completed yet
                </p>
                <p className="text-xs text-gray-300 mt-1">
                    Completed tasks will show up here
                </p>
            </div>

            ) : (
                <ul className="space-y-3">
                    {tasks.map(task => (
                    <li
                        key={task.id}
                        className="flex items-start justify-between gap-3 p-3 rounded-xl border border-gray-100"
                    >
                
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                            <input
                                type="checkbox"
                                checked={true}
                                onChange={() => onToggle(task)}
                                className="mt-0.5 accent-emerald-500 cursor-pointer shrink-0"
                            />
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-400 line-through truncate">{task.name}</p>
                                <p className="text-xs text-gray-300 mt-0.5">{task.category}</p>
                            </div>
                        </div>
                    <ClipboardCheck size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                </li>
            ))}
        </ul>
        )}
    </div>
  )
}