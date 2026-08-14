'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewForkliftPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    customerId: '',
    code: '',
    brand: 'Toyota',
    model: '',
    serialNumber: '',
    fuelType: 'DIESEL',
    hoursCurrent: 0,
    hoursNextService: 250,
    notes: '',
  });

  useEffect(() => {
    fetch('/api/customers')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCustomers(data);
          if (data.length > 0) {
            setFormData((prev) => ({ ...prev, customerId: data[0].id }));
          }
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerId) {
      alert('กรุณาเลือกลูกค้า หรือเพิ่มลูกค้าก่อน');
      return;
    }
    if (!formData.code.trim()) {
      alert('กรุณาระบุรหัสรถ Forklift');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/forklifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to create forklift');
      router.push('/forklifts');
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
        <Link href="/forklifts" className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mb-2">
          ← ย้อนกลับ
        </Link>
        <h1 className="text-2xl font-bold text-white tracking-tight">เพิ่ม Forklift ใหม่</h1>
        <p className="text-sm text-slate-400 mt-1">ลงทะเบียนรถคันใหม่เพื่อคำนวณและแจ้งเตือนรอบบำรุงรักษา</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#111729] border border-orange-500/10 rounded-xl p-6 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            เลือกลูกค้า / บริษัทเจ้าของ <span className="text-red-400">*</span>
          </label>
          {customers.length === 0 ? (
            <div className="text-sm text-amber-400 bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg flex items-center justify-between">
              <span>ยังไม่มีข้อมูลลูกค้าในระบบ</span>
              <Link href="/customers/new" className="text-xs underline font-bold">
                + เพิ่มลูกค้าก่อน
              </Link>
            </div>
          ) : (
            <select
              required
              value={formData.customerId}
              onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
              className="w-full px-4 py-2.5 bg-black/30 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500 text-sm"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                  {c.name} {c.company ? `(${c.company})` : ''}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              รหัสรถ / ทะเบียน <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="เช่น FL-001 หรือ 8F-30"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full px-4 py-2.5 bg-black/30 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              ยี่ห้อ (Brand)
            </label>
            <input
              type="text"
              placeholder="Toyota, Komatsu, Mitsubishi ฯลฯ"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full px-4 py-2.5 bg-black/30 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              รุ่น (Model)
            </label>
            <input
              type="text"
              placeholder="เช่น 8FG30 หรือ FD25"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="w-full px-4 py-2.5 bg-black/30 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              ประเภทพลังงาน
            </label>
            <select
              value={formData.fuelType}
              onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
              className="w-full px-4 py-2.5 bg-black/30 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500 text-sm"
            >
              <option value="DIESEL" className="bg-slate-900">ดีเซล (Diesel)</option>
              <option value="GAS" className="bg-slate-900">แก๊ส LPG</option>
              <option value="ELECTRIC" className="bg-slate-900">ไฟฟ้า (Electric)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              ชั่วโมงใช้งานปัจจุบัน (ชม.)
            </label>
            <input
              type="number"
              min={0}
              placeholder="0"
              value={formData.hoursCurrent}
              onChange={(e) => setFormData({ ...formData, hoursCurrent: Number(e.target.value) })}
              className="w-full px-4 py-2.5 bg-black/30 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500 text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              รอบซ่อมบำรุงถัดไป (ชม.)
            </label>
            <input
              type="number"
              min={1}
              placeholder="250"
              value={formData.hoursNextService}
              onChange={(e) => setFormData({ ...formData, hoursNextService: Number(e.target.value) })}
              className="w-full px-4 py-2.5 bg-black/30 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500 text-sm font-mono"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
          <Link
            href="/forklifts"
            className="px-4 py-2 bg-transparent hover:bg-white/5 text-slate-300 text-sm font-medium rounded-lg transition-colors"
          >
            ยกเลิก
          </Link>
          <button
            type="submit"
            disabled={loading || customers.length === 0}
            className="px-6 py-2 bg-[#ff6b2b] hover:bg-[#ff8c54] text-white text-sm font-semibold rounded-lg shadow-lg shadow-orange-500/20 disabled:opacity-50 transition-all"
          >
            {loading ? 'กำลังบันทึก...' : 'บันทึกข้อมูลรถ'}
          </button>
        </div>
      </form>
    </div>
  );
}
