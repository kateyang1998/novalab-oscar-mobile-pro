import React from "react";
import PatientRecordScreen from "./PatientRecordScreen";

/**
 * Patient Record History Screen Component
 * Thin wrapper to preserve legacy route: /patient/:id/history
 */
const PatientRecordHistoryScreen = () => {
  return <PatientRecordScreen />;
};

export default PatientRecordHistoryScreen;
