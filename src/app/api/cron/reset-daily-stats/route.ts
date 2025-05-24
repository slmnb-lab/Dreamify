import { NextResponse } from 'next/server';
import { db } from '@/db';
import { siteStats } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    await db.update(siteStats)
      .set({
        dailyGenerations: 0,
        lastResetDate: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(siteStats.id, 1));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error resetting daily stats:', error);
    return NextResponse.json(
      { error: 'Failed to reset daily stats' },
      { status: 500 }
    );
  }
} 