"use client";
import { useRouter } from "next/router";
import { useEffect, createContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "~/redux/userSlice";
import { RootState } from "~/redux/store";
import Graph from "~/components/Graph";
import List from "~/components/List";
import EditModal from "~/components/EditModal";
import Entries from "~/components/Entries";

export type CategoryData = {
  name: string;
  target: number;
  value: number;
  id: string;
}[];

const dataContext = createContext<any>({});

export default function UserPage() {
  const router = useRouter();
  const username = router.query.username as string;
  const [data, setData] = useState<CategoryData>([]);

  const dispatch = useDispatch();
  const userStore = useSelector((state: RootState) => state.user);

  useEffect(() => {
    fetch("/backend/data/" + username)
      .then((res) => res.json())
      .then((data) => {
        setData(data.data);
        dispatch(setUserData(data.data));
      });
  }, []);

  const [select, setSelect] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [showEntries, setShowEntries] = useState(true);
  return (
    <div>
      <p className={"h-6"}>{select}</p>
      <dataContext.Provider value={{ select, setSelect }}>
        <Graph
          width={400}
          data={data}
          title={"Habits"}
          subtitle={"categories"}
          context={dataContext}
        />
        <List data={data} context={dataContext} type={"category"} />
      </dataContext.Provider>
      <button className={"border p-2"} onClick={() => setShowModal(true)}>
        Edit Categories
      </button>
      {showModal && (
        <EditModal
          data={data}
          setData={setData}
          endpoint={"/backend/data/" + username}
          setShowModal={setShowModal}
        />
      )}
      <button className={"border p-2"} onClick={() => setShowEntries(true)}>
        Entries
      </button>
      {showEntries && <Entries setShowEntries={setShowEntries} />}
    </div>
  );
}
