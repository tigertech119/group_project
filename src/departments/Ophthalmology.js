import React from "react";
import { useOutletContext } from "react-router-dom";
import DepartmentTemplate from "./DepartmentTemplate";

export default function OphthalmologyPage() {
  const { currentDept } = useOutletContext(); // "Ophthalmology"

  const intro = `Eye health across the lifespan—refractive care, cataract, glaucoma, and retinal
  disease—with an emphasis on screening and vision preservation.`;

  const diseases = [
    "Refractive errors (myopia, hyperopia, astigmatism)",
    "Cataract",
    "Glaucoma (open/angle-closure)",
    "Diabetic retinopathy & macular edema",
    "Age-related macular degeneration",
    "Dry eye & blepharitis",
    "Uveitis (co-managed)",
  ];

  const treatments = [
    "Refraction & contact lens fitting",
    "Topical therapy (IOP control, anti-inflammatory, lubrication)",
    "Glaucoma medical/surgical planning",
    "Intravitreal injections (retinal disease)",
    "Ocular surface disease regimens & lid hygiene",
    "Vision rehab referrals when indicated",
  ];

  const surgeries = [
    "Cataract surgery (phaco + IOL)",
    "Laser procedures (YAG, SLT) per indication",
    "Trabeculectomy/tube shunts (referral)",
    "Vitreoretinal surgery (referral)",
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

