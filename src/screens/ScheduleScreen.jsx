// ─── src/screens/ScheduleScreen.jsx ──────────────────────────────────────────

import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ViewSwitcher from "../components/schedule/ViewSwitcher";
import CalendarHeader from "../components/schedule/CalendarHeader";
import MonthGrid from "../components/schedule/MonthGrid";
import WeekGrid from "../components/schedule/WeekGrid";
import DayTimeline from "../components/schedule/DayTimeline";
import {
  MONTHS,
  DAYS_FULL,
  getTodayString,
  getWeekDates,
  groupAppointmentsByDate,
} from "../components/schedule/Scheduleutils";
import SAMPLE_APPOINTMENTS from '../data/sampleAppointments';
import theme from '../styles/theme';

// ─── Replace with API fetch when OSCAR backend is ready ──────────────────────

export default function ScheduleScreen({ appointments = SAMPLE_APPOINTMENTS }) {
  const navigate = useNavigate();
  const location = useLocation();
  const todayStr = getTodayString();

  // allow navigation to open the schedule in a specific view/date
  const initialView = location.state?.view ?? "month";
  const initialSelectedDate = location.state?.date ?? "2026-04-15";

  const [view, setView] = useState(initialView);
  const [selectedDate, setSelectedDate] = useState(initialSelectedDate);
  const [calYear, setCalYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(3);

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

  function handleSelectDate(dateStr) {
    setSelectedDate(dateStr);
    const d = new Date(dateStr + "T00:00:00");
    setCalYear(d.getFullYear());
    setCalMonth(d.getMonth());
    setView("day");
  }

  // ── Tapping an appointment → go to Edit screen ─────────────────────────────

  function handleAppointmentPress(appointment) {
    navigate("/appointment/edit", { state: { appointment } });
  }

  // ── Header title ────────────────────────────────────────────────────────────

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

  const weekDates = getWeekDates(selectedDate);
  const dayAppointments = appointmentsByDate[selectedDate] ?? [];

  return (
    <div style={styles.screen}>
      <ViewSwitcher activeView={view} onChange={setView} />

      <CalendarHeader
        title={getHeaderTitle()}
        onPrev={handlePrev}
        onNext={handleNext}
        onTitlePress={() => { }}
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
    height: "calc(100vh - 80px)",
    background: theme.colors.oscarWhite,
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