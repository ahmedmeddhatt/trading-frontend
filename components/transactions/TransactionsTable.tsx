// components/transactions/TransactionsTable.tsx
import React, { useState } from "react";
import { useTransactions, useDeleteTransaction } from "@/hooks/api/useTransactions";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { TransactionFormModal } from "./TransactionFormModal";
import { formatCurrency } from "@/lib/utils/formatNumber";
import { Skeleton } from "@/components/ui/Skeleton";
import { Error } from "@/components/ui/Error";

interface TransactionsTableProps {
  positionId: string;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({ positionId }) => {
  const { data: transactions = [], isLoading, error } = useTransactions(positionId);
  const deleteTransactionMutation = useDeleteTransaction();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await deleteTransactionMutation.mutateAsync(id);
    } catch (err) {
      // Error handled by mutation
    }
  };

  if (isLoading && transactions.length === 0) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rectangular" height="60px" />
        ))}
      </div>
    );
  }

  if (error) {
    return <Error message={(error as any)?.message || "Failed to load transactions"} />;
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl md:text-2xl font-semibold">Transactions</h2>
        <Button onClick={() => { setEditId(null); setShowModal(true); }} variant="primary">
          Add Transaction
        </Button>
      </div>

      {transactions.length === 0 ? (
        <div className="bg-[#1a1a1a] p-8 rounded-xl text-center text-[#a3a3a3] border border-[#2a2a2a]">
          <p>No transactions found for this position. Click "Add Transaction" to get started.</p>
        </div>
      ) : (
        <Table className="bg-[#1a1a1a] border border-[#2a2a2a]">
          <TableHeader>
            <TableRow className="bg-[#121212]">
              <TableHead className="p-3 border-b border-[#2a2a2a] text-[#a3a3a3]">Date</TableHead>
              <TableHead className="p-3 border-b border-[#2a2a2a] text-[#a3a3a3]">Type</TableHead>
              <TableHead className="p-3 border-b border-[#2a2a2a] text-[#a3a3a3]">Quantity</TableHead>
              <TableHead className="p-3 border-b border-[#2a2a2a] text-[#a3a3a3]">Price</TableHead>
              <TableHead className="p-3 border-b border-[#2a2a2a] text-[#a3a3a3]">Fees</TableHead>
              <TableHead className="p-3 border-b border-[#2a2a2a] text-[#a3a3a3]">Total</TableHead>
              <TableHead className="p-3 border-b border-[#2a2a2a] text-[#a3a3a3]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction._id} className="text-center border-b border-[#2a2a2a] last:border-b-0 hover:bg-[#121212]/50 transition-colors">
                <TableCell className="p-3">{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="p-3 capitalize">{transaction.type}</TableCell>
                <TableCell className="p-3">{transaction.quantity}</TableCell>
                <TableCell className="p-3">{formatCurrency(transaction.price)}</TableCell>
                <TableCell className="p-3">{formatCurrency(transaction.fees || 0)}</TableCell>
                <TableCell className="p-3">{formatCurrency(transaction.total)}</TableCell>
                <TableCell className="p-3 space-x-2">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(transaction._id)}
                    disabled={deleteTransactionMutation.isPending}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {showModal && (
        <TransactionFormModal
          transactionId={editId}
          positionId={positionId}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};
