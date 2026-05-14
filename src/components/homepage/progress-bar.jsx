import React from 'react'

export default function ProgressBar({total, done, loading}) {

    const percent = total > 0 ? Math.round((done / total) * 100) : 0

  return (

    <div className="bg-white border border-gray-200 rounded-2xl p-6">

      <div className="flex items-center justify-between mb-3">
        
        <p className="text-sm font-medium text-gray-800">
            Today's progress
        </p>

        <span className="text-xs text-gray-400">
            {done} of {total} tasks complete
        </span>

      </div>

      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">

        <div
          className="h-full bg-emerald-500 rounded-full transition-all duration-700"
          style={{ width: `${percent}%` }}
        />

      </div>

      <p className="text-xs text-gray-400 mt-2">
        {loading
          ? 'Loading your tasks...'
          : total === 0
          ? 'No tasks added yet — head to Add Task to get started.'
          : percent === 100
          ? 'Great work!'
          : `${percent}% there — keep going!`}
      </p>
      
    </div>
  )
}
