// MACROS
const TOOLS = ["paint", "eraser"];
const DEFAULT_TOOL = TOOLS[0];
const ERASER_COLOR = 'white';
const DEFAULT_COLOR = 'black';
const DEFAULT_GRID_LINES_PRESENT = true;

// Canvas configs
let slider = document.querySelector('#canvas-slider');
let oldSliderValue = slider.value;
let sliderValue = document.querySelector('.canvas-slider-area > p');
sliderValue.textContent = slider.value + " x " + slider.value;
let gridContent = document.querySelector('.grid-content');
let gridLinesIsPresent = DEFAULT_GRID_LINES_PRESENT
document.querySelector("#toggle-gridlines-button").onclick = (e) => {
    if (gridLinesIsPresent) {
        gridLinesIsPresent = false;
        gridContent.style.gap = '0px';
    } else {
        gridLinesIsPresent = true;
        gridContent.style.gap = '0.25%';
    }
};

// Tool configs
let allTools = Array.from(document.querySelectorAll('.toolbox > button'));
// Set default tool to be active
document.querySelector(`#${DEFAULT_TOOL}-button`).classList.toggle('active-tool');
let currentTool = allTools[0];
let mouseDown = false
document.body.onmousedown = () => (mouseDown = true)
document.body.onmouseup = () => (mouseDown = false)

// Color configs
let colorPicker = document.querySelector('#color-picker');

// Clear canvas
let clearCanvas = () => {
    let grid = document.querySelectorAll('.grid');
    grid.forEach((grid) => {
        grid.style.backgroundColor = ERASER_COLOR;
    });
}

// Change canvas size on slider change
slider.addEventListener('input', () => {
    clearCanvas();
    // Change the canvas grid size
        // Get the new slider value
        let newSliderValue = slider.value;
        // Get the difference between the two: new - old
        let difference = newSliderValue - oldSliderValue;
        // If difference is negative (new < old):
            // Delete all rows and columns based on the difference
        if (difference < 0) {
            gridContent.setAttribute('style', 'grid-template-columns: repeat(' + newSliderValue + ', 1fr);');
            if (gridLinesIsPresent) {
                gridContent.style.gap = '0.25%';
            }
            else {
                gridContent.style.gap = '0px';
            }
            // Get the difference of the squared values which indicates the number of divs to remove
            let divsToRemove = Math.abs(Math.pow(newSliderValue, 2) - Math.pow(oldSliderValue, 2));
            // Remove the divs
            for (let i = 0; i < divsToRemove*2; i++) {
                // Need to multiply number of loop by 2 because div whitespacing in .html file causes the creation of unintended child texts (can also format it in .html file but at the cost of readability)
                gridContent.removeChild(gridContent.lastChild);
            }
        }
        // If difference is positive (new > old):
            // Add all rows and columns based on the difference
        else if (difference > 0) {
            gridContent.setAttribute('style', 'grid-template-columns: repeat(' + newSliderValue + ', 1fr);');
            if (gridLinesIsPresent) {
                gridContent.style.gap = '0.25%';
            }
            else {
                gridContent.style.gap = '0px';
            }
            // Get the difference of the squared values which indicates the number of divs to add
            let divsToAdd = Math.abs(Math.pow(newSliderValue, 2) - Math.pow(oldSliderValue, 2));
            // Add the divs
            for (let i = 0; i < divsToAdd*2; i++) {
                // Need to multiply number of loop by 2 because div whitespacing in .html file causes the creation of unintended child texts (can also format it in .html file but at the cost of readability)
                // Need to add additional child texts to maintain html DOM structure if i is odd
                let newGrid = document.createElement('div');
                newGrid.classList.add('grid');
                if (i % 2 == 0) {
                    gridContent.appendChild(newGrid);
                }
                else {
                    gridContent.appendChild(document.createTextNode(''));
                }
            }
        }
    // Update the old slider value
    oldSliderValue = slider.value;
    sliderValue.textContent = slider.value + " x " + slider.value;
});

// Change colour based on tool
let changeColor = (e) => {
    if (e.type === 'mouseover' && !mouseDown || e.target.classList.contains('grid-content')) return
    if (currentTool.id === 'paint-button') {
        e.target.style.backgroundColor = colorPicker.value;
    }
    else if (currentTool.id === 'lighten-button') {
        let currentColor = e.target.style.backgroundColor;
        let currentColorRGB = currentColor.substring(4, currentColor.length-1).split(',');
        let newColorRGB = currentColorRGB.map((color) => {
            return Math.min(255, parseInt(color) + 25);
        });
        e.target.style.backgroundColor = 'rgb(' + newColorRGB.join(',') + ')';
    }
    else if (currentTool.id === 'darken-button') {
        let currentColor = e.target.style.backgroundColor;
        let currentColorRGB = currentColor.substring(4, currentColor.length-1).split(',');
        let newColorRGB = currentColorRGB.map((color) => {
            return Math.max(0, parseInt(color) - 25);
        });
        e.target.style.backgroundColor = 'rgb(' + newColorRGB.join(',') + ')';
    }
    else if (currentTool.id === 'rainbow-button') {
        e.target.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    }
    else if (currentTool.id === 'eraser-button') {
        e.target.style.backgroundColor = ERASER_COLOR;  // has to be string "white" so that darken and ligthen do not affect it because it parses based on rgb substring
    }
};

// Use tool on mouse [over and down] or [only on click]
gridContent.addEventListener('mouseover', changeColor);
gridContent.addEventListener('mousedown', changeColor);

// Toggle active tool on click tool button except clear button and toggle gridlines button
allTools.forEach(tool => {
    if (tool.id != "clear-button" && tool.id != "toggle-gridlines-button") {
        tool.addEventListener('click', (e) => {
            allTools.forEach(element => {
                element.classList.remove('active-tool');
            });
            // Toggle active tool
            e.target.classList.toggle('active-tool');
            currentTool = e.target;
        });
    }
});


// On clear button click
document.querySelector('#clear-button').addEventListener('click', clearCanvas);