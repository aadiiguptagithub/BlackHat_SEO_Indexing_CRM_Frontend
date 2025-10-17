import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useBank } from "../context/BankContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Validation schema
const bankFormSchema = z.object({
  name: z
    .string()
    .min(3, "Bank name must be at least 3 characters")
    .max(100, "Bank name must not exceed 100 characters"),
  accountNumber: z
    .string()
    .min(8, "Account number must be at least 8 characters")
    .max(20, "Account number must not exceed 20 characters")
    .regex(/^\d+$/, "Account number must contain only numbers"),
  ifsc: z
    .string()
    .length(11, "IFSC code must be exactly 11 characters")
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format"),
});

export function BankFormDialog({ open, onOpenChange, bank }) {
  const { addBank, updateBank, isLoading } = useBank();
  const isEditing = Boolean(bank);

  const form = useForm({
    resolver: zodResolver(bankFormSchema),
    defaultValues: {
      name: "",
      accountNumber: "",
      ifsc: "",
    },
  });

  useEffect(() => {
    if (bank) {
      form.reset(bank);
    } else {
      form.reset({
        name: "",
        accountNumber: "",
        ifsc: "",
      });
    }
  }, [bank, form]);

  const onSubmit = async (data) => {
    let success;

    if (isEditing) {
      success = await updateBank(bank.id, data);
    } else {
      success = await addBank(data);
    }

    if (success) {
      onOpenChange(false);
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Bank Details" : "Add New Bank"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter bank name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter account number"
                      {...field}
                      maxLength={20}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ifsc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IFSC Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter IFSC code"
                      {...field}
                      maxLength={11}
                      style={{ textTransform: "uppercase" }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isEditing ? "Update" : "Add"} Bank
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
