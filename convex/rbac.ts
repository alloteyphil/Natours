import { ConvexError } from "convex/values";
import type { GenericCtx } from "@convex-dev/better-auth";
import type { GenericDatabaseReader } from "convex/server";
import type { DataModel } from "./_generated/dataModel";
import { authComponent } from "./auth";

export type UserRole = "user" | "guide" | "lead-guide" | "admin";
type DbCtx = GenericCtx<DataModel> & { db: GenericDatabaseReader<DataModel> };

export const getAuthUserOrThrow = async (ctx: GenericCtx<DataModel>) => {
  const authUser = await authComponent.getAuthUser(ctx);
  if (!authUser) {
    throw new ConvexError("Unauthenticated");
  }
  return authUser;
};

export const getAuthUserId = (authUser: {
  userId?: string | null;
  _id: unknown;
}) => {
  return authUser.userId ?? String(authUser._id);
};

export const getUserByAuthId = async (ctx: DbCtx, authUserId: string) => {
  return ctx.db
    .query("users")
    .withIndex("by_auth_user", (q) => q.eq("authUserId", authUserId))
    .unique();
};

export const requireRole = async (ctx: DbCtx, roles: UserRole[]) => {
  const authUser = await getAuthUserOrThrow(ctx);
  const user = await getUserByAuthId(ctx, getAuthUserId(authUser));
  if (!user) {
    throw new ConvexError("User record not found");
  }
  if (!roles.includes(user.role as UserRole)) {
    throw new ConvexError("Forbidden");
  }
  return user;
};
