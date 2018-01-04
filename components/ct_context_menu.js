/*
*   --------------------------------------------------
*   CT Context Menu Web Component V1
*   --------------------------------------------------
*
*   Recoded for version 1 of the web components spec.
*
*   This will display a popup context menu that can
*   be configured to either popout from the side of
*   the page or to popout under a specific element.
*
*   --------------------------------------------------
*/
(function() {
    /**
     * CTContextMenu
     * @attribute {number} [MinWidth]
     * @attribute {string} [Direction]
     * @attribute {boolean} [Overlay]
     * @container
     */
    class CTContextMenu extends HTMLElement {
        // Default Component methods
        constructor(self) {
            self = super(self);
            self._rendered = false;
            return self;
        }
        connectedCallback() {
            if(!this._rendered) {
                this._rendered = true;
                this._render();
            }
        }
      	disconnectedCallback() {
        	this._rendered = false;
        }
        // Custom Component Methods (for this component only)
        _render() {
            this.minWidth = this.getAttribute('minwidth') === 'null' ? 0 : parseInt(this.getAttribute('minwidth'));
            this.direction = this.getAttribute('direction');
            this.overlay = this.getAttribute('overlay');
            let container = document.createElement('div');
            container.className = 'contextMenuBG ' + this.direction;
            container.style.display = 'none';
            container.addEventListener('click', this.clickToClose, true);
            let menu = document.createElement('div');
            menu.className = 'contextMenu';
            //menu.addEventListener('click', this.contextMenuNull, false);
            while(this.childNodes.length !== 0) {
                menu.appendChild(this.childNodes[0]);
            }
            container.appendChild(menu);
            this.appendChild(container);
            this.opened = false;
            if(!this.overlay) {
                var appContainer = document.querySelector('.app-container');
                appContainer.appendChild(this);
            }
        }
        // Toggles the menu opened and closed based on the value
        // of the this.opened property (initially set to false)
        toggleMenu() {
            var contextMenu = document.getElementsByClassName('contextMenuBG')[0];
            if(!this.opened) {
                this.opened = true;
                contextMenu.style.display = 'initial';
            }
            else {
                this.opened = false;
                contextMenu.style.display = 'none';
            }
        }
        /**
         * Toggles the page opened and closed based on the value
         * of the this.opened property (initially set to false)
         */
        toggle(e) {
            if(this.overlay) {
                var contextMenu = document.getElementsByTagName('ct-context-menu')[0];
                contextMenu.toggleMenu();
            }
            else {
                var currPage = document.querySelector('div#' + cti.store.state.currentPage);
                if(this.opened) {
                    currPage.classList.add('hideUnderlay');
                    this.opened = false;
                    currPage.removeEventListener('click', this.clickToClose, false);
                }
                else {
                    currPage.classList.remove('hideUnderlay');
                    currPage.classList.add('underlayStyle');
                    this.opened = true;
                    currPage.addEventListener('click', this.clickToClose, false);
                }
            }
        }
        clickToClose(e) {
            var contextMenu = document.getElementsByTagName('ct-context-menu')[0];
            contextMenu.toggle();
        }
        // This stops clicks from within the CTI page div
        // (where this component lives) from bubbling up
        // and raising the clickToClose event
        contextMenuNull(e){
            e.stopPropagation();
            // Do nothing!
        }
    }
    // New V1 component definition
    customElements.define('ct-context-menu', CTContextMenu);
})();