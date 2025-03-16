javascript:!(function () {
    /* Weblighters by Ray Kooyenga - MIT License */
    const colors = [
        { name: "gold", rgb: "255,215,0" },
        { name: "pink", rgb: "255,105,180" },
        { name: "seafoam", rgb: "159,226,191" },
        { name: "orange", rgb: "236,152,90" },
        { name: "cyan", rgb: "0,255,255" },
        { name: "midnight", rgb: "10,17,54" }
    ];

    let currentColorIndex = 0;
    let switchTimeout = null;
    let waitingForColorKey = false;
    let selectionStyleElement = null;
    let paletteVisible = false;
    let highlightTextColor = null; // Can be 'white', 'black', or null for original
    let customColor = null; // To store the value from the color picker
    let moreOptionsVisible = false;

    // Check if Weblighters is already running
    if (document.querySelector('.weblighter-palette-container')) {
        return; // Exit if already running
    }

    function createCursor(color) {
        const svg = `<svg viewBox="0 0 24 24" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
            <g>
                <path d="M9 11L3 17V20H12L15 17Z" fill="rgb(${color})"/>
                <path d="M22 12L17.4 16.6A2 2 0 0 1 14.6 16.6L9.4 11.4A2 2 0 0 1 9.4 8.6L14 4Z" fill="rgb(38,38,38)"/>
            </g>
        </svg>`;
        return `url('data:image/svg+xml;base64,${btoa(svg)}') 0 30, progress`;
    }

    function applyHighlighter() {
        const color = customColor ? customColor : colors[currentColorIndex].rgb;
        const selection = window.getSelection();
        if (!selection.isCollapsed) {
            const range = selection.getRangeAt(0);
            const span = document.createElement("span");
            span.className = "weblighter";
            span.style.background = `linear-gradient(to bottom, rgba(${color},0) 10%, rgb(${color}) 22%, rgb(${color}) 75%, rgba(${color},1) 90%, rgba(${color},0) 100%)`;
            if (highlightTextColor === 'white') {
                span.style.color = 'white';
            } else if (highlightTextColor === 'black') {
                span.style.color = 'black';
            }
            range.surroundContents(span);
            selection.removeAllRanges();
        }
    }

    function updateSelectionStyle(color) {
        if (!selectionStyleElement) {
            selectionStyleElement = document.createElement('style');
            document.head.appendChild(selectionStyleElement);
        }
        selectionStyleElement.textContent = `::selection { background-color: rgba(${color}, 1); }`;
    }

    function showColorPalette(event) {
        if (paletteVisible) {
            return; // Don't show if already visible
        }
        paletteVisible = true;
        customColor = null; // Reset custom color when palette opens
        moreOptionsVisible = false;

        const paletteContainer = document.createElement('div');
        paletteContainer.className = 'weblighter-palette-container'; // For checking if running
        paletteContainer.style.position = 'fixed';
        paletteContainer.style.top = `${event.clientY + 10}px`;
        paletteContainer.style.left = `${event.clientX + 10}px`;
        paletteContainer.style.backgroundColor = 'rgba(40,40,40,0.4)';
        paletteContainer.style.backgroundImage = 'linear-gradient(rgb(51, 51, 51), rgb(17, 17, 17))';
        paletteContainer.style.border = '1px solid rgba(250,250,250,0.7)';
        paletteContainer.style.borderRadius = '10px';
        paletteContainer.style.backdropFilter = 'blur(4px)';
        paletteContainer.style.padding = '10px';
        paletteContainer.style.zIndex = '10000';
        paletteContainer.style.boxShadow = '2px 2px 5px rgba(0,0,0,0.2)';
        paletteContainer.style.display = 'flex';
        paletteContainer.style.flexDirection = 'column';
        paletteContainer.style.alignItems = 'center';

        // Title
        const titleRow = document.createElement('div');
        titleRow.textContent = 'Weblighters';
        titleRow.style.color = '#eee';
        titleRow.style.marginBottom = '5px';
        paletteContainer.appendChild(titleRow);

        // Color Swatches
        const colorSwatchRow = document.createElement('div');
        colorSwatchRow.style.marginBottom = '5px';
        colors.forEach((colorObj, index) => {
            const colorSwatch = document.createElement('div');
            colorSwatch.style.width = '30px';
            colorSwatch.style.height = '30px';
            colorSwatch.style.backgroundColor = `rgb(${colorObj.rgb})`;
            colorSwatch.style.borderRadius = '3px';
            colorSwatch.style.margin = '5px';
            colorSwatch.style.display = 'inline-block';
            colorSwatch.style.cursor = 'pointer';
            colorSwatch.title = colorObj.name.toUpperCase();

            colorSwatch.addEventListener('click', () => {
                if (!moreOptionsVisible) {
                    currentColorIndex = index;
                    const finalColor = colors[currentColorIndex].rgb;
                    document.documentElement.style.cursor = createCursor(finalColor);
                    updateSelectionStyle(finalColor);
                    paletteContainer.remove();
                    paletteVisible = false;
                } else {
                    currentColorIndex = index;
                    // Wait for update button
                }
            });
            colorSwatchRow.appendChild(colorSwatch);
        });
        paletteContainer.appendChild(colorSwatchRow);

        // More Options Button
        const moreButton = document.createElement('button');
        moreButton.innerHTML = '&#x21D3;';
        moreButton.title = 'More Options';
        moreButton.style.backgroundColor = 'rgba(128,128,128,0.4)';
        moreButton.style.color = '#fff';
        moreButton.style.border = '1px outset white';
        moreButton.style.cursor = 'pointer';
        moreButton.style.fontWeight = 'bold';
        moreButton.style.fontSize = '1.2em';
        moreButton.style.padding = '5px 10px';
        moreButton.style.borderRadius = '5px';
        moreButton.style.marginBottom = '10px';
        moreButton.addEventListener('click', () => {
            moreOptionsVisible = true;
            moreButton.style.display = 'none'; // Hide the more button after clicking
            customColorRow.style.display = 'flex';
            textColorRow.style.display = 'flex';
            updateButton.style.display = 'block';
        });
        paletteContainer.appendChild(moreButton);

        // More Options Container (initially hidden)
        const moreOptionsContainer = document.createElement('div');
        moreOptionsContainer.style.display = 'flex';
        moreOptionsContainer.style.flexDirection = 'column';
        moreOptionsContainer.style.alignItems = 'center';

        // Custom Color Picker (initially hidden)
        const customColorRow = document.createElement('div');
        customColorRow.style.marginBottom = '10px';
        customColorRow.style.display = 'none';
        customColorRow.style.alignItems = 'center';
        const customColorLabel = document.createElement('span');
        customColorLabel.textContent = 'Custom highlight color:';
        customColorLabel.style.color = '#eee';
        customColorLabel.style.marginRight = '5px';
        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.style.cursor = 'pointer';
        colorPicker.value = `#${parseInt(colors[currentColorIndex].rgb.split(',').map(c => parseInt(c).toString(16).padStart(2, '0')).join(''), 16).toString(16).padStart(6, '0')}`;
        colorPicker.addEventListener('input', (event) => {
            customColor = event.target.value.substring(1); // Store hex without #
        });
        customColorRow.appendChild(customColorLabel);
        customColorRow.appendChild(colorPicker);
        paletteContainer.appendChild(customColorRow);

        // Text Color Options (initially hidden)
        const textColorRow = document.createElement('div');
        textColorRow.style.marginBottom = '10px';
        textColorRow.style.display = 'none';
        textColorRow.style.alignItems = 'center';
        const textColorLabel = document.createElement('span');
        textColorLabel.textContent = 'Text Color: ';
        textColorLabel.style.color = '#eee';
        textColorLabel.style.marginRight = '5px';
        textColorRow.appendChild(textColorLabel);

        const textColorOptions = [
            { label: 'White', value: 'white' },
            { label: 'Black', value: 'black' },
            { label: 'Original', value: null }
        ];

        textColorOptions.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option.label;
            button.style.marginRight = '5px';
            button.style.cursor = 'pointer';
            button.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            button.style.color = 'white';
            button.style.border = '1px solid rgba(255, 255, 255, 0.3)';
            button.style.borderRadius = '5px';
            button.style.padding = '5px 10px';
            button.style.fontSize = '0.8em';
            button.addEventListener('click', () => {
                highlightTextColor = option.value;
            });
            textColorRow.appendChild(button);
        });
        paletteContainer.appendChild(textColorRow);

        // Update Weblighter Color Button (initially hidden)
        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update Weblighter Color';
        updateButton.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        updateButton.style.color = 'white';
        updateButton.style.border = '1px solid rgba(255, 255, 255, 0.3)';
        updateButton.style.borderRadius = '5px';
        updateButton.style.padding = '8px 15px';
        updateButton.style.cursor = 'pointer';
        updateButton.style.fontSize = '0.9em';
        updateButton.style.transition = 'background-color 0.2s, transform 0.1s';
        updateButton.style.marginBottom = '10px';
        updateButton.style.display = 'none';

        updateButton.addEventListener('mouseover', () => {
            updateButton.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        });
        updateButton.addEventListener('mouseout', () => {
            updateButton.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        });
        updateButton.addEventListener('mousedown', () => {
            updateButton.style.transform = 'scale(0.95)';
        });
        updateButton.addEventListener('mouseup', () => {
            updateButton.style.transform = 'scale(1)';
            const finalColor = customColor ? `#${customColor}` : colors[currentColorIndex].rgb;
            document.documentElement.style.cursor = createCursor(finalColor);
            updateSelectionStyle(finalColor);
            paletteContainer.remove();
            paletteVisible = false;
        });
        paletteContainer.appendChild(updateButton);

        // Attribution
        const attributionRow = document.createElement('div');
        attributionRow.style.fontSize = '0.8em';
        attributionRow.style.color = '#ccc';
        const link = document.createElement('a');
        link.href = '//rkooyenga.github.io';
        link.textContent = 'Weblighters by Ray Kooyenga 2024';
        link.style.color = '#eee';
        link.style.textDecoration = 'none';
        attributionRow.appendChild(link);
        paletteContainer.appendChild(attributionRow);

        document.body.appendChild(paletteContainer);
    }

    document.addEventListener("mouseup", () => {
        applyHighlighter();
    });

    document.addEventListener("mousedown", (event) => {
        if (event.button === 0) {
            switchTimeout = setTimeout(() => {
                waitingForColorKey = true;
            }, 500);
        }
    });

    document.addEventListener("mouseup", () => {
        clearTimeout(switchTimeout);
        waitingForColorKey = false;
    });

    document.addEventListener("keydown", (event) => {
        if (waitingForColorKey && (event.key === 'c' || event.key === 'C')) {
            event.preventDefault();
            waitingForColorKey = false;
            const mouseEvent = new MouseEvent('mouseup', {
                clientX: event.clientX,
                clientY: event.clientY,
                screenX: event.screenX,
                screenY: event.screenY,
                pageX: event.pageX,
                pageY: event.pageY
            });
            showColorPalette(mouseEvent);
        }
    });

    const initialColor = colors[currentColorIndex].rgb;
    document.documentElement.style.cursor = createCursor(initialColor);
    updateSelectionStyle(initialColor);
})();
