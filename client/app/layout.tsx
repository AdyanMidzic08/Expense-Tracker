// app/layout.tsx
import home from "./page.tsx";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <home />
        <main>{children}</main>
      </body>
    </html>
  );
}
