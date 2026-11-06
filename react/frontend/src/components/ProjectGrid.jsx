import ProjectCard from "./ProjectCard";

function ProjectGrid({ projects }) {
  if (!projects.length) {
    return (
      <div className="empty-state">
        <h3>No projects yet</h3>
        <p>There are no projects to show right now. Please check back soon.</p>
      </div>
    );
  }

  return (
    <div className="projects-grid">
      {projects.map((project) => <ProjectCard key={project._id} project={project} />)}
    </div>
  );
}

export default ProjectGrid;
