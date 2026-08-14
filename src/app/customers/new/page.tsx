'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewCustomerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    lineId: '',
    lineUserId: '',
    email: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('กรุณากรอกชื่อลูกค้า');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to create customer');
      router.push('/customers');
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
        <Link href="/customers" className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mb-2">
          ← ย้อนกลับ
        </Link>
        <h1 className="text-2xl font-bold text-white tracking-tight">เพิ่มลูกค้าใหม่</h1>
        <p className="text-sm text-slate-400 mt-1">กรอกข้อมูลผู้ติดต่อหรือชื่อบริษัทเพื่อเริ่มติดตามรถ Forklift</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#111729] border border-orange-500/10 rounded-xl p-6 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            ชื่อผู้ติดต่อ / ชื่อเล่น <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="เช่น คุณสมศักดิ์ หรือ หัวหน้าช่างโรงงาน A"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2.5 bg-black/30 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              ชื่อบริษัท / โรงงาน
            </label>
            <input
              type="text"
              placeholder="เช่น บจก. สยาม โลจิสติกส์"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-4 py-2.5 bg-black/30 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              เบอร์โทรศัพท์
            </label>
            <input
              type="text"
              placeholder="08x-xxx-xxxx"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2.5 bg-black/30 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              LINE ID
            </label>
            <input
              type="text"
              placeholder="เช่น @customerline"
              value={formData.lineId}
              onChange={(e) => setFormData({ ...formData, lineId: e.target.value })}
              className="w-full px-4 py-2.5 bg-black/30 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              LINE User ID (สำหรับ API Push)
            </label>
            <input
              type="text"
              placeholder="Uxxxxxxxxxxxx"
              value={formData.lineUserId}
              onChange={(e) => setFormData({ ...formData, lineUserId: e.target.value })}
              className="w-full px-4 py-2.5 bg-black/30 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            อีเมล
          </label>
          <input
            type="email"
            placeholder="contact@company.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2.5 bg-black/30 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            บันทึกเพิ่มเติม (Notes)
          </label>
          <textarea
            rows={3}
            placeholder="รายละเอียดที่ตั้งโรงงาน แผนกจัดซื้อ ฯลฯ"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-4 py-2.5 bg-black/30 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-sm"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
          <Link
            href="/customers"
            className="px-4 py-2 bg-transparent hover:bg-white/5 text-slate-300 text-sm font-medium rounded-lg transition-colors"
          >
            ยกเลิก
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-[#ff6b2b] hover:bg-[#ff8c54] text-white text-sm font-semibold rounded-lg shadow-lg shadow-orange-500/20 disabled:opacity-50 transition-all"
          >
            {loading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
          </button>
        </div>
      </form>
    </div>
  );
}
