// app/layout.tsx
import "./global.css";
import Navbar from "./components/Navbar";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar>
         <div className="flex flex-col gap-4">
            <a href="/">HomePage</a>
            <a href="/dashboard">dashboard</a>
            <a href="/payments">payments</a>
            <a href="/categories">categories</a>
         </div>
      </Navbar>
        <main>{children}</main>
      </body>
    </html>
  );
}
