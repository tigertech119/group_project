import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Add navigation
import { forgotPassword } from "../api/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    const res = await forgotPassword(email);
    if (res.error) {
      setMsg("❌ " + res.error);
    } else {
      setMsg("✅ " + res.message);

      // ✅ Save email so ResetPassword.js can use it
      localStorage.setItem("resetEmail", email);

      // ✅ Redirect user to Reset Password page
      navigate("/reset-password");
    }
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Forgot Password</h2>
      <form onSubmit={onSubmit}>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Code</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}
