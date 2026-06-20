"use client";

import React, { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/shared/pagination";
import type { PageSize } from "@/components/shared/pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageIndex?: number;
  pageCount?: number;
  pageSize?: PageSize;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: PageSize) => void;
  onSortingChange?: (sorting: { id: string; desc: boolean } | null) => void;
  sorting?: { id: string; desc: boolean } | null;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageIndex: controlledPageIndex = 0,
  pageCount: controlledPageCount = 1,
  pageSize: controlledPageSize = 10 as PageSize,
  onPageChange,
  onPageSizeChange,
  onSortingChange,
  sorting: controlledSorting,
}: DataTableProps<TData, TValue>) {
  const [internalSorting, setInternalSorting] = React.useState<SortingState>([]);

  const sorting = controlledSorting
    ? [{ id: controlledSorting.id, desc: controlledSorting.desc }]
    : internalSorting;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      pagination: {
        pageIndex: controlledPageIndex,
        pageSize: controlledPageSize,
      },
      sorting: sorting as SortingState,
    },
    pageCount: controlledPageCount,
    onPaginationChange: (updater) => {
      if (onPageChange) {
        const newPage = typeof updater === "function"
          ? updater({ pageIndex: controlledPageIndex, pageSize: controlledPageSize }).pageIndex
          : updater.pageIndex;
        onPageChange(newPage);
      }
    },
    onSortingChange: (updater) => {
      if (onSortingChange) {
        const newSorting = typeof updater === "function"
          ? updater(sorting as SortingState)
          : updater;
        if (newSorting.length === 0) {
          onSortingChange(null);
        } else {
          onSortingChange({ id: newSorting[0].id, desc: newSorting[0].desc });
        }
      } else {
        setInternalSorting(typeof updater === "function" ? updater(internalSorting) : updater);
      }
    },
    manualPagination: true,
    manualSorting: true,
  });

  return (
    <div>
      <div className="rounded-md border min-h-[250px]">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  return (
                    <TableHead
                      key={header.id}
                      className={canSort ? "cursor-pointer select-none" : ""}
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                    >
                      <div className="flex items-center gap-1">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                        {canSort && (
                          <span className="ml-1 text-muted-foreground">
                            {sorted === "asc" ? "↑" : sorted === "desc" ? "↓" : ""}
                          </span>
                        )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Pagination
        pageIndex={controlledPageIndex}
        pageCount={controlledPageCount}
        pageSize={controlledPageSize}
        onPageChange={(page) => onPageChange?.(page)}
        onPageSizeChange={(size) => onPageSizeChange?.(size)}
      />
    </div>
  );
}
