type Data = {
  name: string;
  target: number;
  value: number;
}[];

type SliceCoords = {
  point1: { x: number; y: number };
  outerRadius: number;
  point2: { x: number; y: number };
  point3: { x: number; y: number };
  innerRadius: number;
  point4: { x: number; y: number };
};

export default function Graph() {
  const data: Data = [
    { name: "a", target: 0.25, value: 0.2 },
    { name: "b", target: 0.25, value: 0.3 },
    { name: "c", target: 0.25, value: 0.3 },
    { name: "d", target: 0.25, value: 0.1 },
  ];

  const width = 400;
  const height = 400;
  const baseLength = width / 4;

  function getStartAngle(data: Data, index: number) {
    if (index === 0) return -Math.PI / 2;

    return (
      // prettier-ignore
      data.slice(0, index).reduce((acc, cur) => acc + cur.target, 0) * 2 * Math.PI - Math.PI / 2
    );
  }

  function getEndAngle(data: Data, index: number) {
    // prettier-ignore
    return (data[index]!.target + data.slice(0, index).reduce((acc, cur) => acc + cur.target, 0)) * 2 * Math.PI - Math.PI / 2;
  }

  function createSlice(data: Data, index: number) {
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
    <div className={"border"}>
      <svg width={width} height={height}>
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          <circle r={width / 3} fill={"hsla(0,0%,50%,50%)"} />
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
                    fill={`hsla(${i * 40 + 180},40%,50%,50%)`}
                    />
            );
          })}
        </g>
      </svg>
    </div>
  );
}
