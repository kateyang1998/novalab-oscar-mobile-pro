import React from "react";
import PatientRecordScreen from "./PatientRecordScreen";

/**
 * Patient Record Summary Screen Component
 * Thin wrapper component that preserves the legacy route:
 * - /patient/:id/summary
 */
const PatientRecordSummaryScreen = () => {
  return <PatientRecordScreen />;
};

export default PatientRecordSummaryScreen;
