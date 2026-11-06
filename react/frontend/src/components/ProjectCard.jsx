import { Link } from "react-router-dom";

function ProjectCard({ project }) {
  const technologies = Array.isArray(project.technologies) ? project.technologies : [];

  return (
    <article className="project-card">
      {project.image ? (
        <img className="project-image" src={project.image} alt="" loading="lazy" />
      ) : (
        <div aria-hidden="true" className="project-image project-image-placeholder">
          <span>{project.title?.slice(0, 1) || "P"}</span>
        </div>
      )}
      <div className="project-card-content">
        <div className="project-card-meta">
          <span className="project-category">{project.category}</span>
          {project.featured && <span className="featured-label">Featured</span>}
        </div>
        <h3><Link to={`/projects/${project._id}`}>{project.title}</Link></h3>
        <p>{project.description}</p>
        {technologies.length > 0 && (
          <ul aria-label="Technologies" className="technology-list">
            {technologies.map((technology) => <li key={technology}>{technology}</li>)}
          </ul>
        )}
        <Link className="text-link" to={`/projects/${project._id}`}>
          View project <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

export default ProjectCard;
