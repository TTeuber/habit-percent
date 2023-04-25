import Graph from "~/components/Graph";
import { useRouter } from "next/router";
import { CategoryData } from "~/components/Graph";
import { useEffect, useState } from "react";

export default function UserCategoryPage() {
  const router = useRouter();
  const [data, setData] = useState<CategoryData>([]);

  useEffect(() => {
    fetch("/backend/activitydata/tyler/social")
      .then((res) => res.json())
      .then((data) => {
        setData(data.data);
      });
  }, []);

  return (
    <>
      <h1>Category</h1>
      <Graph
        width={400}
        data={data}
        title={router.query.category as string}
        subtitle={"activities"}
      />
    </>
  );
}
