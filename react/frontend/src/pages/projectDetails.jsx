import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProject } from "../api/client";

function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loadedId, setLoadedId] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getProject(id)
      .then((result) => {
        if (active) {
          setProject(result);
          setLoadedId(id);
          setStatus("success");
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.message);
          setLoadedId(id);
          setStatus("error");
        }
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (loadedId !== id || !status) {
    return <section className="container page-section"><div className="status-panel" role="status"><span className="spinner" /> Loading project…</div></section>;
  }

  if (status === "error") {
    return (
      <section className="container page-section">
        <div className="notice notice-error" role="alert">
          <h1>Unable to load project</h1>
          <p>{error}</p>
          <Link className="button button-outline" to="/projects">Back to projects</Link>
        </div>
      </section>
    );
  }

  const technologies = Array.isArray(project?.technologies) ? project.technologies : [];

  return (
    <article className="container page-section detail-page">
      <Link className="back-link" to="/projects">← All projects</Link>
      {project.image && <img className="detail-image" src={project.image} alt="" />}
      <p className="section-label">{project.category}</p>
      <h1>{project.title}</h1>
      {project.featured && <span className="featured-label">Featured project</span>}
      <p className="detail-description">{project.description}</p>
      {technologies.length > 0 && (
        <section className="detail-block" aria-labelledby="tech-heading">
          <h2 id="tech-heading">Technologies</h2>
          <ul className="technology-list">
            {technologies.map((technology) => <li key={technology}>{technology}</li>)}
          </ul>
        </section>
      )}
      <div className="hero-actions">
        {project.githubUrl && <a className="button button-outline" href={project.githubUrl} rel="noreferrer" target="_blank">View source ↗</a>}
        {project.liveUrl && <a className="button button-primary" href={project.liveUrl} rel="noreferrer" target="_blank">Visit live project ↗</a>}
      </div>
      {!project.githubUrl && !project.liveUrl && <p className="muted-copy">Project links are not available.</p>}
    </article>
  );
}

export default ProjectDetails;
