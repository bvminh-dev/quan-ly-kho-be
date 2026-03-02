import { DashboardPeriod } from '../enums/index.js';

export function getDateRange(
  period: DashboardPeriod,
  date: string,
): { startDate: Date; endDate: Date } {
  switch (period) {
    case DashboardPeriod.DAY: {
      const startDate = new Date(`${date}T00:00:00.000Z`);
      const endDate = new Date(`${date}T23:59:59.999Z`);
      return { startDate, endDate };
    }
    case DashboardPeriod.MONTH: {
      const [year, month] = date.split('-').map(Number);
      const startDate = new Date(Date.UTC(year, month - 1, 1));
      const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
      return { startDate, endDate };
    }
    case DashboardPeriod.YEAR: {
      const yearNum = Number(date);
      const startDate = new Date(Date.UTC(yearNum, 0, 1));
      const endDate = new Date(Date.UTC(yearNum, 11, 31, 23, 59, 59, 999));
      return { startDate, endDate };
    }
  }
}
