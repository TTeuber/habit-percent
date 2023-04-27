import { CategoryData } from "~/pages/user/[username]";
import { ActivityData } from "~/pages/user/[username]/[category]";
import {
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
}: {
  data: CategoryData | ActivityData;
  type: "category" | "activity";
}) {
  const [total, setTotal] = useState<number[]>([50]);

  useEffect(() => {
    data.forEach((d) => {
      sessionStorage.setItem(d.name, d.target.toString());
    });
  }, []);

  return (
    <div className={"fixed inset-0 bg-gray-700/50 backdrop-blur-sm"}>
      <div className={"relative top-1/4 m-auto w-1/2 rounded-md bg-white p-4"}>
        <h1 className={"text-2xl"}>Edit Categories</h1>
        {/*sum of total*/}
        <p>{total.reduce((acc, val) => acc + val, 0)}</p>
        <EditContext.Provider value={{ total, setTotal }}>
          {data.map((d, i) => {
            return <EditItem d={d} i={i} key={i} context={EditContext} />;
          })}
        </EditContext.Provider>
        <form
          action={"/backend/edit"}
          method={"post"}
          className={"flex gap-4 [&>input]:bg-gray-300"}
        >
          <input type={"text"} name={"name"} />
          <input
            type={"number"}
            name={"target"}
            className={
              "[&::-webkit-inner-spin-button]:[-webkit-appearance:none] [&::-webkit-outer-spin-button]:[-webkit-appearance:none] [&]:[margin:0] [&]:[appearance:textfield]"
            }
          />
          <input type={"number"} name={"value"} />
          <button type={"submit"}>Submit</button>
        </form>
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
  const input = useRef<HTMLInputElement>(null);
  const { total, setTotal } = useContext(context);

  useEffect(() => {
    const copy = total.slice();
    copy[i] = currentValue;
    setTotal(copy);
  }, [currentValue]);

  return (
    <div key={i} className={"flex gap-4"}>
      <p className={"grow"}>{d.name}</p>
      <p>{currentValue}</p>
      <button
        onClick={() => {
          setCurrentValue(currentValue - 1);
          input.current!.value = String(Number(input.current!.value) - 1);
        }}
      >
        -
      </button>
      <input
        type="text"
        ref={input}
        defaultValue={currentValue}
        className={"w-6"}
        onBlur={() => {
          const value = Number(input.current?.value);
          setCurrentValue(value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            input.current!.blur();
          }
        }}
      />
      <p>%</p>
      <button
        onClick={() => {
          setCurrentValue(currentValue + 1);
          input.current!.value = String(Number(input.current!.value) + 1);
        }}
      >
        +
      </button>
    </div>
  );
}
