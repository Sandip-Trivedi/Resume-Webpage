// Analysis targets: a requirement of 8-15 years is the preferred experience range.
const BEST_MATCH_MIN_YEARS = 8;
const BEST_MATCH_MAX_YEARS = 15;
// Experience fit below 70% is not matched; higher non-best fits are average.
const AVERAGE_MATCH_MIN_FIT_PERCENT = 70;
// Resume summary states 10 years in iOS; related iOS technologies use that same tenure as an estimate.
const IOS_CANDIDATE_YEARS = 10;
// Replace this placeholder locally; client-side passwords are visible in the page source.
const DEVELOPER_PASSWORD = "change-this-developer-password";
const IOS_RELATED_SKILLS = [
    "iOS", "iPhone", "iPad", "Swift", "SwiftUI", "UIKit", "Objective-C", "Objective C",
    "CoreBluetooth", "Cocoa Touch", "iOS development", "mobile development"
];

document.addEventListener("DOMContentLoaded", () => {
    const jobDescription = document.getElementById("job-description");
    const submitButton = document.getElementById("match-submit");
    const staticMatchButton = document.getElementById("static-match");
    const aiMatchDialog = document.getElementById("ai-match-dialog");
    const status = document.getElementById("match-status");
    const results = document.getElementById("match-results");
    const calculationToggle = document.getElementById("match-calculation-toggle");
    const calculationData = document.getElementById("match-calculation-data");

    calculationToggle.addEventListener("click", () => {
        const expanded = calculationToggle.getAttribute("aria-expanded") === "true";
        if (!expanded) {
            const password = window.prompt("Enter the developer password to view the mathematical data:");
            if (password !== DEVELOPER_PASSWORD) {
                if (password !== null) {
                    window.alert("Incorrect developer password.");
                }
                return;
            }
        }
        calculationToggle.setAttribute("aria-expanded", String(!expanded));
        calculationData.hidden = expanded;
        calculationToggle.textContent = expanded ? "Show mathematical data" : "Hide mathematical data";
    });

    submitButton.addEventListener("click", () => {
        aiMatchDialog.showModal();
    });
    document.getElementById("ai-match-dialog-close").addEventListener("click", () => {
        aiMatchDialog.close();
    });

    staticMatchButton.addEventListener("click", async () => {
        results.hidden = true;
        status.classList.remove("is-error");

        const description = jobDescription.value.trim();
        if (!description) {
            status.textContent = "Paste a job description before analyzing.";
            status.classList.add("is-error");
            return;
        }

        submitButton.disabled = true;
        staticMatchButton.disabled = true;
        const progress = document.getElementById("static-match-progress");
        progress.hidden = false;
        progress.value = 0;
        progress.max = 2;

        try {
            for (let secondsRemaining = 2; secondsRemaining > 0; secondsRemaining -= 1) {
                progress.value = 2 - secondsRemaining;
                await new Promise((resolve) => window.setTimeout(resolve, 1000));
            }
            progress.value = 2;

            const match = createStaticMatch(description);
            if (!match) {
                status.textContent = "No skills from the static weight catalog were found in the job description.";
                status.classList.add("is-error");
                return;
            }

            renderMatch(
                match,
                "Skill Weight Analysis",
                "This estimate uses configured skill weights only. It is informational and not a hiring decision."
            );
            status.textContent = "Skill weight analysis complete.";
        } catch (error) {
            status.textContent = error.message || "Unable to calculate the static match.";
            status.classList.add("is-error");
        } finally {
            progress.hidden = true;
            submitButton.disabled = false;
            staticMatchButton.disabled = false;
        }
    });

});

function createStaticMatch(description) {
    const catalog = JSON.parse(document.getElementById("skill-weightages").textContent);
    const matched = catalog.map((entry) => {
        const occupiedRanges = [];
        const keywords = [...entry.keywords].sort((a, b) => b.length - a.length);
        for (const keyword of keywords) {
            const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const skillPattern = new RegExp(`(^|[^a-z0-9])(${escapedKeyword})(?=$|[^a-z0-9])`, "gi");
            for (const match of description.matchAll(skillPattern)) {
                const start = match.index + match[1].length;
                const end = start + match[2].length;
                if (!occupiedRanges.some((range) => start < range.end && end > range.start)) {
                    occupiedRanges.push({ start, end });
                }
            }
        }
        return { ...entry, mentions: occupiedRanges.length };
    }).filter((entry) => entry.mentions > 0);
    if (matched.length === 0) return null;

    const weightedSkills = matched.map((entry) => ({
        skill: entry.skill,
        weightage: Number.parseInt(entry.weightage, 10),
        mentions: entry.mentions
    }));
    const totalMentions = weightedSkills.reduce((total, entry) => total + entry.mentions, 0);
    const score = Math.round(weightedSkills.reduce((total, entry) => total + entry.weightage * entry.mentions, 0) / totalMentions);
    const skillWeights = weightedSkills
        .map((entry) => ({ ...entry, weightedPoints: entry.weightage * entry.mentions }))
        .sort((a, b) => b.weightedPoints - a.weightedPoints);
    const experienceMatches = findExperienceMatches(description);
    const lowerWeightMatches = weightedSkills
        .filter((entry) => entry.weightage < 60)
        .map((entry) => `${entry.skill} — ${entry.weightage}% profile weight, mentioned ${entry.mentions} ${entry.mentions === 1 ? "time" : "times"}`);

    return {
        score,
        summary: `Found ${totalMentions} skill mention${totalMentions === 1 ? "" : "s"} across ${matched.length} configured skill${matched.length === 1 ? "" : "s"}. The score is weighted by mention frequency.`,
        strengths: [],
        skillWeights,
        experienceMatches,
        gaps: lowerWeightMatches.length ? lowerWeightMatches : ["No low-weight matches among the configured skills."],
        recommendation: "These static weights are estimates. Use the AI match for a contextual comparison of responsibilities and experience."
    };
}

function findExperienceMatches(description) {
    const matches = [];
    const seenRequirements = new Set();
    const yearPatterns = [
        /\b(\d{1,2})\s*(?:-|–|to)\s*(\d{1,2})\s*(?:years?|yrs?)\b/i,
        /\b(?:at least|minimum(?: of)?|more than|over)\s+(\d{1,2})\s*\+?\s*(?:years?|yrs?)\b/i,
        /\b(\d{1,2})\s*\+?\s*(?:years?|yrs?)\b/i
    ];

    for (const skill of IOS_RELATED_SKILLS) {
        const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const skillPattern = new RegExp(`(^|[^a-z0-9])(${escapedSkill})(?=$|[^a-z0-9])`, "gi");
        for (const skillMatch of description.matchAll(skillPattern)) {
            const skillStart = skillMatch.index + skillMatch[1].length;
            const contextStart = Math.max(0, skillStart - 60);
            const contextEnd = Math.min(description.length, skillStart + skillMatch[2].length + 60);
            const context = description.slice(contextStart, contextEnd);
            const yearMatch = yearPatterns.map((pattern) => pattern.exec(context)).find(Boolean);
            if (!yearMatch) continue;

            const minYears = Number(yearMatch[1]);
            const maxYears = yearMatch[2] ? Number(yearMatch[2]) : Number.POSITIVE_INFINITY;
            const requirementKey = `${contextStart + yearMatch.index}:${minYears}-${maxYears}`;
            if (seenRequirements.has(requirementKey)) continue;
            seenRequirements.add(requirementKey);

            const candidateMeetsRequirement = IOS_CANDIDATE_YEARS >= minYears && IOS_CANDIDATE_YEARS <= maxYears;
            const bestMatch = candidateMeetsRequirement &&
                IOS_CANDIDATE_YEARS >= BEST_MATCH_MIN_YEARS &&
                IOS_CANDIDATE_YEARS <= BEST_MATCH_MAX_YEARS;
            const fitPercent = candidateMeetsRequirement
                ? 100
                : Math.max(0, Math.min(100, Math.round((Math.min(IOS_CANDIDATE_YEARS, maxYears) / Math.max(IOS_CANDIDATE_YEARS, minYears)) * 100)));
            const matchLevel = bestMatch
                ? "Best match"
                : fitPercent >= AVERAGE_MATCH_MIN_FIT_PERCENT
                    ? "Average match"
                    : "Not matched";

            matches.push({
                skill: skillMatch[2],
                candidateYears: IOS_CANDIDATE_YEARS,
                minYears,
                maxYears,
                fitPercent,
                matchLevel
            });
        }
    }

    return matches;
}

function renderMatch(match, type, disclaimer) {
    document.getElementById("match-type").textContent = type;
    document.getElementById("match-score").textContent = `${match.score}%`;
    document.getElementById("match-summary").textContent = match.summary;
    document.getElementById("match-disclaimer").textContent = disclaimer;
    if (match.skillWeights) {
        renderSkillWeights("match-strengths", match.skillWeights);
        renderCalculation(match);
    } else {
        renderSkillWeights("match-strengths", []);
        renderList("match-strengths", match.strengths);
        document.getElementById("match-calculation").hidden = true;
    }
    renderExperienceMatches(match.experienceMatches || []);
    renderList("match-gaps", match.gaps);
    document.getElementById("match-results").hidden = false;
}

function renderCalculation(match) {
    const container = document.getElementById("match-calculation");
    const toggle = document.getElementById("match-calculation-toggle");
    const data = document.getElementById("match-calculation-data");
    const totalMentions = match.skillWeights.reduce((total, skill) => total + skill.mentions, 0);
    const totalPoints = match.skillWeights.reduce((total, skill) => total + skill.weightedPoints, 0);

    data.replaceChildren();
    match.skillWeights.forEach((skill) => {
        const line = document.createElement("p");
        line.textContent = `${skill.skill}: ${skill.weightage}% × ${skill.mentions} ${skill.mentions === 1 ? "mention" : "mentions"} = ${skill.weightedPoints} points`;
        data.appendChild(line);
    });

    const formula = document.createElement("p");
    formula.textContent = `Total: ${totalPoints} ÷ ${totalMentions} mentions = ${match.score}%`;
    data.appendChild(formula);
    data.hidden = true;
    toggle.textContent = "Show mathematical data";
    toggle.setAttribute("aria-expanded", "false");
    container.hidden = false;
}

function renderExperienceMatches(matches) {
    const section = document.getElementById("match-experience");
    const list = document.getElementById("match-experience-list");
    list.replaceChildren();
    section.hidden = matches.length === 0;

    matches.forEach((match) => {
        const entry = document.createElement("li");
        const label = document.createElement("span");
        const bar = document.createElement("div");
        const fill = document.createElement("div");
        const requirement = match.maxYears === Number.POSITIVE_INFINITY
            ? `${match.minYears}+`
            : match.minYears === match.maxYears
                ? String(match.minYears)
                : `${match.minYears}-${match.maxYears}`;
        label.textContent = `${match.skill}: ${requirement} years required; ${match.candidateYears} years in profile — ${match.matchLevel}`;
        bar.className = "match-experience-bar";
        bar.setAttribute("role", "progressbar");
        bar.setAttribute("aria-label", `${match.skill} experience fit`);
        bar.setAttribute("aria-valuemin", "0");
        bar.setAttribute("aria-valuemax", "100");
        bar.setAttribute("aria-valuenow", String(match.fitPercent));
        bar.setAttribute("aria-valuetext", `${match.fitPercent}% experience fit`);
        fill.className = `match-experience-bar-fill is-${match.matchLevel.toLowerCase().replace(/\s+/g, "-")}`;
        fill.style.width = `${match.fitPercent}%`;
        bar.appendChild(fill);
        entry.append(label, bar);
        list.appendChild(entry);
    });
}

function renderSkillWeights(elementId, skills) {
    const list = document.getElementById(elementId);
    list.replaceChildren();
    list.classList.add("is-weighted");
    const maxPoints = Math.max(...skills.map((skill) => skill.weightedPoints), 1);

    skills.forEach((skill) => {
        const entry = document.createElement("li");
        const label = document.createElement("span");
        const bar = document.createElement("div");
        const fill = document.createElement("div");
        const barValue = Math.round((skill.weightedPoints / maxPoints) * 100);

        label.textContent = skill.skill;
        label.className = "match-weight-label";
        bar.className = "match-weight-bar";
        bar.setAttribute("role", "progressbar");
        bar.setAttribute("aria-label", `${skill.skill} weighted contribution`);
        bar.setAttribute("aria-valuemin", "0");
        bar.setAttribute("aria-valuemax", "100");
        bar.setAttribute("aria-valuenow", String(barValue));
        bar.setAttribute("aria-valuetext", `${skill.weightedPoints} weighted points`);
        fill.className = "match-weight-bar-fill";
        fill.style.width = `${barValue}%`;
        bar.appendChild(fill);
        entry.append(label, bar);
        list.appendChild(entry);
    });
}

function renderList(elementId, items) {
    const list = document.getElementById(elementId);
    list.replaceChildren();
    list.classList.remove("is-weighted");
    items.forEach((item) => {
        const entry = document.createElement("li");
        entry.textContent = item;
        list.appendChild(entry);
    });
}
