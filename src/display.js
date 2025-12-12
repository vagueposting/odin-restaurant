import { TextControls } from "./utils";

/**
 * Creates all features displayed on the actual web page
 * @param {object} data - Data loader function
 */
export const Interface = (data) => {
    console.log('This is the interface.');
    const body = document.querySelector('body');

    const coreNavigation = () => {
        /* const navigation = {
            header: document.createElement('header'),
            logoSpace: {
                root: document.createElement('div'),
                logo: document.createElement('h1') // change to img later.
            },
            navigator: document.createElement('nav'),
            navButtons: {}
        }; */

        const navigation = new Map([
            ['header', () => {
                const shell = document.createElement('header');
                return shell;
            }],
            ['logoSpace', () => {
                const root = document.createElement('div');

                const logo = document.createElement('h1'); // change to img later.
                logo.textContent = 'The Tasty Restaurant'

                root.appendChild(logo);

                return root;
            }],
            ['navigator', () => {
                const shell = document.createElement('nav');
                const navButtons = {};
                // Create buttons based on the general nav array
                const pageList = data.nav.pages.map(page => page.name);
                pageList.forEach(button => {
                    navButtons[button] = document.createElement('button');
                    navButtons[button].classList.add('navButtons');

                    navButtons[button].id = `nav-${button}`;

                    navButtons[button].textContent = TextControls
                        .capitalizeEachWord(button);

                    shell.appendChild(navButtons[button]);
                });

                return shell;
            }]
        ])

        body.appendChild(assembleParts(navigation, 'header'));
    }

    // TODO: Add "format" parameter that changes layout (grid, flex, etc).
    const pageTemplate = (page = 'home', format = 'DEFAULT') => {
        // Core, non-negotiable features of each page
        const pageFeatures = new Map([
            ['shell', () => {
                const shell = document.createElement('div');
                shell.classList.add('bodyPage');
                shell.id = page;
                return shell;
            }],
            ['header', () => {
                const shell = document.createElement('h1');
                shell.textContent = TextControls.capitalizeEachWord(page);
                return shell;
            }],
            ['bodyText', (text = `This is placeholder text for ${page}`) => {
                const shell = document.createElement('p');
                shell.textContent = text;
                return shell;
            }]
        ])

        if (page === 'menu') {
            pageFeatures.set('menu', () => {
                const menuBoard = document.createElement('div');
                menuBoard.classList.add(page); // menu

                data.menu.appetizer.forEach((dish) => {
                    const dishCard = pageElements.menuitem(dish);
                    menuBoard.appendChild(dishCard);
                })
                return menuBoard;
            })
        }

        body.appendChild(
            assembleParts(pageFeatures, 'shell'));
    }

     const applyPageSwitches = (page) => {
        const targetButton = document.getElementById(`nav-${page}`);

        targetButton.addEventListener('click', () => {
            const allPages = document.querySelectorAll('.bodyPage');
            allPages.forEach((pg) => {
                if (pg.id === page) {
                    pg.classList.add('visible');
                } else {
                    pg.classList.remove('visible');
                }});
        });
    };

    // Assemble all elements of the page.
    (() => {
        coreNavigation();
        data.nav.pages.forEach((page) => {
            pageTemplate(page.name);
            applyPageSwitches(page.name);
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
     * 
     * Every component here is an assembly instruction
     * If you want to change the sorting order, change the
     * order at which parts are declared.
     */
    menuitem: (dish, styles = ['core']) => {
        const parts = new Map([
            ['card', () => {
                const shell = document.createElement('div')
                styles.forEach((style) => {
                    shell.classList.add(style);
                });
                return shell;
            }],
            [ 'dishName', () => {
                const shell = document.createElement('h2');
                shell.textContent = dish.name;
                // TODO: Add class/es

                return shell;
            }],
            [ 'dishPrice', () => {
                const shell = document.createElement('p');
                
                const header = document.createElement('span');
                header.textContent = 'Price: ';

                const data = document.createElement('span');
                data.textContent = `Php ${dish.price}`;

                shell.appendChild(header);
                shell.appendChild(data);
                return shell;
            }],
            ['dishDescription', () => {
                const shell = document.createElement('p');
                shell.textContent = dish.description;
                return shell;
            }]
        ])

        return assembleParts(parts, 'card');
    },
    // TODO: add assemblies for other elements!
}


const assembleParts = (parts, baseName) => {
    const base = parts.get(baseName)();

    for (const [part, assemble] of parts) {
        if (part === baseName) {
            continue;
        }
        
        base.appendChild(assemble());
    }

    return base;
}