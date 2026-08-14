# 📋 ForkTech Group — Project Log & Feature Documentation

> **บันทึกสถานะโปรเจกต์**  
> วันที่: 14 สิงหาคม 2024 (อัพเดตล่าสุด)  
> ผู้ดูแล: Sakda K. (khampong.s@gmail.com)

---

## 🏢 Business Model & Concept
- **ธุรกิจหลัก**: บริการซ่อมบำรุง Forklift (เปลี่ยนถ่ายน้ำมันเครื่อง, ซ่อมเครื่องยนต์, ยกรถซ่อมอู่, ตรวจเช็คตามรอบ)
- **กลยุทธ์การตลาด (Concierge Care)**: ให้บริการ **ระบบติดตามรอบซ่อมและแจ้งเตือนผ่าน LINE ฟรี 100%** สำหรับลูกค้า/โรงงาน
- **Customer Journey**:
  1. ลูกค้าส่งรายชื่อรถ (ทะเบียน/รุ่น/ชั่วโมง) มาทาง LINE OA
  2. แอดมินลงทะเบียนรถในระบบ Dashboard
  3. ระบบติดตามชั่วโมงและส่งแจ้งเตือนผ่าน LINE เมื่อถึงรอบ
  4. ลูกค้ากดปุ่มโทรนัดหมายช่าง ForkTech เข้าไปให้บริการ

---

## 📂 รายละเอียด Repositories & Architecture

```
┌────────────────────────────────────────────────────────┐
│               PostgreSQL Database (Render)             │
│                                                        │
│  [ตารางเดิม - ระบบบัญชี Go]     [ตารางใหม่ - ft_*]     │
│  • invoices                  • ft_customers            │
│  • (billing tables)          • ft_forklifts            │
│                              • ft_repair_jobs          │
│                              • ft_maintenance_alerts   │
└───────────────┬────────────────────────┬───────────────┘
                │                        │
         ┌──────▼──────┐          ┌──────▼──────┐
         │ ระบบบัญชี Go │          │ ft-dashboard│
         │  Render.com │          │ Next.js 14  │
         └─────────────┘          └─────────────┘
                                         │
┌─────────────────────────┐              │ (LINE Push)
│     ft-landing-page     │              ▼
│  (Static HTML / Vercel) │       ┌─────────────┐
│    forktechgroup.com    │       │ LINE API    │
└─────────────────────────┘       └─────────────┘
```

---

## 1. 🌐 Landing Page (`ft-landing-page`)
- **Repository**: [https://github.com/khampong/ft-landing-page.git](https://github.com/khampong/ft-landing-page.git)
- **Local Path**: `/Users/sakda/Documents/forktech/ft-landingpage`
- **Tech Stack**: Pure HTML5, CSS3 (Glassmorphism & Industrial Orange Dark Theme), Vanilla JS
- **สถานะ**: Deploy Ready บน Vercel

### ✨ Features ที่ทำแล้ว:
- [x] **Hero Section**: ชูจุดเด่น "ดูแล Forklift ของคุณให้เราจัดการ ฟรี ไม่มีค่าใช้จ่าย"
- [x] **Live Interactive Mockup**: การ์ดแสดงสถานะรถ (ปกติ, ใกล้ถึงรอบ, เกินกำหนด) พร้อมตัวอย่างปุ่มนัดช่าง LINE
- [x] **CTA Focus**: เปลี่ยนจากขอใบเสนอราคาเป็น **"💬 ส่งข้อมูลผ่าน LINE"** และโทรติดต่อ
- [x] **How It Works (4 ขั้นตอน)**: ส่งข้อมูล → เราลงทะเบียนให้ → แจ้งเตือนผ่าน LINE → โทรนัดช่าง
- [x] **Services List**: 6 บริการ (เปลี่ยนถ่ายน้ำมัน, ซ่อมเครื่อง, ยกรถกลับซ่อม, อะไหล่, ตรวจเช็ค, แจ้งเตือนฟรี)
- [x] **Why Us**: จุดเด่นเรื่องช่างเฉพาะทาง Forklift และสถิติประสบการณ์
- [x] **SEO & Responsive**: รองรับมือถือ 100%, Micro-animations เมื่อ Scroll

---

## 2. 🎛️ ระบบหลังบ้าน (`ft-dashboard`)
- **Repository**: [https://github.com/khampong/ft-dashboard.git](https://github.com/khampong/ft-dashboard.git)
- **Local Path**: `/Users/sakda/Documents/forktech/ft-dashboard`
- **Tech Stack**: Next.js 14 (App Router), TypeScript, Prisma ORM, Tailwind CSS, LINE Messaging API
- **สถานะ**: Build ผ่าน 100% พร้อมเชื่อม Database

### 🗄️ โครงสร้างฐานข้อมูล (Prisma Models - Prefix `ft_`):
1. **`ft_customers`**: เก็บข้อมูลลูกค้า, เบอร์ติดต่อ, LINE ID, LINE User ID, notes
2. **`ft_forklifts`**: รหัสรถ (Code), ยี่ห้อ, รุ่น, ประเภทเชื้อเพลิง (Gas, Diesel, Electric), ชั่วโมงปัจจุบัน, รอบซ่อมถัดไป, สถานะ (`NORMAL`, `WARNING`, `OVERDUE`)
3. **`ft_repair_jobs`**: บันทึกงานซ่อม, ช่างผู้รับผิดชอบ, ชั่วโมงตอนซ่อม, สถานะ (`PENDING`, `IN_PROGRESS`, `COMPLETED`), `invoice_id` (สำหรับเชื่อมกับระบบบัญชี Go ในอนาคต)
4. **`ft_maintenance_alerts`**: คิวและประวัติการส่งแจ้งเตือน LINE

### 🖥️ หน้า UI & Features ที่ทำแล้ว:
- [x] **Dashboard Overview (`/`)**:
  - การ์ดสถิติ 4 ตัว: ลูกค้าทั้งหมด, Forklift ทั้งหมด, รถที่เกินรอบ (🚨 สีแดง), รถที่ใกล้ถึงรอบ (⏳ สีส้ม)
  - รายการ Forklift ที่ต้องดูแลเร่งด่วน (Urgent List)
  - ประวัติงานซ่อม 5 รายการล่าสุด
- [x] **จัดการลูกค้า (`/customers` & `/customers/new`)**:
  - รายชื่อลูกค้าทั้งหมด + จำนวน Forklift ที่ครอบครอง
  - ฟอร์มลงทะเบียนลูกค้าใหม่ พร้อมเก็บ LINE ID / LINE User ID
- [x] **จัดการ Forklift (`/forklifts` & `/forklifts/new`)**:
  - ตารางแสดงสถานะรถ (ปกติ, ใกล้ถึงรอบ, เกินรอบ)
  - ฟอร์มเพิ่มรถใหม่: เลือกเจ้าของ, ใส่ยี่ห้อ/รุ่น, ชั่วโมงใช้งาน, กำหนดรอบบริการ
  - ระบบคำนวณสถานะอัตโนมัติ (เกินรอบเมื่อ `hoursCurrent >= hoursNextService`, เตือนเมื่อเหลือ < 50 ชม.)
- [x] **งานซ่อมบำรุง (`/repairs` & `/repairs/new`)**:
  - บันทึกงานซ่อมใหม่ (เปลี่ยนถ่ายน้ำมัน, ซ่อมเครื่อง, ยกรถ ฯลฯ)
  - **Auto Next Service Logic**: เมื่องานเปลี่ยนถ่ายน้ำมันเสร็จสิ้น (`COMPLETED`) ระบบจะขยับรอบซ่อมถัดไป `+250 ชม.` และรีเซ็ตสถานะรถเป็น `NORMAL` ให้อัตโนมัติ
- [x] **การแจ้งเตือน (`/alerts`)**:
  - ตารางแสดงคิวแจ้งเตือนและสถานะการส่ง (Pending / Sent)

### 🔌 API Routes ที่สร้างแล้ว:
- `GET/POST /api/customers` — ดูและเพิ่มลูกค้า
- `GET/POST /api/forklifts` — ดูและเพิ่มรถ Forklift
- `PATCH /api/forklifts/[id]/hours` — อัพเดตชั่วโมงหน้าปัดรถ (สร้าง Alert อัตโนมัติเมื่อสถานะเปลี่ยนเป็น Warning/Overdue)
- `GET/POST /api/repairs` — ดูและบันทึกงานซ่อม
- `PATCH /api/repairs/[id]/status` — อัพเดตสถานะงานซ่อม
- `GET /api/alerts` — ดึงคิวการแจ้งเตือน
- `POST /api/alerts/send` — Trigger ยิง LINE Push Notification หาคิวที่ค้างอยู่
- `GET /api/dashboard/stats` — รวมข้อมูลสถิติภาพรวม

---

## 🎯 แผนงานสำหรับครั้งถัดไป (Next Steps / Backlog)

### 1. การเชื่อมต่อจริง (Database & Env):
- [ ] นำ `DATABASE_URL` จาก Render PostgreSQL มาใส่ใน `.env` ของ `ft-dashboard`
- [ ] รัน `npx prisma db push` เพื่อสร้างตาราง `ft_*` ในฐานข้อมูลจริง

### 2. LINE Messaging API Integration:
- [ ] สมัคร LINE Official Account + LINE Developers Console
- [ ] นำ `LINE_CHANNEL_ACCESS_TOKEN` ใส่ใน `.env`
- [ ] ทำ Rich Menu หรือ LINE Webhook รับ Event เมื่อลูกค้า Add Friend เพื่อดึง `lineUserId` อัตโนมัติ

### 3. เชื่อมต่อระบบบัญชี Go:
- [ ] เชื่อมโยง `ft_repair_jobs.invoice_id` เข้ากับระบบเปิดบิลของ Go
- [ ] ทำปุ่ม "เปิดบิลในระบบบัญชี" จากหน้ารายละเอียดงานซ่อม

### 4. ฟีเจอร์เพิ่มเติมที่น่าสนใจ:
- [ ] ระบบค้นหาและตัวกรอง (Filter) ในหน้าลูกค้าและ Forklift
- [ ] ปฏิทินนัดหมายช่าง (Maintenance Schedule Calendar)
- [ ] ส่งข้อความสรุปรายงานประจำเดือนให้ลูกค้าผ่าน LINE
