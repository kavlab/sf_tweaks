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
  
    function correctHeader() {
        const header = document.querySelector('div.outline-header');
        if (header) {
            header.style.padding = '0px 60px 10px';
            const title = header.querySelector('h3.outline-header__last-lesson');
            if (title) {
                title.style = 'font-size: 1.5em; margin-bottom: 10px;'
            }
            const headerWidgets = header.querySelector('div.outline-header__widgets');
            if (headerWidgets) {
                const wasteWidgets = headerWidgets.querySelectorAll('div.sf-info-widget--page');
                for (let i = 0; i < wasteWidgets.length; i++) {
                    wasteWidgets[i].style.display = 'none';
                }
                const progressWidget = headerWidgets.querySelector('div.sf-info-widget--page-wider');
                if (progressWidget) {
                    progressWidget.style = 'width: 170px; height: 170px; padding: 10px 10px;';
                }
            }
            const button = header.querySelector('a.outline-header__link');
            if (button) {
                button.style = 'padding: 5px 5px;';
            }
        }
    }

    /**
     * Hide or display list elements.
     */
    function correctElementsStyle(commandId) {
        correctHeader();

        const progressChart = document.querySelector('div.sf-progress-tab__bar-chart');

        if (progressChart) {
            progressChart.style.display = 'none';
            mainMenu = 'div.sf-progress-tab__detailed-grades-container';
            subMenu = 'div.sf-progress-tab__detailed-grades-container';
            element = 'div';
        } else {
            mainMenu = 'nav.sf-course-menu';
            subMenu = 'ul';
            element = 'li';
        }
        const nav = document.querySelector(mainMenu);
        if (nav) {
            liElements = null;
            if (progressChart) {
                liElements = nav.getElementsByTagName('div');
            } else {
                ul = nav.querySelector('ul');
                if (ul) {
                    liElements = ul.getElementsByTagName('li');
                }
            }
            if (liElements) {
                for (let i = 0; i < liElements.length; i++) {
                    console.debug(liElements[i]);
                    const textElement = liElements[i].querySelector('span');
                    if (textElement) {
                        console.debug(textElement.textContent);
                        if (progressChart) {
                            //
                        } else {
                            liElements[i].style.padding = "10px 4px";
                        }
                        switch (commandId) {
                            case "1":
                                if (textElement.textContent.startsWith('I.')
                                    || textElement.textContent.startsWith('Адаптационный')
                                    || textElement.textContent.startsWith('Выравнивающий')) {
                                    liElements[i].style.display = 'none';
                                }
                                break
                            case "2":
                                if (textElement.textContent.startsWith('II.')) {
                                    liElements[i].style.display = 'none';
                                }
                                break
                            case "0":
                                liElements[i].style.display = 'flex';
                                if (progressChart) {
                                    //
                                } else {
                                    liElements[i].style.padding = "28px 24px";
                                }
                                break
                        }
                    }
                }
            }
        }
    }
  
    /**
     * Listen for messages from the background script.
     * Call "correctElementsStyle()".
     */
    browser.runtime.onMessage.addListener((message) => {
        correctElementsStyle(message.command);
    });
})();
