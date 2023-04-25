import { useRouter } from "next/router";

export type CategoryData = {
  name: string;
  target: number;
  value: number;
  id: number;
}[];

type SliceCoords = {
  point1: { x: number; y: number };
  outerRadius: number;
  point2: { x: number; y: number };
  point3: { x: number; y: number };
  innerRadius: number;
  point4: { x: number; y: number };
};

export default function Graph({
  width,
  data,
  title,
  subtitle,
}: {
  width: number;
  data: CategoryData;
  title: string;
  subtitle: string;
}) {
  const router = useRouter();

  const height = width;
  const baseLength = width / 4;

  function getStartAngle(data: CategoryData, index: number) {
    if (index === 0) return -Math.PI / 2;

    return (
      // prettier-ignore
      data.slice(0, index).reduce((acc, cur) => acc + cur.target, 0) * 2 * Math.PI - Math.PI / 2
    );
  }

  function getEndAngle(data: CategoryData, index: number) {
    // prettier-ignore
    return (data[index]!.target + data.slice(0, index).reduce((acc, cur) => acc + cur.target, 0)) * 2 * Math.PI - Math.PI / 2;
  }

  function createSlice(data: CategoryData, index: number) {
    const targetLength = data[index]!.target * 100;
    const actualPercent = data[index]!.value / data[index]!.target;

    const point1 = {
      x:
        (baseLength + actualPercent * targetLength) *
        Math.cos(getStartAngle(data, index)),
      y:
        (baseLength + actualPercent * targetLength) *
        Math.sin(getStartAngle(data, index)),
    };

    const outerRadius = baseLength + actualPercent * targetLength;

    const point2 = {
      x:
        (baseLength + actualPercent * targetLength) *
        Math.cos(getEndAngle(data, index)),
      y:
        (baseLength + actualPercent * targetLength) *
        Math.sin(getEndAngle(data, index)),
    };

    const point3 = {
      x: baseLength * Math.cos(getEndAngle(data, index)),
      y: baseLength * Math.sin(getEndAngle(data, index)),
    };

    const innerRadius = baseLength;

    const point4 = {
      x: baseLength * Math.cos(getStartAngle(data, index)),
      y: baseLength * Math.sin(getStartAngle(data, index)),
    };

    return {
      point1,
      point2,
      point3,
      point4,
      innerRadius,
      outerRadius,
    } as SliceCoords;
  }

  const slices = data.map((_, i) => createSlice(data, i));

  return (
    <div
      className={"relative border"}
      style={{ width: width + "px", height: height + "px" }}
    >
      <p className={"absolute left-1/2 -translate-x-1/2 text-4xl"}>{title}</p>
      {/*prettier-ignore*/}
      <div className={"absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"}>
        <p id="category" className={`text-center text-[150%] max-w-1/2 truncate`}>{subtitle}</p>
        <p id={"percent"} className={"text-center"}></p>
      </div>
      <svg width={width} height={height}>
        <g
          transform={`translate(${width / 2}, ${height / 2})`}
          className={"group"}
        >
          {/*<circle r={width / 3} fill={"hsla(0,0%,50%,50%)"} />*/}
          {slices.map((slice, i) => {
            const { point1, outerRadius, point2, point3, innerRadius, point4 } =
              slice;
            return (
              // prettier-ignore
              <path
                    key={i}
                    d={`M ${point1.x} ${point1.y} A ${outerRadius} ${outerRadius} 0 ${data[i]!.target > 0.5 ? "1" : "0"} 1 
                    ${point2.x} ${point2.y} L ${point3.x} ${point3.y} A ${innerRadius} ${innerRadius} 0 
                    ${data[i]!.target > 0.5 ? "1" : "0"} 0 ${point4.x} ${point4.y} Z`}
                    fill={`hsl(${(i * 35) % 110 + 180},40%,50%)`} className={"group-hover:opacity-70 hover:!opacity-100 cursor-pointer"}
                    onMouseEnter={() => {
                      document.getElementById("category")!.innerHTML = data[i]!.name;
                      document.getElementById("percent")!.innerHTML = `${data[i]!.value * 100}%/${data[i]!.target * 100}%`
                    }}
                    onMouseLeave={() => {
                      document.getElementById("category")!.innerHTML = "Habits";
                      document.getElementById("percent")!.innerHTML = "";
                    }}
                    onClick={() => {
                      if (title === "Habits") {
                        router.push(`/user/${router.query.username}/` + data[i]!.name).catch((err) => console.log(err));
                      }
                    }}
                    />
            );
          })}
        </g>
      </svg>
    </div>
  );
}
