import React from "react";
import { useOutletContext } from "react-router-dom";
import DepartmentTemplate from "./DepartmentTemplate";

export default function CardiologyPage() {
  const { currentDept } = useOutletContext(); // "Cardiology"

  const intro = `Heart health across prevention, diagnostics, and interventional care. We focus on
  early risk detection, evidence-based therapy, and coordinated follow-up.`;

  const diseases = [
    "Coronary artery disease (CAD) & angina",
    "Acute coronary syndrome (ACS) / myocardial infarction",
    "Heart failure (HFrEF / HFpEF)",
    "Arrhythmias (AF, SVT, VT), palpitations, syncope",
    "Hypertension & hypertensive emergencies",
    "Valvular heart disease (AS, MR, etc.)",
    "Cardiomyopathies (dilated, hypertrophic, restrictive)",
    "Pericardial disease (pericarditis, effusion)",
    "Congenital heart disease (adult follow-up)",
    "Dyslipidemia & primary prevention",
  ];

  const treatments = [
    "Risk stratification & prevention (BP, lipids, glucose, smoking)",
    "Anti-anginal & guideline-directed medical therapy (GDMT)",
    "Heart failure optimization (ACEi/ARNI, BB, MRA, SGLT2i)",
    "Rate/rhythm control for AF; anticoagulation assessment",
    "Ambulatory ECG / Holter / event monitoring",
    "Echocardiography, stress testing, cardiac CT where indicated",
    "Cardiac rehab & structured lifestyle programs",
  ];

  const surgeries = [
    "Percutaneous coronary intervention (PCI/stenting) referral",
    "Coronary artery bypass grafting (CABG) referral",
    "Transcatheter valve interventions (TAVR/Mitraclip) referral",
    "EP procedures (ablation, device: pacemaker/ICD/CRT) referral",
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
