import { z } from "zod";
import fetch from "node-fetch";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

let testData = "test";

fetch("http://localhost:5000").then((res) =>
  res.json().then((data) => {
    testData = data as string;
  })
);

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${testData}`,
      };
    }),
});
