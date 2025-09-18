import React from "react";
import { useOutletContext } from "react-router-dom";
import DepartmentTemplate from "./DepartmentTemplate";

export default function OrthopedicsPage() {
  const { currentDept } = useOutletContext(); // "Orthopedics"

  const intro = `Bone, joint, and soft-tissue care—from sports injuries and trauma to arthritis and
  complex reconstruction—focused on function, biomechanics, and safe return to activity.`;

  const diseases = [
    "Osteoarthritis (knee/hip/shoulder)",
    "Rheumatologic arthropathies (co-managed)",
    "Rotator cuff tendinopathy/tears",
    "ACL/MCL injuries & meniscal tears",
    "Ankle sprain/instability & Achilles tendinopathy",
    "Carpal tunnel syndrome & nerve entrapments",
    "Low back pain, radiculopathy, sciatica",
    "Fractures & dislocations (acute and malunion)",
  ];

  const treatments = [
    "Phased physiotherapy & load management",
    "Bracing/orthoses & activity modification",
    "Image-guided injections (HA, corticosteroid, PRP as indicated)",
    "Analgesia & bone health optimization (vitamin D, calcium)",
    "Post-op rehabilitation protocols & return-to-sport criteria",
  ];

  const surgeries = [
    "Arthroscopy (knee/shoulder/ankle)",
    "ACL/PCL reconstruction",
    "Rotator cuff repair",
    "Total/partial knee arthroplasty",
    "Total hip arthroplasty",
    "Trauma fixation (ORIF, IM nailing)",
    "Shoulder stabilization (Bankart/Latarjet per referral)",
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
