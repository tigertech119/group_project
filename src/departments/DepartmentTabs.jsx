import React, { useState } from "react";

export default function DepartmentTabs({ render, initial = "diseases" }) {
  const [tab, setTab] = useState(initial);
  const tabs = [
    { key: "diseases",  label: "Diseases" },
    { key: "treatments", label: "Treatments" },
    { key: "doctors",    label: "Doctors" },
    { key: "articles",   label: "Articles" },
  ];

  return (
    <>
      <div className="tab-row" role="tablist" aria-label="Department sections">
        {tabs.map(t => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            aria-controls={`panel-${t.key}`}
            id={`tab-${t.key}`}
            className={`tab-btn ${tab === t.key ? "active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Force remount on tab change (so animations trigger) */}
      <div key={tab} id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`}>
        {render(tab)}
      </div>
    </>
  );
}
