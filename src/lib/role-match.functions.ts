import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const matchRoleFn = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ role: z.string().trim().min(20).max(4000) }).parse(d))
  .handler(async ({ data }) => {
    const { matchRole, GatewayError } = await import("./role-match.server");
    try {
      return { ok: true as const, result: await matchRole(data.role) };
    } catch (e) {
      return { ok: false as const, error: e instanceof GatewayError ? e.message : "Something went wrong. Please try again." };
    }
  });
