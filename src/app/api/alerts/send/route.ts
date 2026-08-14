import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendMaintenanceAlert } from '@/lib/line';

export async function POST() {
  try {
    const pendingAlerts = await prisma.ftMaintenanceAlert.findMany({
      where: {
        status: 'PENDING',
      },
      include: {
        forklift: {
          include: {
            customer: true,
          },
        },
      },
    });

    let sentCount = 0;
    let skippedCount = 0;

    for (const alert of pendingAlerts) {
      const customer = alert.forklift.customer;
      const lineUserId = customer.lineUserId;

      if (lineUserId) {
        await sendMaintenanceAlert(
          customer.name,
          alert.forklift.code,
          alert.forklift.brand,
          alert.forklift.model,
          alert.forklift.hoursCurrent,
          lineUserId
        );

        await prisma.ftMaintenanceAlert.update({
          where: { id: alert.id },
          data: {
            status: 'SENT',
            sentAt: new Date(),
          },
        });
        sentCount++;
      } else {
        skippedCount++;
      }
    }

    return NextResponse.json({
      message: `ส่งการแจ้งเตือนสำเร็จ ${sentCount} รายการ (ข้าม ${skippedCount} รายการที่ไม่มี LINE User ID)`,
      sentCount,
      skippedCount,
    });
  } catch (error) {
    console.error('Error sending alerts:', error);
    return NextResponse.json({ error: 'Failed to send alerts' }, { status: 500 });
  }
}
