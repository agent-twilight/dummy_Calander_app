"use client"
import React from 'react'
import MonthView from './month-view'
import WeekView from './week-view'
import DayView from './day-view'
import SideBar from './sidebar/SideBar'
import { useViewStore } from '@/lib/store'
import { useEventStore } from '@/lib/store'
import { useDateStore } from '@/lib/store'
import EventPopover from './event-popover'



export default function MainView() {

   const{selectedView} = useViewStore()

   const {
    isPopoverOpen,
    closePopover,
    isEventSummaryOpen,
    closeEventSummary,
    selectedEvent,
    setEvents,
  } = useEventStore();

  const { userSelectedDate } = useDateStore();

  return (
    <div className='flex'>
      <SideBar/>

        <div className='w-full flex-1'>
            {selectedView === "month" && <MonthView/>}
            {selectedView === "week" && <WeekView/>}
            {selectedView === "day" && <DayView/>}

        </div>

        {isPopoverOpen && (
        <EventPopover
          isOpen={isPopoverOpen}
          onClose={closePopover}
          date={userSelectedDate.format("YYYY-MM-DD")}
        />
      )}
      
    </div>
  )
}