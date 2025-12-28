import { TextControls } from "./utils";
import { Images } from "./images.js";

/**
 * Creates all features displayed on the actual web page
 * @param {object} data - Data loader function
 */
export const Interface = (data) => {
    console.log('This is the interface.');
    const body = document.querySelector('body');

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

                if (rawText.length >= 1 && rawText[0].text != '') {
                    const body = pageElements
                    .formattedText(rawText);
                    shell.appendChild(body);
                    return shell;
                };
                return;
            }]
        ])

        if (page === 'menu') {
            pageFeatures.set('menu', () => {
                const menu = document.createElement('div');

                const categories = ['appetizer', 'entree', 'dessert'];

                categories.forEach((course) => {
                    const section = document.createElement('div');
                    const items = document.createElement('div');
                    items.classList.add('menu');

                    const header = document.createElement('h2');
                    header.textContent = course === 'entree' ? 'Entrée' : TextControls
                        .capitalizeEachWord(course);
                    section.appendChild(header);

                    data.menu[course].forEach((dish)  => {
                        const dishCard = pageElements.menuItem(dish);
                        items.appendChild(dishCard);
                    })

                    section.appendChild(items);
                    menu.appendChild(section);
                })

                return menu;
            })
        }

        if (page === 'about') {
            pageFeatures.set('testimonials', () => {
                const shell = document.createElement('div');

                const header = document.createElement('h2');
                header.textContent = 'What diners say about us';
                shell.appendChild(header); 

                const { testimonials } = data.nav.pages.find(pg => pg.name === 'about');
                const testimonialCollection = document.createElement('div');
                testimonialCollection.classList.add('testimonialCollection');
                
                testimonials.forEach(item => {
                    const testimonialBox = document.createElement('div');
                    testimonialBox.classList.add('testimonialBox');

                    const guestInfoWrapper = document.createElement('div');
                    guestInfoWrapper.classList.add('guestData');

                    const testimonialContents = new Map([
                        ['comment', () => {
                            const guestComment = document.createElement('p');
                            guestComment.classList.add('guestComment');
                            guestComment.textContent = item.comment;
                            return guestComment; 
                        }],
                        ['guest', () => {
                            const guestName = document.createElement('span');
                            guestName.classList.add('guestName');
                            guestName.textContent = item.customer;
                            return guestName; 
                        }],
                        ['guestJob', () => {
                            const guestJob = document.createElement('span');
                            guestJob.classList.add('guestJob');
                            guestJob.textContent = item.customerJob; 
                            return guestJob; 
                        }]
                    ]);

                    testimonialContents.forEach((renderFunction, key) => {
                        const element = renderFunction();
                        if (!element) return;

                        if (key === 'comment') {
                            testimonialBox.appendChild(element);
                        } else {
                            guestInfoWrapper.appendChild(element);
                        }
                    });

                    // 3. Append the populated wrapper to the main box
                    testimonialBox.appendChild(guestInfoWrapper);
                    testimonialCollection.appendChild(testimonialBox);
                });

                shell.appendChild(testimonialCollection);
                return shell;
            })
        }

        if (page === 'contact') {
            pageFeatures.set('contactForm', () => {
                const shell = document.createDocumentFragment();

                const contactForm = document.createElement('form');
                contactForm.classList.add('contactForm')
                const formElements = ['name', 'email', 'message', 'tos', 'submit'];
                let input, label;

                /**
                 * Helper function which quickly sets attributes for
                 * input elements on the DOM.
                 * @param {Node} e - element to be targeted
                 * @param {string} type - desired input type
                 * @param {number} maxLength - max length
                 */
                const setInputAttributes = (e, type, maxLength = 30) => {
                    e.setAttribute('type', type);
                    e.setAttribute('maxlength', maxLength);
                    if (type === 'text' || type === 'email') {
                        e.setAttribute('size', maxLength + 2)
                    };
                }

            formElements.forEach(e => {
                const formFragment = document.createElement('div');
                formFragment.id = `section-${e}`;
                formFragment.classList.add('formFragment');

                input = null;
                label = null;

                if (e !== 'submit') {
                    label = document.createElement('label');
                    const agreementTOS = data.nav.pages.find(pg => pg.name === 'contact')['TOS'];
                    label.textContent = e !== 'tos' ? `${TextControls.capitalizeEachWord(e)}: ` : agreementTOS;
                    label.setAttribute('for', e);
                }

                switch (e) {
                    case 'message':
                        input = document.createElement('textarea');
                        break;
                    case 'submit':
                        formFragment.classList.add('center')
                        input = document.createElement('button');
                        input.textContent = 'Submit';
                        setInputAttributes(input, 'submit');
                        break;
                    case 'tos':
                        input = document.createElement('input');
                        setInputAttributes(input, 'checkbox');
                        break;
                    case 'name':
                        input = document.createElement('input');
                        setInputAttributes(input, 'text');
                        break;
                    case 'email':
                        input = document.createElement('input');
                        setInputAttributes(input, 'email');
                        break;
                    default:
                        input = document.createElement('input');
                        break;
                }

                input.id = e; 
                input.setAttribute('name', e);

                // 4. Append to fragment
                if (e !== 'tos' && label) formFragment.appendChild(label);
                formFragment.appendChild(input);
                if (e === 'tos' && label) formFragment.appendChild(label);
                
                contactForm.appendChild(formFragment);
            });

                shell.appendChild(contactForm);

                return shell;
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
    menuItem: (dish, styles = ['core']) => {
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
                header.classList.add('dataHeader');
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
            }],
            ['notes', () => {
                const shell = document.createElement('div');
                shell.classList.add('dishNotes')
                const icons = {
                    vegetarian: () => {
                        const icon = document.createElement('span');
                        let src;

                        // This is really lazy, but I'll probably make a
                        // "more secure" version when I'm not running out of time
                        if (dish.notes.vegetarian) {
                            src = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>food-apple</title><path d="M20,10C22,13 17,22 15,22C13,22 13,21 12,21C11,21 11,22 9,22C7,22 2,13 4,10C6,7 9,7 11,8V5C5.38,8.07 4.11,3.78 4.11,3.78C4.11,3.78 6.77,0.19 11,5V3H13V8C15,7 18,7 20,10Z" /></svg>`
                        }

                        icon.innerHTML = src;
                        return icon;
                    },
                    spicy: () => {
                        const icon = document.createElement('span');
                        let src;

                        if (dish.notes.spicy) {
                            src = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>chili-mild</title><path d="M16 10V22C16 22 8 20 8 11V10C8 9.27 8.4 8.63 9 8.28L10.25 9L12 8L13.75 9L15 8.28C15.6 8.63 16 9.27 16 10M12 6.5L13.75 7.5L15.27 6.63C14.72 5.66 13.91 4.94 12.97 4.65C12.79 3.16 11.54 2 10 2V4C10.44 4 10.8 4.29 10.94 4.69C10.03 5 9.26 5.7 8.73 6.63L10.25 7.5L12 6.5Z" /></svg>`
                        } else {
                            src = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>chili-mild-outline</title><path d="M10.25 7.5L8.73 6.63C9.26 5.7 10.03 5 10.94 4.69C10.8 4.29 10.44 4 10 4V2C11.54 2 12.79 3.16 12.97 4.65C13.91 4.94 14.72 5.66 15.27 6.63L13.75 7.5L12 6.5L10.25 7.5M16 10V22C16 22 8 20 8 11V10C8 9.27 8.4 8.63 9 8.28L10.25 9L12 8L13.75 9L15 8.28C15.6 8.63 16 9.27 16 10M14 11.45L12 10.3L10 11.43C10.17 15.44 12.23 17.69 14 18.87V11.45Z" /></svg>`
                        }

                        icon.innerHTML = src;
                        return icon;
                    }
                }
                if (dish.notes.vegetarian) shell.appendChild(icons.vegetarian());
                if (dish.notes.spicy) shell.appendChild(icons.spicy());
                return shell;
            }
            ]
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
            span.textContent = frag.text;
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