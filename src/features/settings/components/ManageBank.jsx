import { useState, useMemo } from "react";
import { PlusCircle } from "lucide-react";
import { useBank } from "../context/BankContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BankFormDialog } from "./BankFormDialog";
import { DeleteBankDialog } from "./DeleteBankDialog";
import { cn } from "@/lib/utils";

export function ManageBank() {
  const { banks, isLoading, toggleBankStatus } = useBank();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [editBank, setEditBank] = useState(null);
  const [bankToDelete, setBankToDelete] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const itemsPerPage = 10;

  // Filter and sort banks
  const filteredBanks = useMemo(() => {
    return banks
      .filter(
        (bank) =>
          bank.name.toLowerCase().includes(search.toLowerCase()) &&
          (statusFilter === "all" || bank.status === statusFilter)
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [banks, search, statusFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredBanks.length / itemsPerPage);
  const paginatedBanks = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredBanks.slice(start, start + itemsPerPage);
  }, [filteredBanks, page]);

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Manage Banks</h1>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add New Bank
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <Input
            placeholder="Search banks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bank Name</TableHead>
              <TableHead>Account Number</TableHead>
              <TableHead>IFSC Code</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedBanks.map((bank) => (
              <TableRow key={bank.id} className="hover:bg-gray-50/50">
                <TableCell className="font-medium">{bank.name}</TableCell>
                <TableCell>{bank.accountNumber}</TableCell>
                <TableCell>{bank.ifsc}</TableCell>
                <TableCell>
                  <Badge
                    variant={bank.status === "active" ? "success" : "secondary"}
                    className={cn(
                      "cursor-pointer transition-colors px-4 py-1 rounded-full",
                      bank.status === "active"
                        ? "bg-emerald-50 text-emerald-700 hover:bg-red-50 hover:text-red-700"
                        : "bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                    )}
                    onClick={() => toggleBankStatus(bank.id)}
                  >
                    {bank.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end items-center gap-2">
                    <button
                      onClick={() => setEditBank(bank)}
                      className="inline-flex items-center justify-center p-1 text-blue-600 hover:bg-blue-50 rounded-full"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => setBankToDelete(bank)}
                      className="inline-flex items-center justify-center p-1 text-red-600 hover:bg-red-50 rounded-full"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {paginatedBanks.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No banks found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      <BankFormDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        bank={null}
      />

      <BankFormDialog
        open={Boolean(editBank)}
        onOpenChange={(open) => !open && setEditBank(null)}
        bank={editBank}
      />

      <DeleteBankDialog
        open={Boolean(bankToDelete)}
        onOpenChange={(open) => !open && setBankToDelete(null)}
        bank={bankToDelete}
      />
    </div>
  );
}
