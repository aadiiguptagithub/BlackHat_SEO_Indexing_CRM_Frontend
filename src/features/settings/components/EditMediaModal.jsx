import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { IndianRupee } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Media name must be at least 2 characters"),
  pricePerSqFt: z.coerce
    .number()
    .min(0.01, "Price must be greater than 0")
    .max(10000, "Price seems too high"),
  gstPercent: z.coerce
    .number()
    .min(0, "GST cannot be negative")
    .max(100, "GST cannot exceed 100%")
    .transform((val) => Number(val.toFixed(2))),
  hsnCode: z
    .string()
    .min(6, "HSN code must be at least 6 characters")
    .max(8, "HSN code must be at most 8 characters")
    .regex(/^[0-9]+$/, "HSN code must contain only numbers"),
});

export function EditMediaModal({ media, isOpen, onClose, onSubmit }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: media?.name || "",
      pricePerSqFt: media?.pricePerSqFt?.toString() || "",
      gstPercent: media?.gstPercent?.toString() || "",
      hsnCode: media?.hsnCode || "",
    },
  });

  const handleSubmit = (data) => {
    onSubmit({
      ...data,
      id: media.id,
      pricePerSqFt: parseFloat(data.pricePerSqFt),
      gstPercent: parseFloat(data.gstPercent),
      status: media.status,
    });
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Edit Media Type
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 mt-4"
          >
            {/* Media Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Media Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Flex Banner, Vinyl Print"
                      className="h-10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Price per Square Foot */}
            <FormField
              control={form.control}
              name="pricePerSqFt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Price per sq. ft <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="number"
                        min="0.01"
                        step="0.01"
                        placeholder="25.00"
                        className="h-10 pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* GST Percentage */}
            <FormField
              control={form.control}
              name="gstPercent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    GST % <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      placeholder="18.00"
                      className="h-10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* HSN Code */}
            <FormField
              control={form.control}
              name="hsnCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    HSN Code <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., 39209100"
                      maxLength={8}
                      className="h-10 font-mono"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                  <p className="text-xs text-gray-500">
                    6-8 digit HSN code for tax purposes
                  </p>
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  onClose();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
