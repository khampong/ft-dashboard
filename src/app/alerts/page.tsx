import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AlertsPage() {
  let alerts: any[] = [];
  try {
    alerts = await prisma.ftMaintenanceAlert.findMany({
      include: {
        forklift: {
          include: { customer: true },
        },
      },
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
          <h1 className="text-2xl font-bold text-white tracking-tight">การแจ้งเตือน LINE (Maintenance Alerts)</h1>
          <p className="text-sm text-slate-400 mt-1">คิวข้อความแจ้งเตือนรอบซ่อมบำรุงที่ส่งไปยัง LINE ของลูกค้า</p>
        </div>
      </div>

      <div className="bg-[#111729] border border-orange-500/10 rounded-xl overflow-hidden shadow-sm">
        {alerts.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <div className="text-4xl mb-3">🔔</div>
            <div className="text-base font-semibold text-slate-400">ไม่มีคิวการแจ้งเตือน</div>
            <p className="text-xs text-slate-500 mt-1">เมื่อ Forklift ถึงรอบหรือใกล้ถึงรอบ ระบบจะสร้างการแจ้งเตือนให้อัตโนมัติ</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-white/5 text-xs uppercase font-semibold text-slate-400 border-b border-white/5">
                <tr>
                  <th className="px-6 py-4">วันที่สร้าง</th>
                  <th className="px-6 py-4">รถ Forklift</th>
                  <th className="px-6 py-4">ลูกค้าผู้รับ</th>
                  <th className="px-6 py-4">ข้อความแจ้งเตือน</th>
                  <th className="px-6 py-4 text-center">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {alerts.map((a) => {
                  const isSent = a.status === 'SENT';
                  return (
                    <tr key={a.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 text-xs text-slate-400">
                        {new Date(a.createdAt).toLocaleDateString('th-TH')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-white">{a.forklift?.code}</div>
                        <div className="text-xs text-slate-400">{a.forklift?.brand} {a.forklift?.model}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-200">{a.forklift?.customer?.name}</div>
                        <div className="text-xs text-emerald-400">{a.forklift?.customer?.lineId ? `💬 ${a.forklift.customer.lineId}` : 'ไม่มี LINE'}</div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-300 max-w-sm">
                        {a.message || 'แจ้งเตือนรอบซ่อมบำรุง'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            isSent
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {isSent ? '✓ ส่งแล้ว' : '● รอดำเนินการ'}
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
