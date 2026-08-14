import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ForkliftStatus } from '@prisma/client';

function calculateStatus(hoursCurrent: number, hoursNextService: number): ForkliftStatus {
  if (hoursCurrent >= hoursNextService) return 'OVERDUE';
  if (hoursCurrent >= hoursNextService - 50) return 'WARNING';
  return 'NORMAL';
}

export async function GET() {
  try {
    const forklifts = await prisma.ftForklift.findMany({
      include: {
        customer: true,
      },
      orderBy: [
        { status: 'asc' },
        { createdAt: 'desc' },
      ],
    });
    return NextResponse.json(forklifts);
  } catch (error) {
    console.error('Error fetching forklifts:', error);
    return NextResponse.json({ error: 'Failed to fetch forklifts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerId,
      code,
      brand,
      model,
      serialNumber,
      fuelType,
      hoursCurrent = 0,
      hoursNextService = 250,
      notes,
    } = body;

    if (!customerId || !code) {
      return NextResponse.json({ error: 'Customer ID and Forklift Code are required' }, { status: 400 });
    }

    const currentH = Number(hoursCurrent) || 0;
    const nextH = Number(hoursNextService) || 250;
    const status = calculateStatus(currentH, nextH);

    const forklift = await prisma.ftForklift.create({
      data: {
        customerId,
        code,
        brand,
        model,
        serialNumber,
        fuelType,
        hoursCurrent: currentH,
        hoursNextService: nextH,
        status,
        notes,
      },
    });

    if (status === 'WARNING' || status === 'OVERDUE') {
      await prisma.ftMaintenanceAlert.create({
        data: {
          forkliftId: forklift.id,
          alertType: 'OIL_CHANGE',
          dueHours: nextH,
          message: `Forklift ${code} มีชั่วโมงการใช้งาน ${currentH} ชม. (${status === 'OVERDUE' ? 'เกินกำหนด' : 'ใกล้ถึงรอบ'})`,
        },
      });
    }

    return NextResponse.json(forklift, { status: 201 });
  } catch (error) {
    console.error('Error creating forklift:', error);
    return NextResponse.json({ error: 'Failed to create forklift' }, { status: 500 });
  }
}
