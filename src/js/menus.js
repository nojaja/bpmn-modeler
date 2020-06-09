'use strict';

export class Menus {

    constructor(container) {
        const menuContainer = document.querySelectorAll('.menuContainer');
        menuContainer.forEach(el => this.setup(el));
    }

    /**
     * Initializes a drop down menu.
     *
     * @param {Element} container Container element with the drop down menu.
     */
    setup(container) {
        const toggleButton = container.querySelector('button.menuTop');
        toggleButton.addEventListener('click', () => {
            this._toggle(toggleButton);
        });
        this.addKeyboardShortcut(toggleButton);
        container.addEventListener('keydown', (e) => {
            if (e.keyCode === 27) {
                this.hideAll();
                //app.setFocus();
                return;
            }
            if (e.keyCode === 40) {
                const next = e.srcElement.nextElementSibling;
                if (next) {
                    next.focus();
                }
                return;
            }
            if (e.keyCode === 38) {
                const prev = e.srcElement.previousElementSibling;
                if (prev) {
                    prev.focus();
                }
                return;
            }
        });
    };

    /**
     * Initializes a drop down menu.
     *
     * @param {Element} button Toggle button to show/hide menu.
     */
    addKeyboardShortcut(button) {
        /*
        if (app.isMac) {
            // Keyboard shortcuts aren't available on mac.
            return;
        }
        */
        let key;
        try {
            key = button.querySelector('.kbdShortcut').textContent.trim().toLowerCase();
        } catch (ex) {
            // No keyboard shortcut found.
        }
        if (!key) {
            return;
        }
        window.addEventListener('keydown', (e) => {
            if (e.altKey === true && e.key === key) {
                button.click();
            }
        });
    };

    /**
     * Hides all visible menus.
     */
    hideAll() {
        const elems = document.querySelectorAll('.menuContainer');
        elems.forEach((elem) => {
            this.hide(elem);
        });
    };

    /**
     * Hides a menu dropdown.
     *
     * @param {Element} menuContainer Container element with the drop down menu.
     */
    hide(menuContainer) {
        const button = menuContainer.querySelector('.menuTop');
        button.setAttribute('aria-expanded', false);
        const panel = menuContainer.querySelector('.menuItemContainer');
        if (panel) {
            panel.classList.toggle('hidden', true);
        }
    };

    /**
     * Shows a menu dropdown.
     *
     * @param {Element} menuContainer Container element with the drop down menu.
     */
    show(menuContainer) {
        this.hideAll();
        const button = menuContainer.querySelector('.menuTop');
        button.setAttribute('aria-expanded', true);
        const panel = menuContainer.querySelector('.menuItemContainer');
        panel.classList.toggle('hidden', false);
        const firstButton = panel.querySelector('button');
        if (!firstButton) {
            this.hideAll();
            //app.setFocus();
            return;
        }
        firstButton.focus();
    };

    /**
     * Creates a new menu item button.
     *
     * @param {string} label Label for button
     * @return {Button} Returns an HTML button.
     */
    createButton(label) {
        const butt = document.createElement('button');
        butt.innerText = label;
        butt.setAttribute('type', 'button');
        butt.setAttribute('role', 'menuitem');
        return butt;
    };

    /**
     * Adds an element to the menu.
     *
     * @param {Element} menuContainer Container element with the drop down menu.
     * @param {Element} elem Element to add to the menu container.
     */
    addElement(menuContainer, elem) {
        const container = menuContainer.querySelector('.menuItemContainer');
        container.appendChild(elem);
    };

    /**
     * Removes all items from the menu.
     *
     * @param {Element} menuContainer Container element with the drop down menu.
     */
    clearMenu(menuContainer) {
        const container = menuContainer.querySelector('.menuItemContainer');
        container.innerHTML = '';
    };

    /**
     * Toggles a menu open or closed.
     *
     * @private
     * @param {Element} button Toggle button to show/hide menu.
     */
    _toggle(button) {
        const parent = button.parentElement;
        const expanded = button.getAttribute('aria-expanded');
        if (expanded === 'true') {
            this.hide(parent);
        } else {
            this.show(parent);
        }
    };

    /* Show shortcuts on menu items when ALT key is pressed, non-Mac only */
    /*
    if (!app.isMac) {
      window.addEventListener('keydown', (e) => {
        if (e.altKey === true && e.key === 'Alt') {
          document.body.classList.toggle('altKey', true);
        }
      });
      window.addEventListener('keyup', (e) => {
        if (e.key === 'Alt') {
          document.body.classList.toggle('altKey', false);
        }
      });
    }
    */
}

export default Menus