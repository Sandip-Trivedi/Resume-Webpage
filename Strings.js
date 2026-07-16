const ResumeStrings = {
    // Personal Details
    name: "Sandip Trivedi",
    title: "Lead Software Engineer - Mobile | Project Manager",
    phone: "+919409072687",
    email: "sandiptrivedi07@gmail.com",
    linkedin: "https://www.linkedin.com/in/sandip-trivedi-6a558323",
    github: "https://github.com/Sandip-Trivedi", // Placeholder Git link
    resumeDownloadUrl: "https://drive.google.com/file/d/1-yR3Kw42zVP7ukMaQEnRkaWCwtPh_nmV/view?usp=sharing", // Add your uploaded PDF link here
    profilePicUrl: "https://drive.google.com/thumbnail?id=1tO1EBm4-cXJf8rjVJvpWrWIBNNjd-O4B&sz=w140",
    navExperience: "Professional Experience",

    // Profile Summary
    summaryTitle: "Career Summary",
    summaryText: "Results-driven Lead Software Engineer - Mobile | Project Manager with extensive experience in leading teams, managing complex projects, and driving strategic initiatives. Total 12 years of experience in IT, featuring 4+ years as a Tech Lead and 10 years as a Mobile Engineer (iOS + Android). Led teams of up to 8 developers, successfully delivering multiple high-impact projects.",

    // Tech Stack
    techTitle: "Technical Expertise",
    techList: [
        "Languages & Frameworks: SwiftUI, Swift 5.1, Objective-C, Android-Kotlin, Flutter-Dart, React JS, TypeScript, HTML, CSS",
        "Project Management: Agile, Scrum, JIRA, Bitbucket, Git, CI/CD (Fastlane, App Center)",
        "Databases & Cloud: Realm, Core Data, SQLite, AWS, Azure"
    ],

    // Experience
    expTitle: "Professional Experience",
    experiences: [
        { role: "Sr. Software Engineer - Mobile", company: "3M TCoE", duration: "Nov 2021 - Current",desc:'Create structure containing job details and an empty container for its nested projectsCreate structure containing job details and an empty container for its nested projectsCreate structure containing job details and an empty container for its nested projectsCreate structure containing job details and an empty container for its nested projectsCreate structure containing job details and an empty container for its nested projects',
        projects: [
            {
                name: "DR TRUST (360 Health Companion)",
                tech: "SwiftUI | Core BLE | Realm | Machine Learning",
                desc: "US and Indian Health monitoring app with 100k+ users. Connects to Bluetooth weighing machines, BP apparatuses, and portable ECGs seamlessly.",
                link: "https://apple.com"
            },
            {
                name: "POST IT",
                tech: "Swift | Core Data | Clean Architecture | MVVM",
                desc: "Iconic note-taking application designed with dynamic graphic add-ons and millions of active users worldwide.",
                link: "https://apple.com"
            },
            {
                name: "3M SAFE GUARD",
                tech: "QR Code Scanning | Core ML | AR Mask | Vision",
                desc: "An enterprise-grade anti-counterfeit QR Code scanning application that uses machine learning to determine product authenticity.",
                link: "https://apple.com"
            }]
        },
        { role: "Lead Consultant", company: "ITC Infotech", duration: "Feb 2020 – Oct 2021" ,desc:'desc',
        projects: [
            {
                name: "DR TRUST (360 Health Companion)",
                tech: "SwiftUI | Core BLE | Realm | Machine Learning",
                desc: "US and Indian Health monitoring app with 100k+ users. Connects to Bluetooth weighing machines, BP apparatuses, and portable ECGs seamlessly.",
                link: "https://apple.com"
            },
            {
                name: "3M SAFE GUARD",
                tech: "QR Code Scanning | Core ML | AR Mask | Vision",
                desc: "An enterprise-grade anti-counterfeit QR Code scanning application that uses machine learning to determine product authenticity.",
                link: "https://apple.com"
            }]},
        { role: "Full Stack Mobile App Developer", company: "Freelance", duration: "Oct 2018 – Jan 2020",desc:'desc',         projects: [
            {
                name: "DR TRUST (360 Health Companion)",
                tech: "SwiftUI | Core BLE | Realm | Machine Learning",
                desc: "US and Indian Health monitoring app with 100k+ users. Connects to Bluetooth weighing machines, BP apparatuses, and portable ECGs seamlessly.",
                link: "https://apple.com"
            },
            {
                name: "3M SAFE GUARD",
                tech: "QR Code Scanning | Core ML | AR Mask | Vision",
                desc: "An enterprise-grade anti-counterfeit QR Code scanning application that uses machine learning to determine product authenticity.",
                link: "https://apple.com"
            }]}
    ],

    // Featured Projects
    projectsTitle: "App Portfolios",
    projects: [
        {
            name: "DR TRUST (360 Health Companion)",
            tech: "SwiftUI | Core BLE | Realm | Machine Learning",
            desc: "US and Indian Health monitoring app with 100k+ users. Connects to Bluetooth weighing machines, BP apparatuses, and portable ECGs seamlessly.",
            link: "https://apple.com"
        },
        {
            name: "POST IT",
            tech: "Swift | Core Data | Clean Architecture | MVVM",
            desc: "Iconic note-taking application designed with dynamic graphic add-ons and millions of active users worldwide.",
            link: "https://apple.com"
        },
        {
            name: "3M SAFE GUARD",
            tech: "QR Code Scanning | Core ML | AR Mask | Vision",
            desc: "An enterprise-grade anti-counterfeit QR Code scanning application that uses machine learning to determine product authenticity.",
            link: "https://apple.com"
        },
        {
            name: "HOME CONNECT",
            tech: "Home Automation | IoT | Core Animation | MVVM",
            desc: "A powerful smart automation ecosystem application allowing users to monitor and operate home appliances remotely.",
            link: "https://apple.com"
        }
    ],
    personalDetailsTitle: "Personal Profile Details",
    personalDetails: [
    { label: "Full Name", value: "Sandip Trivedi" },
    { label: "Current Location", value: "Ahmedabad, Gujarat, India" },
    { label: "Nationality", value: "Indian" },
    { label: "Languages", value: "English, Hindi, Gujarati" }
    ]
};

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
document.getElementById("personal-title").innerText = ResumeStrings.personalDetailsTitle;
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
