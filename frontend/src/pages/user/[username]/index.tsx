"use client";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Graph, { Data } from "~/components/Graph";

export default function UserPage() {
  const router = useRouter();
  const username = router.query.username as string;

  let update = 0;

  const getData = api.data.get.useMutation();

  let test;
  useEffect(() => {
    getData.mutate(username);
  }, [username]);

  const [messages, setMessages] = useState<string[]>([]);

  const [ids, setIds] = useState<number[]>([]);

  useLayoutEffect(() => {
    setMessages(getData.data?.messages ?? []);
    setIds(getData.data?.ids ?? []);
  }, []);

  const postData = api.data.post.useMutation();
  const deleteData = api.data.delete.useMutation();
  const patchData = api.data.patch.useMutation();

  useEffect(() => {
    if (getData.error) {
      router.push("/error").then((r) => console.log(r));
    }
  }, [getData.data?.messages]);

  let messageInput = useRef<HTMLInputElement>(null);

  const data: Data = [
    { name: "a", target: 0.25, value: 0.2 },
    { name: "b", target: 0.25, value: 0.3 },
    { name: "c", target: 0.25, value: 0.3 },
    { name: "d", target: 0.25, value: 0.1 },
  ];

  return (
    <div>
      <Graph width={400} data={data} />
      <h1>{username}</h1>
      {getData.data?.messages.map((message, i) => {
        return (
          <div key={getData.data?.ids[i]} className={"flex gap-2"}>
            <p>{getData.data?.ids[i]}</p>
            <p>{message}</p>
            <button
              onClick={async () => {
                deleteData.mutateAsync(ids[i] ?? 0).then(() => {
                  getData.mutateAsync(username);
                });
              }}
            >
              X
            </button>
            <button
              onClick={async () => {
                let update = prompt("Update message", message);
                if (update !== null) {
                  patchData
                    .mutateAsync({
                      id: getData.data?.ids[i] ?? 0,
                      message: update,
                    })
                    .then(() => {
                      getData.mutateAsync(username);
                    });
                }
              }}
            >
              U
            </button>
          </div>
        );
      })}
      <form action="http://localhost:5000/logout" method={"post"}>
        <button type={"submit"}>Log Out</button>
      </form>
      {/*post*/}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (messageInput.current?.value) {
            postData.mutateAsync(messageInput.current?.value).then(() => {
              getData.mutateAsync(username).then(() => {
                messageInput.current!.value = "";
              });
            });
          }
        }}
      >
        <input
          ref={messageInput}
          name={"message"}
          type={"text"}
          className={"bg-gray-400"}
        />
        <button type={"submit"} className={"mx-2"}>
          Submit
        </button>
      </form>
    </div>
  );
}
