const words = ["demos", "meetings", "screen recordings", "teaching"];
const container = document.getElementById("rotating-text");
let currentIndex = 0;

function rotateText() {
    // Start exit animation
    container.classList.add("slide-out");

    setTimeout(() => {
        // Change text
        currentIndex = (currentIndex + 1) % words.length;
        container.textContent = words[currentIndex];
        
        // Reset classes for entry animation
        container.classList.remove("slide-out");
        container.classList.add("slide-in");
        
        // Clean up entry class after animation finishes
        setTimeout(() => {
            container.classList.remove("slide-in");
        }, 500); // Match CSS transition duration
        
    }, 500); // Half of total cycle or match exit duration
}

// Start rotation loop
setInterval(rotateText, 3000);
