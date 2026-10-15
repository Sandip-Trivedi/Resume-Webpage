const MATCHER_API_URL = " https://ai-resume-match.workers.dev";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("match-form");
    const jobDescription = document.getElementById("job-description");
    const submitButton = document.getElementById("match-submit");
    const status = document.getElementById("match-status");
    const results = document.getElementById("match-results");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        results.hidden = true;
        status.classList.remove("is-error");

        if (!MATCHER_API_URL) {
            status.textContent = "AI matching is not configured yet. Deploy the Worker and set MATCHER_API_URL in recruiter.js.";
            status.classList.add("is-error");
            return;
        }

        const description = jobDescription.value.trim();
        if (!description) {
            status.textContent = "Paste a job description before analyzing.";
            status.classList.add("is-error");
            return;
        }

        submitButton.disabled = true;
        status.textContent = "Comparing the job description with my profile...";

        try {
            const response = await fetch(MATCHER_API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    jobDescription: description,
                    profile: createCandidateProfile()
                })
            });
            const payload = await response.json();
            if (!response.ok) {
                throw new Error(payload.error || "The match could not be generated. Please try again.");
            }

            renderMatch(payload);
            status.textContent = "";
        } catch (error) {
            status.textContent = error.message || "Unable to reach the AI service. Please try again later.";
            status.classList.add("is-error");
        } finally {
            submitButton.disabled = false;
        }
    });
});

function createCandidateProfile() {
    const stripMarkup = (value) => value.replace(/<[^>]*>/g, " ");
    const experiences = ResumeStrings.experiences.map((experience) => [
        `${experience.role} at ${experience.company} (${experience.duration})`,
        ...(Array.isArray(experience.desc) ? experience.desc : [experience.desc]),
        experience.products ? `Products: ${experience.products}` : "",
        experience.technologies ? `Technologies: ${experience.technologies}` : ""
    ].filter(Boolean).join("\n")).join("\n\n");
    const projects = ResumeStrings.projects.map((project) => [
        project.name,
        `Technologies: ${project.tech}`,
        ...(Array.isArray(project.desc) ? project.desc : [project.desc])
    ].join("\n")).join("\n\n");

    return [
        `${ResumeStrings.name} — ${ResumeStrings.title}`,
        ResumeStrings.summaryText,
        "Technical skills:",
        ...ResumeStrings.techList.map(stripMarkup),
        "Professional experience:",
        experiences,
        "Selected projects:",
        projects
    ].join("\n\n");
}

function renderMatch(match) {
    document.getElementById("match-score").textContent = String(match.score);
    document.getElementById("match-summary").textContent = match.summary;
    document.getElementById("match-recommendation").textContent = match.recommendation;
    renderList("match-strengths", match.strengths);
    renderList("match-gaps", match.gaps);
    document.getElementById("match-results").hidden = false;
}

function renderList(elementId, items) {
    const list = document.getElementById(elementId);
    list.replaceChildren();
    items.forEach((item) => {
        const entry = document.createElement("li");
        entry.textContent = item;
        list.appendChild(entry);
    });
}
