"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TableType = {
  headers: string[];
  data: string[][];
};

const LOCAL_STORAGE_KEY = "dynamicTableData";

function App() {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);
  const [headers, setHeaders] = useState<string[]>([]);
  const [tableData, setTableData] = useState<string[][]>([]);
  const [deleteIndex, setDeleteIndex] = useState<{
    type: "row" | "column";
    index: number;
  } | null>(null);

  // Load data
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed: TableType = JSON.parse(saved);
      setHeaders(parsed.headers);
      setTableData(parsed.data);
      setCols(parsed.headers.length);
      setRows(parsed.data.length);
    }
  }, []);

  // Save data
  useEffect(() => {
    if (headers.length && tableData.length) {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({ headers, data: tableData })
      );
    }
  }, [headers, tableData]);

  const handleCreateTable = () => {
    const newHeaders = Array.from(
      { length: cols },
      (_, i) => `Column ${i + 1}`
    );
    const newData = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => "")
    );
    setHeaders(newHeaders);
    setTableData(newData);
    setOpen(false);
  };

  const handleCellChange = (
    rowIndex: number,
    colIndex: number,
    value: string
  ) => {
    const updated = [...tableData];
    updated[rowIndex][colIndex] = value;
    setTableData(updated);
  };

  const handleHeaderChange = (colIndex: number, value: string) => {
    const updated = [...headers];
    updated[colIndex] = value;
    setHeaders(updated);
  };

  const handleAddRow = () => {
    const newRow = Array.from({ length: cols }, () => "");
    setTableData((prev) => [...prev, newRow]);
    setRows((prev) => prev + 1);
  };

  const handleAddColumn = () => {
    const newHeaders = [...headers, `Column ${headers.length + 1}`];
    const updatedData = tableData.map((row) => [...row, ""]);
    setHeaders(newHeaders);
    setTableData(updatedData);
    setCols((prev) => prev + 1);
  };

  const handleDeleteRow = (index: number) => {
    const updatedData = [...tableData];
    updatedData.splice(index, 1);
    setTableData(updatedData);
    setRows(updatedData.length);
    setDeleteIndex(null);
  };

  const handleDeleteColumn = (index: number) => {
    const updatedHeaders = [...headers];
    updatedHeaders.splice(index, 1);

    const updatedData = tableData.map((row) => {
      const newRow = [...row];
      newRow.splice(index, 1);
      return newRow;
    });

    setHeaders(updatedHeaders);
    setTableData(updatedData);
    setCols(updatedHeaders.length);
    setDeleteIndex(null);
  };

  const handleDeleteTable = () => {
    setHeaders([]);
    setTableData([]);
    setCols(0);
    setRows(0);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const handleResetTable = () => {
    const blankHeaders = Array.from({ length: cols }, () => "");
    const blankData = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => "")
    );
    setHeaders(blankHeaders);
    setTableData(blankData);
  };

  const confirmDelete = () => {
    if (!deleteIndex) return;

    if (deleteIndex.type === "row") {
      handleDeleteRow(deleteIndex.index);
    } else {
      handleDeleteColumn(deleteIndex.index);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-svh gap-6 p-6">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Create Table</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Set Table Dimensions</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input
              type="number"
              placeholder="Number of rows"
              value={rows}
              onChange={(e) => setRows(Number(e.target.value))}
            />
            <Input
              type="number"
              placeholder="Number of columns"
              value={cols}
              onChange={(e) => setCols(Number(e.target.value))}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleCreateTable}>Generate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {tableData.length > 0 && (
        <div className="w-full max-w-6xl space-y-4 overflow-x-auto">
          <div className="flex gap-4 justify-end flex-wrap">
            <Button onClick={handleAddRow}>Add Row</Button>
            <Button onClick={handleAddColumn}>Add Column</Button>
            <Button onClick={handleResetTable}>Reset Table</Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Table</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to delete the table?
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="text-white hover:text-gray-400">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteTable}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="overflow-x-auto p-2 border-3">
            <div className="mb-5">
              <div className="p-5 text-center font-bold">
                <h1>BUSINESS SHARES & PROFITS</h1>
              </div>
              <div className="font-semibold text-end flex flex-col">
                <div>Email: alloor19@gmail.com</div>
                <div>Contact: +91 7034220899</div>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  {headers.map((header, colIndex) => (
                    <TableHead key={colIndex}>
                      <div className="flex items-center gap-2">
                        <Input
                          value={header}
                          onChange={(e) =>
                            handleHeaderChange(colIndex, e.target.value)
                          }
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            setDeleteIndex({ type: "column", index: colIndex })
                          }
                        >
                          ❌
                        </Button>
                      </div>
                    </TableHead>
                  ))}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell, colIndex) => (
                      <TableCell key={colIndex}>
                        <Input
                          value={cell}
                          onChange={(e) =>
                            handleCellChange(rowIndex, colIndex, e.target.value)
                          }
                        />
                      </TableCell>
                    ))}
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setDeleteIndex({ type: "row", index: rowIndex })
                        }
                      >
                        ❌
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Row/Column Deletion */}
      <AlertDialog
        open={!!deleteIndex}
        onOpenChange={(open) => !open && setDeleteIndex(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this {deleteIndex?.type}?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-white hover:text-gray-400">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default App;
