(function() {
  
  /**
   * radioButtons component
   * @attribute {string} [questionText] - Question description
   * @attribute {string} [selectedValue] - Selected value to allow us to preselect if the value exists in the store
   * @event radioPressed - Emitted when a value changes in the component
   * @event connected - Emitted when the element has connected
   */
  class radioButtons extends HTMLElement {
    
    constructor(self) {
      self = super(self);
      return self;
    }
    
    connectedCallback() {
      this._render();
      const $radios = this.querySelectorAll("input[type='radio']");
      const callback = (event) => {
        console.log("Radio Pressed:", event.target.value);
        event.target.setAttribute('checked', 'true');
        this.dispatchEvent(new CustomEvent("radioPressed", { detail: event.target.value }));
      };
      [].forEach.call($radios, function ($radio) {
          $radio.addEventListener("change", callback);
      });
      this.dispatchEvent(new CustomEvent("connected"));
    };   
    
    isChecked(p_val){
      var currentVal
      try {
        currentVal =  eval(this.getAttribute('selectedValue'))
        if (currentVal) {
          if (currentVal === p_val) return 'checked'
        }
        return ''
      } catch (e) { 
      	return ''
      }
    }
   
    _render() {
      this.innerHTML = `
        <label class='control-label ng-binding'>${this.getAttribute("questionText") || "(none)"}</label>
        <div class='radioButtons'>
            <input type="radio" name="choice" value="1" class='radioInput' id='radio1' ${this.isChecked('1')}/>
            <label for='radio1'>1</label>
            <input type="radio" name="choice" value="2" class='radioInput' id='radio2'${this.isChecked('2')}/>
            <label for='radio2'>2</label>
            <input type="radio" name="choice" value="3" class='radioInput' id='radio3'${this.isChecked('3')}/>
            <label for='radio3'>3 </label>
            <input type="radio" name="choice" value="4" class='radioInput' id='radio4' ${this.isChecked('4')}/>
            <label for='radio4'>4 </label>
            <input type="radio" name="choice" value="5" class='radioInput' id='radio5' ${this.isChecked('5')}/>
            <label for='radio5'>5</label>
            <input type="radio" name="choice" value="6" class='radioInput' id='radio6' ${this.isChecked('6')}/>
            <label for='radio6'>6</label>
            <input type="radio" name="choice" value="7" class='radioInput' id='radio7' ${this.isChecked('7')}/>
            <label for='radio7'>7</label>
        </div>
      `;
    }
  }
  customElements.define('cti-radio-buttons', radioButtons);
})();