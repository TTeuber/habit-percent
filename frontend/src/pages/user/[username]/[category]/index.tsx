import Graph from "~/components/Graph";
import { useRouter } from "next/router";
import { useEffect, useState, createContext } from "react";
import List from "~/components/List";

export type ActivityData = {
  name: string;
  target: number;
  value: number;
  id: number;
}[];

const dataContext = createContext<any>({});

export default function UserCategoryPage() {
  const router = useRouter();
  const [data, setData] = useState<ActivityData>([]);

  useEffect(() => {
    fetch(("/backend/activitydata/tyler/" + router.query.category) as string)
      .then((res) => res.json())
      .then((data) => {
        setData(data.data);
      });
  }, []);

  const [select, setSelect] = useState("");

  return (
    <>
      <h1>Category</h1>
      <dataContext.Provider value={{ select, setSelect }}>
        <Graph
          width={400}
          data={data}
          title={router.query.category as string}
          subtitle={"activities"}
          context={dataContext}
        />
        <List data={data} context={dataContext} />
      </dataContext.Provider>
      <button className={""}>Edit Activities</button>
    </>
  );
}
