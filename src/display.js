import { TextControls } from "./utils";
import { Images } from "./images.js";

/**
 * Creates all features displayed on the actual web page
 * @param {object} data - Data loader function
 */
export const Interface = (data) => {
    console.log('This is the interface.');
    const body = document.querySelector('body');

    const banner = () => {
        console.log('Generating banner..')
    }

    const coreNavigation = () => {
         const navigation = new Map([
            ['header', () => {
                const shell = document.createElement('header');
                return shell;
            }],
            ['logoSpace', () => {
                const root = document.createElement('div');

                const logo = document.createElement('img');
                logo.classList.add('logo')
                logo.src = Images.logo;

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
        console.log(`Creating page ${page} of type ${format}`)
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
            ['hero', () => {
                if (format === 'HERO') {
                    const shell = document.createDocumentFragment();
                    
                    const img = document.createElement('img');
                    img.classList.add('hero')
                    img.src = Images.hero;
                    shell.appendChild(img);

                    return shell;
                }

                return null;
            }],
            ['bodyText', () => {
                const shell = document.createElement('p');
                const rawText = data.nav.pages.find(
                    pg => pg.name === page).body
                const body = pageElements
                    .formattedText(rawText);
                shell.appendChild(body);
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
            pageTemplate(page.name, page.type);
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
    // TODO: refactor this so that it spawns in paragraphs
    formattedText: (rawText) => {
        const fragment = document.createDocumentFragment();
        let currentParagraph = null;
        const classMap = {
            1: ['emp'],
            2: ['str'],
            3: ['emp', 'str']
        };

        rawText.forEach((frag) => {
            if (frag.startParagraph || !currentParagraph) {
                currentParagraph = document.createElement('p');
                fragment.appendChild(currentParagraph);
            }

            const span = document.createElement('span');
            const classes = classMap[frag.format] ?? [];
            span.classList.add(...classes);


            currentParagraph.appendChild(span);
        });

        return fragment;
    }
    // TODO: add assemblies for other elements!
}


const assembleParts = (parts, baseName) => {
    const base = parts.get(baseName)();

    for (const [part, assemble] of parts) {
        if (part === baseName) {
            continue;
        }
        
        const element = assemble();

        if (element) {
            base.appendChild(element);
        };
    };

    return base;
}