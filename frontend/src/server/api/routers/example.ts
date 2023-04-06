import { z } from "zod";
import fetch from "node-fetch";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

let testData: {
  hello: string;
  goodbye: string;
};

fetch("http://localhost:5000").then((res) =>
  res.json().then((data) => {
    console.log(data);
    testData = data as unknown as { hello: string; goodbye: string };
  })
);

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${testData.goodbye}`,
      };
    }),
});
