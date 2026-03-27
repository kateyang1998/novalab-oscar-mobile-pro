// src/test/utils/scheduleUtils.test.js
import { describe, it, expect } from 'vitest';
import {
  toDateString,
  parseTimeToMinutes,
  formatTime12h,
  getDaysInMonth,
  getFirstDayOfMonth,
  getWeekDates,
  getTodayString,
  getTypeColors,
  groupAppointmentsByDate,
  getTimelinePosition,
  APPOINTMENT_TYPE_COLORS
} from '../../components/schedule/Scheduleutils';

describe('ScheduleUtils Tests', () => {

  it('toDateString formats date correctly', () => {
    expect(toDateString(2026, 2, 7)).toBe('2026-03-07');
  });

  it('parseTimeToMinutes converts time string to minutes', () => {
    expect(parseTimeToMinutes('08:30')).toBe(510);
  });

  it('formatTime12h converts 24h time to 12h format', () => {
    expect(formatTime12h('13:05')).toBe('1:05 PM');
    expect(formatTime12h('00:00')).toBe('12:00 AM');
    expect(formatTime12h('12:30')).toBe('12:30 PM');
  });

  it('getDaysInMonth returns correct number of days', () => {
    expect(getDaysInMonth(2026, 1)).toBe(28); // February 2026
    expect(getDaysInMonth(2026, 0)).toBe(31); // January 2026
  });

  it('getFirstDayOfMonth returns correct weekday index', () => {
    expect(getFirstDayOfMonth(2026, 2)).toBe(0); // March 1, 2026 is Sunday
  });

  it('getWeekDates returns an array of 7 dates for the week', () => {
    const week = getWeekDates('2026-03-07');
    expect(week.length).toBe(7);
    expect(week[0]).toBe('2026-03-01'); // Sunday
    expect(week[6]).toBe('2026-03-07'); // Saturday
  });

  it('getTodayString returns today in YYYY-MM-DD format', () => {
    const t = new Date();
    const expected = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
    expect(getTodayString()).toBe(expected);
  });

  it('getTypeColors returns correct color for known and unknown types', () => {
    expect(getTypeColors('New Patient')).toBe(APPOINTMENT_TYPE_COLORS['New Patient']);
    expect(getTypeColors('Unknown')).toBe(APPOINTMENT_TYPE_COLORS['Default']);
  });

  it('groupAppointmentsByDate groups appointments correctly', () => {
    const appointments = [
      { date: '2026-03-07', patient: 'A' },
      { date: '2026-03-07', patient: 'B' },
      { date: '2026-03-08', patient: 'C' },
    ];
    const grouped = groupAppointmentsByDate(appointments);
    expect(Object.keys(grouped)).toEqual(['2026-03-07', '2026-03-08']);
    expect(grouped['2026-03-07'].length).toBe(2);
  });

  it('getTimelinePosition calculates top and height correctly', () => {
    const pos = getTimelinePosition('08:00', '09:00');
    expect(pos.top).toBe(0); // START_HOUR = 8
    expect(pos.height).toBe(64); // HOUR_HEIGHT = 64
  });

});
