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
          {children}
        </Navbar>
      </body>
    </html>
  );
}
