// ========================================
// PORTFOLIO ADMIN DASHBOARD
// ========================================


const API_URL =
    "http://localhost:5000/api";


// ========================================
// AUTHENTICATION
// ========================================

const token =
    localStorage.getItem("token");


if (!token) {

    window.location.href = "login.html";

}


// ========================================
// DOM ELEMENTS
// ========================================

const projectForm =
    document.getElementById("projectForm");

const projectId =
    document.getElementById("projectId");

const projectTitle =
    document.getElementById("projectTitle");

const projectDescription =
    document.getElementById("projectDescription");

const projectCategory =
    document.getElementById("projectCategory");

const projectTechnologies =
    document.getElementById("projectTechnologies");

const projectGithub =
    document.getElementById("projectGithub");

const projectLive =
    document.getElementById("projectLive");

const projectImage =
    document.getElementById("projectImage");

const projectFeatured =
    document.getElementById("projectFeatured");

const projectSubmitBtn =
    document.getElementById("projectSubmitBtn");

const cancelEditBtn =
    document.getElementById("cancelEditBtn");

const projectMessage =
    document.getElementById("projectMessage");

const dashboardMessage =
    document.getElementById("dashboardMessage");

const adminProjectList =
    document.getElementById("adminProjectList");

const projectCount =
    document.getElementById("projectCount");

const logoutBtn =
    document.getElementById("logoutBtn");

const projectFormHeading =
    document.getElementById("projectFormHeading");


// ========================================
// LOGOUT
// ========================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            localStorage.removeItem("token");

            window.location.href =
                "login.html";

        }
    );

}


// ========================================
// LOAD PROJECTS
// ========================================

async function loadAdminProjects() {

    try {

        dashboardMessage.textContent =
            "Loading projects...";


        const response =
            await fetch(
                `${API_URL}/projects`,
                {
                    method: "GET",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            if (response.status === 401) {

                localStorage.removeItem("token");

                window.location.href =
                    "login.html";

                return;

            }

            throw new Error(
                data.message ||
                "Failed to load projects"
            );

        }


        const projects =
            data.projects || [];


        dashboardMessage.textContent =
            "";


        projectCount.textContent =
            `${projects.length} ${
                projects.length === 1
                    ? "Project"
                    : "Projects"
            }`;


        adminProjectList.innerHTML =
            "";


        if (projects.length === 0) {

            adminProjectList.innerHTML = `

                <div class="empty-projects">

                    <h3>
                        No projects yet
                    </h3>

                    <p>
                        Add your first portfolio project
                        using the form above.
                    </p>

                </div>

            `;

            return;

        }


        projects.forEach(
            project => {

                createProjectCard(project);

            }
        );


    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );


        dashboardMessage.textContent =
            error.message;

    }

}


// ========================================
// CREATE PROJECT CARD
// ========================================

function createProjectCard(project) {

    const card =
        document.createElement("article");


    card.className =
        "admin-project-card";


    const technologies =
        Array.isArray(project.technologies)
            ? project.technologies
            : [];


    const technologiesHTML =
        technologies
            .map(
                technology => `
                    <span>
                        ${escapeHTML(technology)}
                    </span>
                `
            )
            .join("");


    card.innerHTML = `

        <div class="admin-project-content">

            <div class="admin-project-top">

                <span class="project-category">
                    ${escapeHTML(
                        project.category ||
                        "Project"
                    )}
                </span>

                ${
                    project.featured
                        ? `
                            <span class="project-featured">
                                Featured
                            </span>
                        `
                        : ""
                }

            </div>


            <h3>
                ${escapeHTML(
                    project.title
                )}
            </h3>


            <p class="admin-project-description">
                ${escapeHTML(
                    project.description
                )}
            </p>


            <div class="project-tech">

                ${technologiesHTML}

            </div>


            <div class="admin-project-actions">

                <button
                    type="button"
                    class="button button-secondary edit-project-btn"
                    data-id="${project._id}"
                >
                    Edit
                </button>


                <button
                    type="button"
                    class="button button-danger delete-project-btn"
                    data-id="${project._id}"
                >
                    Delete
                </button>

            </div>

        </div>

    `;


    adminProjectList.appendChild(card);


    // Edit

    const editButton =
        card.querySelector(
            ".edit-project-btn"
        );


    editButton.addEventListener(
        "click",
        () => {

            startEditProject(project);

        }
    );


    // Delete

    const deleteButton =
        card.querySelector(
            ".delete-project-btn"
        );


    deleteButton.addEventListener(
        "click",
        () => {

            deleteProject(project._id);

        }
    );

}


// ========================================
// ADD / UPDATE PROJECT
// ========================================

projectForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        projectMessage.textContent =
            "Saving project...";


        const technologies =
            projectTechnologies.value
                .split(",")
                .map(
                    technology =>
                        technology.trim()
                )
                .filter(
                    technology =>
                        technology.length > 0
                );


        const projectData = {

            title:
                projectTitle.value.trim(),

            description:
                projectDescription.value.trim(),

            category:
                projectCategory.value.trim(),

            technologies,

            githubUrl:
                projectGithub.value.trim(),

            liveUrl:
                projectLive.value.trim(),

            image:
                projectImage.value.trim(),

            featured:
                projectFeatured.checked

        };


        try {

            const isEditing =
                projectId.value !== "";


            const url =
                isEditing
                    ? `${API_URL}/projects/${projectId.value}`
                    : `${API_URL}/projects`;


            const method =
                isEditing
                    ? "PUT"
                    : "POST";


            const response =
                await fetch(
                    url,
                    {
                        method,

                        headers: {

                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`

                        },

                        body:
                            JSON.stringify(
                                projectData
                            )

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                if (response.status === 401) {

                    localStorage.removeItem(
                        "token"
                    );

                    window.location.href =
                        "login.html";

                    return;

                }


                throw new Error(
                    data.message ||
                    "Failed to save project"
                );

            }


            projectMessage.textContent =
                isEditing
                    ? "Project updated successfully."
                    : "Project added successfully.";


            resetProjectForm();


            await loadAdminProjects();


        } catch (error) {

            console.error(
                "Save project error:",
                error
            );


            projectMessage.textContent =
                error.message;

        }

    }
);


// ========================================
// START EDIT
// ========================================

function startEditProject(project) {

    projectId.value =
        project._id;


    projectTitle.value =
        project.title || "";


    projectDescription.value =
        project.description || "";


    projectCategory.value =
        project.category || "";


    projectTechnologies.value =
        Array.isArray(project.technologies)
            ? project.technologies.join(", ")
            : "";


    projectGithub.value =
        project.githubUrl || "";


    projectLive.value =
        project.liveUrl || "";


    projectImage.value =
        project.image || "";


    projectFeatured.checked =
        project.featured || false;


    projectFormHeading.textContent =
        "Edit Project";


    projectSubmitBtn.textContent =
        "Update Project";


    cancelEditBtn.style.display =
        "inline-flex";


    projectMessage.textContent =
        "";


    projectForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


// ========================================
// CANCEL EDIT
// ========================================

cancelEditBtn.addEventListener(
    "click",
    () => {

        resetProjectForm();

    }
);


// ========================================
// RESET FORM
// ========================================

function resetProjectForm() {

    projectForm.reset();


    projectId.value =
        "";


    projectFormHeading.textContent =
        "Add New Project";


    projectSubmitBtn.textContent =
        "Add Project";


    cancelEditBtn.style.display =
        "none";


    setTimeout(
        () => {

            projectMessage.textContent =
                "";

        },
        2500
    );

}


// ========================================
// DELETE PROJECT
// ========================================

async function deleteProject(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this project?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/projects/${id}`,
                {
                    method: "DELETE",

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            if (response.status === 401) {

                localStorage.removeItem(
                    "token"
                );

                window.location.href =
                    "login.html";

                return;

            }


            throw new Error(
                data.message ||
                "Failed to delete project"
            );

        }


        await loadAdminProjects();


    } catch (error) {

        console.error(
            "Delete project error:",
            error
        );


        dashboardMessage.textContent =
            error.message;

    }

}


// ========================================
// SECURITY HELPERS
// ========================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// ========================================
// INITIAL LOAD
// ========================================

loadAdminProjects();