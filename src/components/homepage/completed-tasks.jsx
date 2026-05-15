import { ClipboardCheck } from 'lucide-react'

export default function CompletedTasks({ tasks, loading, onToggle }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 lg:p-6 w-full overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5">

        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shrink-0" />

          <p className="text-sm sm:text-base font-medium text-gray-800 truncate">
            Completed tasks
          </p>
        </div>

        <span className="text-xs text-gray-400 bg-gray-100 px-2.5 sm:px-3 py-1 rounded-full shrink-0">
          {tasks.length}
        </span>
      </div>

      {/* Loading */}
      {loading ? (
        <p className="text-sm text-gray-300 text-center py-10">
          Loading...
        </p>

      ) : tasks.length === 0 ? (

        /* Empty state */
        <div className="text-center py-10 px-2">
          <ClipboardCheck
            size={36}
            className="mx-auto text-gray-200 mb-3"
          />

          <p className="text-sm font-medium text-gray-300">
            Nothing completed yet
          </p>

          <p className="text-xs text-gray-300 mt-1 leading-relaxed">
            Completed tasks will show up here
          </p>
        </div>

      ) : (

        /* Task list */
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="
                flex items-start justify-between gap-3
                p-3 sm:p-4
                rounded-xl border border-gray-100
                hover:border-gray-200 transition
              "
            >

              {/* Left side */}
              <div className="flex items-start gap-3 flex-1 min-w-0">

                <input
                  type="checkbox"
                  checked={true}
                  onChange={() => onToggle(task)}
                  className="
                    mt-0.5 accent-emerald-500
                    cursor-pointer shrink-0
                    w-4 h-4
                  "
                />

                <div className="min-w-0 flex-1">

                  <p
                    className="
                      text-sm sm:text-[15px]
                      font-medium text-gray-400
                      line-through
                      break-words
                    "
                  >
                    {task.name}
                  </p>

                  <p
                    className="
                      text-xs text-gray-300
                      mt-1
                      break-words
                    "
                  >
                    {task.category}
                  </p>
                </div>
              </div>

              {/* Right icon */}
              <ClipboardCheck
                size={16}
                className="text-emerald-400 shrink-0 mt-0.5"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}