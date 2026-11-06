import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProjects } from "../api/client";
import ProjectGrid from "../components/ProjectGrid";
import portrait from "../assets/sonali-shukla-profile.webp";

const skillGroups = [
  { title: "Frontend", technologies: ["HTML5", "CSS3", "JavaScript", "React"] },
  { title: "Backend", technologies: ["Node.js", "Express.js", "REST APIs"] },
  { title: "Database", technologies: ["MongoDB"] },
  { title: "Programming", technologies: ["Java"] },
  { title: "Tools", technologies: ["Git", "GitHub", "VS Code"] },
];

function Home() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getProjects()
      .then((result) => {
        if (active) {
          setProjects(Array.isArray(result?.projects) ? result.projects : []);
          setStatus("success");
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.message);
          setStatus("error");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  function retryProjects() {
    setStatus("loading");
    setError("");
    getProjects()
      .then((result) => {
        setProjects(Array.isArray(result?.projects) ? result.projects : []);
        setStatus("success");
      })
      .catch((requestError) => {
        setError(requestError.message);
        setStatus("error");
      });
  }

  const featuredProjects = projects.filter((project) => project.featured).slice(0, 3);
  const visibleProjects = featuredProjects.length ? featuredProjects : projects.slice(0, 3);

  return (
    <>
      <section className="hero section" id="home">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Hello, I’m</p>
            <h1>Sonali <span>Shukla</span></h1>
            <p className="hero-role">Aspiring Full Stack Developer</p>
            <p className="hero-intro">
              B.Tech Computer Science student passionate about building
              responsive web applications and learning full-stack development.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#projects">View Projects <span aria-hidden="true">→</span></a>
              <a className="button button-outline" href="#contact">Contact Me <span aria-hidden="true">↗</span></a>
            </div>
            <div aria-label="Social links" className="social-links">
              <a href="https://github.com/sonalishukla721-max" rel="noreferrer" target="_blank">GitHub ↗</a>
              <a href="https://www.linkedin.com/in/sonali-shukla-778891333/" rel="noreferrer" target="_blank">LinkedIn ↗</a>
            </div>
          </div>
          <div className="profile-wrap">
            <div aria-hidden="true" className="profile-backdrop" />
            <div className="profile-frame">
              <img src={portrait} alt="Portrait of Sonali Shukla" />
            </div>
            <div className="profile-note">
              <span aria-hidden="true" className="note-dot" />
              <span>Learning, building,<br />and growing.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-light" id="about">
        <div className="container narrow-grid">
          <div>
            <p className="section-label">01 / About</p>
            <h2>About Me</h2>
          </div>
          <div className="about-copy">
            <p className="lead">
              I’m Sonali, a B.Tech Computer Science student who enjoys creating
              thoughtful, practical digital experiences.
            </p>
            <p>
              I’m interested in full stack development, web development, backend
              development, and software development. I like understanding how
              the pieces fit together—from a clear interface to the APIs and
              logic behind it—and I’m building my skills through consistent
              practice and meaningful projects.
            </p>
          </div>
        </div>
      </section>

      <section className="section" id="skills">
        <div className="container">
          <div className="section-heading">
            <p className="section-label">02 / Skills</p>
            <h2>My Skills</h2>
            <p>A focused toolkit I’m using to grow as a developer.</p>
          </div>
          <div className="skills-grid">
            {skillGroups.map((group, index) => (
              <article className="skill-card" key={group.title}>
                <span className="skill-index">{String(index + 1).padStart(2, "0")}</span>
                <h3>{group.title}</h3>
                <div className="tags">
                  {group.technologies.map((technology) => <span key={technology}>{technology}</span>)}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-light" id="projects">
        <div className="container">
          <div className="section-heading">
            <p className="section-label">03 / Projects</p>
            <h2>Selected Projects</h2>
            <p>Recent work, loaded live from the portfolio API.</p>
          </div>
          {status === "loading" && <div className="status-panel" role="status"><span className="spinner" /> Loading projects…</div>}
          {status === "error" && (
            <div className="notice notice-error" role="alert">
              <p>{error}</p>
              <button className="button button-outline" onClick={retryProjects} type="button">Try again</button>
            </div>
          )}
          {status === "success" && (
            <>
              <ProjectGrid projects={visibleProjects} />
              {projects.length > 0 && <p className="section-action"><Link className="text-link" to="/projects">View all projects →</Link></p>}
            </>
          )}
        </div>
      </section>

      <section className="section contact-section" id="contact">
        <div className="container contact-grid">
          <div>
            <p className="section-label">04 / Contact</p>
            <h2>Contact Me</h2>
            <p className="contact-intro">Have a question, idea, or opportunity to share? I’d be happy to hear from you.</p>
            <div className="contact-details">
              <a href="mailto:sonalishukla721@gmail.com"><small>Email</small>sonalishukla721@gmail.com</a>
              <a href="https://github.com/sonalishukla721-max" rel="noreferrer" target="_blank"><small>GitHub</small>github.com/sonalishukla721-max</a>
              <a href="https://www.linkedin.com/in/sonali-shukla-778891333/" rel="noreferrer" target="_blank"><small>LinkedIn</small>linkedin.com/in/sonali-shukla-778891333</a>
            </div>
          </div>
          <form action="mailto:sonalishukla721@gmail.com" className="contact-form" encType="text/plain" method="post">
            <div className="form-field">
              <label htmlFor="contact-name">Name</label>
              <input autoComplete="name" id="contact-name" name="Name" placeholder="Your name" required />
            </div>
            <div className="form-field">
              <label htmlFor="contact-email">Email</label>
              <input autoComplete="email" id="contact-email" name="Email" placeholder="you@example.com" required type="email" />
            </div>
            <div className="form-field">
              <label htmlFor="contact-message">Message</label>
              <textarea id="contact-message" name="Message" placeholder="How can I help?" required rows="4" />
            </div>
            <button className="button button-primary" type="submit">Send message <span aria-hidden="true">↗</span></button>
            <p className="form-status">This opens your email app to send the message.</p>
          </form>
        </div>
      </section>
    </>
  );
}

export default Home;
