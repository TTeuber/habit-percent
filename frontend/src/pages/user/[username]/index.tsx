"use client";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useEffect, useRef, useState } from "react";
import Graph, { Data } from "~/components/Graph";

export default function UserPage() {
  const router = useRouter();
  const username = router.query.username as string;
  const [data, setData] = useState<Data>([]);

  useEffect(() => {
    fetch("/backend/data/" + username)
      .then((res) => res.json())
      .then((data) => {
        setData(data.data);
      });
  }, []);

  return (
    <div>
      <Graph width={400} data={data} />
      <form action={"/backend/logout"} method={"post"}>
        <button type={"submit"}>Log Out</button>
      </form>
    </div>
  );
}
