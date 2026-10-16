import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import SubmitPage from "./pages/SubmitPage.jsx";
import StatusLookupPage from "./pages/StatusLookupPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import { Toaster } from "@/components/ui/toaster";

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<SubmitPage />} />
          <Route path="/status" element={<StatusLookupPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}
