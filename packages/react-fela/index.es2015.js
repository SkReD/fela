import { Component, Children, PropTypes, createElement } from 'react';

var babelHelpers = {};
babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

babelHelpers.classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

babelHelpers.createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

babelHelpers.defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

babelHelpers.extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

babelHelpers.inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

babelHelpers.objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

babelHelpers.possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

babelHelpers.toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

babelHelpers;


var __commonjs_global = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this;
function __commonjs(fn, module) { return module = { exports: {} }, fn(module, module.exports, __commonjs_global), module.exports; }

/*  weak */
var RULE_TYPE = 1;

function createDOMInterface(renderer, node) {
  return function (change) {
    // only use insertRule in production as browser devtools might have
    // weird behavior if used together with insertRule at runtime
    if (true && change.type === RULE_TYPE && !change.media) {
      try {
        node.sheet.insertRule(change.selector + '{' + change.declaration + '}', node.sheet.cssRules.length);
      } catch (error) {
        // TODO: MAYBE WARN IN DEV MODE
      }
    } else {
      node.textContent = renderer.renderToString();
    }
  };
}

function isValidHTMLElement(mountNode) {
  return mountNode && mountNode.nodeType === 1;
}

function render(renderer, mountNode) {
  // mountNode must be a valid HTML element to be able
  // to set mountNode.textContent later on
  if (!isValidHTMLElement(mountNode)) {
    throw new Error('You need to specify a valid element node (nodeType = 1) to render into.');
  }

  // warns if the DOM node either is not a valid <style> element
  // thus the styles do not get applied as Expected
  // or if the node already got the data-fela-stylesheet attribute applied
  // suggesting it is already used by another Renderer
  void 0;

  // mark and clean the DOM node to prevent side-effects
  mountNode.setAttribute('data-fela-stylesheet', '');

  var updateNode = createDOMInterface(renderer, mountNode);
  renderer.subscribe(updateNode);

  var css = renderer.renderToString();

  if (mountNode.textContent !== css) {
    // render currently rendered styles to the DOM once
    mountNode.textContent = css;
  }
}

var Provider = function (_Component) {
  babelHelpers.inherits(Provider, _Component);

  function Provider() {
    babelHelpers.classCallCheck(this, Provider);
    return babelHelpers.possibleConstructorReturn(this, (Provider.__proto__ || Object.getPrototypeOf(Provider)).apply(this, arguments));
  }

  babelHelpers.createClass(Provider, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return { renderer: this.props.renderer };
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _props = this.props,
          mountNode = _props.mountNode,
          renderer = _props.renderer;


      if (mountNode) {
        render(renderer, mountNode);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return Children.only(this.props.children);
    }
  }]);
  return Provider;
}(Component);

Provider.propTypes = { renderer: PropTypes.object.isRequired };
Provider.childContextTypes = { renderer: PropTypes.object };

var generateDisplayName = function generateDisplayName(Comp) {
  var displayName = Comp.displayName || Comp.name;
  if (displayName) {
    return 'Fela' + displayName;
  }

  return 'ConnectedFelaComponent';
};

var createVNode = Inferno.createVNode;
function connect(mapStylesToProps) {
  return function (Comp) {
    var _class, _temp;

    return _temp = _class = function (_Component) {
      babelHelpers.inherits(EnhancedComponent, _Component);

      function EnhancedComponent() {
        babelHelpers.classCallCheck(this, EnhancedComponent);
        return babelHelpers.possibleConstructorReturn(this, (EnhancedComponent.__proto__ || Object.getPrototypeOf(EnhancedComponent)).apply(this, arguments));
      }

      babelHelpers.createClass(EnhancedComponent, [{
        key: 'render',

        // reuse the initial displayName name
        value: function render() {
          var _context = this.context,
              renderer = _context.renderer,
              theme = _context.theme;


          var styles = mapStylesToProps(babelHelpers.extends({}, this.props, {
            theme: theme || {}
          }))(renderer);

          return createVNode(16, Comp, babelHelpers.extends({}, this.props, {
            'styles': styles
          }));
        }
      }]);
      return EnhancedComponent;
    }(Component), _class.displayName = generateDisplayName(Comp), _class.contextTypes = babelHelpers.extends({}, Comp.contextTypes, {
      renderer: PropTypes.object,
      theme: PropTypes.object
    }), _temp;
  };
}

/*  weak */
function extractPassThroughProps(passThrough, ruleProps) {
  return passThrough.reduce(function (output, prop) {
    output[prop] = ruleProps[prop];
    return output;
  }, {});
}

/*  weak */
function resolvePassThrough(passThrough, ruleProps) {
  if (passThrough instanceof Function) {
    return Object.keys(passThrough(ruleProps));
  }

  return passThrough;
}

/*  weak */
function assignStyles(base) {
  for (var _len = arguments.length, extendingStyles = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    extendingStyles[_key - 1] = arguments[_key];
  }

  for (var i = 0, len = extendingStyles.length; i < len; ++i) {
    var style = extendingStyles[i];

    for (var property in style) {
      var value = style[property];
      var baseValue = base[property];

      if (baseValue instanceof Object) {
        if (Array.isArray(baseValue)) {
          if (Array.isArray(value)) {
            base[property] = [].concat(babelHelpers.toConsumableArray(baseValue), babelHelpers.toConsumableArray(value));
          } else {
            base[property] = [].concat(babelHelpers.toConsumableArray(baseValue), [value]);
          }
          continue;
        }

        if (value instanceof Object && !Array.isArray(value)) {
          base[property] = assignStyles({}, baseValue, value);
          continue;
        }
      }

      base[property] = value;
    }
  }

  return base;
}

function combineRules() {
  for (var _len = arguments.length, rules = Array(_len), _key = 0; _key < _len; _key++) {
    rules[_key] = arguments[_key];
  }

  return function (props) {
    var style = {};

    for (var i = 0, len = rules.length; i < len; ++i) {
      assignStyles(style, rules[i](props));
    }

    return style;
  };
}

function createComponent(rule) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'div';
  var passThroughProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  var FelaComponent = function FelaComponent(_ref, _ref2) {
    var renderer = _ref2.renderer,
        theme = _ref2.theme;
    var children = _ref.children,
        _felaRule = _ref._felaRule,
        _ref$passThrough = _ref.passThrough,
        passThrough = _ref$passThrough === undefined ? [] : _ref$passThrough,
        ruleProps = babelHelpers.objectWithoutProperties(_ref, ['children', '_felaRule', 'passThrough']);

    var combinedRule = _felaRule ? combineRules(rule, _felaRule) : rule;

    // compose passThrough props from arrays or functions
    var resolvedPassThrough = [].concat(babelHelpers.toConsumableArray(resolvePassThrough(passThroughProps, ruleProps)), babelHelpers.toConsumableArray(resolvePassThrough(passThrough, ruleProps)));

    // if the component renders into another Fela component
    // we pass down the combinedRule as well as both
    if (type._isFelaComponent) {
      return createElement(type, babelHelpers.extends({
        _felaRule: combinedRule,
        passThrough: resolvedPassThrough
      }, ruleProps), children);
    }

    var componentProps = extractPassThroughProps(resolvedPassThrough, ruleProps);

    componentProps.style = ruleProps.style;
    componentProps.id = ruleProps.id;
    componentProps.ref = ruleProps.innerRef;

    var customType = ruleProps.is || type;
    var cls = ruleProps.className ? ruleProps.className + ' ' : '';
    ruleProps.theme = theme || {};

    componentProps.className = cls + renderer.renderRule(combinedRule, ruleProps);
    return createElement(customType, componentProps, children);
  };

  FelaComponent.contextTypes = {
    renderer: PropTypes.object,
    theme: PropTypes.object
  };

  // use the rule name as display name to better debug with react inspector
  FelaComponent.displayName = rule.name ? rule.name : 'FelaComponent';
  FelaComponent._isFelaComponent = true;

  return FelaComponent;
}

var ThemeProvider = function (_Component) {
  babelHelpers.inherits(ThemeProvider, _Component);

  function ThemeProvider() {
    babelHelpers.classCallCheck(this, ThemeProvider);
    return babelHelpers.possibleConstructorReturn(this, (ThemeProvider.__proto__ || Object.getPrototypeOf(ThemeProvider)).apply(this, arguments));
  }

  babelHelpers.createClass(ThemeProvider, [{
    key: 'getChildContext',
    value: function getChildContext() {
      var _props = this.props,
          overwrite = _props.overwrite,
          theme = _props.theme;

      var previousTheme = this.context.theme;

      return {
        theme: babelHelpers.extends({}, !overwrite ? previousTheme || {} : {}, theme)
      };
    }
  }, {
    key: 'render',
    value: function render() {
      return Children.only(this.props.children);
    }
  }]);
  return ThemeProvider;
}(Component);

ThemeProvider.propTypes = {
  theme: PropTypes.object.isRequired,
  overwrite: PropTypes.bool
};
ThemeProvider.childContextTypes = { theme: PropTypes.object };
ThemeProvider.contextTypes = { theme: PropTypes.object };
ThemeProvider.defaultProps = { overwrite: false };

var index = {
  Provider: Provider,
  connect: connect,
  createComponent: createComponent,
  ThemeProvider: ThemeProvider
};

export default index;