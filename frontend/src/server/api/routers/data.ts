import { z } from "zod";
import fetch from "node-fetch";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

async function getData(username: string): Promise<string> {
  const res = await fetch(`http://localhost:5000/data/${username}`);
  return await res.text();
}

export const dataRouter = createTRPCRouter({
  test: publicProcedure.input(z.string()).query(async ({ input }) => {
    const data = await getData(input);
    return { message: data };
  }),
});
