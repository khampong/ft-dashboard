import Link from 'next/link';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function ForkliftsPage() {
  let forklifts: any[] = [];
  try {
    forklifts = await prisma.ftForklift.findMany({
      include: { customer: true },
      orderBy: [
        { status: 'asc' },
        { createdAt: 'desc' },
      ],
    });
  } catch (err) {
    console.warn('Database error or not connected yet');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">รถ Forklift ทั้งหมด</h1>
          <p className="text-sm text-slate-400 mt-1">จัดการข้อมูลรถ ตรวจสอบชั่วโมง และติดตามรอบซ่อมบำรุง</p>
        </div>
        <Link
          href="/forklifts/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff6b2b] hover:bg-[#ff8c54] text-white text-sm font-semibold rounded-lg shadow-lg shadow-orange-500/20 transition-all"
        >
          <span>+</span> เพิ่ม Forklift ใหม่
        </Link>
      </div>

      <div className="bg-[#111729] border border-orange-500/10 rounded-xl overflow-hidden shadow-sm">
        {forklifts.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <div className="text-4xl mb-3">🏗️</div>
            <div className="text-base font-semibold text-slate-400">ยังไม่มีข้อมูล Forklift</div>
            <p className="text-xs text-slate-500 mt-1">เพิ่มรถ Forklift คันแรกเพื่อเริ่มระบบแจ้งเตือน</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-white/5 text-xs uppercase font-semibold text-slate-400 border-b border-white/5">
                <tr>
                  <th className="px-6 py-4">รหัสรถ / ยี่ห้อรุ่น</th>
                  <th className="px-6 py-4">ลูกค้า / เจ้าของ</th>
                  <th className="px-6 py-4">ประเภทพลังงาน</th>
                  <th className="px-6 py-4">ชั่วโมงปัจจุบัน</th>
                  <th className="px-6 py-4">รอบซ่อมถัดไป</th>
                  <th className="px-6 py-4 text-center">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {forklifts.map((f) => {
                  const isOverdue = f.status === 'OVERDUE';
                  const isWarning = f.status === 'WARNING';
                  return (
                    <tr key={f.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-white text-base">{f.code}</div>
                        <div className="text-xs text-slate-400">{[f.brand, f.model].filter(Boolean).join(' ') || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-200">{f.customer?.name}</div>
                        {f.customer?.company && <div className="text-xs text-slate-400">{f.customer.company}</div>}
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <span className="px-2.5 py-1 bg-white/5 rounded-md border border-white/10 text-slate-300">
                          {f.fuelType === 'GAS' ? '🔥 แก๊ส LPG' : f.fuelType === 'DIESEL' ? '⛽ ดีเซล' : f.fuelType === 'ELECTRIC' ? '⚡ ไฟฟ้า' : 'ทั่วไป'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-mono font-bold text-white text-base">{f.hoursCurrent.toLocaleString()} ชม.</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-mono text-slate-300">{f.hoursNextService.toLocaleString()} ชม.</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            isOverdue
                              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                              : isWarning
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {isOverdue ? '🚨 เกินกำหนด' : isWarning ? '⏳ ใกล้ถึงรอบ' : '✓ ปกติ'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
