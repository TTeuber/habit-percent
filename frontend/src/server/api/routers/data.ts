import { z } from "zod";
import fetch from "node-fetch";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { Data } from "~/components/Graph";

async function getData(username: string): Promise<Data> {
  const res = await fetch(`http://backend/data/${username}`);

  if (!res.ok) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }

  return (await res.json()) as Data;
}

async function postData(username: string, message: string): Promise<void> {
  const res = await fetch(`http://backend/data/${username}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    throw new TRPCError({
      code: "BAD_REQUEST",
    });
  }
}

async function patchData(
  username: string,
  id: number,
  message: string
): Promise<void> {
  const res = await fetch(`http://backend/data/${username}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, message }),
  });

  if (!res.ok) {
    throw new TRPCError({
      code: "BAD_REQUEST",
    });
  }
}

async function deleteData(username: string, id: number): Promise<void> {
  const res = await fetch(`http://backend/data/${username}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  if (!res.ok) {
    throw new TRPCError({
      code: "BAD_REQUEST",
    });
  }
}

export const dataRouter = createTRPCRouter({
  get: publicProcedure.input(z.string()).mutation(async ({ input }) => {
    const data = await getData(input);
    return data;
  }),

  post: publicProcedure.input(z.string()).mutation(async ({ input }) => {
    const res = await postData("tyler", input);
    // return "";
  }),

  delete: publicProcedure.input(z.number()).mutation(async ({ input }) => {
    const res = await deleteData("tyler", input);
    return "success";
  }),

  patch: publicProcedure
    .input(z.object({ id: z.number(), message: z.string() }))
    .mutation(async ({ input }) => {
      const res = await patchData("tyler", input.id, input.message);
      return "success";
    }),
});
