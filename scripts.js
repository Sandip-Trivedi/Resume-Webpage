// Inject content programmatically into DOM after loading
document.addEventListener("DOMContentLoaded", () => {
    // Header & Hero Profile
    document.getElementById("profile-name").innerText = ResumeStrings.name;
    document.getElementById("profile-title").innerText = ResumeStrings.title;

    // Contact CTA buttons
    document.getElementById("btn-download").href = ResumeStrings.resumeDownloadUrl;
    // document.getElementById("btn-email").href = `mailto:${ResumeStrings.email}`;
    document.getElementById("btn-call").href = `tel:${ResumeStrings.phone}`;
    document.getElementById("btn-git").href = ResumeStrings.github;

    // About/Summary section
    document.getElementById("summary-title").innerText = ResumeStrings.summaryTitle;
    document.getElementById("summary-text").innerText = ResumeStrings.summaryText;

    const linkedinBtn = document.getElementById("btn-linkedin");
    if (linkedinBtn) {
        linkedinBtn.onclick = function(e) {
            e.preventDefault(); // Prevents page from jumping or reloading            
            if (typeof openLinkModal === "function") {
                openLinkModal("LinkedIn Profile", ResumeStrings.linkedin);
            } else {
                alert("Modal system error: modal.js is not loaded correctly. Opening link directly instead.");
                window.open(ResumeStrings.linkedin, "_blank");
            }
        };
    } else {
        console.error("HTML Error: Could not find an element with id='btn-linkedin'");
    }
    document.getElementById("tech-title").innerText = ResumeStrings.techTitle;
    const techUl = document.getElementById("tech-list");
    ResumeStrings.techList.forEach(item => {
        let li = document.createElement("li");
        li.innerText = item;
        techUl.appendChild(li);
    });

    document.getElementById("exp-title").innerText = ResumeStrings.expTitle;
    const expDiv = document.getElementById("exp-container");
    ResumeStrings.experiences.forEach(exp => {
    let block = document.createElement("div");
    block.className = "experience-card";
        block.innerHTML = `
        <h4>${exp.role} <span>@ ${exp.company}</span></h4>
        <small>${exp.duration}</small>
        <div><medium">${exp.desc}</medium></div></br>
        <div class="nested-projects-container"></div>
    `;
    expDiv.appendChild(block);

    // 2. Find the nested-projects-container we just injected into THIS specific company block
    const nestedContainer = block.querySelector(".nested-projects-container");

    // 3. Loop through and append projects directly to this company card
    if (exp.projects && exp.projects.length > 0) {
        exp.projects.forEach(p => {
            let card = document.createElement("div");
            card.className = "project-card nested-project-card";
            card.innerHTML = `
                <h3>${p.name}</h3>
                <span class="tech-badge">${p.tech}</span>
                <p>${p.desc}</p>
                <a href="${p.link}" target="_blank" class="project-link">View on App Store ↗</a>
            `;
            nestedContainer.appendChild(card);
        });
    }
});

    // Inject Projects
    document.getElementById("projects-title").innerText = ResumeStrings.projectsTitle;
    const projGrid = document.getElementById("projects-grid");
    ResumeStrings.projects.forEach(p => {
        let card = document.createElement("div");
        card.className = "project-card";
        card.innerHTML = `
            <h3>${p.name}</h3>
            <span class="tech-badge">${p.tech}</span>
            <p>${p.desc}</p>
            <a href="${p.link}" target="_blank" class="project-link">View on App Store ↗</a>
        `;
        projGrid.appendChild(card);
    });
});
// document.getElementById("personal-title").innerText = ResumeStrings.personalDetailsTitle;
const personalDiv = document.getElementById("personal-container");
ResumeStrings.personalDetails.forEach(detail => {
    let row = document.createElement("div");
    row.className = "detail-row";
    row.innerHTML = `<strong>${detail.label}:</strong> <span>${detail.value}</span>`;
    personalDiv.appendChild(row);
});
document.getElementById("btn-email").onclick = (e) => {
    e.preventDefault();
    sendCV(ResumeStrings.email);
};