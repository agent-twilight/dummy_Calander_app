"use client";
import {
  CalendarEventType,
  useDateStore,
  useEventStore,
  useViewStore,
} from "@/lib/store";
import MonthView from "./month-view";
import WeekView from "./week-view";
import DayView from "./day-view";
import EventPopover from "./event-popover";
import { EventSummaryPopover } from "./event-summary-popover";
import { useEffect } from "react";
import { getEvents } from "@/app/actions/event-actions"
import dayjs from "dayjs";

export default function MainView({
  eventsData,
}: {
  eventsData: CalendarEventType[];
}) {
  const { selectedView } = useViewStore();

  const {
    isPopoverOpen,
    closePopover,
    isEventSummaryOpen,
    closeEventSummary,
    selectedEvent,
    setEvents,
  } = useEventStore();


  useEffect(() => {
    const getAndSetEvents = async () => {
      const ev = await getEvents();
      const formattedEvents: CalendarEventType[] = ev.map(event => ({
        id: event.id.toString(), // convert number to string
        title: event.title,
        description: event.description,
        date: dayjs(event.date), // convert JS Date to Dayjs
      }));
      console.log(ev);
      setEvents(formattedEvents);
    };
  
    getAndSetEvents();
  }, [isPopoverOpen, isEventSummaryOpen])

  

  const { userSelectedDate } = useDateStore();

  return (
    <div className="flex">
 

      <div className="w-full flex-1">
        {selectedView === "month" && <MonthView />}
        {selectedView === "week" && <WeekView />}
        {selectedView === "day" && <DayView />}
      </div>
      {isPopoverOpen && (
        <EventPopover
          isOpen={isPopoverOpen}
          onClose={closePopover}
          date={userSelectedDate.format("YYYY-MM-DD")}
        />
      )}

      {isEventSummaryOpen && selectedEvent && (
        <EventSummaryPopover
          isOpen={isEventSummaryOpen}
          onClose={closeEventSummary}
          event={selectedEvent}
        />
      )}
    </div>
  );
}
