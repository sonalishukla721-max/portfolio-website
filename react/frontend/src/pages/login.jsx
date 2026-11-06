import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Login() {
  const { isAdmin, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isAdmin) {
    return <Navigate to="/admin/projects" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Enter your password.");
      return;
    }

    setSubmitting(true);
    try {
      await login(normalizedEmail, password);
      navigate(location.state?.from || "/admin/projects", { replace: true });
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="container page-section login-section">
      <div className="form-card login-card">
        <p className="section-label">Administration</p>
        <h1>Admin sign in</h1>
        <p className="muted-copy">Sign in with an administrator account to manage portfolio projects.</p>
        <form className="project-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input autoComplete="email" id="email" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input autoComplete="current-password" id="password" onChange={(event) => setPassword(event.target.value)} required type="password" value={password} />
          </div>
          {error && <p className="notice notice-error" role="alert">{error}</p>}
          <button className="button button-primary" disabled={submitting} type="submit">
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="muted-copy login-back"><Link className="text-link" to="/projects">Return to projects</Link></p>
      </div>
    </section>
  );
}

export default Login;
