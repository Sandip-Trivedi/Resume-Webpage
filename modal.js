function sendCV(emailAddress) {
    const subject = encodeURIComponent("Mobile Engineer Position Inquiry - Sandip Trivedi");
    window.location.href = `mailto:${emailAddress}?subject=${subject}`;
}

// 2. Handle Safe Local Asset Resume Downloads
function downloadCV(fileUrl) {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "Sandip_Trivedi_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 3. Dynamic Modal Overlay Generator (LinkedIn / GitHub Framework)
function openLinkModal(title, destinationUrl) {
    // Prevent duplicate layers from breaking focus
    const standardOldModal = document.getElementById("custom-link-modal");
    if (standardOldModal) standardOldModal.remove();

    // Create dark backing screen
    const modalOverlay = document.createElement("div");
    modalOverlay.id = "custom-link-modal";
    modalOverlay.className = "modal-overlay";

    // Build functional container structure
    modalOverlay.innerHTML = `
        <div class="modal-box">
            <h4>Navigate to ${title}</h4></br>
            <div class="modal-actions">
                <button id="modal-btn-open" class="m-btn m-btn-primary">Open Linkedin</button>
                <button id="modal-btn-copy" class="m-btn m-btn-secondary">Copy URL</button>
                <button id="modal-btn-close" class="m-btn m-btn-close">Cancel</button>
            </div>
        </div>
    `;
    document.body.appendChild(modalOverlay);

    // ACTION A: Open redirect endpoint target in a fresh browser tab
    document.getElementById("modal-btn-open").onclick = () => {
        window.open(destinationUrl, "_blank");
        modalOverlay.remove();
    };

    // ACTION B: Copy link string directly to user clipboard
    document.getElementById("modal-btn-copy").onclick = () => {
        navigator.clipboard.writeText(destinationUrl)
            .then(() => {
                alert("URL copied successfully to clipboard!");
            })
            .catch(() => {
                alert("Failed to copy link automatically.");
            });
        modalOverlay.remove();
    };

    // ACTION C: Close popup window safely
    document.getElementById("modal-btn-close").onclick = () => modalOverlay.remove();
    
    // Tap-outside backdrop cancellation protection rule
    modalOverlay.onclick = (e) => { 
        if (e.target === modalOverlay) modalOverlay.remove(); 
    };
}
