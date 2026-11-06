import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { createProject, deleteProject, getProject, getProjects, updateProject } from "../api/client";
import { useAuth } from "../context/useAuth";

function AdminProjectList() {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

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

  async function handleDelete(project) {
    if (!window.confirm(`Delete "${project.title}"? This cannot be undone.`)) {
      return;
    }
    setDeletingId(project._id);
    setError("");
    try {
      await deleteProject(project._id, token);
      setProjects((current) => current.filter((item) => item._id !== project._id));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setDeletingId("");
    }
  }

  return (
    <section className="container page-section">
      <div className="admin-heading">
        <div>
          <p className="section-label">Administration</p>
          <h1>Manage projects</h1>
          <p className="muted-copy">Create, edit, or remove projects in your portfolio.</p>
        </div>
        <Link className="button button-primary" to="/admin/projects/new">Add project <span aria-hidden="true">+</span></Link>
      </div>
      {status === "loading" && <div className="status-panel" role="status"><span className="spinner" /> Loading projects…</div>}
      {status === "error" && (
        <div className="notice notice-error" role="alert">
          <p>{error}</p>
          <button className="button button-outline" onClick={retryProjects} type="button">Try again</button>
        </div>
      )}
      {error && status !== "error" && <div className="notice notice-error" role="alert">{error}</div>}
      {status === "success" && projects.length === 0 && (
        <div className="empty-state"><h2>No projects yet</h2><p>Create your first project to publish it on the portfolio.</p></div>
      )}
      {status === "success" && projects.length > 0 && (
        <div className="admin-project-list">
          {projects.map((project) => (
            <article className="admin-project-row" key={project._id}>
              <div>
                <span className="project-category">{project.category}</span>
                <h2>{project.title}</h2>
                <p>{project.description}</p>
              </div>
              <div className="admin-row-actions">
                <Link className="button button-outline" to={`/admin/projects/${project._id}/edit`}>Edit</Link>
                <button
                  className="button button-danger"
                  disabled={deletingId === project._id}
                  onClick={() => handleDelete(project)}
                  type="button"
                >
                  {deletingId === project._id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

const EMPTY_FORM = {
  title: "",
  description: "",
  category: "",
  technologies: "",
  githubUrl: "",
  liveUrl: "",
  image: "",
  featured: false,
};

function isValidOptionalUrl(value) {
  if (!value.trim()) {
    return true;
  }
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function ProjectForm() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const editing = Boolean(id);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loadedId, setLoadedId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    if (!editing) {
      return undefined;
    }

    let active = true;
    getProject(id)
      .then((project) => {
        if (active) {
          setLoadFailed(false);
          setForm({
            title: project.title || "",
            description: project.description || "",
            category: project.category || "",
            technologies: Array.isArray(project.technologies) ? project.technologies.join(", ") : "",
            githubUrl: project.githubUrl || "",
            liveUrl: project.liveUrl || "",
            image: project.image || "",
            featured: Boolean(project.featured),
          });
        }
      })
      .catch((requestError) => {
        if (active) {
          setLoadFailed(true);
          setError(requestError.message);
        }
      })
      .finally(() => {
        if (active) {
          setLoadedId(id);
        }
      });

    return () => {
      active = false;
    };
  }, [editing, id]);

  function updateField(event) {
    const { name, value, checked, type } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const requiredFields = [
      ["title", "Project title"],
      ["description", "Description"],
      ["category", "Category"],
    ];
    const missingField = requiredFields.find(([field]) => !form[field].trim());
    if (missingField) {
      setError(`${missingField[1]} is required.`);
      return;
    }
    for (const field of ["githubUrl", "liveUrl", "image"]) {
      if (!isValidOptionalUrl(form[field])) {
        setError(`${field === "githubUrl" ? "GitHub URL" : field === "liveUrl" ? "Live URL" : "Image URL"} must be a valid HTTP or HTTPS URL.`);
        return;
      }
    }

    const project = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      technologies: form.technologies.split(",").map((technology) => technology.trim()).filter(Boolean),
      githubUrl: form.githubUrl.trim(),
      liveUrl: form.liveUrl.trim(),
      image: form.image.trim(),
      featured: form.featured,
    };

    setSubmitting(true);
    try {
      if (editing) {
        await updateProject(id, project, token);
      } else {
        await createProject(project, token);
      }
      navigate("/admin/projects", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (editing && loadedId !== id) {
    return <section className="container page-section"><div className="status-panel" role="status"><span className="spinner" /> Loading project…</div></section>;
  }

  if (editing && loadFailed) {
    return (
      <section className="container page-section">
        <div className="notice notice-error" role="alert">
          <h1>Unable to load project</h1>
          <p>{error}</p>
          <Link className="button button-outline" to="/admin/projects">Back to dashboard</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container page-section form-page">
      <Link className="back-link" to="/admin/projects">← Back to dashboard</Link>
      <div className="form-card">
        <p className="section-label">{editing ? "Update portfolio" : "Add to portfolio"}</p>
        <h1>{editing ? "Edit project" : "Create project"}</h1>
        {error && <div className="notice notice-error" role="alert">{error}</div>}
        <form className="project-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="title">Title <span aria-hidden="true">*</span></label>
            <input id="title" maxLength="120" name="title" onChange={updateField} required value={form.title} />
          </div>
          <div className="form-field">
            <label htmlFor="category">Category <span aria-hidden="true">*</span></label>
            <input id="category" maxLength="80" name="category" onChange={updateField} required value={form.category} />
          </div>
          <div className="form-field">
            <label htmlFor="description">Description <span aria-hidden="true">*</span></label>
            <textarea id="description" maxLength="3000" name="description" onChange={updateField} required rows="6" value={form.description} />
          </div>
          <div className="form-field">
            <label htmlFor="technologies">Technologies</label>
            <input id="technologies" name="technologies" onChange={updateField} placeholder="React, Node.js, MongoDB" value={form.technologies} />
            <small>Separate technologies with commas.</small>
          </div>
          <div className="form-field">
            <label htmlFor="githubUrl">GitHub URL</label>
            <input id="githubUrl" name="githubUrl" onChange={updateField} placeholder="https://github.com/…" type="url" value={form.githubUrl} />
          </div>
          <div className="form-field">
            <label htmlFor="liveUrl">Live project URL</label>
            <input id="liveUrl" name="liveUrl" onChange={updateField} placeholder="https://…" type="url" value={form.liveUrl} />
          </div>
          <div className="form-field">
            <label htmlFor="image">Image URL</label>
            <input id="image" name="image" onChange={updateField} placeholder="https://…" type="url" value={form.image} />
          </div>
          <label className="checkbox-field">
            <input checked={form.featured} name="featured" onChange={updateField} type="checkbox" />
            Feature this project on the home page
          </label>
          <div className="form-actions">
            <button className="button button-primary" disabled={submitting} type="submit">
              {submitting ? "Saving…" : editing ? "Save changes" : "Create project"}
            </button>
            <Link className="button button-outline" to="/admin/projects">Cancel</Link>
          </div>
        </form>
      </div>
    </section>
  );
}

function AdminDashboard() {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <Navigate replace to="/login" state={{ from: "/admin/projects" }} />;
  }

  return (
    <Routes>
      <Route index element={<AdminProjectList />} />
      <Route path="new" element={<ProjectForm />} />
      <Route path=":id/edit" element={<ProjectForm />} />
      <Route path="*" element={<Navigate replace to="/admin/projects" />} />
    </Routes>
  );
}

export default AdminDashboard;
