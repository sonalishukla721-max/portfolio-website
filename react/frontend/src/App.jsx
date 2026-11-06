import { useEffect, useState } from "react";
import { Link, NavLink, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./context/useAuth";
import AdminDashboard from "./pages/AdminDashboard";
import Home from "./pages/home";
import Login from "./pages/login";
import ProjectDetails from "./pages/projectDetails";
import Projects from "./pages/projects";

function Layout() {
  const { isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => window.localStorage.getItem("portfolio-theme") !== "light"
  );
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    window.localStorage.setItem("portfolio-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    if (location.hash) {
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
    } else if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleLogout() {
    logout();
    closeMenu();
    navigate("/");
  }

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header">
        <div className="container navbar">
          <Link className="brand" to="/" onClick={closeMenu}>Sonali<span> Shukla</span></Link>
          <button
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            className="menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            <span />
            <span />
            <span />
          </button>
          <nav aria-label="Main navigation" className={`nav-menu${menuOpen ? " open" : ""}`}>
            <NavLink className="nav-link" end onClick={closeMenu} to="/">Home</NavLink>
            <Link className="nav-link" onClick={closeMenu} to="/#about">About</Link>
            <Link className="nav-link" onClick={closeMenu} to="/#skills">Skills</Link>
            <Link className="nav-link" onClick={closeMenu} to="/#projects">Projects</Link>
            <Link className="nav-link" onClick={closeMenu} to="/#contact">Contact</Link>
            {isAdmin ? (
              <>
                <NavLink className="admin-login-btn" onClick={closeMenu} to="/admin/projects">Dashboard</NavLink>
                <button className="nav-link nav-button" onClick={handleLogout} type="button">Log out</button>
              </>
            ) : (
              <NavLink className="admin-login-btn" onClick={closeMenu} to="/login">Admin Login</NavLink>
            )}
            <button
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              aria-pressed={darkMode}
              className="theme-toggle"
              onClick={() => setDarkMode((value) => !value)}
              type="button"
            >
              <span aria-hidden="true">{darkMode ? "☀" : "☾"}</span>
              <span>{darkMode ? "Light mode" : "Dark mode"}</span>
            </button>
          </nav>
        </div>
      </header>
      <main id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/projects/*" element={<AdminDashboard />} />
          <Route path="*" element={
            <section className="container page-section">
              <div className="notice notice-error" role="alert">
                <h1>Page not found</h1>
                <p>The page you requested does not exist.</p>
                <Link className="button button-primary" to="/">Return home</Link>
              </div>
            </section>
          } />
        </Routes>
      </main>
      <footer className="site-footer">
        <div className="container footer-content">
          <span>© Sonali Shukla</span>
          <Link to="/projects">Explore projects</Link>
        </div>
      </footer>
    </>
  );
}

export default Layout;
