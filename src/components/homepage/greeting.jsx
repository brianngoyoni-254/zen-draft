import React, { useEffect, useState } from 'react'

function getGreeting() {
    const h = new Date().getHours()
    if (h < 12) return 'Good Morning'
    if (h < 17) return 'Good Afternoon'
    return 'Good Evening'
}

function getDateString() {
    return new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    })
}

function getTimeString() {
    return new Date().toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit',
    })
}

export default function Greeting() {
    //STATES
    const[time, setTime] = useState(getTimeString())

    useEffect(() => {
        const interval = setInterval(() => setTime(getTimeString()), 30000)
        return () => clearInterval(interval)
    }, [])

  return (
    <div className="w-full bg-white border-b border-gray-200 px-6 py-6 flex items-center justify-between">
      <div>

        <h2 className="text-4xl font-light text-gray-900 mb-1">
          {getGreeting()}, <span className="italic text-emerald-600">Student</span>
        </h2>

        <p className="text-sm text-gray-400">{getDateString()}</p>
        
      </div>
      <span className="text-sm text-gray-400">{time}</span>
    </div>
  )
}
