import React from 'react'
import { getWeekDays } from '@/lib/getTime'
import { useDateStore } from '@/lib/store'

export default function WeekView() {

  const {userSelectedDate} = useDateStore()

  const Days = getWeekDays(userSelectedDate)

  console.log(Days)

  


  return (
    <div>
      
    </div>
  )
}

