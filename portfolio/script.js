// ========================================
// PORTFOLIO SCRIPT
// ========================================


// ========================================
// THEME TOGGLE
// ========================================

const themeToggle = document.getElementById("theme-toggle");

if (themeToggle) {

    themeToggle.addEventListener("click", () => {

        document.body.classList.toggle("dark-mode");

        const isDark =
            document.body.classList.contains("dark-mode");

        localStorage.setItem(
            "portfolio-theme",
            isDark ? "dark" : "light"
        );

    });

}


// Restore saved theme

const savedTheme =
    localStorage.getItem("portfolio-theme");

if (savedTheme === "dark") {

    document.body.classList.add("dark-mode");

}


// ========================================
// MOBILE NAVIGATION
// ========================================

const menuToggle =
    document.querySelector(".menu-toggle");

const navMenu =
    document.querySelector(".nav-menu");

if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", () => {

        navMenu.classList.toggle("active");

    });

}


// ========================================
// SMOOTH SCROLL
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function (event) {

        const targetId =
            this.getAttribute("href");

        if (targetId === "#") {
            return;
        }

        const target =
            document.querySelector(targetId);

        if (target) {

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    });

});


// ========================================
// CONTACT FORM
// ========================================

const contactForm =
    document.getElementById("contact-form");

if (contactForm) {

    contactForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const name =
                document.getElementById("name")?.value.trim();

            const email =
                document.getElementById("email")?.value.trim();

            const message =
                document.getElementById("message")?.value.trim();


            if (!name || !email || !message) {

                alert(
                    "Please fill in all fields."
                );

                return;

            }


            alert(
                "Thank you! Your message has been received."
            );


            contactForm.reset();

        }
    );

}


// ========================================
// BACKEND API
// ========================================

const PROJECTS_API =
    "http://localhost:5000/api/projects";


// ========================================
// LOAD PROJECTS FROM MONGODB
// ========================================

async function loadProjects() {

    const projectsContainer =
        document.querySelector(
            "#projects .projects-grid"
        );


    // If projects section doesn't exist
    // then stop.

    if (!projectsContainer) {

        return;

    }


    try {

        // Fetch projects from backend

        const response =
            await fetch(PROJECTS_API);


        if (!response.ok) {

            throw new Error(
                "Failed to fetch projects"
            );

        }


        const data =
            await response.json();


        const projects =
            data.projects || [];


        // Clear old hardcoded projects

        projectsContainer.innerHTML = "";


        // No projects

        if (projects.length === 0) {

            projectsContainer.innerHTML = `

                <div class="project-empty">

                    <p>
                        No projects available yet.
                    </p>

                </div>

            `;

            return;

        }


        // ========================================
        // CREATE PROJECT CARDS
        // ========================================

        projects.forEach(project => {


            // Technologies

            const technologies =
                Array.isArray(project.technologies)
                    ? project.technologies
                    : [];


            const technologyHTML =
                technologies
                    .map(
                        technology => `
                            <span>
                                ${escapeHTML(technology)}
                            </span>
                        `
                    )
                    .join("");


            // GitHub button

            const githubHTML =
                project.githubUrl
                    ? `
                        <a
                            href="${escapeAttribute(project.githubUrl)}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="project-link"
                        >
                            GitHub
                            <span aria-hidden="true">↗</span>
                        </a>
                    `
                    : "";


            // Live demo button

            const liveHTML =
                project.liveUrl
                    ? `
                        <a
                            href="${escapeAttribute(project.liveUrl)}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="project-link"
                        >
                            Live Demo
                            <span aria-hidden="true">↗</span>
                        </a>
                    `
                    : "";


            // Featured label

            const featuredHTML =
                project.featured
                    ? `
                        <span class="project-featured">
                            Featured
                        </span>
                    `
                    : "";


            // Image

            const imageHTML =
                project.image
                    ? `
                        <div class="project-image">

                            <img
                                src="${escapeAttribute(project.image)}"
                                alt="${escapeAttribute(project.title)}"
                                loading="lazy"
                            >

                        </div>
                    `
                    : "";


            // ========================================
            // PROJECT CARD
            // ========================================

            const projectHTML = `

                <article
                    class="project-card"
                    data-project-id="${escapeAttribute(project._id)}"
                >

                    ${imageHTML}


                    <div class="project-card-content">


                        <div class="project-card-top">

                            <p class="project-category">

                                ${escapeHTML(
                                    project.category ||
                                    "Project"
                                )}

                            </p>

                            ${featuredHTML}

                        </div>


                        <h3>

                            ${escapeHTML(
                                project.title ||
                                "Untitled Project"
                            )}

                        </h3>


                        <p class="project-description">

                            ${escapeHTML(
                                project.description ||
                                "No description available."
                            )}

                        </p>


                        <div class="project-tech">

                            ${technologyHTML}

                        </div>


                        <div class="project-links">

                            ${githubHTML}

                            ${liveHTML}

                        </div>


                    </div>

                </article>

            `;


            projectsContainer.insertAdjacentHTML(
                "beforeend",
                projectHTML
            );

        });


    } catch (error) {

        console.error(
            "Project loading error:",
            error
        );


        projectsContainer.innerHTML = `

            <div class="project-error">

                <p>
                    Unable to load projects right now.
                </p>

                <button
                    type="button"
                    onclick="loadProjects()"
                >
                    Try Again
                </button>

            </div>

        `;

    }

}


// ========================================
// SECURITY HELPERS
// ========================================

// Escape HTML text

function escapeHTML(value) {

    if (value === null || value === undefined) {

        return "";

    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// Escape URL/attribute values

function escapeAttribute(value) {

    if (value === null || value === undefined) {

        return "";

    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

}


// ========================================
// LOAD PROJECTS WHEN PAGE LOADS
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadProjects();

    }
);
