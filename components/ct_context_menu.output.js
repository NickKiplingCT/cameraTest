'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
(function () {
    /**
     * CTContextMenu
     * @attribute {number} [MinWidth]
     * @attribute {string} [Direction]
     * @attribute {boolean} [Overlay]
     * @container
     */
    var CTContextMenu = function (_HTMLElement) {
        _inherits(CTContextMenu, _HTMLElement);

        // Default Component methods
        function CTContextMenu(self) {
            var _this, _ret;

            _classCallCheck(this, CTContextMenu);

            self = (_this = _possibleConstructorReturn(this, (CTContextMenu.__proto__ || Object.getPrototypeOf(CTContextMenu)).call(this, self)), _this);
            self._rendered = false;
            return _ret = self, _possibleConstructorReturn(_this, _ret);
        }

        _createClass(CTContextMenu, [{
            key: 'connectedCallback',
            value: function connectedCallback() {
                if (!this._rendered) {
                    this._rendered = true;
                    this._render();
                }
            }
        }, {
            key: 'disconnectedCallback',
            value: function disconnectedCallback() {
                this._rendered = false;
            }
            // Custom Component Methods (for this component only)

        }, {
            key: '_render',
            value: function _render() {
                this.minWidth = this.getAttribute('minwidth') === 'null' ? 0 : parseInt(this.getAttribute('minwidth'));
                this.direction = this.getAttribute('direction');
                this.overlay = this.getAttribute('overlay');
                var container = document.createElement('div');
                container.className = 'contextMenuBG ' + this.direction;
                container.style.display = 'none';
                container.addEventListener('click', this.clickToClose, true);
                var menu = document.createElement('div');
                menu.className = 'contextMenu';
                //menu.addEventListener('click', this.contextMenuNull, false);
                while (this.childNodes.length !== 0) {
                    menu.appendChild(this.childNodes[0]);
                }
                container.appendChild(menu);
                this.appendChild(container);
                this.opened = false;
                if (!this.overlay) {
                    var appContainer = document.querySelector('.app-container');
                    appContainer.appendChild(this);
                }
            }
            // Toggles the menu opened and closed based on the value
            // of the this.opened property (initially set to false)

        }, {
            key: 'toggleMenu',
            value: function toggleMenu() {
                var contextMenu = document.getElementsByClassName('contextMenuBG')[0];
                if (!this.opened) {
                    this.opened = true;
                    contextMenu.style.display = 'initial';
                } else {
                    this.opened = false;
                    contextMenu.style.display = 'none';
                }
            }
            /**
             * Toggles the page opened and closed based on the value
             * of the this.opened property (initially set to false)
             */

        }, {
            key: 'toggle',
            value: function toggle(e) {
                if (this.overlay) {
                    var contextMenu = document.getElementsByTagName('ct-context-menu')[0];
                    contextMenu.toggleMenu();
                } else {
                    var currPage = document.querySelector('div#' + cti.store.state.currentPage);
                    if (this.opened) {
                        currPage.classList.add('hideUnderlay');
                        this.opened = false;
                        currPage.removeEventListener('click', this.clickToClose, false);
                    } else {
                        currPage.classList.remove('hideUnderlay');
                        currPage.classList.add('underlayStyle');
                        this.opened = true;
                        currPage.addEventListener('click', this.clickToClose, false);
                    }
                }
            }
        }, {
            key: 'clickToClose',
            value: function clickToClose(e) {
                var contextMenu = document.getElementsByTagName('ct-context-menu')[0];
                contextMenu.toggle();
            }
            // This stops clicks from within the CTI page div
            // (where this component lives) from bubbling up
            // and raising the clickToClose event

        }, {
            key: 'contextMenuNull',
            value: function contextMenuNull(e) {
                e.stopPropagation();
                // Do nothing!
            }
        }]);

        return CTContextMenu;
    }(HTMLElement);
    // New V1 component definition


    customElements.define('ct-context-menu', CTContextMenu);
})();