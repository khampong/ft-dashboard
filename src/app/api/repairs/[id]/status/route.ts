import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: 'status is required' }, { status: 400 });
    }

    const existing = await prisma.ftRepairJob.findUnique({
      where: { id },
      include: { forklift: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Repair job not found' }, { status: 404 });
    }

    const completedAt = status === 'COMPLETED' ? new Date() : null;

    const updated = await prisma.ftRepairJob.update({
      where: { id },
      data: {
        status,
        completedAt: completedAt || existing.completedAt,
      },
    });

    // If marked completed and oil change, update forklift next service
    if (status === 'COMPLETED' && existing.type === 'OIL_CHANGE' && existing.forklift) {
      const serviceH = existing.hoursAtService || existing.forklift.hoursCurrent;
      await prisma.ftForklift.update({
        where: { id: existing.forkliftId },
        data: {
          hoursNextService: serviceH + 250,
          status: 'NORMAL',
        },
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating repair status:', error);
    return NextResponse.json({ error: 'Failed to update repair status' }, { status: 500 });
  }
}
