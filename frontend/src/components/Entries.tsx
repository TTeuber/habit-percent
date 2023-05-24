import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { EntryData } from "~/redux/entrySlice";
import type { UserData } from "~/redux/userSlice";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import { RootState } from "~/redux/store";
import { setEntries } from "~/redux/entrySlice";
import { setDate, updateDate } from "~/redux/dateSlice";
import { setUserData } from "~/redux/userSlice";

import testData from "../../public/entryTestData.json";
import entriesData from "../../public/entriesData.json";

type Entries = {
  id: string;
  date: string;
  activityId: string;
  userId: string;
  completed: boolean;
};

export default function Entries({
  setShowEntries,
}: {
  setShowEntries: (showEntries: boolean) => void;
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const entrySelector = useSelector((state: RootState) => state.entries);
  const userSelector = useSelector((state: RootState) => state.user);
  const dateSelector = useSelector((state: RootState) => state.date);

  const [utilityData, setUtilityData] = useState<
    { category: string; activities: { name: string }[] }[]
  >([]);

  useEffect(() => {
    if (router.isReady) {
      fetch(`/backend/entrydata/${router.query.username}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        });

      fetch(`/backend/entryutility/${router.query.username}`)
        .then((res) => res.json())
        .then((data) => {
          setUtilityData(data.data);
        });
    }
  }, [router.isReady]);

  useEffect(() => {
    if (router.isReady) {
      // fetch(`/backend/entrydata/${router.query.username}`)
      //   .then((res) => res.json())
      //   .then((data) => {
      //     dispatch(setEntries(data));
      //   });

      dispatch(setEntries(testData));
    }
  }, [router.isReady]);

  return (
    <div
      className={"fixed inset-0 bg-gray-700/50 backdrop-blur-sm"}
      onClick={(e) => {
        setShowEntries(false);
      }}
    >
      <div
        className={
          "absolute top-1/2 left-1/2 flex h-3/4 w-96 -translate-x-1/2 -translate-y-1/2 transform flex-col overflow-hidden bg-white"
        }
        onClick={(e) => e.stopPropagation()}
      >
        <div className={"flex flex-col items-center justify-between p-4"}>
          <div className={"mb-4 flex w-full"}>
            <p className={"grow text-2xl"}>Entries</p>
            <button
              className={"text-2xl"}
              onClick={() => {
                setShowEntries(false);
              }}
            >
              X
            </button>
          </div>
          <div className={"mb-4 flex gap-4"}>
            <ArrowLeftIcon
              className={"h-6 w-6 cursor-pointer"}
              onClick={() => {
                dispatch(updateDate(-1));
              }}
            />
            <div className={"h-10"}>
              <DatePicker
                selected={dateSelector}
                dateFormat={"eee, MMMM do, yyyy"}
                className={"text-center"}
                onChange={(i) => {
                  if (i) {
                    dispatch(setDate(i));
                  }
                }}
              />
            </div>
            <ArrowRightIcon
              className={"h-6 w-6 cursor-pointer"}
              onClick={() => {
                dispatch(updateDate(1));
              }}
            />
          </div>
        </div>
        <div className={"grow overflow-scroll bg-gray-700 pt-3"}>
          {utilityData.map((entry, i) => {
            return (
              <Category
                key={i}
                name={entry.category}
                activities={entry.activities}
              />
            );
          })}
        </div>
        <button
          className={"p-4"}
          onClick={() => {
            setShowEntries(false);
          }}
        >
          submit
        </button>
      </div>
    </div>
  );
}

function Category({ name, activities }: { name: string; activities: any[] }) {
  const [showActivities, setShowActivities] = useState(false);

  const dateSelector = useSelector((state: RootState) => state.date);

  return (
    <div className={"category"}>
      <p>{moment(dateSelector).format("YYYY-MM-DD")}</p>
      <div
        className={"flex cursor-pointer transition-all"}
        onClick={() => setShowActivities(!showActivities)}
      >
        <div
          className={`${
            showActivities ? "rotate-90" : ""
          } text-2xl transition-all duration-500`}
        >
          <ChevronRightIcon className={"mx-2 h-6 w-6"} />
        </div>
        <p>{name}</p>
      </div>
      <div>
        <div
          className={`flex ${
            showActivities ? `max-h-[500px]` : "max-h-0"
          } flex-col overflow-hidden transition-all duration-500`}
        >
          {activities.map((entry, i) => {
            return (
              <Entry
                key={i}
                name={entry.name}
                id={entry.id}
                completed={
                  entriesData.find((e) => {
                    return (
                      e.activityId === entry.id &&
                      e.date === moment(dateSelector).format("YYYY-MM-DD")
                    );
                  })?.completed ?? false
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Entry({
  name,
  id,
  completed,
}: {
  name: string;
  id: string;
  completed: boolean;
}) {
  const dateSelector = useSelector((state: RootState) => state.date);
  const inputRef = useRef<HTMLInputElement>(null);

  // set input checked when date changes
  useEffect(() => {
    if (inputRef.current !== null) {
      inputRef.current.checked =
        entriesData.find((e) => {
          return (
            e.activityId === id &&
            e.date === moment(dateSelector).format("YYYY-MM-DD")
          );
        })?.completed ?? false;
    }
  }, [dateSelector]);

  return (
    <div className={"relative flex items-center gap-2 px-2"}>
      <input
        type="checkbox"
        ref={inputRef}
        onClick={() => {
          // todo: update entriesData
        }}
        className={
          "mr-4 h-0 w-0 cursor-pointer appearance-none after:absolute after:top-1/2 after:left-2 after:block after:h-4 after:w-4 after:-translate-y-1/2 after:border after:bg-red-50 after:content-[''] checked:after:bg-blue-50"
        }
      />
      <p className={"border"}>{name}</p>
    </div>
  );
}
