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
        const color = colors[currentColorIndex].rgb;
        const selection = window.getSelection();
        if (!selection.isCollapsed) {
            const range = selection.getRangeAt(0);
            const span = document.createElement("span");
            span.className = "weblighter";
            span.style.background = `linear-gradient(to bottom, rgba(${color},0) 10%, rgb(${color}) 22%, rgb(${color}) 75%, rgba(${color},1) 90%, rgba(${color},0) 100%)`;
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
        const palette = document.createElement('div');
        palette.style.position = 'fixed';
        palette.style.top = `${event.clientY + 10}px`;
        palette.style.left = `${event.clientX + 10}px`;
        palette.style.backgroundColor = 'rgba(100,100,100,0.4)';
        palette.style.border = '1px solid rgba(250,250,250,0.7)';
        palette.style.borderRadius = '10px';
        palette.style.backdropFilter='blur(4px)';
        palette.style.padding = '10px';
        palette.style.zIndex = '10000';
        palette.style.boxShadow = '2px 2px 5px rgba(0,0,0,0.2)';

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
                currentColorIndex = index;
                document.documentElement.style.cursor = createCursor(colors[currentColorIndex].rgb);
                updateSelectionStyle(colors[currentColorIndex].rgb);
                palette.remove();
            });

            palette.appendChild(colorSwatch);
        });

        document.body.appendChild(palette);
    }

    document.addEventListener("mouseup", () => {
        applyHighlighter();
    });

    document.addEventListener("mousedown", (event) => {
        if (event.button === 0) {
            switchTimeout = setTimeout(() => {
                waitingForColorKey = true;
            }, 2000);
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

    document.documentElement.style.cursor = createCursor(colors[currentColorIndex].rgb);
    updateSelectionStyle(colors[currentColorIndex].rgb);
})();
