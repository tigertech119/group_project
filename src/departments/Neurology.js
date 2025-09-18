import React from "react";
import { useOutletContext } from "react-router-dom";
import DepartmentTemplate from "./DepartmentTemplate";

export default function NeurologyPage() {
  const { currentDept } = useOutletContext(); // "Neurology"

  const intro = `Disorders of the brain, spinal cord, and peripheral nerves—from headaches and seizures
  to stroke and neurodegeneration—with multidisciplinary long-term care.`;

  const diseases = [
    "Migraine & Tension-Type Headache",
    "Epilepsy & Seizure Disorders",
    "Ischemic & Hemorrhagic Stroke / TIA",
    "Parkinson’s Disease & Movement Disorders",
    "Essential Tremor & Dystonia",
    "Multiple Sclerosis & Demyelinating Disease",
    "Peripheral Neuropathies (diabetic, post-infectious)",
    "Myasthenia Gravis & Neuromuscular Junction Disorders",
    "Mild Cognitive Impairment & Dementias",
    "Radiculopathy & Spine-related Pain",
  ];

  const treatments = [
    "Headache hygiene + preventive/abortive regimens",
    "Antiepileptic medication selection & safety counseling",
    "Acute stroke pathways (thrombolysis/transfer for thrombectomy)",
    "Movement disorder therapy & device referral (DBS evaluation)",
    "Immunotherapy for demyelinating disease",
    "Neuropathic pain algorithms (TCAs, SNRIs, gabapentinoids)",
    "Neurorehab (PT/OT/speech) & caregiver education",
    "Vascular risk control (BP, lipids, diabetes, sleep apnea)",
  ];

  const surgeries = [
    "Deep Brain Stimulation (DBS) evaluation",
    "Botulinum toxin injections for dystonia/spasticity",
    "Epilepsy surgical referral workup",
    "Carotid endarterectomy/stenting (external referral) ",
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

/*
import React from "react";
import { useOutletContext } from "react-router-dom";
import DepartmentTabs from "./DepartmentTabs";
import ArticlesList from "./ArticlesList";

export default function NeurologyPage() {
  const { currentDept } = useOutletContext(); // "Neurology"

  return (
    <>
      <h1 className="dept-title">{currentDept}</h1>
      <div className="dept-sub">
        Disorders of the brain, spinal cord, and peripheral nerves — from migraines and epilepsy to
        stroke and neurodegenerative disease. Our neurology team focuses on timely diagnosis, risk
        factor control, and long-term multidisciplinary care.
      </div>

      <DepartmentTabs
        render={(tab) => {
          if (tab === "diseases") {
            return (
              <div className="dept-card">
                <h3>Common & Notable Conditions</h3>
                <p>
                  Neurological disorders often present subtly: intermittent headaches, transient
                  weakness, sensory disturbances, or cognitive changes. Early assessment helps
                  preserve function and quality of life.
                </p>
                <ul>
                  <li>Migraine & Tension-Type Headache</li>
                  <li>Epilepsy & Seizure Disorders</li>
                  <li>Ischemic & Hemorrhagic Stroke / TIA</li>
                  <li>Parkinson’s Disease & Movement Disorders</li>
                  <li>Peripheral Neuropathies (e.g., diabetic neuropathy)</li>
                  <li>Multiple Sclerosis & Demyelinating Disease</li>
                  <li>Neurocognitive Disorders (Mild cognitive impairment, Dementia)</li>
                </ul>
                <p>
                  Red flags include sudden severe headache, acute weakness or facial droop, speech
                  difficulty, or new-onset seizures — these warrant urgent evaluation.
                </p>
              </div>
            );
          }
          if (tab === "treatments") {
            return (
              <div className="dept-card">
                <h3>Diagnostics & Treatment Approaches</h3>
                <p>
                  Care is individualized. We combine clinical exam with imaging (MRI/CT), EEG, nerve
                  conduction studies, and lab tests to confirm the diagnosis and guide therapy.
                </p>
                <ul>
                  <li>Acute stroke pathways (thrombolysis / thrombectomy referrals)</li>
                  <li>Antiepileptic medications & seizure safety counseling</li>
                  <li>Movement disorder therapy & device referrals (DBS evaluation)</li>
                  <li>Headache management plans (acute & preventive regimens)</li>
                  <li>Immunomodulatory therapy for demyelinating disease</li>
                  <li>Physical, occupational & speech therapy coordination</li>
                </ul>
                <p>
                  Lifestyle modification — sleep, stress, and vascular risk control — is integral to
                  durable outcomes alongside pharmacologic therapy.
                </p>
              </div>
            );
          }
          if (tab === "doctors") {
            return (
              <div className="dept-card">
                <h3>Neurology Doctors</h3>
                <p>
                  For availability and booking, please use the appointment flow you already have:
                  go to the Departments → Doctors pages to see schedules and request a visit.
                </p>
              </div>
            );
          }
          return <ArticlesList department={currentDept} />;
        }}
      />
    </>
  );
}
*/