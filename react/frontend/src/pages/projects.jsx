import { useEffect, useState } from "react";
import { getProjects } from "../api/client";
import ProjectGrid from "../components/ProjectGrid";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  function loadProjects() {
    return getProjects().then((result) => {
      setProjects(Array.isArray(result?.projects) ? result.projects : []);
      setStatus("success");
    }).catch((requestError) => {
      setError(requestError.message);
      setStatus("error");
    });
  }

  useEffect(() => {
    getProjects().then((result) => {
      setProjects(Array.isArray(result?.projects) ? result.projects : []);
      setStatus("success");
    }).catch((requestError) => {
      setError(requestError.message);
      setStatus("error");
    });
  }, []);

  function retryProjects() {
    setStatus("loading");
    setError("");
    loadProjects();
  }

  return (
    <section className="container page-section">
      <div className="section-heading">
        <p className="section-label">The portfolio</p>
        <h1>Projects</h1>
        <p>Browse projects and the technologies behind them.</p>
      </div>
      {status === "loading" && <div className="status-panel" role="status"><span className="spinner" /> Loading projects…</div>}
      {status === "error" && (
        <div className="notice notice-error" role="alert">
          <p>{error}</p>
          <button className="button button-outline" onClick={retryProjects} type="button">Try again</button>
        </div>
      )}
      {status === "success" && <ProjectGrid projects={projects} />}
    </section>
  );
}

export default Projects;
