import { query, mutation } from './_generated/server';
import { v } from 'convex/values';
import type { MutationCtx, QueryCtx } from './_generated/server';
import type { Id } from './_generated/dataModel';
import { AppErrorCode, appError } from './errors';

async function getUserIdFromToken(
  ctx: QueryCtx | MutationCtx,
  token: string
): Promise<Id<'users'> | null> {
  const session = await ctx.db
    .query('sessions')
    .withIndex('by_token', (q) => q.eq('token', token))
    .first();

  if (!session || session.expiresAt < Date.now()) {
    return null;
  }

  return session.userId;
}

export const list = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const userId = await getUserIdFromToken(ctx, args.token);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query('tasks')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .order('desc')
      .collect();
  },
});

export const create = mutation({
  args: { token: v.string(), title: v.string() },
  handler: async (ctx, args) => {
    const userId = await getUserIdFromToken(ctx, args.token);
    if (!userId) {
      appError(AppErrorCode.UNAUTHORIZED);
    }

    const title = args.title.trim();
    if (!title) {
      appError(AppErrorCode.TASK_TITLE_REQUIRED);
    }

    return await ctx.db.insert('tasks', {
      userId,
      title,
      done: false,
      createdAt: Date.now(),
    });
  },
});

export const toggle = mutation({
  args: { token: v.string(), taskId: v.id('tasks') },
  handler: async (ctx, args) => {
    const userId = await getUserIdFromToken(ctx, args.token);
    if (!userId) {
      appError(AppErrorCode.UNAUTHORIZED);
    }

    const task = await ctx.db.get(args.taskId);
    if (!task || task.userId !== userId) {
      appError(AppErrorCode.TASK_NOT_FOUND);
    }

    await ctx.db.patch(args.taskId, { done: !task.done });
    return !task.done;
  },
});

export const remove = mutation({
  args: { token: v.string(), taskId: v.id('tasks') },
  handler: async (ctx, args) => {
    const userId = await getUserIdFromToken(ctx, args.token);
    if (!userId) {
      appError(AppErrorCode.UNAUTHORIZED);
    }

    const task = await ctx.db.get(args.taskId);
    if (!task || task.userId !== userId) {
      appError(AppErrorCode.TASK_NOT_FOUND);
    }

    await ctx.db.delete(args.taskId);
  },
});
