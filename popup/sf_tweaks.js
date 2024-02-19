/**
* Listen for clicks on the buttons, and send the appropriate message to
* the content script in the page.
*/
function listenForClicks() {
    document.addEventListener("click", (e) => {
        /**
        * Send command message to the content script in the active tab.
        */
        function correct_page(tabs) {
            browser.tabs.sendMessage(tabs[0].id, {
                command: e.target.textContent
            });
        }

        /**
        * Just log the error to the console.
        */
        function reportError(error) {
            console.error(`Error: ${error}`);
        }

        /**
        * Get the active tab,
        * then call "correct_page()".
        */
        if (e.target.tagName !== "BUTTON" || !e.target.closest("#popup-content")) {
            // Ignore when click is not on a button within <div id="popup-content">.
            return;
        }
        browser.tabs
            .query({ active: true, currentWindow: true })
            .then(correct_page)
            .catch(reportError);
    });
}

/**
* There was an error executing the script.
* Display the popup's error message, and hide the normal UI.
*/
function reportExecuteScriptError(error) {
    document.querySelector("#popup-content").classList.add("hidden");
    document.querySelector("#error-content").classList.remove("hidden");
    console.error(`Failed to execute content script: ${error.message}`);
}

/**
* When the popup loads, inject a content script into the active tab,
* and add a click handler.
* If we couldn't inject the script, handle the error.
*/
browser.tabs
    .executeScript({ file: "/content_scripts/tweaks.js" })
    .then(listenForClicks)
    .catch(reportExecuteScriptError);
