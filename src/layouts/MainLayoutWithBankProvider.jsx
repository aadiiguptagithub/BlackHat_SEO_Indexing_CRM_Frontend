import React from "react";
import { MainLayout } from "./MainLayout";
import { BankProvider } from "../features/settings/context/BankContext";

export function MainLayoutWithBankProvider() {
  return (
    <BankProvider>
      <MainLayout />
    </BankProvider>
  );
}
