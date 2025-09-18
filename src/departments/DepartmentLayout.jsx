import React, { useEffect, useMemo } from "react";
import { NavLink, Outlet, useParams, useNavigate } from "react-router-dom";
import "./departmentStyles.css";

const DEPARTMENTS = [
  { slug: "Cardiology",        label: "🫀 Cardiology" },
  { slug: "Neurology",         label: "🧠 Neurology" },
  { slug: "Orthopedics",       label: "🦴 Orthopedics" },
  { slug: "Pediatrics",        label: "👶 Pediatrics" },
  { slug: "General Medicine",  label: "🩺 General Medicine" },
  { slug: "Ophthalmology",     label: "👁 Ophthalmology" },
  { slug: "Dentistry",         label: "🦷 Dentistry" },
];

export default function DepartmentLayout() {
  const { dept } = useParams();
  const navigate = useNavigate();

  const current = useMemo(() => decodeURIComponent(dept || "Cardiology"), [dept]);

  useEffect(() => {
    const known = DEPARTMENTS.some(d => d.slug === current);
    if (!known) {
      navigate(`/departments/info/${encodeURIComponent("Cardiology")}`, { replace: true });
    }
  }, [current, navigate]);

  useEffect(() => {
    document.title = `${current} • Departments`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [current]);

  return (
    <div className="dept-root page-fade">
      {/* Sidebar */}
      <aside className="dept-sidebar">
        <div className="dept-side-title">Departments</div>
        <ul className="dept-nav">
          {DEPARTMENTS.map((d) => (
            <li key={d.slug}>
              <NavLink
                to={`/departments/info/${encodeURIComponent(d.slug)}`}
                className={({ isActive }) => `dept-link ${isActive ? "active" : ""}`}
              >
                <span aria-hidden>•</span> {d.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>

      {/* Content (no hero) */}
      <section className="dept-content">
        <Outlet context={{ currentDept: current }} />
      </section>
    </div>
  );
}
