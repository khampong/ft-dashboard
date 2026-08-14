import Link from 'next/link';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function RepairsPage() {
  let repairs: any[] = [];
  try {
    repairs = await prisma.ftRepairJob.findMany({
      include: { forklift: true, customer: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  } catch (err) {
    console.warn('Database error or not connected yet');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">บันทึกงานซ่อมบำรุง (Repair Jobs)</h1>
          <p className="text-sm text-slate-400 mt-1">ประวัติการเปลี่ยนถ่ายน้ำมัน ซ่อมเครื่อง และงานบริการทั้งหมด</p>
        </div>
        <Link
          href="/repairs/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff6b2b] hover:bg-[#ff8c54] text-white text-sm font-semibold rounded-lg shadow-lg shadow-orange-500/20 transition-all"
        >
          <span>+</span> บันทึกงานซ่อมใหม่
        </Link>
      </div>

      <div className="bg-[#111729] border border-orange-500/10 rounded-xl overflow-hidden shadow-sm">
        {repairs.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <div className="text-4xl mb-3">🛠️</div>
            <div className="text-base font-semibold text-slate-400">ยังไม่มีประวัติงานซ่อม</div>
            <p className="text-xs text-slate-500 mt-1">บันทึกงานซ่อมแรกเพื่อเก็บประวัติและต่อรอบระยะบริการอัตโนมัติ</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-white/5 text-xs uppercase font-semibold text-slate-400 border-b border-white/5">
                <tr>
                  <th className="px-6 py-4">วันที่ / เวลา</th>
                  <th className="px-6 py-4">รถ Forklift</th>
                  <th className="px-6 py-4">ประเภทงาน</th>
                  <th className="px-6 py-4">รายละเอียด</th>
                  <th className="px-6 py-4">ช่างผู้รับผิดชอบ</th>
                  <th className="px-6 py-4 text-center">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {repairs.map((r) => {
                  const isDone = r.status === 'COMPLETED';
                  const inProgress = r.status === 'IN_PROGRESS';
                  return (
                    <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 text-xs text-slate-400">
                        {new Date(r.createdAt).toLocaleDateString('th-TH')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-white">{r.forklift?.code}</div>
                        <div className="text-xs text-slate-400">{r.customer?.name}</div>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold">
                        <span className="px-2.5 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-md">
                          {r.type === 'OIL_CHANGE' ? '🛢️ เปลี่ยนถ่ายน้ำมัน' : r.type === 'ENGINE_REPAIR' ? '⚙️ ซ่อมเครื่อง' : r.type === 'TOWING' ? '🚛 ยกรถกลับ' : r.type === 'PARTS_REPLACEMENT' ? '🔩 เปลี่ยนอะไหล่' : '🔍 ตรวจเช็ค'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-300 max-w-xs truncate">
                        {r.description || '-'}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">
                        {r.technicianName || '-'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            isDone
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : inProgress
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {isDone ? '✓ เสร็จสิ้น' : inProgress ? '⏳ กำลังซ่อม' : '● รอดำเนินการ'}
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
