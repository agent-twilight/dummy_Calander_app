import {create} from "zustand"
import { devtools, persist } from "zustand/middleware";
import dayjs from "dayjs";
import { getMonth } from "./getTime";
import { Dayjs } from "dayjs";

interface ViewStoreType {
    selectedView: string;
    setView: (value: string) => void;
  }

interface DateStoreType {
    userSelectedDate: Dayjs;
    setDate: (value: Dayjs) => void;
    twoDMonthArray: dayjs.Dayjs[][];
    selectedMonthIndex: number;
    setMonth: (index: number) => void;
  }
  

export const useViewStore = create<ViewStoreType>()(
    devtools(
      persist(
        (set) => ({
          selectedView: "month",
          setView: (value: string) => {
            set({ selectedView: value });
          },
        }),
        { name: "calendar_view", skipHydration: true },
      ),
    ),
  );


  export const useDateStore = create<DateStoreType>()(
    devtools(
      persist(
        (set) => ({
          userSelectedDate: dayjs(),
          twoDMonthArray: getMonth(),
          selectedMonthIndex: dayjs().month(),
          setDate: (value: Dayjs) => {
            set({ userSelectedDate: value });
          },
          setMonth: (index) => {
            set({ twoDMonthArray: getMonth(index), selectedMonthIndex: index });
          },
        }),
        { name: "date_data", skipHydration: true },
      ),
    ),
  );
  
