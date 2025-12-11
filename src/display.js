import { TextControls } from "./utils";

/**
 * Creates all features displayed on the actual web page
 * @param {object} data - Data loader function
 */
export const Interface = (data) => {
    console.log('This is the interface.');
    const body = document.querySelector('body');

    const coreNavigation = () => {
        const navigation = {
            header: document.createElement('header'),
            logoSpace: {
                root: document.createElement('div'),
                logo: document.createElement('h1') // change to img later.
            },
            navigator: document.createElement('nav'),
            navButtons: {}
        };

        navigation.logoSpace.logo.textContent = 'The Tasty Restaurant'
        navigation.logoSpace.root.appendChild(navigation
            .logoSpace
            .logo)
        navigation.header.appendChild(navigation.logoSpace.root);

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

const pageElements = {
    /**
     * Creates a card-style div for each dish on the menu
     * @param {Object} dish - dish data, e.g. data.menu.appetizer[i]  
     * @param {Array} styles - default is 'core' but can append with alternate styles 
     * @returns a completed dish card
     */
    menuitem: (dish, styles = ['core']) => {
        const parts = [
            { card: () => {
                const template = document.createElement('div')
                // TODO: Add class/es
                // Maybe I'll make it modular so a different class applies
            }},
            // Every component here is an assembly instruction
            // If you want to change the sorting order, change the
            // order at which parts are declared.
            { dishName: () => { 
                const shell = document.createElement('h2');
                shell.textContent = dish.name;
                // TODO: Add class/es

                return shell;
            }},
            { dishPrice: () => {
                const shell = document.createElement('p');

                const header = document.createElement('span');
                header.textContent = 'Price: ';
                
                const data = document.createElement('span');
                data.textContent = String(data.price);

                shell.appendChild(header);
                shell.appendChild(data);
                // TODO: Add class/es

                return shell;
            }},
            { dishDescription: () => {
                const shell = document.createElement('p');
                shell.textContent = dish.description
                // TODO: Add class/es

                return shell;
            }}
            // TODO: Add Notes Element
        ]

        /* my stanford bootcamp mentors will axe me to death 
        for not assigning variables to everything, but i care not.
        if i don't put enough cognitive stress into my code, 
        i will make stupid mistakes. so this is for the best */

        for (let i = 0; i < parts.length; i++) {
            // Get part name.
            const partName = Object.keys(parts[i])[0];

            // Skip the card itself
            if (partName === 'card') {
                parts[0].card = parts[0].card();
                continue;
            }
    
            // Append each feature by running their 
            // assembly instructions on the spot.
            parts[0].card.appendChild(parts[i][partName]());
        }

        return parts.card;
    }
    // TODO: add assemblies for other elements!
}