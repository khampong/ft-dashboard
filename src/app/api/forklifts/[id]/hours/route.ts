import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ForkliftStatus } from '@prisma/client';

function calculateStatus(hoursCurrent: number, hoursNextService: number): ForkliftStatus {
  if (hoursCurrent >= hoursNextService) return 'OVERDUE';
  if (hoursCurrent >= hoursNextService - 50) return 'WARNING';
  return 'NORMAL';
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { hoursCurrent } = body;

    if (hoursCurrent === undefined) {
      return NextResponse.json({ error: 'hoursCurrent is required' }, { status: 400 });
    }

    const current = await prisma.ftForklift.findUnique({
      where: { id },
    });

    if (!current) {
      return NextResponse.json({ error: 'Forklift not found' }, { status: 404 });
    }

    const currentH = Number(hoursCurrent);
    const newStatus = calculateStatus(currentH, current.hoursNextService);

    const updated = await prisma.ftForklift.update({
      where: { id },
      data: {
        hoursCurrent: currentH,
        status: newStatus,
      },
    });

    // Create alert if status degraded to warning or overdue
    if ((newStatus === 'WARNING' || newStatus === 'OVERDUE') && current.status === 'NORMAL') {
      await prisma.ftMaintenanceAlert.create({
        data: {
          forkliftId: id,
          alertType: 'OIL_CHANGE',
          dueHours: current.hoursNextService,
          message: `Forklift ${current.code} อัพเดตชั่วโมงเป็น ${currentH} ชม. (${newStatus === 'OVERDUE' ? 'เกินกำหนด' : 'ใกล้ถึงรอบ'})`,
        },
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating forklift hours:', error);
    return NextResponse.json({ error: 'Failed to update hours' }, { status: 500 });
  }
}
