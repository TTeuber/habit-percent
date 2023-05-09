"use client";
import { useRouter } from "next/router";
import { useEffect, createContext, useState } from "react";
import Graph from "~/components/Graph";
import List from "~/components/List";
import EditModal from "~/components/EditModal";

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

  useEffect(() => {
    fetch("/backend/data/" + username)
      .then((res) => res.json())
      .then((data) => {
        setData(data.data);
      });
  }, []);

  const [select, setSelect] = useState("");

  const [showModal, setShowModal] = useState(true);

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
        <List data={data} context={dataContext} />
      </dataContext.Provider>
      <button className={"border p-2"} onClick={() => setShowModal(true)}>
        Edit Categories
      </button>
      {showModal && (
        <EditModal data={data} type={"category"} setShowModal={setShowModal} />
      )}
    </div>
  );
}
