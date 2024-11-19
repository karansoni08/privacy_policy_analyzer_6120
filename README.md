# privacy_policy_analyzer_6120

background.js:
  Detailed Explanation:
    chrome.runtime.onMessage.addListener: This function sets up an event listener that listens for messages sent from other scripts within the extension. It's useful for background communication between the popup script and the content script.
    request.action === "goToHomePage": This condition checks if the action in the message is to open the Chrome homepage. If so, it creates a new browser tab with chrome.tabs.create.
    chrome.tabs.create({ url: "chrome://newtab" }): This API call creates a new tab in the Chrome browser, directing it to the "new tab" page.
 Purpose: 
    The background script ensures that specific actions (like opening the home page) are executed when messages are received from the extension's components.

content.js: 
This script is responsible for injecting and displaying a modal on the webpage to analyze the privacy policy.

  Detailed Explanation:
    sessionStorage: Used to check if the modal has already been shown in the current session and to prevent it from showing again.
    overlay and modal: These are HTML elements created dynamically to display the Privacy Analyzer UI. Styling ensures that the modal appears centered and looks polished.
    createStarRating: This function generates star icons to visually represent the privacy policy rating. It uses conditional logic to color the stars based on the provided rating.
    analyzeButton: When clicked, this button extracts the webpage text and sends it to the Flask backend for analysis.
    fetch API: Used to send an HTTP POST request to the backend server running on localhost:8000. It sends the policy text and waits for a JSON response containing the analysis.
    buttonContainer: Contains navigation buttons, such as "Proceed to Website" and "Go to Chrome Home". The latter uses the Chrome API to open a new tab.
  Purpose:
    This script injects a modal onto any webpage to analyze the privacy policy and display the results.

main.py:
This file is the backend component of your privacy policy analyzer, built using the Flask web framework. It handles HTTP requests from the extension and performs privacy policy analysis using a large language model (LLM).

  Detailed Explanation:
    Flask Setup: The Flask framework is used to create a web server that listens for HTTP POST requests on /analyze.
    CORS: The CORS package allows the Chrome extension (a different origin) to communicate with the Flask server.
    extract_json_from_text: A utility function that uses regular expressions to extract JSON-like data from text.
    analyze_with_ollama: Runs the analysis using the Ollama language model. It uses subprocess.run to execute the LLM and captures the output. The function formats the LLM's output into a structured JSON format.
    subprocess: This module is used to run shell commands from Python. In this case, it runs the Ollama LLM and provides it with the privacy policy text.
    Error Handling: If the LLM fails or does not return JSON, errors are logged and returned to the frontend.
  Purpose: 
    Acts as a bridge between the extension and the language model, analyzing privacy policies and returning ratings.

manifest.json:
This file defines the configuration and permissions for your Chrome extension.

  Detailed Explanation:
    manifest_version: Specifies the version of the manifest format. Version 3 is the latest and introduces significant changes to permissions and background scripts.
    name, version, description: Basic metadata for the extension.
    permissions: These specify what the extension can do, such as:
    activeTab: Allows the extension to interact with the currently active tab.
    webNavigation: Used for intercepting and modifying navigation events.
    scripting: Grants the ability to execute scripts.
    tabs: Enables tab management.
    host_permissions: Specifies that the extension has permission to run on all URLs.
    action: Defines the popup interface and the icons used in the extension.
    background: Specifies the service worker (background.js) that handles background tasks.
    content_scripts: Lists the scripts that should be injected into webpages and the conditions under which they run.
    icons: Specifies the icons used for the extension in different sizes.
  Purpose:
    Provides Chrome with essential information about the extension and specifies permissions, content scripts, and background behavior.

popup.html:
Defines the HTML structure and style for the popup that appears when the user interacts with the extension icon.

  Detailed Explanation:
    HTML Structure: Contains a title (h2), a content box (div#content), an "Analyze" button, and a hidden button container with "Proceed to Page" and "Go to Chrome Home" buttons.
    CSS Styles: Defines the layout, colors, shadows, and responsive behavior of elements. Styles enhance the user interface for a clean and polished appearance.
    Script Link: The popup.js script is included to handle the interactivity of the popup.
  Purpose:
    Provides a simple, user-friendly interface for the Chrome extension popup, guiding users to analyze a privacy policy and proceed based on the results.

popup.js
This script handles the logic and interactivity of the extension’s popup interface.

  Detailed Explanation:
    DOMContentLoaded Event: Ensures that the script runs only after the HTML has fully loaded.
    Event Listeners:
    analyzeButton: Sends a POST request to the backend server with a sample privacy policy text. The server responds with a structured analysis, which is then formatted and displayed in the popup.
    proceedButton: Closes the popup when clicked.
    goHomeButton: Opens a new Chrome tab with the homepage and closes the popup.
    fetch API: Used to make asynchronous requests to the Flask server and handle the response.
  Purpose:
    Handles user interactions in the popup, performs the privacy policy analysis by communicating with the backend, and displays the results or error messages.