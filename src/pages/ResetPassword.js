import { useState, useEffect } from "react";
import { resetPassword } from "../api/auth";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");

  // ✅ Auto-load email from localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem("resetEmail");
    if (savedEmail) setEmail(savedEmail);
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return setMsg("❌ Passwords do not match");
    }

    const res = await resetPassword({ email, code, newPassword });
    setMsg(res.error ? "❌ " + res.error : "✅ " + res.message);
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>🔒 Reset Password</h2>
      <form onSubmit={onSubmit}>
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Enter OTP Code"
          value={code}
          onChange={e => setCode(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}
