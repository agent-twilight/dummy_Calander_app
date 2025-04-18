import React from 'react'
import MonthView from './month-view'
import WeekView from './week-view'
import DayView from './day-view'
import SideBar from './sidebar/SideBar'



export default function MainView() {
  return (
    <div className='flex'>
      <SideBar/>

        <div className='w-full flex-1'>
            <MonthView/>

        </div>
      
    </div>
  )
}


