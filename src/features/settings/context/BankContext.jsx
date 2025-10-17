import { createContext, useContext, useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";

// Mock data
const initialBanks = [
  {
    id: 1,
    name: "State Bank of India",
    accountNumber: "20145678901",
    ifsc: "SBIN0001234",
    status: "active",
  },
  {
    id: 2,
    name: "HDFC Bank",
    accountNumber: "30145678902",
    ifsc: "HDFC0002345",
    status: "active",
  },
  {
    id: 3,
    name: "ICICI Bank",
    accountNumber: "40145678903",
    ifsc: "ICIC0003456",
    status: "inactive",
  },
];

const BankContext = createContext(null);

// Simulated API delay
const simulateApiCall = (data, delay = 1000) =>
  new Promise((resolve) => setTimeout(() => resolve(data), delay));

export function BankProvider({ children }) {
  const [banks, setBanks] = useState(initialBanks);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Add new bank
  const addBank = useCallback(
    async (bankData) => {
      setIsLoading(true);
      try {
        const newBank = {
          ...bankData,
          id: Date.now(),
          status: "active",
        };
        await simulateApiCall(newBank);
        setBanks((prev) => [...prev, newBank]);
        toast({
          title: "Success",
          description: "Bank added successfully",
          variant: "success",
        });
        return true;
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to add bank",
          variant: "destructive",
        });
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  // Update bank
  const updateBank = useCallback(
    async (id, bankData) => {
      setIsLoading(true);
      try {
        await simulateApiCall(bankData);
        setBanks((prev) =>
          prev.map((bank) => (bank.id === id ? { ...bank, ...bankData } : bank))
        );
        toast({
          title: "Success",
          description: "Bank updated successfully",
          variant: "success",
        });
        return true;
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update bank",
          variant: "destructive",
        });
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  // Delete bank
  const deleteBank = useCallback(
    async (id) => {
      setIsLoading(true);
      try {
        await simulateApiCall({ id });
        setBanks((prev) => prev.filter((bank) => bank.id !== id));
        toast({
          title: "Success",
          description: "Bank deleted successfully",
          variant: "success",
        });
        return true;
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete bank",
          variant: "destructive",
        });
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  // Toggle bank status
  const toggleBankStatus = useCallback(
    async (id) => {
      setIsLoading(true);
      try {
        const bank = banks.find((b) => b.id === id);
        const newStatus = bank.status === "active" ? "inactive" : "active";
        await simulateApiCall({ id, status: newStatus });
        setBanks((prev) =>
          prev.map((bank) =>
            bank.id === id ? { ...bank, status: newStatus } : bank
          )
        );
        toast({
          title: "Success",
          description: `Bank ${
            newStatus === "active" ? "activated" : "deactivated"
          } successfully`,
          variant: "success",
        });
        return true;
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update bank status",
          variant: "destructive",
        });
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [banks, toast]
  );

  const value = {
    banks,
    isLoading,
    addBank,
    updateBank,
    deleteBank,
    toggleBankStatus,
  };

  return <BankContext.Provider value={value}>{children}</BankContext.Provider>;
}

export const useBank = () => {
  const context = useContext(BankContext);
  if (!context) {
    throw new Error("useBank must be used within a BankProvider");
  }
  return context;
};
