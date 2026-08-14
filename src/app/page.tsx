import Link from 'next/link';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  let stats = {
    totalCustomers: 0,
    totalForklifts: 0,
    overdueCount: 0,
    warningCount: 0,
    pendingAlerts: 0,
    recentJobs: [] as any[],
    urgentForklifts: [] as any[],
  };

  try {
    const [
      totalCustomers,
      totalForklifts,
      overdueCount,
      warningCount,
      pendingAlerts,
      recentJobs,
      urgentForklifts,
    ] = await Promise.all([
      prisma.ftCustomer.count(),
      prisma.ftForklift.count(),
      prisma.ftForklift.count({ where: { status: 'OVERDUE' } }),
      prisma.ftForklift.count({ where: { status: 'WARNING' } }),
      prisma.ftMaintenanceAlert.count({ where: { status: 'PENDING' } }),
      prisma.ftRepairJob.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { forklift: true, customer: true },
      }),
      prisma.ftForklift.findMany({
        where: {
          status: { in: ['OVERDUE', 'WARNING'] },
        },
        take: 10,
        orderBy: { hoursCurrent: 'desc' },
        include: { customer: true },
      }),
    ]);

    stats = {
      totalCustomers,
      totalForklifts,
      overdueCount,
      warningCount,
      pendingAlerts,
      recentJobs,
      urgentForklifts,
    };
  } catch (error) {
    console.warn('Database not connected or empty, using defaults');
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">ภาพรวมระบบ (Overview)</h1>
          <p className="text-sm text-slate-400 mt-1">ติดตามรอบซ่อมบำรุงและสถานะ Forklift ทั้งหมดแบบ Real-time</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/forklifts/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff6b2b] hover:bg-[#ff8c54] text-white text-sm font-semibold rounded-lg shadow-lg shadow-orange-500/20 transition-all"
          >
            <span>+</span> เพิ่ม Forklift
          </Link>
          <Link
            href="/customers/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-all"
          >
            <span>+</span> เพิ่มลูกค้า
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111729] border border-orange-500/10 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">ลูกค้าทั้งหมด</span>
            <span className="text-xl">👥</span>
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.totalCustomers}</div>
          <div className="text-xs text-slate-500 mt-1">บริษัทที่ลงทะเบียน</div>
        </div>

        <div className="bg-[#111729] border border-orange-500/10 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Forklift ในระบบ</span>
            <span className="text-xl">🏗️</span>
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.totalForklifts}</div>
          <div className="text-xs text-slate-500 mt-1">คันที่กำลังติดตาม</div>
        </div>

        <div className="bg-[#111729] border border-red-500/20 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-red-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">ถึงรอบซ่อม (Overdue)</span>
            <span className="text-xl">🚨</span>
          </div>
          <div className="text-3xl font-extrabold text-red-400">{stats.overdueCount}</div>
          <div className="text-xs text-red-400/70 mt-1">ต้องติดต่อเข้าบริการด่วน</div>
        </div>

        <div className="bg-[#111729] border border-amber-500/20 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">ใกล้ถึงรอบ (Warning)</span>
            <span className="text-xl">⏳</span>
          </div>
          <div className="text-3xl font-extrabold text-amber-400">{stats.warningCount}</div>
          <div className="text-xs text-amber-400/70 mt-1">เหลือไม่เกิน 50 ชม.</div>
        </div>
      </div>

      {/* Main Grid: Urgent Forklifts & Recent Repairs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Urgent Forklifts (2 cols) */}
        <div className="lg:col-span-2 bg-[#111729] border border-orange-500/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white">Forklift ที่ต้องดูแลเร่งด่วน</h2>
              <p className="text-xs text-slate-400">รถที่เกินรอบหรือใกล้ถึงรอบเปลี่ยนถ่ายน้ำมัน</p>
            </div>
            <Link href="/forklifts" className="text-xs text-[#ff6b2b] hover:underline font-semibold">
              ดูทั้งหมด →
            </Link>
          </div>

          {stats.urgentForklifts.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              ✨ ไม่มี Forklift ที่ต้องเข้าซ่อมด่วนในขณะนี้
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {stats.urgentForklifts.map((forklift) => {
                const isOverdue = forklift.status === 'OVERDUE';
                return (
                  <div key={forklift.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-base font-bold ${isOverdue ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                        {isOverdue ? '!' : '⏳'}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-white flex items-center gap-2">
                          <span>{forklift.code}</span>
                          <span className="text-xs font-normal text-slate-400">· {forklift.brand} {forklift.model}</span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {forklift.customer?.name} ({forklift.customer?.phone || 'ไม่มีเบอร์'})
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold text-white">{forklift.hoursCurrent.toLocaleString()} ชม.</div>
                      <div className={`text-xs font-semibold ${isOverdue ? 'text-red-400' : 'text-amber-400'}`}>
                        {isOverdue ? `เกิน ${forklift.hoursCurrent - forklift.hoursNextService} ชม.` : `เหลือ ${forklift.hoursNextService - forklift.hoursCurrent} ชม.`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Repairs (1 col) */}
        <div className="bg-[#111729] border border-orange-500/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white">งานซ่อมล่าสุด</h2>
              <p className="text-xs text-slate-400">ประวัติการบริการ 5 รายการล่าสุด</p>
            </div>
            <Link href="/repairs" className="text-xs text-[#ff6b2b] hover:underline font-semibold">
              ดูทั้งหมด →
            </Link>
          </div>

          {stats.recentJobs.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              ยังไม่มีประวัติงานซ่อม
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentJobs.map((job) => (
                <div key={job.id} className="p-3 bg-white/5 rounded-lg border border-white/5">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-orange-400">{job.forklift?.code}</span>
                    <span className="text-slate-500">{new Date(job.createdAt).toLocaleDateString('th-TH')}</span>
                  </div>
                  <div className="text-xs text-slate-300 font-medium">{job.description || job.type}</div>
                  <div className="text-[11px] text-slate-400 mt-1">ช่าง: {job.technicianName || 'ทีมช่าง'}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
