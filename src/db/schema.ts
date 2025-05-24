import { pgTable, timestamp, integer } from 'drizzle-orm/pg-core';

export const siteStats = pgTable('site_stats', {
  id: integer('id').primaryKey().default(1),
  totalGenerations: integer('total_generations').default(0),
  dailyGenerations: integer('daily_generations').default(0),
  lastResetDate: timestamp('last_reset_date').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}); 