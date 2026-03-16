import React from "react";
import PatientRecordScreen from "./PatientRecordScreen";

/**
 * Patient Record Vitals Screen Component
 * Thin wrapper around PatientRecordScreen to preserve legacy route: /patient/:id/vitals
 */
const PatientRecordVitalsScreen = () => {
  return <PatientRecordScreen />;
};

export default PatientRecordVitalsScreen;
