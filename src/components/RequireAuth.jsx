import { useEffect, useState } from "react";
import { getMe } from "../api/auth";
import { Navigate } from "react-router-dom";

export default function RequireAuth({ allowed, children }){
  const [loading,setLoading]=useState(true); const [me,setMe]=useState(null);
  useEffect(()=>{(async()=>{ const r=await getMe(); setMe(r.user||null); setLoading(false); })();},[]);
  if(loading) return <p>Loading…</p>;
  if(!me) return <Navigate to="/login" replace/>;
  if(allowed && !allowed.includes(me.role)) return <Navigate to="/" replace/>;
  return children;
}
