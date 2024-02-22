(() => {
    /**
     * Check and set a global guard variable.
     * If this content script is injected into the same page again,
     * it will do nothing next time.
     */
    if (window.hasRun) {
      return;
    }
    window.hasRun = true;
  
    /**
     * Hide or display list elements.
     */
    function change_elements_style(button_text) {
        let nav = document.querySelector('nav.sf-course-menu');
        let ul = null;
        if (nav) {
        ul = nav.querySelector('ul');
        }
        if (ul) {
            let liElements = ul.getElementsByTagName('li');
            for (let i = 0; i < liElements.length; i++) {
                let textElement = liElements[i].querySelector('span');
                if (textElement) {
                    liElements[i].style.padding = "10px 4px";
                    switch (button_text) {
                        case "Hide 1 semester": 
                            if (textElement.textContent.startsWith('I.')
                                || textElement.textContent.startsWith('Адаптационный')
                                || textElement.textContent.startsWith('Выравнивающий')) {
                                liElements[i].style.display = 'none';
                            }
                            break
                        case "Hide 2 semester": 
                            if (textElement.textContent.startsWith('II.')) {
                                liElements[i].style.display = 'none';
                            }
                            break
                        case "Reset": 
                            liElements[i].style.display = 'flex';
                            liElements[i].style.padding = "28px 24px";
                    }
                }
            }
        }
    }
  
    /**
     * Listen for messages from the background script.
     * Call "change_elements_style()".
     */
    browser.runtime.onMessage.addListener((message) => {
        change_elements_style(message.command);
    });
})();
