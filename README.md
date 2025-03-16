# Weblighters

**Highlight and Share: Highlighter Pens for the Web**

Weblighters provides a user-friendly way to highlight text on webpages, with the highlights persisting regardless of other mouse actions. This makes it ideal for emphasizing key sections of articles or content for screenshots and sharing.

## Overview (Bookmarklet Version)

The Weblighters bookmarklet allows you to:

* **Highlight Text Persistently:** Select text and it will remain highlighted, even after you move your mouse or interact with other elements on the page.
* **Choose from Preset Colors:** Quickly select from a predefined palette of highlight colors.
* **Use a Native Color Picker:** Select any highlight color you desire using your browser's built-in color picker.
* **Control Highlighted Text Color:** Set the text color of your highlights to white, black, or revert to the original text color for better readability on various backgrounds.
* **Dynamic Cursor:** Features a pen icon cursor that changes color to match your current highlight selection.
* **Dynamic `::selection` Color:** The browser's default selection color also updates to reflect your chosen highlight color.

## Key Features (Bookmarklet)

* Persistent text highlighting.
* Six preset highlight colors.
* Option to choose any color using the browser's native color picker.
* Control over highlighted text color (white, black, original).
* Customizable pen icon cursor.
* Dynamically updating `::selection` background color.
* Simple activation via bookmarklet.

## How to Use (Bookmarklet)

### Installation

1.  Navigate to the [Weblighters GitHub repository](https://github.com/rkooyenga/weblighters).
2.  In your browser, create a new bookmark.
3.  Edit the bookmark's URL and paste the entire JavaScript code provided in the `README.md` or the `weblighters.js` file (once available).
4.  Save the bookmark.

### Usage

1.  Navigate to any webpage where you want to highlight text.
2.  Click the Weblighters bookmarklet in your bookmarks bar to activate it. The cursor will change to a colored pen icon.
3.  **To highlight text:** Simply select the text you want to highlight with your mouse. It will be highlighted with the currently selected color.
4.  **To change the highlight color:**
    * Hold down the left mouse button for approximately 500 milliseconds (0.5 seconds).
    * While still holding the left mouse button (or immediately after releasing it), press the 'c' key on your keyboard.
    * A color palette will appear near your mouse cursor.
    * **Choose a preset color:** Click on one of the colored squares.
    * **Choose a custom color:** Click on the color input field to open your browser's color picker and select your desired color.
    * **Change the highlighted text color:** Click on the "White", "Black", or "Original" buttons to adjust the text color of future highlights.
    * The cursor will update to the newly selected highlight color, and the `::selection` color will also change.
5.  Continue highlighting as needed. The highlights will persist on the page.

## Coming Soon

* **Standalone `weblighters.js`:** Embeddable JavaScript file to enable highlighting functionality directly on websites.
* **React Module:** A reusable React component for seamless integration into React-based projects.
* **Node Package:** For server-side rendering or build-time manipulation of highlighted content.

## Contributing

Contributions to Weblighters are welcome! Please feel free to open issues or submit pull requests on the [GitHub repository](https://github.com/rkooyenga/weblighters).

## License

This project is licensed under the MIT License.

## Links

* **GitHub Repository:** [github.com/rkooyenga/weblighters](https://github.com/rkooyenga/weblighters)
* **Website (Coming Soon):** [rkooyenga.github.io/weblighters](https://rkooyenga.github.io/weblighters)
