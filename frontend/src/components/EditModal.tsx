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
  const [total, setTotal] = useState<number[]>([50]);
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
        <p>{total.reduce((acc, val) => acc + val, 0)}</p>
        <EditContext.Provider value={{ total, setTotal }}>
          {editData.map((d, i) => {
            return <EditItem d={d} i={i} key={i} context={EditContext} />;
          })}
        </EditContext.Provider>
        <button
          onClick={() => {
            if (!sessionStorage.getItem("new")) {
              sessionStorage.setItem("new", "0");
              setEditData([
                ...editData,
                { name: "new", target: 0, value: 0, id: 0 },
              ]);
            }
          }}
        >
          New
        </button>
        <button
          className={"m-4"}
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
        >
          Submit
        </button>
      </div>
    </div>
  );
}

function EditItem({
  d,
  i,
  context,
}: {
  d: { name: string; target: number };
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
            <p>{a.target}</p>
          </div>
        );
      })}
      <input
        ref={nameInput}
        type={"text"}
        className={"grow"}
        defaultValue={d.name}
      />
      <button
        onClick={() => {
          setCurrentValue(currentValue - 1);
          numberInput.current!.value = String(
            Number(numberInput.current!.value) - 1
          );
          sessionData.current.find(
            (a: { name: string; target: number }) => a.name === d.name
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
            (a: { name: string }) => a.name === d.name
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
