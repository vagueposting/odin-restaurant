import { TextControls } from "./utils";

/**
 * Creates all features displayed on the actual web page
 * @param {object} data - Data loader function
 */
export function Interface(data) {
    console.log('This is the interface.');
    const body = document.querySelector('body');

    const coreNavigation = () => {
        const navigation = {
            header: document.createElement('header'),
            navigator: document.createElement('nav'),
            navButtons: {}
        };

        const navButtons = data.nav.pages;

        // Create buttons based on the general nav array
        navButtons.forEach(button => {
            const { navButtons, navigator } = navigation;
            navButtons[button] = document.createElement('button');
            navButtons[button].classList.add('navButtons');
            navButtons[button].id = `nav-${button}`;

            navButtons[button].textContent = TextControls.capitalizeEachWord(button);

            navigator.appendChild(navButtons[button]);

        });

        navigation.header
            .appendChild(navigation.navigator)

        body.appendChild(navigation.header);
    }

    // TODO: Add "style" parameter that changes layout (grid, flex, etc).
    const pageTemplate = (page = 'home') => {
        const pageFeatures = {
            shell: document.createElement('div'),
            header: document.createElement('h1'),
            bodyText: document.createElement('p')
        };

        pageFeatures.shell.classList.add('bodyPage');
        pageFeatures.shell.id = page;

        pageFeatures.header.textContent = TextControls.capitalizeEachWord(page);
        pageFeatures.bodyText.textContent = `This is placeholder text for ${page}.`

        pageFeatures.shell.appendChild(pageFeatures.header);
        pageFeatures.shell.appendChild(pageFeatures.bodyText);
        body.appendChild(pageFeatures.shell);
    }

    const applyPageSwitches = (page) => {
        const targetButton = document.getElementById(`nav-${page}`);

        targetButton.addEventListener('click', () => {
            const allPages = document.querySelectorAll('.bodyPage');
            allPages.forEach((pg) => {
                if (pg.id === page) {
                    pg.classList.add('visible');
                    console.log(pg.classList);
                } else {
                    pg.classList.remove('visible');
                    console.log(pg.classList);
                }});
        });
    };

    // Assemble all elements of the page.
    (() => {
        coreNavigation();
        data.nav.pages.forEach((page) => {
            pageTemplate(page);
            applyPageSwitches(page);
            document.getElementById('home').classList.add('visible');
        })
    })();
}