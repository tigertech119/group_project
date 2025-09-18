import React from "react";
import { useOutletContext } from "react-router-dom";
import DepartmentTemplate from "./DepartmentTemplate";

export default function PediatricsPage() {
  const { currentDept } = useOutletContext(); // "Pediatrics"

  const intro = `Child-centered care from newborns to adolescents—preventive health, acute illness
  management, and developmental support for growing minds and bodies.`;

  const diseases = [
    "Fever, viral URI, acute otitis media, pharyngitis",
    "Asthma & allergic rhinitis / eczema",
    "Gastroenteritis & dehydration",
    "Nutritional concerns: anemia, faltering growth",
    "Developmental & behavioral questions",
    "Common orthopedic & sports issues in children",
    "Immunization concerns & catch-up schedules",
  ];

  const treatments = [
    "Weight-based dosing & safety counseling",
    "Asthma action plans & inhaler technique",
    "Allergy mitigation strategies & eczema care",
    "Hydration/sick-day plans & oral rehydration therapy",
    "Nutrition counseling & micronutrient repletion",
    "Well-child visits, anticipatory guidance, screening",
  ];

  const surgeries = [
    "Tonsillectomy/adenoidectomy (referral)",
    "Orthopedic procedures (fracture fixation/soft tissue; referral)",
    "ENT procedures for recurrent otitis (grommets; referral)",
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
