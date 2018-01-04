"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {

  /**
   * radioButtons component
   * @attribute {string} [questionText] - Question description
   * @attribute {string} [selectedValue] - Selected value to allow us to preselect if the value exists in the store
   * @event radioPressed - Emitted when a value changes in the component
   * @event connected - Emitted when the element has connected
   */
  var radioButtons = function (_HTMLElement) {
    _inherits(radioButtons, _HTMLElement);

    function radioButtons(self) {
      var _this, _ret;

      _classCallCheck(this, radioButtons);

      self = (_this = _possibleConstructorReturn(this, (radioButtons.__proto__ || Object.getPrototypeOf(radioButtons)).call(this, self)), _this);
      return _ret = self, _possibleConstructorReturn(_this, _ret);
    }

    _createClass(radioButtons, [{
      key: "connectedCallback",
      value: function connectedCallback() {
        var _this2 = this;

        this._render();
        var $radios = this.querySelectorAll("input[type='radio']");
        var callback = function callback(event) {
          console.log("Radio Pressed:", event.target.value);
          event.target.setAttribute('checked', 'true');
          _this2.dispatchEvent(new CustomEvent("radioPressed", { detail: event.target.value }));
        };
        [].forEach.call($radios, function ($radio) {
          $radio.addEventListener("change", callback);
        });
        this.dispatchEvent(new CustomEvent("connected"));
      }
    }, {
      key: "isChecked",
      value: function isChecked(p_val) {
        var currentVal;
        try {
          currentVal = eval(this.getAttribute('selectedValue'));
          if (currentVal) {
            if (currentVal === p_val) return 'checked';
          }
          return '';
        } catch (e) {
          return '';
        }
      }
    }, {
      key: "_render",
      value: function _render() {
        this.innerHTML = "\n        <label class='control-label ng-binding'>" + (this.getAttribute("questionText") || "(none)") + "</label>\n        <div class='radioButtons'>\n            <input type=\"radio\" name=\"choice\" value=\"1\" class='radioInput' id='radio1' " + this.isChecked('1') + "/>\n            <label for='radio1'>1</label>\n            <input type=\"radio\" name=\"choice\" value=\"2\" class='radioInput' id='radio2'" + this.isChecked('2') + "/>\n            <label for='radio2'>2</label>\n            <input type=\"radio\" name=\"choice\" value=\"3\" class='radioInput' id='radio3'" + this.isChecked('3') + "/>\n            <label for='radio3'>3 </label>\n            <input type=\"radio\" name=\"choice\" value=\"4\" class='radioInput' id='radio4' " + this.isChecked('4') + "/>\n            <label for='radio4'>4 </label>\n            <input type=\"radio\" name=\"choice\" value=\"5\" class='radioInput' id='radio5' " + this.isChecked('5') + "/>\n            <label for='radio5'>5</label>\n            <input type=\"radio\" name=\"choice\" value=\"6\" class='radioInput' id='radio6' " + this.isChecked('6') + "/>\n            <label for='radio6'>6</label>\n            <input type=\"radio\" name=\"choice\" value=\"7\" class='radioInput' id='radio7' " + this.isChecked('7') + "/>\n            <label for='radio7'>7</label>\n        </div>\n      ";
      }
    }]);

    return radioButtons;
  }(HTMLElement);

  customElements.define('cti-radio-buttons', radioButtons);
})();