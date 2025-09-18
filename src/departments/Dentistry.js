import React from "react";
import { useOutletContext } from "react-router-dom";
import DepartmentTemplate from "./DepartmentTemplate";

export default function DentistryPage() {
  const { currentDept } = useOutletContext(); // "Dentistry"

  const intro = `Preventive, restorative, and cosmetic dental care—healthy gums and teeth support
  systemic health and overall well-being.`;

  const diseases = [
    "Caries (tooth decay) & pulpitis",
    "Gingivitis & periodontitis",
    "Dental trauma & fractures",
    "Malocclusion & orthodontic concerns",
    "Temporomandibular disorders (TMD)",
    "Pericoronitis & impacted third molars",
    "Aphthous ulcers & oral mucosal conditions",
  ];

  const treatments = [
    "Scaling & root planing, fluoride therapy",
    "Restorations: fillings/inlays/onlays",
    "Endodontic therapy (root canal) when indicated",
    "Crowns/bridges & implant planning",
    "Whitening & cosmetic contouring",
    "Orthodontic evaluation & aligner referrals",
    "Oral hygiene & dietary counseling",
  ];

  const surgeries = [
    "Simple & surgical extractions",
    "Impacted third molar removal",
    "Implant placement (as service availability permits)",
    "Periodontal surgery (referral)",
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
