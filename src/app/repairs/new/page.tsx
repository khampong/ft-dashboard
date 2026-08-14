'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewRepairPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [forklifts, setForklifts] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    forkliftId: '',
    type: 'OIL_CHANGE',
    description: '',
    hoursAtService: 0,
    cost: '',
    technicianName: '',
    status: 'COMPLETED',
  });

  useEffect(() => {
    fetch('/api/forklifts')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setForklifts(data);
          if (data.length > 0) {
            setFormData((prev) => ({
              ...prev,
              forkliftId: data[0].id,
              hoursAtService: data[0].hoursCurrent || 0,
            }));
          }
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleForkliftChange = (id: string) => {
    const selected = forklifts.find((f) => f.id === id);
    setFormData((prev) => ({
      ...prev,
      forkliftId: id,
      hoursAtService: selected?.hoursCurrent || 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.forkliftId) {
      alert('กรุณาเลือกรถ Forklift');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/repairs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to create repair job');
      router.push('/repairs');
      router.refresh();
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/repairs" className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mb-2">
          ← ย้อนกลับ
        </Link>
        <h1 className="text-2xl font-bold text-white tracking-tight">บันทึกงานซ่อมใหม่</h1>
        <p className="text-sm text-slate-400 mt-1">บันทึกประวัติการเปลี่ยนถ่ายน้ำมัน ซ่อมเครื่องยนต์ หรือตรวจเช็คสภาพ</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#111729] border border-orange-500/10 rounded-xl p-6 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            เลือกรถ Forklift <span className="text-red-400">*</span>
          </label>
          {forklifts.length === 0 ? (
            <div className="text-sm text-amber-400 bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg flex items-center justify-between">
              <span>ยังไม่มีข้อมูลรถ Forklift ในระบบ</span>
              <Link href="/forklifts/new" className="text-xs underline font-bold">
                + เพิ่มรถก่อน
              </Link>
            </div>
          ) : (
            <select
              required
              value={formData.forkliftId}
              onChange={(e) => handleForkliftChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-black/30 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500 text-sm"
            >
              {forklifts.map((f) => (
                <option key={f.id} value={f.id} className="bg-slate-900 text-white">
                  {f.code} — {f.brand} {f.model} ({f.customer?.name})
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              ประเภทงานบริการ
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2.5 bg-black/30 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500 text-sm"
            >
              <option value="OIL_CHANGE" className="bg-slate-900">🛢️ เปลี่ยนถ่ายน้ำมันเครื่อง (+250 ชม. อัตโนมัติ)</option>
              <option value="ENGINE_REPAIR" className="bg-slate-900">⚙️ ซ่อมเครื่องยนต์</option>
              <option value="TOWING" className="bg-slate-900">🚛 ยกรถกลับซ่อมอู่</option>
              <option value="PARTS_REPLACEMENT" className="bg-slate-900">🔩 เปลี่ยนอะไหล่</option>
              <option value="INSPECTION" className="bg-slate-900">🔍 ตรวจเช็คสภาพประจำรอบ</option>
              <option value="OTHER" className="bg-slate-900">📝 อื่นๆ</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              ชั่วโมงหน้าปัดตอนซ่อม (ชม.)
            </label>
            <input
              type="number"
              min={0}
              placeholder="0"
              value={formData.hoursAtService}
              onChange={(e) => setFormData({ ...formData, hoursAtService: Number(e.target.value) })}
              className="w-full px-4 py-2.5 bg-black/30 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500 text-sm font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              ชื่อช่างผู้ดำเนินการ
            </label>
            <input
              type="text"
              placeholder="เช่น ช่างเอก หรือ ทีมช่างโมบาย"
              value={formData.technicianName}
              onChange={(e) => setFormData({ ...formData, technicianName: e.target.value })}
              className="w-full px-4 py-2.5 bg-black/30 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              สถานะงาน
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2.5 bg-black/30 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500 text-sm"
            >
              <option value="COMPLETED" className="bg-slate-900">✓ เสร็จสิ้นแล้ว (Completed)</option>
              <option value="IN_PROGRESS" className="bg-slate-900">⏳ กำลังดำเนินการ</option>
              <option value="PENDING" className="bg-slate-900">● รอดำเนินการ</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            รายละเอียดงาน / อะไหล่ที่เปลี่ยน
          </label>
          <textarea
            rows={3}
            placeholder="เช่น เปลี่ยนน้ำมันเครื่อง 15W-40, กรองน้ำมันเครื่อง, กรองอากาศ"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2.5 bg-black/30 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-sm"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
          <Link
            href="/repairs"
            className="px-4 py-2 bg-transparent hover:bg-white/5 text-slate-300 text-sm font-medium rounded-lg transition-colors"
          >
            ยกเลิก
          </Link>
          <button
            type="submit"
            disabled={loading || forklifts.length === 0}
            className="px-6 py-2 bg-[#ff6b2b] hover:bg-[#ff8c54] text-white text-sm font-semibold rounded-lg shadow-lg shadow-orange-500/20 disabled:opacity-50 transition-all"
          >
            {loading ? 'กำลังบันทึก...' : 'บันทึกงานซ่อม'}
          </button>
        </div>
      </form>
    </div>
  );
}
