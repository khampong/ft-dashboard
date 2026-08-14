import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "ForkTech Dashboard — ระบบดูแล Forklift",
  description: "ระบบบริหารจัดการรอบซ่อมบำรุงและแจ้งเตือน Forklift สำหรับ ForkTech Group",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="bg-[#0b0f1e] text-slate-100 antialiased min-h-screen flex">
        {/* Sidebar */}
        <aside className="w-64 bg-[#0e1424] border-r border-orange-500/15 flex flex-col fixed inset-y-0 z-30">
          {/* Brand */}
          <div className="h-16 flex items-center gap-3 px-6 border-b border-orange-500/10">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#ff6b2b] to-[#cc4400] flex items-center justify-center text-lg shadow-lg shadow-orange-500/20">
              🔧
            </div>
            <div>
              <div className="font-bold text-white tracking-tight text-sm">ForkTech</div>
              <div className="text-[10px] text-orange-400 font-semibold tracking-wider uppercase">Care Dashboard</div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            <Link
              href="/"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              <span className="text-base">📊</span>
              <span>ภาพรวม (Overview)</span>
            </Link>
            <Link
              href="/customers"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              <span className="text-base">👥</span>
              <span>ลูกค้า (Customers)</span>
            </Link>
            <Link
              href="/forklifts"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              <span className="text-base">🏗️</span>
              <span>รถ Forklift</span>
            </Link>
            <Link
              href="/repairs"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              <span className="text-base">🛠️</span>
              <span>งานซ่อมบำรุง</span>
            </Link>
            <Link
              href="/alerts"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              <span className="text-base">🔔</span>
              <span>การแจ้งเตือน LINE</span>
            </Link>
          </nav>

          {/* Footer Info */}
          <div className="p-4 border-t border-white/5 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>PostgreSQL Connected</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-500">ForkTech Group Co., Ltd.</div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 pl-64 min-h-screen">
          <div className="p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
