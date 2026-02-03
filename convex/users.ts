import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import {
  getAuthUserId,
  getAuthUserOrThrow,
  getUserByAuthId,
  requireRole,
  type UserRole,
} from "./rbac";

export const getMe = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await getAuthUserOrThrow(ctx);
    const user = await getUserByAuthId(ctx, getAuthUserId(authUser));
    return { authUser, user };
  },
});

export const ensureUser = mutation({
  args: {},
  handler: async (ctx) => {
    const authUser = await getAuthUserOrThrow(ctx);
    const authUserId = getAuthUserId(authUser);
    const existing = await getUserByAuthId(ctx, authUserId);
    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: authUser.name ?? existing.name,
        email: authUser.email ?? existing.email,
        photo: authUser.image ?? existing.photo,
        updatedAt: now,
      });
      return existing._id;
    }

    return ctx.db.insert("users", {
      authUserId,
      name: authUser.name ?? "New user",
      email: authUser.email ?? "unknown@example.com",
      photo: authUser.image ?? undefined,
      role: "user",
      active: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const setRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    await requireRole(ctx, ["admin"]);
    const now = Date.now();
    await ctx.db.patch(args.userId, {
      role: args.role as UserRole,
      updatedAt: now,
    });
  },
});

export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    photo: v.optional(v.string()),
    photoStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const authUser = await getAuthUserOrThrow(ctx);
    const authUserId = getAuthUserId(authUser);
    const now = Date.now();
    const existing = await getUserByAuthId(ctx, authUserId);

    const nextName =
      args.name?.trim() || authUser.name || existing?.name || "Traveler";
    const storagePhotoUrl = args.photoStorageId
      ? await ctx.storage.getUrl(args.photoStorageId)
      : null;
    const rawPhoto =
      storagePhotoUrl ||
      args.photo?.trim() ||
      authUser.image ||
      existing?.photo ||
      undefined;
    const nextPhoto: string | undefined = rawPhoto ?? undefined;
    const nextEmail =
      authUser.email ?? existing?.email ?? "unknown@example.com";

    if (!existing) {
      return ctx.db.insert("users", {
        authUserId,
        name: nextName,
        email: nextEmail,
        photo: nextPhoto,
        role: "user",
        active: true,
        createdAt: now,
        updatedAt: now,
      });
    }

    await ctx.db.patch(existing._id, {
      name: nextName,
      email: nextEmail,
      photo: nextPhoto,
      updatedAt: now,
    });

    return existing._id;
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
