import { Outlet } from "react-router-dom";
import { APP_NAME } from "../config.js";

export default function Layout() {
  return (
    <>
      <header className="border-b border-zinc-200">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center px-6 lg:px-10">
          <p className="text-lg font-semibold tracking-tight text-zinc-950">{APP_NAME}</p>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-10 lg:py-12">
        <Outlet />
      </main>
    </>
  );
}
