import Graph from "~/components/Graph";
import { useRouter } from "next/router";
import { useEffect, useState, createContext } from "react";
import List from "~/components/List";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import Link from "next/link";

export type ActivityData = {
  name: string;
  target: number;
  value: number;
  id: string;
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
      <Link href={`/user/${router.query.username}`}>back</Link>
      <dataContext.Provider value={{ select, setSelect }}>
        <ErrorBoundary errorComponent={() => <h1>error</h1>}>
          <Graph
            width={400}
            data={data}
            title={router.query.category as string}
            subtitle={"activities"}
            context={dataContext}
          />
          <List data={data} context={dataContext} />
        </ErrorBoundary>
      </dataContext.Provider>
      <button className={""}>Edit Activities</button>
    </>
  );
}
