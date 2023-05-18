import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { EntryData } from "~/redux/entrySlice";
import { CategoryData } from "~/pages/user/[username]";
import { ActivityData } from "~/pages/user/[username]/[category]";
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

export default function Entries({
  setShowEntries,
}: {
  setShowEntries: (showEntries: boolean) => void;
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const entryStore = useSelector((state: RootState) => state.entries);

  const [date, setDate] = useState<Date>(moment().toDate());

  useEffect(() => {
    if (router.isReady) {
      fetch(`/backend/entrydata/${router.query.username}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        });
    }
  }, [router.isReady]);

  const entryData = useRef<EntryData[]>([
    {
      id: "1",
      date: moment("2023-05-18").toDate(),
      data: [
        {
          category: "a",
          activities: [
            { name: "a", completed: true },
            { name: "b", completed: true },
          ],
        },
        {
          category: "b",
          activities: [
            { name: "a", completed: true },
            { name: "b", completed: true },
          ],
        },
        {
          category: "c",
          activities: [
            { name: "a", completed: true },
            { name: "b", completed: true },
          ],
        },
      ],
    },
    {
      id: "2",
      date: moment("2023-05-16").toDate(),
      data: [
        {
          category: "a",
          activities: [
            { name: "a", completed: true },
            { name: "b", completed: false },
          ],
        },
        {
          category: "b",
          activities: [
            { name: "a", completed: true },
            { name: "b", completed: false },
          ],
        },
        {
          category: "c",
          activities: [
            { name: "a", completed: true },
            { name: "b", completed: false },
          ],
        },
      ],
    },
    {
      id: "3",
      date: moment("2023-05-17").toDate(),
      data: [
        {
          category: "a",
          activities: [
            { name: "a", completed: false },
            { name: "b", completed: false },
          ],
        },
        {
          category: "b",
          activities: [
            { name: "a", completed: false },
            { name: "b", completed: false },
          ],
        },
        {
          category: "c",
          activities: [
            { name: "a", completed: false },
            { name: "b", completed: false },
          ],
        },
      ],
    },
  ]);

  useEffect(() => {
    if (router.isReady) {
      // fetch(`/backend/entrydata/${router.query.username}`)
      //   .then((res) => res.json())
      //   .then((data) => {
      //     dispatch(setEntries(data));
      //   });

      dispatch(setEntries(entryData.current));
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
                setDate(moment(date).subtract(1, "day").toDate());
              }}
            />
            <div className={"h-10"}>
              <DatePicker
                selected={date}
                dateFormat={"eee, MMMM do, yyyy"}
                className={"text-center"}
                onChange={(i) => {
                  if (i) {
                    setDate(i);
                  }
                }}
              />
            </div>
            <ArrowRightIcon
              className={"h-6 w-6 cursor-pointer"}
              onClick={() => {
                setDate(moment(date).add(1, "day").toDate());
              }}
            />
          </div>
        </div>
        <div className={"grow overflow-scroll bg-gray-700 pt-3"}>
          {entryStore.find(
            (entry) => entry.date.toDateString() === date.toDateString()
          )?.data &&
            entryData.current
              .find(
                (entry) => entry.date.toDateString() === date.toDateString()
              )!
              .data.map((entry, i) => {
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
  const [num] = useState(activities.length as number);
  return (
    <div className={"category"}>
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
      {/*<Entry />*/}
      <div className={``}>
        <div
          className={`flex ${
            showActivities ? `max-h-[500px]` : "max-h-0"
          } flex-col overflow-hidden transition-all duration-500`}
        >
          {activities.map((activity, i) => {
            return (
              <Entry
                key={i}
                name={activity.name}
                completed={activity.completed}
              />
            ); // TODO: pass in activity data, activity id as key
          })}
        </div>
      </div>
    </div>
  );
}

function Entry({ name, completed }: { name: string; completed: boolean }) {
  return (
    <div className={"relative flex items-center gap-2 px-2"}>
      <input
        type="checkbox"
        checked={completed}
        className={
          "mr-4 h-0 w-0 cursor-pointer appearance-none after:absolute after:top-1/2 after:left-2 after:block after:h-4 after:w-4 after:-translate-y-1/2 after:border after:bg-red-50 after:content-[''] checked:after:bg-blue-50"
        }
      />
      <p className={"border"}>{name}</p>
      {/*<p>{moment().format("YYYY-MM-DD")}</p>*/}
    </div>
  );
}
