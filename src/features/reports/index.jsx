import { Routes, Route } from "react-router-dom";
import { Reports } from "./components/Reports";

/**
 * Simplified Report routes - Only main dashboard
 */
export function ReportRoutes() {
  return (
    <Routes>
      <Route index element={<Reports />} />
    </Routes>
  );
}

export default ReportRoutes;
