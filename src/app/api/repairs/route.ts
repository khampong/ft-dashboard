import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const repairs = await prisma.ftRepairJob.findMany({
      include: {
        forklift: true,
        customer: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });
    return NextResponse.json(repairs);
  } catch (error) {
    console.error('Error fetching repair jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch repair jobs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      forkliftId,
      type = 'OIL_CHANGE',
      description,
      hoursAtService,
      cost,
      technicianName,
      status = 'PENDING',
      invoiceId,
    } = body;

    if (!forkliftId) {
      return NextResponse.json({ error: 'Forklift ID is required' }, { status: 400 });
    }

    const forklift = await prisma.ftForklift.findUnique({
      where: { id: forkliftId },
    });

    if (!forklift) {
      return NextResponse.json({ error: 'Forklift not found' }, { status: 404 });
    }

    const repair = await prisma.ftRepairJob.create({
      data: {
        forkliftId,
        customerId: forklift.customerId,
        type,
        description,
        hoursAtService: hoursAtService ? Number(hoursAtService) : forklift.hoursCurrent,
        cost: cost ? Number(cost) : null,
        technicianName,
        status,
        invoiceId,
        completedAt: status === 'COMPLETED' ? new Date() : null,
      },
    });

    // If completed and oil change, advance the next service hours
    if (status === 'COMPLETED' && type === 'OIL_CHANGE') {
      const serviceH = hoursAtService ? Number(hoursAtService) : forklift.hoursCurrent;
      await prisma.ftForklift.update({
        where: { id: forkliftId },
        data: {
          hoursNextService: serviceH + 250,
          status: 'NORMAL',
        },
      });
    }

    return NextResponse.json(repair, { status: 201 });
  } catch (error) {
    console.error('Error creating repair job:', error);
    return NextResponse.json({ error: 'Failed to create repair job' }, { status: 500 });
  }
}
