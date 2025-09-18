import React from "react";
import { useOutletContext } from "react-router-dom";
import DepartmentTemplate from "./DepartmentTemplate";

export default function GeneralMedicinePage() {
  const { currentDept } = useOutletContext(); // "General Medicine"

  const intro = `Primary and complex adult medical care—diagnostics, risk factor control, and
  longitudinal management across systems with coordinated specialty input.`;

  const diseases = [
    "Hypertension, diabetes, dyslipidemia",
    "Thyroid & endocrine disorders",
    "CKD & liver disease evaluation",
    "Anemia workup & nutritional deficiencies",
    "Infections & fever of unknown origin",
    "COPD/asthma in adults & sleep apnea risk",
    "Multimorbidity & polypharmacy issues",
  ];

  const treatments = [
    "Medication optimization & titration to targets",
    "Cardiometabolic risk reduction (BP, LDL, HbA1c)",
    "Vaccination & cancer screening reminders",
    "Lifestyle & nutrition counseling, smoking cessation",
    "Care plans for multimorbidity & deprescribing review",
    "Integrated referrals (cardiology, nephrology, endocrine, ID)",
  ];

  const surgeries = [
    "Endoscopy/colonoscopy referrals",
    "Dialysis access planning (with nephrology)",
    "Biopsy coordination (liver/thyroid/lymph node) via IR/ENT",
  ];

  return (
    <DepartmentTemplate
      intro={intro}
      deptName={currentDept}
      diseases={diseases}
      treatments={treatments}
      surgeries={surgeries}
    />
  );
}
