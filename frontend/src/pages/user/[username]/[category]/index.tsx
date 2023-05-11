import Graph from "~/components/Graph";
import { useRouter } from "next/router";
import { useEffect, useState, createContext } from "react";
import List from "~/components/List";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import Link from "next/link";
import EditModal from "~/components/EditModal";

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

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      fetch(
        `/backend/activitydata/${router.query.username}/${router.query.category}`
      )
        .then((res) => res.json())
        .then((data) => {
          setData(data.data);
        });
    }
  }, [router.isReady]);

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
          <List data={data} context={dataContext} type={"activity"} />
        </ErrorBoundary>
      </dataContext.Provider>
      <button className={"border p-2"} onClick={() => setShowModal(true)}>
        Edit Activities
      </button>
      {showModal && (
        <EditModal
          data={data}
          setShowModal={setShowModal}
          endpoint={`/backend/activitydata/${router.query.username}/${router.query.category}`}
          setData={setData}
        />
      )}
    </>
  );
}
