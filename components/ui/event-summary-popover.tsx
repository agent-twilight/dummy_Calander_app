'use client'

import React, { useRef, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { Button } from "@/components/ui/button"
import { IoCloseSharp } from "react-icons/io5"
import { CalendarEventType } from '@/lib/store'
import { deleteEvent, editEvent } from "@/app/actions/event-actions"

interface EventSummaryPopoverProps {
  isOpen: boolean
  onClose: () => void
  event: CalendarEventType
}

export function EventSummaryPopover({ isOpen, onClose, event }: EventSummaryPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Edit form state
  const [title, setTitle] = useState(event.title)
  const [description, setDescription] = useState(event.description)
  const [date, setDate] = useState(dayjs(event.date).format("YYYY-MM-DD"))
  const [time, setTime] = useState(dayjs(event.date).format("HH:mm"))

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const deleteEv = async () => {
    await deleteEvent(event.id)
    onClose()
  }

  const submitEdit = async () => {
    const updatedDate = `${date}T${time}`

    const res = await editEvent(event.id, {
      title,
      description,
      date: updatedDate,
    })

    if (res.success) {
      setIsEditing(false)
      onClose()
    } else {
      alert(res.error)
    }
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        ref={popoverRef}
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {isEditing ? "Edit Event" : "Event Summary"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <IoCloseSharp className="h-4 w-4" />
          </Button>
        </div>

        {!isEditing ? (
          <div className="space-y-2 mb-4">
            <p><strong>Title:</strong> {event.title}</p>
            <p><strong>Date:</strong> {dayjs(event.date).format("dddd, MMMM D, YYYY h:mm A")}</p>
            <p><strong>Description:</strong> {event.description}</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              submitEdit()
            }}
            className="space-y-3 mb-4"
          >
            <div>
              <label className="block text-sm font-medium">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => {
                    setDate(date); 
                    setTime(e.target.value)}}
                  className="border rounded px-2 py-1"
                />
              </div>
            </div>
          </form>
        )}

        <div className="flex justify-end gap-2">
          {!isEditing ? (
            <>
              <Button variant="destructive" onClick={deleteEv}>Delete</Button>
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={submitEdit}>Save</Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
