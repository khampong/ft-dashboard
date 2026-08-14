import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const [
      totalCustomers,
      totalForklifts,
      overdueCount,
      warningCount,
      pendingAlerts,
      recentJobs,
      urgentForklifts,
    ] = await Promise.all([
      prisma.ftCustomer.count(),
      prisma.ftForklift.count(),
      prisma.ftForklift.count({ where: { status: 'OVERDUE' } }),
      prisma.ftForklift.count({ where: { status: 'WARNING' } }),
      prisma.ftMaintenanceAlert.count({ where: { status: 'PENDING' } }),
      prisma.ftRepairJob.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { forklift: true, customer: true },
      }),
      prisma.ftForklift.findMany({
        where: {
          status: { in: ['OVERDUE', 'WARNING'] },
        },
        take: 10,
        orderBy: { hoursCurrent: 'desc' },
        include: { customer: true },
      }),
    ]);

    return NextResponse.json({
      totalCustomers,
      totalForklifts,
      overdueCount,
      warningCount,
      pendingAlerts,
      recentJobs,
      urgentForklifts,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({
      totalCustomers: 0,
      totalForklifts: 0,
      overdueCount: 0,
      warningCount: 0,
      pendingAlerts: 0,
      recentJobs: [],
      urgentForklifts: [],
    });
  }
}
