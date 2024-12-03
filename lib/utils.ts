import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Active, DataRef, Over } from '@dnd-kit/core';
import { ColumnDragData } from '@/app/admin/kanban/_components/board-column';
import { TaskDragData } from '@/app/admin/kanban/_components/task-card';
import { asc, count, desc, InferSelectModel, SelectedFields, sql, SQL } from 'drizzle-orm';
import db from './db/db';
import { PgTableWithColumns, TableConfig } from 'drizzle-orm/pg-core';
import { User } from 'next-auth';
import { Role } from './db/schema/users';
import { NextResponse } from 'next/server';

type DraggableData = ColumnDragData | TaskDragData;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hasDraggableData<T extends Active | Over>(
  entry: T | null | undefined
): entry is T & {
  data: DataRef<DraggableData>;
} {
  if (!entry) {
    return false;
  }

  const data = entry.data.current;

  if (data?.type === 'Column' || data?.type === 'Task') {
    return true;
  }

  return false;
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: 'accurate' | 'normal';
  } = {}
) {
  const { decimals = 0, sizeType = 'normal' } = opts;

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === 'accurate' ? accurateSizes[i] ?? 'Bytest' : sizes[i] ?? 'Bytes'
  }`;
}

export interface OrderBy<T> {
  column: keyof T;
  direction: typeof asc | typeof desc
}

export interface PagedResponse<T extends TableConfig> {
    data: InferSelectModel<PgTableWithColumns<T>>[];
    nextPage: number | null;
    totalPages: number;
    totalItems: number;
}

export async function getItemsPaged<T extends TableConfig>(
  table: PgTableWithColumns<T>,
  where?: SQL<unknown>,
  orderBy?: { column: keyof typeof table.$inferSelect, direction: typeof asc | typeof desc },
  page?: number,
  limit?: number,
): Promise<PagedResponse<T>> {
  let totalItems = await db.select({ count: count() }).from(table);

  const currentPage = page ?? 1;
  const currentPageIndex = currentPage - 1;
  const resultLimit = (limit || 1000);

  const offset = (currentPageIndex * resultLimit);
  const nextPage = totalItems[0].count > (currentPage * resultLimit) ? currentPage + 1 : null;

  let query;

  if(orderBy)
  {
    query = db
      .select()
      .from(table)
      .offset(offset)
      .limit(resultLimit)
      .where(where ?? undefined)
      .orderBy(orderBy.direction(table[orderBy.column]))
  } else {
    query = db
      .select()
      .from(table)
      .offset(offset)
      .limit(resultLimit)
      .where(where ?? undefined)
  }

  const result = await query;

  return {
    data: result  as InferSelectModel<PgTableWithColumns<T>>[],
    nextPage: nextPage,
    totalPages: Math.ceil(totalItems[0].count / resultLimit),
    totalItems: totalItems[0].count
  };
}

export function enumToPgEnum<T extends Record<string, any>>(
  myEnum: T,
): [T[keyof T], ...T[keyof T][]] {
  return Object.values(myEnum).map((value: any) => `${value}`) as any
}

export function redirectToUserDefaultPage( user: User )
{
  if(user.roles?.includes(Role.ADMIN))
    return '/admin/overview';
  else 
    return '/';
}