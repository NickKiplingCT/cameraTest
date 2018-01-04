(function() {
  
  /**
   * loadSpinner component
   * @attribute {string} [message] - A message to display whilst the spinner is showing
   */
  class loadSpinner extends HTMLElement {
    
    constructor(self) {
      self = super(self);
      return self;
    }
    
    static get observedAttributes() {
      return ["message"];
    };
    
    connectedCallback() {
      this._render();
    };
    
    disconnectedCallback() {
    };
    
    /**
     * Invoke the spinner
     */
    show() {
        this.className = 'active';            
    }

    /**
     * Remove/hide the spinner
     */
    close() {
          this.className = '';
    }

    /**
     * Add the 'spinner' class to start the animation
     */
    startSpin() {

      document.getElementById('spinAnimation').className = 'spinner'
    }

    /**
     * Remove the 'spinner' class to prevent animation in the backgroud
     */
    stopSpin() {

      document.getElementById('spinAnimation').className = ''     
    }
    
    attributeChangedCallback(attrName, oldVal, newVal) {
      var displayMessage = this.getAttribute("message") || "Loading - please wait a moment";
      var elem = this.getElementsByClassName("loading-message");
      if (elem && elem.length > 0) {
        elem[0].innerHTML = displayMessage;    
      }
    };
    
    _render() {
        var displayMessage = this.getAttribute("message") || "Loading - please wait a moment";

        this.innerHTML = '<div class="header"></div><div id="spinAnimation"></div><div class="loading-message">'+ displayMessage + '</div>';
        this.className = '';
    }
  }
  customElements.define('load-spinner', loadSpinner);
})();