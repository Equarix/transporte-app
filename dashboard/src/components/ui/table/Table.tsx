import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Table as TableHero,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Spinner } from "@heroui/react";
import type { ReactNode } from "react";

interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  bottomContent?: ReactNode;
  emptyContent?: ReactNode;
}

export default function Table<T>({
  data,
  columns,
  isLoading,
  bottomContent,
  emptyContent,
}: TableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <TableHero
      aria-label="Tabla de ventas"
      className="bg-white dark:bg-zinc-900 rounded-2xl shadow-md border border-zinc-200 dark:border-zinc-800"
      bottomContent={bottomContent}
    >
      <TableHeader
        columns={table
          .getHeaderGroups()
          .map((headerGroup) => headerGroup.headers)
          .flat()}
      >
        {(column) => (
          <TableColumn key={column.id}>
            {column.isPlaceholder
              ? null
              : flexRender(column.column.columnDef.header, column.getContext())}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent={emptyContent}
        items={table.getRowModel().rows}
        isLoading={isLoading}
        loadingContent={<Spinner label="Cargando.." />}
      >
        {(row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        )}
      </TableBody>
    </TableHero>
  );
}
