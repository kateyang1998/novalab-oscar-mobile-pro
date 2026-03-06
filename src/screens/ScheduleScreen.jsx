// ─── src/screens/ScheduleScreen.jsx ──────────────────────────────────────────
/**
 * Orchestrates all schedule components.
 * Replace SAMPLE_APPOINTMENTS with your OSCAR API fetch when ready.
 *
 * Appointment shape:
 *   {
 *     id          {string|number}
 *     patientName {string}    e.g. "Robert Brown"
 *     type        {string}    e.g. "New Patient" | "Follow Up" | "Physical" | ...
 *     date        {string}    "YYYY-MM-DD"
 *     startTime   {string}    "HH:MM" 24-hour
 *     endTime     {string}    "HH:MM" 24-hour
 *     status      {string}    "Scheduled" | "Finished" | "Cancelled"
 *   }
 */

import { useState, useMemo } from "react";
import ViewSwitcher from "../components/schedule/Viewswitcher";
import CalendarHeader from "../components/schedule/Calendarheader";
import MonthGrid from "../components/schedule/Monthgrid";
import WeekGrid from "../components/schedule/Weekgrid";
import DayTimeline from "../components/schedule/Daytimeline";
import {
  MONTHS,
  DAYS_FULL,
  getTodayString,
  getWeekDates,
  groupAppointmentsByDate,
} from "../components/schedule/Scheduleutils";

// ─── Replace with API fetch when OSCAR backend is ready ──────────────────────
const SAMPLE_APPOINTMENTS = [
  { id: 1, patientName: "Robert Brown", type: "New Patient", date: "2026-04-15", startTime: "10:00", endTime: "11:00", status: "Finished" },
  { id: 2, patientName: "Rohit Talwar", type: "Follow Up", date: "2026-04-15", startTime: "11:00", endTime: "12:30", status: "Scheduled" },
  { id: 3, patientName: "Robert Brown", type: "Physical", date: "2026-04-15", startTime: "13:30", endTime: "14:00", status: "Finished" },
  { id: 4, patientName: "Robert Brown", type: "New Patient", date: "2026-04-15", startTime: "14:00", endTime: "14:30", status: "Cancelled" },
  { id: 5, patientName: "Robert Brown", type: "Consultation", date: "2026-04-15", startTime: "15:00", endTime: "15:30", status: "Scheduled" },
  { id: 6, patientName: "Robert Brown", type: "Urgent Care", date: "2026-04-15", startTime: "15:30", endTime: "16:00", status: "Scheduled" },
  { id: 7, patientName: "Robert Brown", type: "New Patient", date: "2026-04-13", startTime: "10:00", endTime: "11:30", status: "Finished" },
  { id: 8, patientName: "Robert Brown", type: "Physical", date: "2026-04-13", startTime: "13:30", endTime: "14:30", status: "Scheduled" },
  { id: 9, patientName: "Chris Konstas", type: "Follow Up", date: "2026-04-14", startTime: "11:00", endTime: "12:30", status: "Scheduled" },
  { id: 10, patientName: "Robert Brown", type: "Consultation", date: "2026-04-16", startTime: "14:00", endTime: "15:00", status: "Scheduled" },
  { id: 11, patientName: "Robert Brown", type: "New Patient", date: "2026-04-06", startTime: "09:00", endTime: "10:00", status: "Finished" },
  { id: 12, patientName: "Robert Brown", type: "Follow Up", date: "2026-04-06", startTime: "10:00", endTime: "11:00", status: "Scheduled" },
  { id: 13, patientName: "Robert Brown", type: "Physical", date: "2026-04-08", startTime: "09:00", endTime: "10:00", status: "Scheduled" },
  { id: 14, patientName: "Robert Brown", type: "Consultation", date: "2026-04-08", startTime: "11:00", endTime: "12:00", status: "Scheduled" },
  { id: 15, patientName: "Robert Brown", type: "New Patient", date: "2026-04-20", startTime: "09:00", endTime: "10:00", status: "Scheduled" },
  { id: 16, patientName: "Robert Brown", type: "Follow Up", date: "2026-04-20", startTime: "10:00", endTime: "11:00", status: "Scheduled" },
  { id: 17, patientName: "Robert Brown", type: "Physical", date: "2026-04-20", startTime: "11:00", endTime: "12:00", status: "Scheduled" },
  { id: 18, patientName: "Robert Brown", type: "Consultation", date: "2026-04-20", startTime: "13:00", endTime: "14:00", status: "Scheduled" },
];

export default function ScheduleScreen({ appointments = SAMPLE_APPOINTMENTS }) {
  const todayStr = getTodayString();

  const [view, setView] = useState("month");
  const [selectedDate, setSelectedDate] = useState("2026-04-15");
  const [calYear, setCalYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(3); // 0-indexed: 3 = April

  const appointmentsByDate = useMemo(
    () => groupAppointmentsByDate(appointments),
    [appointments]
  );

  // ── Navigation ──────────────────────────────────────────────────────────────

  function handlePrev() {
    if (view === "month") shiftMonth(-1);
    else if (view === "week") shiftDays(-7);
    else shiftDays(-1);
  }

  function handleNext() {
    if (view === "month") shiftMonth(1);
    else if (view === "week") shiftDays(7);
    else shiftDays(1);
  }

  function shiftMonth(delta) {
    let m = calMonth + delta;
    let y = calYear;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setCalMonth(m);
    setCalYear(y);
  }

  function shiftDays(days) {
    const d = new Date(selectedDate + "T00:00:00");
    d.setDate(d.getDate() + days);
    const newDate = d.toISOString().slice(0, 10);
    setSelectedDate(newDate);
    setCalYear(d.getFullYear());
    setCalMonth(d.getMonth());
  }

  // ── Select date → drill into Day view ──────────────────────────────────────

  function handleSelectDate(dateStr) {
    setSelectedDate(dateStr);
    const d = new Date(dateStr + "T00:00:00");
    setCalYear(d.getFullYear());
    setCalMonth(d.getMonth());
    setView("day");
  }

  // ── Header title per view ───────────────────────────────────────────────────

  function getHeaderTitle() {
    if (view === "month") return `${MONTHS[calMonth]} ${calYear}`;
    if (view === "week") {
      const dates = getWeekDates(selectedDate);
      const start = new Date(dates[0] + "T00:00:00");
      const end = new Date(dates[6] + "T00:00:00");
      if (start.getMonth() === end.getMonth()) {
        return `${MONTHS[start.getMonth()]} ${start.getFullYear()}`;
      }
      return `${MONTHS[start.getMonth()].slice(0, 3)} – ${MONTHS[end.getMonth()].slice(0, 3)} ${end.getFullYear()}`;
    }
    const d = new Date(selectedDate + "T00:00:00");
    return `${DAYS_FULL[d.getDay()]} - ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  }

  // ── Appointment tap → TODO: navigate to detail screen ──────────────────────

  function handleAppointmentPress(appointment) {
    console.log("Appointment pressed:", appointment);
    // e.g. navigate(`/appointment/${appointment.id}`)
  }

  const weekDates = getWeekDates(selectedDate);
  const dayAppointments = appointmentsByDate[selectedDate] ?? [];

  return (
    <div style={styles.screen}>
      <ViewSwitcher activeView={view} onChange={setView} />

      <CalendarHeader
        title={getHeaderTitle()}
        onPrev={handlePrev}
        onNext={handleNext}
        onTitlePress={() => {/* TODO: open date picker */ }}
      />

      <div style={styles.content}>
        {view === "month" && (
          <MonthGrid
            year={calYear}
            month={calMonth}
            selectedDate={selectedDate}
            todayStr={todayStr}
            appointmentsByDate={appointmentsByDate}
            onSelectDate={handleSelectDate}
            onAppointmentPress={handleAppointmentPress}
          />
        )}

        {view === "week" && (
          <WeekGrid
            weekDates={weekDates}
            selectedDate={selectedDate}
            todayStr={todayStr}
            appointmentsByDate={appointmentsByDate}
            onSelectDate={handleSelectDate}
            onAppointmentPress={handleAppointmentPress}
          />
        )}

        {view === "day" && (
          <DayTimeline
            dateStr={selectedDate}
            appointments={dayAppointments}
            onAppointmentPress={handleAppointmentPress}
          />
        )}
      </div>
    </div>
  );
}

const styles = {
  screen: {
    display: "flex",
    flexDirection: "column",
    height: "calc(100vh - 80px)", // 80px = BottomTab height
    background: "#FFFFFF",
    fontFamily: "-apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif",
    overflow: "hidden",
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
};