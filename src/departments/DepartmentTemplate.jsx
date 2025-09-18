import React from "react";
import DepartmentTabs from "./DepartmentTabs";
import ArticlesList from "./ArticlesList";
import AnimatedSection from "./AnimatedSection";

export default function DepartmentTemplate({ intro, deptName, diseases=[], treatments=[], surgeries=[] }) {
  return (
    <>
      {/* Intro blurb */}
      <AnimatedSection>
        <div className="dept-card">
          <p style={{ margin: 0, color: "var(--muted)" }}>{intro}</p>
        </div>
      </AnimatedSection>

      <DepartmentTabs
        render={(tab) => {
          if (tab === "diseases") {
            return (
              <AnimatedSection>
                <div className="dept-card">
                  <h3>Common & Notable Diseases</h3>
                  <p>Below are frequent conditions managed by our {deptName} team.</p>
                  <ul className="dept-list">
                    {diseases.map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                </div>
              </AnimatedSection>
            );
          }
          if (tab === "treatments") {
            return (
              <>
                <AnimatedSection>
                  <div className="dept-card">
                    <h3>Medical & Non-Surgical Treatments</h3>
                    <ul className="dept-list">
                      {treatments.map((t, i) => <li key={i}>{t}</li>)}
                    </ul>
                  </div>
                </AnimatedSection>
                {surgeries.length > 0 && (
                  <AnimatedSection delay={80}>
                    <div className="dept-card">
                      <h3>Procedures & Surgery</h3>
                      <div>
                        {surgeries.map((s, i) => (
                          <span className="dept-badge" key={i}>{s}</span>
                        ))}
                      </div>
                    </div>
                  </AnimatedSection>
                )}
              </>
            );
          }
          if (tab === "doctors") {
            return (
              <AnimatedSection>
                <div className="dept-card">
                  <h3>Doctors in {deptName}</h3>
                  <p>
                    For availability and booking, continue to the existing appointment flow:
                    <br /> <strong>Departments → Doctors</strong> for <em>{deptName}</em>.
                  </p>
                </div>
              </AnimatedSection>
            );
          }
          // Articles
          return (
            <AnimatedSection>
              <ArticlesList department={deptName} />
            </AnimatedSection>
          );
        }}
      />
    </>
  );
}
