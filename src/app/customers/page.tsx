import Link from 'next/link';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function CustomersPage() {
  let customers: any[] = [];
  try {
    customers = await prisma.ftCustomer.findMany({
      include: {
        _count: {
          select: { forklifts: true, repairJobs: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (err) {
    console.warn('Database error or not connected yet');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">รายชื่อลูกค้า (Customers)</h1>
          <p className="text-sm text-slate-400 mt-1">จัดการข้อมูลลูกค้าและผู้ดูแลรถ Forklift</p>
        </div>
        <Link
          href="/customers/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff6b2b] hover:bg-[#ff8c54] text-white text-sm font-semibold rounded-lg shadow-lg shadow-orange-500/20 transition-all"
        >
          <span>+</span> เพิ่มลูกค้าใหม่
        </Link>
      </div>

      <div className="bg-[#111729] border border-orange-500/10 rounded-xl overflow-hidden shadow-sm">
        {customers.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <div className="text-4xl mb-3">👥</div>
            <div className="text-base font-semibold text-slate-400">ยังไม่มีรายชื่อลูกค้า</div>
            <p className="text-xs text-slate-500 mt-1">เริ่มต้นด้วยการเพิ่มลูกค้าคนแรกของคุณ</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-white/5 text-xs uppercase font-semibold text-slate-400 border-b border-white/5">
                <tr>
                  <th className="px-6 py-4">ชื่อลูกค้า / บริษัท</th>
                  <th className="px-6 py-4">เบอร์โทรศัพท์</th>
                  <th className="px-6 py-4">LINE ID</th>
                  <th className="px-6 py-4 text-center">จำนวน Forklift</th>
                  <th className="px-6 py-4">วันที่บันทึก</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{c.name}</div>
                      {c.company && <div className="text-xs text-slate-400">{c.company}</div>}
                    </td>
                    <td className="px-6 py-4">{c.phone || '-'}</td>
                    <td className="px-6 py-4">
                      {c.lineId ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs">
                          💬 {c.lineId}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-bold text-orange-400">{c._count?.forklifts || 0}</span> คัน
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(c.createdAt).toLocaleDateString('th-TH')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
