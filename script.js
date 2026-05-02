const API_URL = window.location.origin;

// Purane local storage functions ko replace karein:
async function loadFromLocal() {
    try {
        const response = await fetch(`${API_URL}/api/data`);
        const data = await response.json();
        if (data) {
            config = data.config || config;
            students = data.students || [];
            attendances = data.attendances || [];
            
            // UI Updates
            renderShiftList();
            if(config.libName) {
                document.getElementById('displayLibName').innerText = config.libName;
                document.getElementById('displayUPI').innerText = "Pay to: " + config.upi;
            }
        }
    } catch (err) { console.log("Initial load error:", err); }
}

async function saveToLocal() {
    const fullData = { config, students, attendances };
    try {
        await fetch(`${API_URL}/api/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fullData)
        });
    } catch (err) { console.error("Save error:", err); }
}
