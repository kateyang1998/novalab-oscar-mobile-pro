import React from "react";
import PatientRecordScreen from "./PatientRecordScreen";

/**
 * Patient Record Notes Screen Component
 * Thin wrapper around PatientRecordScreen to preserve legacy route: /patient/:id/notes
 */
const PatientRecordNotesScreen = () => {
  return <PatientRecordScreen />;
};

export default PatientRecordNotesScreen;
