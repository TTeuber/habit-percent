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

const EditContext = createContext<any>({});

export default function EditModal({
  data,
  type,
  setShowModal,
}: {
  data: CategoryData | ActivityData;
  type: "category" | "activity";
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [total, setTotal] = useState<number[]>([0]);
  const [editData, setEditData] = useState<CategoryData | ActivityData>(data);

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
        target: z.number(),
        value: z.number(),
      })
    )
    .refine((arr) => {
      return arr.reduce((acc, val) => acc + val.target, 0) === 1;
    });

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
        {/*<p>{total.reduce((acc, val) => acc + val, 0)}</p>*/}
        <EditContext.Provider value={{ total, setTotal }}>
          {editData.map((d, i) => {
            return <EditItem d={d} i={i} key={i} context={EditContext} />;
          })}
        </EditContext.Provider>
        <button
          onClick={() => {
            const data = JSON.parse(sessionStorage.getItem("editData")!);
            const newData = {
              name: "New",
              target: 0,
              value: 0,
              id: uuidv4(),
            };
            data.push(newData);
            sessionStorage.setItem("editData", JSON.stringify(data));
            setEditData((prev) => [...prev, newData]);
          }}
        >
          New
        </button>
        <button
          className={"m-4 data-[enabled=false]:text-gray-500"}
          onClick={() => {
            try {
              editValidation.parse(editData);
              alert("success");
            } catch (e) {
              if (e instanceof z.ZodError) {
                alert(e.issues);
              }
            }
          }}
          data-enabled={total.reduce((i, a) => i + a, 0) === 100}
          disabled={total.reduce((i, a) => i + a, 0) !== 100}
        >
          Submit
        </button>
        <p>{total.reduce((i, a) => i + a, 0) === 100 ? "true" : "false"}</p>
      </div>
    </div>
  );
}

function EditItem({
  d,
  i,
  context,
}: {
  d: { name: string; target: number; id: string };
  i: number;
  context: Context<any>;
}) {
  const [currentValue, setCurrentValue] = useState<number>(d.target * 100);
  const numberInput = useRef<HTMLInputElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);
  const { total, setTotal } = useContext(context);

  useEffect(() => {
    const copy = total.slice();
    copy[i] = currentValue;
    setTotal(copy);
  }, [currentValue]);

  const sessionData = useRef(JSON.parse(sessionStorage.getItem("editData")!));

  return (
    <div key={i} className={"flex gap-4"}>
      {sessionData.current.map((a: { name: string; target: number }) => {
        return (
          <div>
            <p>{a.name}</p>
            <p>{a.target.toFixed(2)}</p>
          </div>
        );
      })}
      <input
        ref={nameInput}
        type={"text"}
        className={"grow"}
        defaultValue={d.name}
        onChange={() => {
          sessionData.current.find((a: { id: string }) => a.id === d.id).name =
            nameInput.current!.value;
          if (nameInput.current!.value.length > 0) {
            sessionStorage.setItem(
              "editData",
              JSON.stringify(sessionData.current)
            );
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
          sessionStorage.setItem(
            "editData",
            JSON.stringify(sessionData.current)
          );
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
          const value = Number(numberInput.current?.value);
          setCurrentValue(value);
          sessionData.current.find(
            (a: { id: string }) => a.id === d.id
          ).target = value / 100;
          sessionStorage.setItem(
            "editData",
            JSON.stringify(sessionData.current)
          );
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
          sessionStorage.setItem(
            "editData",
            JSON.stringify(sessionData.current)
          );
        }}
      >
        +
      </button>
    </div>
  );
}
