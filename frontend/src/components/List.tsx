import { CategoryData } from "~/pages/user/[username]";
import { ActivityData } from "~/pages/user/[username]/[category]";
import { Context, useContext } from "react";
import { useRouter } from "next/router";

export default function List({
  data,
  context,
  type,
}: {
  data: CategoryData | ActivityData;
  context: Context<any>;
  type: "category" | "activity";
}) {
  const { select, setSelect } = useContext(context);
  const router = useRouter();

  const color = (s: number) => {
    return `hsl(${((s * 35) % 110) + 180},40%,50%)`;
  };

  return (
    <div className={"inline-block border-2 border-red-50 p-4"}>
      {data.map((d, i) => {
        return (
          <div
            key={i}
            data-selected={select === d.name}
            // prettier-ignore
            className={`flex cursor-pointer gap-4 border-2 p-2 dark:data-[selected=true]:bg-gray-700`}
            style={{
              borderColor: select === d.name ? color(i) : "transparent",
            }}
            onMouseEnter={() => setSelect(d.name)}
            onMouseLeave={() => setSelect("")}
            onClick={() => {
              if (type === "category") {
                router
                  .push("/user/" + router.query.username + "/" + d.name)
                  .catch((e) => console.log(e));
              }
            }}
          >
            <h2>{d.name}</h2>
            <p>
              {Math.round(d.value * 100)}%/{d.target * 100}%
            </p>
          </div>
        );
      })}
    </div>
  );
}
