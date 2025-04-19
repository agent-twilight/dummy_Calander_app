'use server'

import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { eventsTable } from "@/db/schema";
import { revalidatePath } from "next/cache";


export async function createEvent(formData:  FormData): Promise<{ error: string } | { success: boolean } > {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const date = formData.get('date') as string;
  const time = formData.get('time') as string;


  if (!title || !description || !date || !time) {
    return { error: 'All fields are required' };
  }

  const dateTime = new Date(`${date}T${time}:00`);

  try {
    await db.insert(eventsTable).values({
        title,
        description,
        date: dateTime,
      });
      // Revalidate the path and return a success response
    revalidatePath("/");
    return { success: true };  // Return success instead of revalidatePath directly
    
  } catch (error) {
    console.error('Error creating event:', error);
    return { error: 'Failed to create event' };
  }
}

export async function getEvents() {
  try {
    const events = await db.select().from(eventsTable); // or asc(eventsTable.date)
    return events;
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return [];
  }
};

export async function deleteEvent(id: string) {
  try {
    await db.delete(eventsTable).where(eq(eventsTable.id, Number(id)));
    revalidatePath("/"); // refresh page cache if needed
    return { success: true };
  } catch (error) {
    console.error("Failed to delete event:", error);
    return { error: "Failed to delete event" };
  }
}

export async function editEvent(id: string, updatedData: {
  title?: string;
  description?: string;
  date?: string; // ISO format: "2025-04-20T18:30"
}) {
  try {
    const values: any = {};

    if (updatedData.title) values.title = updatedData.title;
    if (updatedData.description) values.description = updatedData.description;
    if (updatedData.date) values.date = new Date(updatedData.date);

    if (Object.keys(values).length === 0) {
      return { error: "No data to update" };
    }

    await db.update(eventsTable)
      .set(values)
      .where(eq(eventsTable.id, Number(id)));

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Failed to edit event:", error);
    return { error: "Failed to edit event" };
  }
}

