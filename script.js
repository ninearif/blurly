const targetWords = ["meetings", "screen recording", "tutorials", "demos", "presentations", "calls"];
let currentIndex = 0;
const container = document.getElementById("rotating-text");
// Store original class for re-applying
const baseClass = "rotating-text";

// Initialization
container.innerHTML = "";
container.classList.remove(baseClass); // Remove old class if present
container.classList.add("text-spinner");

// Create initial state
const initialReel = document.createElement("div");
initialReel.classList.add("text-reel");
const initialItem = document.createElement("div");
initialItem.classList.add("text-item");
initialItem.textContent = "demos"; // Start with demos
initialReel.appendChild(initialItem);
container.appendChild(initialReel);

// Set initial width
// We need to wait for layout to get correct width, but for now let's set it dynamically in spin
// Or we can force a width update
updateWidth(initialItem);

function updateWidth(item) {
    // Temporarily add to DOM to measure if needed, but here it is in DOM
    // We want the container to animate its width
    const width = item.offsetWidth;
    container.style.width = scrollX + "px"; // Just kidding, use standard logic
    container.style.transition = "width 0.5s ease-out";
    container.style.width = `${width}px`;
}

async function spin() {
    const nextWord = targetWords[currentIndex];
    currentIndex = (currentIndex + 1) % targetWords.length;

    const currentReel = container.querySelector('.text-reel');
    const currentItem = currentReel.lastElementChild; // Since we are using column-reverse (bottom is last in DOM? No wait)
    // flex-direction: column-reverse means first child is at bottom. 
    // Let's stick to standard column and create items:
    // [Target]
    // [Random]
    // [Random]
    // [Current]
    // And animate translateY from -Height*(N-1) to 0.

    // Let's rebuild the logic to match the user's request more closely but adapted for words

    const height = container.clientHeight;

    // Create new reel
    const newReel = document.createElement('div');
    newReel.classList.add('text-reel');
    newReel.style.flexDirection = 'column'; // Standard stacking

    // Construct pool: [Target, ...Randoms, Current]
    // But we are animating TO the target (top).
    // So visual order (top to bottom):
    // Target
    // Random 1
    // ...
    // Current (visible)

    // So we translate from -Y (showing current) to 0 (showing target).

    const pool = [nextWord];
    // Add some random filler words to simulate speed
    const fillers = ["working", "sharing", "calls", "coding", "recording"];
    for (let i = 0; i < 5; i++) {
        pool.push(fillers[Math.floor(Math.random() * fillers.length)]);
    }
    // Add current word at the bottom
    pool.push(currentReel.firstElementChild.textContent);

    // Populate new reel
    pool.forEach(text => {
        const box = document.createElement('div');
        box.classList.add('text-item');
        box.textContent = text;
        newReel.appendChild(box);
    });

    // Initial position: showing the bottom item (Current)
    // Height of one item is roughly 'height'
    // Total items: pool.length
    // Position to show bottom item: translateY( - (pool.length - 1) * 100% ) ? NO.
    // simpler: translateY( - (pool.length - 1) * height px )

    // Measure target width before animating
    // We need to append to get width
    // To avoid flash, maybe visibility hidden?
    // Actually, let's just replace the reel immediately but set the transform

    // Fix: We need to set the width of the updated container first?
    // Let's do the reel swap

    newReel.style.transform = `translateY(-${(pool.length - 1) * 100}%)`;
    // Note: using % of the reel height might be tricky if reel height isn't fixed relative to item count.
    // Easier to use em or calc if height is known.
    // Let's assume height is handled by flex/container.
    // Actually, % on `translateY` refers to the element's own height.
    // Element height = N * ItemHeight.
    // We want to shift up by (N-1) items.
    // Shift = (N-1) / N * 100 %. 

    const shiftPercentage = ((pool.length - 1) / pool.length) * 100;
    newReel.style.transform = `translateY(-${shiftPercentage}%)`;
    newReel.style.transition = 'none'; // No transition for setup
    newReel.style.filter = 'blur(3px)'; // Enhanced motion blur effect during spinning
    newReel.style.alignItems = 'flex-start'; // Ensure alignment allows natural width

    currentReel.replaceWith(newReel);

    // Force Reflow
    newReel.offsetHeight;

    // Update container width to match the NEW target word (first in pool)
    // We need to measure it. 
    // It's the first child of newReel.
    const targetItem = newReel.firstElementChild;
    const newWidth = targetItem.getBoundingClientRect().width;

    // Set container width explicitly to the new word's width
    container.style.width = `${newWidth}px`;

    // Animate
    newReel.style.transition = 'transform 1s cubic-bezier(0.1, 0, 0.2, 1), filter 1s ease-out';
    newReel.style.transform = 'translateY(0)';
    newReel.style.filter = 'blur(0)';

    // Cleanup after animation
    setTimeout(() => {
        // Remove all but the first item (Target)
        // And reset transform
        while (newReel.children.length > 1) {
            newReel.lastElementChild.remove();
        }
        newReel.style.transition = 'none';
        newReel.style.transform = 'translateY(0)';
    }, 1000); // 1s matches transition duration
}

// Demo Card Blur Effect
function initDemoCardBlur() {
    const demoCard = document.querySelector('.demo-card');
    if (demoCard) {
        // Blur the card body after 2 seconds
        setTimeout(() => {
            demoCard.classList.add('blur-active');
        }, 2000);
    }
}

// Initial measure
window.addEventListener('load', () => {
    const item = container.querySelector('.text-item');
    if (item) {
        container.style.width = `${item.offsetWidth}px`;
    }

    // Initialize demo card blur effect
    initDemoCardBlur();

    // Start loop
    setInterval(spin, 3000);
});

// Run immediately in case loaded
if (document.readyState === 'complete') {
    const item = container.querySelector('.text-item');
    if (item) {
        container.style.width = `${item.offsetWidth}px`;
    }
    
    // Initialize demo card blur effect
    initDemoCardBlur();
}
