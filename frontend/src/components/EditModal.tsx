import { CategoryData } from "~/pages/user/[username]";
import { ActivityData } from "~/pages/user/[username]/[category]";
import { z } from "zod";
import React, {
  useRef,
  useState,
  createContext,
  useContext,
  Context,
  useEffect,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/router";

const EditContext = createContext<any>({});

export default function EditModal({
  data,
  endpoint,
  setShowModal,
  setData,
}: {
  data: CategoryData | ActivityData;
  endpoint: string;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setData: React.Dispatch<React.SetStateAction<CategoryData | ActivityData>>;
}) {
  const [editData, setEditData] = useState<CategoryData | ActivityData>(data);
  const total = useRef(editData.reduce((acc, val) => acc + val.target, 0));

  const router = useRouter();

  useEffect(() => {
    data.forEach((d) => {
      sessionStorage.setItem(d.name, d.target.toString());
    });
  }, []);

  useEffect(() => {
    sessionStorage.setItem("editData", JSON.stringify(editData));
  }, []);

  const editValidation = z
    .array(
      z.object({
        name: z.string(),
        target: z
          .number()
          .min(0.01, { message: "All categories must be at least 1%" }),
        value: z.number(),
      })
    )
    .refine((arr) => {
      return arr.reduce((acc, val) => acc + val.target, 0) === 1;
    }, "Total must be 100%")
    .refine((arr) => {
      const names = arr.map((d) => d.name);
      return names.length === new Set(names).size;
    }, "Each name must be unique");

  return (
    <div
      className={"fixed inset-0 bg-gray-700/50 backdrop-blur-sm"}
      onClick={() => setShowModal(false)}
    >
      <div
        className={"relative top-1/4 m-auto w-1/2 rounded-md bg-white p-4"}
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className={"text-2xl"}>Edit Categories</h1>
        <p>{editData.reduce((acc, val) => acc + val.target, 0)}</p>
        <EditContext.Provider value={{ total, setEditData }}>
          {editData.map((d, i) => {
            return (
              <EditItem
                d={d}
                i={i}
                key={i}
                context={EditContext}
                endpoint={endpoint}
              />
            );
          })}
        </EditContext.Provider>
        <button
          onClick={() => {
            const data = JSON.parse(sessionStorage.getItem("editData")!);
            const newData = {
              name: "New",
              target: 1 - editData.reduce((acc, val) => acc + val.target, 0),
              value: 0,
              id: uuidv4(),
            };
            data.push(newData);
            sessionStorage.setItem("editData", JSON.stringify(data));
            setEditData((prev) => [...prev, newData]);
            fetch(endpoint, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: newData.name,
                target: newData.target,
                value: newData.value,
                id: newData.id,
              }),
            })
              .then(() => {
                alert("Success!");
              })
              .catch((e) => {
                alert("Error: " + e);
              });
          }}
        >
          New
        </button>
        <button
          className={"m-4"}
          onClick={() => {
            const data = JSON.parse(sessionStorage.getItem("editData")!);
            try {
              // editValidation.parse(
              //   JSON.parse(sessionStorage.getItem("editData")!)
              // );
              fetch(endpoint, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  data,
                }),
              })
                .then(() => {
                  alert("Success!");
                })
                .catch((e) => {
                  alert("Error: " + e);
                });
              setData(JSON.parse(sessionStorage.getItem("editData")!));
              setShowModal(false);
              router.reload();
            } catch (e) {
              if (e instanceof z.ZodError) {
                e.issues.forEach((issue) => {
                  alert(issue.message);
                });
              }
            }
          }}
        >
          Submit
        </button>
        <p>{total.current === 1 ? "true" : "false"}</p>
      </div>
    </div>
  );
}

function EditItem({
  d,
  i,
  context,
  endpoint,
}: {
  d: { name: string; target: number; id: string };
  i: number;
  context: Context<any>;
  endpoint: string;
}) {
  const [currentValue, setCurrentValue] = useState<number>(d.target * 100);
  const numberInput = useRef<HTMLInputElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);
  const { total, setEditData } = useContext(context);

  const sessionData = useRef(JSON.parse(sessionStorage.getItem("editData")!));

  useEffect(() => {
    sessionData.current = JSON.parse(sessionStorage.getItem("editData")!);
  }, []);

  return (
    <div key={i} className={"flex gap-4"}>
      <button
        onClick={() => {
          const confirm = window.confirm("Are you sure you want to delete?");
          if (!confirm) return;
          const data = JSON.parse(sessionStorage.getItem("editData")!);
          data.splice(i, 1);
          sessionStorage.setItem("editData", JSON.stringify(data));
          setEditData((prev: { id: string }[]) =>
            prev.filter((a) => a.id !== d.id)
          );
          fetch(endpoint, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: d.id,
            }),
          })
            .then(() => {
              alert("Success!");
            })
            .catch((e) => {
              alert("Error: " + e);
            });
        }}
      >
        X
      </button>
      <input
        ref={nameInput}
        type={"text"}
        className={"grow"}
        defaultValue={d.name}
        onChange={() => {
          sessionData.current.find((a: { id: string }) => a.id === d.id).name =
            nameInput.current!.value;
          if (nameInput.current!.value.length > 0) {
            const data = JSON.parse(sessionStorage.getItem("editData")!);
            data.find((a: { id: string }) => a.id === d.id).name =
              nameInput.current!.value;
            sessionStorage.setItem("editData", JSON.stringify(data));
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            nameInput.current!.blur();
          }
        }}
      />
      <button
        onClick={() => {
          setCurrentValue(currentValue - 1);
          numberInput.current!.value = String(
            Number(numberInput.current!.value) - 1
          );
          sessionData.current.find(
            (a: { id: string }) => a.id === d.id
          ).target -= 0.01;
          const data = JSON.parse(sessionStorage.getItem("editData")!);
          data.find((a: { id: string }) => a.id === d.id).target -= 0.01;
          sessionStorage.setItem("editData", JSON.stringify(data));
        }}
      >
        -
      </button>
      <input
        type="text"
        ref={numberInput}
        defaultValue={currentValue}
        className={"w-6"}
        onBlur={() => {
          if (numberInput.current!.value.length === 0) {
            numberInput.current!.value = String(currentValue);
          }
          const value = Number(numberInput.current?.value);
          setCurrentValue(value);
          sessionData.current.find(
            (a: { id: string }) => a.id === d.id
          ).target = value / 100;
          const data = JSON.parse(sessionStorage.getItem("editData")!);
          data.find((a: { id: string }) => a.id === d.id).target = value / 100;
          sessionStorage.setItem("editData", JSON.stringify(data));
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            numberInput.current!.blur();
          }
        }}
      />
      <p>%</p>
      <button
        onClick={() => {
          setCurrentValue(currentValue + 1);
          numberInput.current!.value = String(
            Number(numberInput.current!.value) + 1
          );
          sessionData.current.find(
            (a: { id: string }) => a.id === d.id
          ).target += 0.01;
          const data = JSON.parse(sessionStorage.getItem("editData")!);
          data.find((a: { id: string }) => a.id === d.id).target += 0.01;
          sessionStorage.setItem("editData", JSON.stringify(data));
        }}
      >
        +
      </button>
    </div>
  );
}
