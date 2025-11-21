import * as React from "react";
import { cn } from "@/lib/utils";

// Root Table
export const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <table
    ref={ref}
    className={cn(
      "w-full border-separate border-spacing-0 text-sm text-gray-200",
      className
    )}
    {...props}
  />
));
Table.displayName = "Table";

// Table Header container
export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("bg-gradient-to-r from-[#0f172a] to-[#1e293b]", className)}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

// Single header row
export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-slate-800 transition-colors hover:bg-slate-800/40",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

// Header cell
export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "p-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-300 border-b border-slate-700 bg-slate-900/50 backdrop-blur",
      className
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

// Table body container
export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn(className)} {...props} />
));
TableBody.displayName = "TableBody";

// Table body cell
export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-3 border-b border-slate-800 text-sm text-slate-200",
      className
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";
