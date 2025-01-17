/*!
 * JqTree 1.4.4
 * 
 * Copyright 2017 Marco Braak
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 16);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var Position;
(function (Position) {
    Position[Position["Before"] = 1] = "Before";
    Position[Position["After"] = 2] = "After";
    Position[Position["Inside"] = 3] = "Inside";
    Position[Position["None"] = 4] = "None";
})(Position = exports.Position || (exports.Position = {}));
exports.position_names = {
    before: Position.Before,
    after: Position.After,
    inside: Position.Inside,
    none: Position.None
};
function getPositionName(position) {
    for (var name_1 in exports.position_names) {
        if (exports.position_names.hasOwnProperty(name_1)) {
            if (exports.position_names[name_1] === position) {
                return name_1;
            }
        }
    }
    return "";
}
exports.getPositionName = getPositionName;
function getPosition(name) {
    return exports.position_names[name];
}
exports.getPosition = getPosition;
var Node = /** @class */ (function () {
    function Node(o, is_root, node_class) {
        if (is_root === void 0) { is_root = false; }
        if (node_class === void 0) { node_class = Node; }
        this.name = "";
        this.setData(o);
        this.children = [];
        this.parent = null;
        if (is_root) {
            this.id_mapping = {};
            this.tree = this;
            this.node_class = node_class;
        }
    }
    /*
    Set the data of this node.

    setData(string): set the name of the node
    setdata(object): set attributes of the node

    Examples:
        setdata('node1')

        setData({ name: 'node1', id: 1});

        setData({ name: 'node2', id: 2, color: 'green'});

    * This is an internal function; it is not in the docs
    * Does not remove existing node values
    */
    Node.prototype.setData = function (o) {
        var _this = this;
        var setName = function (name) {
            if (name != null) {
                _this.name = name;
            }
        };
        if (!o) {
            return;
        }
        else if (typeof o !== "object") {
            setName(o);
        }
        else {
            for (var key in o) {
                if (o.hasOwnProperty(key)) {
                    var value = o[key];
                    if (key === "label") {
                        // You can use the 'label' key instead of 'name'; this is a legacy feature
                        setName(value);
                    }
                    else if (key !== "children") {
                        // You can't update the children using this function
                        this[key] = value;
                    }
                }
            }
        }
    };
    /*
    Create tree from data.

    Structure of data is:
    [
        {
            label: 'node1',
            children: [
                { label: 'child1' },
                { label: 'child2' }
            ]
        },
        {
            label: 'node2'
        }
    ]
    */
    Node.prototype.loadFromData = function (data) {
        this.removeChildren();
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var o = data_1[_i];
            var node = new this.tree.node_class(o);
            this.addChild(node);
            if (typeof o === "object" && o["children"]) {
                node.loadFromData(o["children"]);
            }
        }
    };
    /*
    Add child.

    tree.addChild(
        new Node('child1')
    );
    */
    Node.prototype.addChild = function (node) {
        this.children.push(node);
        node._setParent(this);
    };
    /*
    Add child at position. Index starts at 0.

    tree.addChildAtPosition(
        new Node('abc'),
        1
    );
    */
    Node.prototype.addChildAtPosition = function (node, index) {
        this.children.splice(index, 0, node);
        node._setParent(this);
    };
    /*
    Remove child. This also removes the children of the node.

    tree.removeChild(tree.children[0]);
    */
    Node.prototype.removeChild = function (node) {
        // remove children from the index
        node.removeChildren();
        this._removeChild(node);
    };
    /*
    Get child index.

    var index = getChildIndex(node);
    */
    Node.prototype.getChildIndex = function (node) {
        return jQuery.inArray(node, this.children);
    };
    /*
    Does the tree have children?

    if (tree.hasChildren()) {
        //
    }
    */
    Node.prototype.hasChildren = function () {
        return this.children.length !== 0;
    };
    Node.prototype.isFolder = function () {
        return this.hasChildren() || this.load_on_demand;
    };
    /*
    Iterate over all the nodes in the tree.

    Calls callback with (node, level).

    The callback must return true to continue the iteration on current node.

    tree.iterate(
        function(node, level) {
           console.log(node.name);

           // stop iteration after level 2
           return (level <= 2);
        }
    );

    */
    Node.prototype.iterate = function (callback) {
        var _iterate = function (node, level) {
            if (node.children) {
                for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
                    var child = _a[_i];
                    var result = callback(child, level);
                    if (result && child.hasChildren()) {
                        _iterate(child, level + 1);
                    }
                }
            }
        };
        _iterate(this, 0);
    };
    /*
    Move node relative to another node.

    Argument position: Position.BEFORE, Position.AFTER or Position.Inside

    // move node1 after node2
    tree.moveNode(node1, node2, Position.AFTER);
    */
    Node.prototype.moveNode = function (moved_node, target_node, position) {
        if (!moved_node.parent || moved_node.isParentOf(target_node)) {
            // - Node is parent of target node
            // - Or, parent is empty
            return;
        }
        else {
            moved_node.parent._removeChild(moved_node);
            if (position === Position.After) {
                if (target_node.parent) {
                    target_node.parent.addChildAtPosition(moved_node, target_node.parent.getChildIndex(target_node) + 1);
                }
            }
            else if (position === Position.Before) {
                if (target_node.parent) {
                    target_node.parent.addChildAtPosition(moved_node, target_node.parent.getChildIndex(target_node));
                }
            }
            else if (position === Position.Inside) {
                // move inside as first child
                target_node.addChildAtPosition(moved_node, 0);
            }
        }
    };
    /*
    Get the tree as data.
    */
    Node.prototype.getData = function (include_parent) {
        if (include_parent === void 0) { include_parent = false; }
        function getDataFromNodes(nodes) {
            return nodes.map(function (node) {
                var tmp_node = {};
                for (var k in node) {
                    if (["parent", "children", "element", "tree"].indexOf(k) ===
                        -1 &&
                        Object.prototype.hasOwnProperty.call(node, k)) {
                        var v = node[k];
                        tmp_node[k] = v;
                    }
                }
                if (node.hasChildren()) {
                    tmp_node["children"] = getDataFromNodes(node.children);
                }
                return tmp_node;
            });
        }
        if (include_parent) {
            return getDataFromNodes([this]);
        }
        else {
            return getDataFromNodes(this.children);
        }
    };
    Node.prototype.getNodeByName = function (name) {
        return this.getNodeByCallback(function (node) { return node.name === name; });
    };
    Node.prototype.getNodeByCallback = function (callback) {
        var result = null;
        this.iterate(function (node) {
            if (callback(node)) {
                result = node;
                return false;
            }
            else {
                return true;
            }
        });
        return result;
    };
    Node.prototype.addAfter = function (node_info) {
        if (!this.parent) {
            return null;
        }
        else {
            var node = new this.tree.node_class(node_info);
            var child_index = this.parent.getChildIndex(this);
            this.parent.addChildAtPosition(node, child_index + 1);
            if (typeof node_info === "object" &&
                node_info["children"] &&
                node_info["children"].length) {
                node.loadFromData(node_info["children"]);
            }
            return node;
        }
    };
    Node.prototype.addBefore = function (node_info) {
        if (!this.parent) {
            return null;
        }
        else {
            var node = new this.tree.node_class(node_info);
            var child_index = this.parent.getChildIndex(this);
            this.parent.addChildAtPosition(node, child_index);
            if (typeof node_info === "object" &&
                node_info["children"] &&
                node_info["children"].length) {
                node.loadFromData(node_info["children"]);
            }
            return node;
        }
    };
    Node.prototype.addParent = function (node_info) {
        if (!this.parent) {
            return null;
        }
        else {
            var new_parent = new this.tree.node_class(node_info);
            new_parent._setParent(this.tree);
            var original_parent = this.parent;
            for (var _i = 0, _a = original_parent.children; _i < _a.length; _i++) {
                var child = _a[_i];
                new_parent.addChild(child);
            }
            original_parent.children = [];
            original_parent.addChild(new_parent);
            return new_parent;
        }
    };
    Node.prototype.remove = function () {
        if (this.parent) {
            this.parent.removeChild(this);
            this.parent = null;
        }
    };
    Node.prototype.append = function (node_info) {
        var node = new this.tree.node_class(node_info);
        this.addChild(node);
        if (typeof node_info === "object" &&
            node_info["children"] &&
            node_info["children"].length) {
            node.loadFromData(node_info["children"]);
        }
        return node;
    };
    Node.prototype.prepend = function (node_info) {
        var node = new this.tree.node_class(node_info);
        this.addChildAtPosition(node, 0);
        if (typeof node_info === "object" &&
            node_info["children"] &&
            node_info["children"].length) {
            node.loadFromData(node_info["children"]);
        }
        return node;
    };
    Node.prototype.isParentOf = function (node) {
        var parent = node.parent;
        while (parent) {
            if (parent === this) {
                return true;
            }
            parent = parent.parent;
        }
        return false;
    };
    Node.prototype.getLevel = function () {
        var level = 0;
        var node = this;
        while (node.parent) {
            level += 1;
            node = node.parent;
        }
        return level;
    };
    Node.prototype.getNodeById = function (node_id) {
        return this.id_mapping[node_id];
    };
    Node.prototype.addNodeToIndex = function (node) {
        if (node.id != null) {
            this.id_mapping[node.id] = node;
        }
    };
    Node.prototype.removeNodeFromIndex = function (node) {
        if (node.id != null) {
            delete this.id_mapping[node.id];
        }
    };
    Node.prototype.removeChildren = function () {
        var _this = this;
        this.iterate(function (child) {
            _this.tree.removeNodeFromIndex(child);
            return true;
        });
        this.children = [];
    };
    Node.prototype.getPreviousSibling = function () {
        if (!this.parent) {
            return null;
        }
        else {
            var previous_index = this.parent.getChildIndex(this) - 1;
            if (previous_index >= 0) {
                return this.parent.children[previous_index];
            }
            else {
                return null;
            }
        }
    };
    Node.prototype.getNextSibling = function () {
        if (!this.parent) {
            return null;
        }
        else {
            var next_index = this.parent.getChildIndex(this) + 1;
            if (next_index < this.parent.children.length) {
                return this.parent.children[next_index];
            }
            else {
                return null;
            }
        }
    };
    Node.prototype.getNodesByProperty = function (key, value) {
        return this.filter(function (node) { return node[key] === value; });
    };
    Node.prototype.filter = function (f) {
        var result = [];
        this.iterate(function (node) {
            if (f(node)) {
                result.push(node);
            }
            return true;
        });
        return result;
    };
    Node.prototype.getNextNode = function (include_children) {
        if (include_children === void 0) { include_children = true; }
        if (include_children && this.hasChildren() && this.is_open) {
            // First child
            return this.children[0];
        }
        else {
            if (!this.parent) {
                return null;
            }
            else {
                var next_sibling = this.getNextSibling();
                if (next_sibling) {
                    // Next sibling
                    return next_sibling;
                }
                else {
                    // Next node of parent
                    return this.parent.getNextNode(false);
                }
            }
        }
    };
    Node.prototype.getPreviousNode = function () {
        if (!this.parent) {
            return null;
        }
        else {
            var previous_sibling = this.getPreviousSibling();
            if (previous_sibling) {
                if (!previous_sibling.hasChildren() ||
                    !previous_sibling.is_open) {
                    // Previous sibling
                    return previous_sibling;
                }
                else {
                    // Last child of previous sibling
                    return previous_sibling.getLastChild();
                }
            }
            else {
                return this.getParent();
            }
        }
    };
    Node.prototype.getParent = function () {
        // Return parent except if it is the root node
        if (!this.parent) {
            return null;
        }
        else if (!this.parent.parent) {
            // Root node -> null
            return null;
        }
        else {
            return this.parent;
        }
    };
    Node.prototype.getLastChild = function () {
        if (!this.hasChildren()) {
            return null;
        }
        else {
            var last_child = this.children[this.children.length - 1];
            if (!last_child.hasChildren() || !last_child.is_open) {
                return last_child;
            }
            else {
                return last_child.getLastChild();
            }
        }
    };
    // Init Node from data without making it the root of the tree
    Node.prototype.initFromData = function (data) {
        var _this = this;
        var addNode = function (node_data) {
            _this.setData(node_data);
            if (node_data["children"]) {
                addChildren(node_data["children"]);
            }
        };
        var addChildren = function (children_data) {
            for (var _i = 0, children_data_1 = children_data; _i < children_data_1.length; _i++) {
                var child = children_data_1[_i];
                var node = new _this.tree.node_class("");
                node.initFromData(child);
                _this.addChild(node);
            }
        };
        addNode(data);
    };
    Node.prototype._setParent = function (parent) {
        this.parent = parent;
        this.tree = parent.tree;
        this.tree.addNodeToIndex(this);
    };
    Node.prototype._removeChild = function (node) {
        this.children.splice(this.getChildIndex(node), 1);
        this.tree.removeNodeFromIndex(node);
    };
    return Node;
}());
exports.Node = Node;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
function isInt(n) {
    return typeof n === "number" && n % 1 === 0;
}
exports.isInt = isInt;
function isFunction(v) {
    return typeof v === "function";
}
exports.isFunction = isFunction;
// Escape a string for HTML interpolation; copied from underscore js
function html_escape(text) {
    return ("" + text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;")
        .replace(/\//g, "&#x2F;");
}
exports.html_escape = html_escape;
function getBoolString(value) {
    if (value) {
        return "true";
    }
    else {
        return "false";
    }
}
exports.getBoolString = getBoolString;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var SimpleWidget = /** @class */ (function () {
    function SimpleWidget(el, options) {
        this.$el = jQuery(el);
        var defaults = this.constructor.defaults;
        this.options = jQuery.extend({}, defaults, options);
    }
    SimpleWidget.register = function (widget_class, widget_name) {
        var getDataKey = function () { return "simple_widget_" + widget_name; };
        function getWidgetData(el, data_key) {
            var widget = jQuery.data(el, data_key);
            if (widget && widget instanceof SimpleWidget) {
                return widget;
            }
            else {
                return null;
            }
        }
        function createWidget($el, options) {
            var data_key = getDataKey();
            for (var _i = 0, _a = $el.get(); _i < _a.length; _i++) {
                var el = _a[_i];
                var existing_widget = getWidgetData(el, data_key);
                if (!existing_widget) {
                    var widget = new widget_class(el, options);
                    if (!jQuery.data(el, data_key)) {
                        jQuery.data(el, data_key, widget);
                    }
                    // Call init after setting data, so we can call methods
                    widget._init();
                }
            }
            return $el;
        }
        function destroyWidget($el) {
            var data_key = getDataKey();
            for (var _i = 0, _a = $el.get(); _i < _a.length; _i++) {
                var el = _a[_i];
                var widget = getWidgetData(el, data_key);
                if (widget) {
                    widget.destroy();
                }
                jQuery.removeData(el, data_key);
            }
        }
        function callFunction($el, function_name, args) {
            var result = null;
            for (var _i = 0, _a = $el.get(); _i < _a.length; _i++) {
                var el = _a[_i];
                var widget = jQuery.data(el, getDataKey());
                if (widget && widget instanceof SimpleWidget) {
                    var widget_function = widget[function_name];
                    if (widget_function &&
                        typeof widget_function === "function") {
                        result = widget_function.apply(widget, args);
                    }
                }
            }
            return result;
        }
        // tslint:disable-next-line: only-arrow-functions
        jQuery.fn[widget_name] = function (argument1) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var $el = this;
            if (argument1 === undefined || typeof argument1 === "object") {
                var options = argument1;
                return createWidget($el, options);
            }
            else if (typeof argument1 === "string" && argument1[0] !== "_") {
                var function_name = argument1;
                if (function_name === "destroy") {
                    return destroyWidget($el);
                }
                else if (function_name === "get_widget_class") {
                    return widget_class;
                }
                else {
                    return callFunction($el, function_name, args);
                }
            }
        };
    };
    SimpleWidget.prototype.destroy = function () {
        this._deinit();
    };
    SimpleWidget.prototype._init = function () {
        //
    };
    SimpleWidget.prototype._deinit = function () {
        //
    };
    SimpleWidget.defaults = {};
    return SimpleWidget;
}());
exports["default"] = SimpleWidget;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var version_1 = __webpack_require__(5);
var jQuery = __webpack_require__(2);
var drag_and_drop_handler_1 = __webpack_require__(6);
var elements_renderer_1 = __webpack_require__(7);
var key_handler_1 = __webpack_require__(8);
var mouse_widget_1 = __webpack_require__(9);
var save_state_handler_1 = __webpack_require__(10);
var scroll_handler_1 = __webpack_require__(11);
var select_node_handler_1 = __webpack_require__(12);
var simple_widget_1 = __webpack_require__(3);
var node_1 = __webpack_require__(0);
var util_1 = __webpack_require__(1);
var node_element_1 = __webpack_require__(13);
var JqTreeWidget = /** @class */ (function (_super) {
    __extends(JqTreeWidget, _super);
    function JqTreeWidget() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JqTreeWidget.prototype.toggle = function (node, slide_param) {
        var slide = slide_param == null ? this.options.slide : slide_param;
        if (node.is_open) {
            this.closeNode(node, slide);
        }
        else {
            this.openNode(node, slide);
        }
        return this.element;
    };
    JqTreeWidget.prototype.getTree = function () {
        return this.tree;
    };
    JqTreeWidget.prototype.selectNode = function (node) {
        this._selectNode(node, false);
        return this.element;
    };
    JqTreeWidget.prototype.getSelectedNode = function () {
        if (this.select_node_handler) {
            return this.select_node_handler.getSelectedNode();
        }
        else {
            return false;
        }
    };
    JqTreeWidget.prototype.toJson = function () {
        return JSON.stringify(this.tree.getData());
    };
    JqTreeWidget.prototype.loadData = function (data, parent_node) {
        this._loadData(data, parent_node);
        return this.element;
    };
    /*
    signatures:
    - loadDataFromUrl(url, parent_node=null, on_finished=null)
        loadDataFromUrl('/my_data');
        loadDataFromUrl('/my_data', node1);
        loadDataFromUrl('/my_data', node1, function() { console.log('finished'); });
        loadDataFromUrl('/my_data', null, function() { console.log('finished'); });

    - loadDataFromUrl(parent_node=null, on_finished=null)
        loadDataFromUrl();
        loadDataFromUrl(node1);
        loadDataFromUrl(null, function() { console.log('finished'); });
        loadDataFromUrl(node1, function() { console.log('finished'); });
    */
    JqTreeWidget.prototype.loadDataFromUrl = function (param1, param2, param3) {
        if (jQuery.type(param1) === "string") {
            // first parameter is url
            this._loadDataFromUrl(param1, param2, param3);
        }
        else {
            // first parameter is not url
            this._loadDataFromUrl(null, param1, param2);
        }
        return this.element;
    };
    JqTreeWidget.prototype.reload = function (on_finished) {
        this._loadDataFromUrl(null, null, on_finished);
        return this.element;
    };
    JqTreeWidget.prototype.getNodeById = function (node_id) {
        return this.tree.getNodeById(node_id);
    };
    JqTreeWidget.prototype.getNodeByName = function (name) {
        return this.tree.getNodeByName(name);
    };
    JqTreeWidget.prototype.getNodesByProperty = function (key, value) {
        return this.tree.getNodesByProperty(key, value);
    };
    JqTreeWidget.prototype.getNodeByHtmlElement = function (element) {
        return this._getNode(jQuery(element));
    };
    JqTreeWidget.prototype.getNodeByCallback = function (callback) {
        return this.tree.getNodeByCallback(callback);
    };
    JqTreeWidget.prototype.openNode = function (node, param1, param2) {
        var _this = this;
        var parseParams = function () {
            var on_finished;
            var slide;
            if (util_1.isFunction(param1)) {
                on_finished = param1;
                slide = null;
            }
            else {
                slide = param1;
                on_finished = param2;
            }
            if (slide == null) {
                slide = _this.options.slide;
            }
            return [slide, on_finished];
        };
        var _a = parseParams(), slide = _a[0], on_finished = _a[1];
        if (node) {
            this._openNode(node, slide, on_finished);
        }
        return this.element;
    };
    JqTreeWidget.prototype.closeNode = function (node, slide_param) {
        var slide = slide_param == null ? this.options.slide : slide_param;
        if (node.isFolder()) {
            new node_element_1.FolderElement(node, this).close(slide, this.options.animationSpeed);
            this._saveState();
        }
        return this.element;
    };
    JqTreeWidget.prototype.isDragging = function () {
        if (this.dnd_handler) {
            return this.dnd_handler.is_dragging;
        }
        else {
            return false;
        }
    };
    JqTreeWidget.prototype.refreshHitAreas = function () {
        if (this.dnd_handler) {
            this.dnd_handler.refresh();
        }
        return this.element;
    };
    JqTreeWidget.prototype.addNodeAfter = function (new_node_info, existing_node) {
        var new_node = existing_node.addAfter(new_node_info);
        if (new_node) {
            this._refreshElements(existing_node.parent);
        }
        return new_node;
    };
    JqTreeWidget.prototype.addNodeBefore = function (new_node_info, existing_node) {
        var new_node = existing_node.addBefore(new_node_info);
        if (new_node) {
            this._refreshElements(existing_node.parent);
        }
        return new_node;
    };
    JqTreeWidget.prototype.addParentNode = function (new_node_info, existing_node) {
        var new_node = existing_node.addParent(new_node_info);
        if (new_node) {
            this._refreshElements(new_node.parent);
        }
        return new_node;
    };
    JqTreeWidget.prototype.removeNode = function (node) {
        if (node.parent && this.select_node_handler) {
            this.select_node_handler.removeFromSelection(node, true); // including children
            node.remove();
            this._refreshElements(node.parent);
        }
        return this.element;
    };
    JqTreeWidget.prototype.appendNode = function (new_node_info, parent_node_param) {
        var parent_node = parent_node_param || this.tree;
        var node = parent_node.append(new_node_info);
        this._refreshElements(parent_node);
        return node;
    };
    JqTreeWidget.prototype.prependNode = function (new_node_info, parent_node_param) {
        var parent_node = !parent_node_param ? this.tree : parent_node_param;
        var node = parent_node.prepend(new_node_info);
        this._refreshElements(parent_node);
        return node;
    };
    JqTreeWidget.prototype.updateNode = function (node, data) {
        var id_is_changed = data.id && data.id !== node.id;
        if (id_is_changed) {
            this.tree.removeNodeFromIndex(node);
        }
        node.setData(data);
        if (id_is_changed) {
            this.tree.addNodeToIndex(node);
        }
        if (typeof data === "object" && data.children) {
            node.removeChildren();
            if (data.children.length) {
                node.loadFromData(data.children);
            }
        }
        this.renderer.renderFromNode(node);
        this._selectCurrentNode();
        return this.element;
    };
    JqTreeWidget.prototype.moveNode = function (node, target_node, position) {
        var position_index = node_1.getPosition(position);
        this.tree.moveNode(node, target_node, position_index);
        this._refreshElements(null);
        return this.element;
    };
    JqTreeWidget.prototype.getStateFromStorage = function () {
        if (this.save_state_handler) {
            return this.save_state_handler.getStateFromStorage();
        }
    };
    JqTreeWidget.prototype.addToSelection = function (node) {
        if (node && this.select_node_handler) {
            this.select_node_handler.addToSelection(node);
            this._getNodeElementForNode(node).select();
            this._saveState();
        }
        return this.element;
    };
    JqTreeWidget.prototype.getSelectedNodes = function () {
        if (!this.select_node_handler) {
            return [];
        }
        else {
            return this.select_node_handler.getSelectedNodes();
        }
    };
    JqTreeWidget.prototype.isNodeSelected = function (node) {
        if (!this.select_node_handler) {
            return false;
        }
        else {
            return this.select_node_handler.isNodeSelected(node);
        }
    };
    JqTreeWidget.prototype.removeFromSelection = function (node) {
        if (this.select_node_handler) {
            this.select_node_handler.removeFromSelection(node);
            this._getNodeElementForNode(node).deselect();
            this._saveState();
        }
        return this.element;
    };
    JqTreeWidget.prototype.scrollToNode = function (node) {
        if (this.scroll_handler) {
            var node_offset = jQuery(node.element).offset();
            var node_top = node_offset ? node_offset.top : 0;
            var tree_offset = this.$el.offset();
            var tree_top = tree_offset ? tree_offset.top : 0;
            var top_1 = node_top - tree_top;
            this.scroll_handler.scrollToY(top_1);
        }
        return this.element;
    };
    JqTreeWidget.prototype.getState = function () {
        if (this.save_state_handler) {
            return this.save_state_handler.getState();
        }
    };
    JqTreeWidget.prototype.setState = function (state) {
        if (this.save_state_handler) {
            this.save_state_handler.setInitialState(state);
            this._refreshElements(null);
        }
        return this.element;
    };
    JqTreeWidget.prototype.setOption = function (option, value) {
        this.options[option] = value;
        return this.element;
    };
    JqTreeWidget.prototype.moveDown = function () {
        if (this.key_handler) {
            this.key_handler.moveDown();
        }
        return this.element;
    };
    JqTreeWidget.prototype.moveUp = function () {
        if (this.key_handler) {
            this.key_handler.moveUp();
        }
        return this.element;
    };
    JqTreeWidget.prototype.getVersion = function () {
        return version_1["default"];
    };
    JqTreeWidget.prototype.testGenerateHitAreas = function (moving_node) {
        if (!this.dnd_handler) {
            return [];
        }
        else {
            this.dnd_handler.current_item = this._getNodeElementForNode(moving_node);
            this.dnd_handler.generateHitAreas();
            return this.dnd_handler.hit_areas;
        }
    };
    JqTreeWidget.prototype._triggerEvent = function (event_name, values) {
        var event = jQuery.Event(event_name);
        jQuery.extend(event, values);
        this.element.trigger(event);
        return event;
    };
    JqTreeWidget.prototype._openNode = function (node, slide, on_finished) {
        var _this = this;
        if (slide === void 0) { slide = true; }
        var doOpenNode = function (_node, _slide, _on_finished) {
            var folder_element = new node_element_1.FolderElement(_node, _this);
            folder_element.open(_on_finished, _slide, _this.options.animationSpeed);
        };
        if (node.isFolder()) {
            if (node.load_on_demand) {
                this._loadFolderOnDemand(node, slide, on_finished);
            }
            else {
                var parent_1 = node.parent;
                while (parent_1) {
                    // nb: do not open root element
                    if (parent_1.parent) {
                        doOpenNode(parent_1, false, null);
                    }
                    parent_1 = parent_1.parent;
                }
                doOpenNode(node, slide, on_finished);
                this._saveState();
            }
        }
    };
    /*
    Redraw the tree or part of the tree.
     from_node: redraw this subtree
    */
    JqTreeWidget.prototype._refreshElements = function (from_node) {
        this.renderer.render(from_node);
        this._triggerEvent("tree.refresh");
    };
    JqTreeWidget.prototype._getNodeElementForNode = function (node) {
        if (node.isFolder()) {
            return new node_element_1.FolderElement(node, this);
        }
        else {
            return new node_element_1.NodeElement(node, this);
        }
    };
    JqTreeWidget.prototype._getNodeElement = function ($element) {
        var node = this._getNode($element);
        if (node) {
            return this._getNodeElementForNode(node);
        }
        else {
            return null;
        }
    };
    JqTreeWidget.prototype._containsElement = function (element) {
        var node = this._getNode(jQuery(element));
        return node != null && node.tree === this.tree;
    };
    JqTreeWidget.prototype._getScrollLeft = function () {
        return ((this.scroll_handler && this.scroll_handler.getScrollLeft()) || 0);
    };
    JqTreeWidget.prototype._init = function () {
        _super.prototype._init.call(this);
        this.element = this.$el;
        this.mouse_delay = 300;
        this.is_initialized = false;
        this.options.rtl = this._getRtlOption();
        if (this.options.closedIcon === null) {
            this.options.closedIcon = this._getDefaultClosedIcon();
        }
        this.renderer = new elements_renderer_1["default"](this);
        if (save_state_handler_1["default"] != null) {
            this.save_state_handler = new save_state_handler_1["default"](this);
        }
        else {
            this.options.saveState = false;
        }
        if (select_node_handler_1["default"] != null) {
            this.select_node_handler = new select_node_handler_1["default"](this);
        }
        if (drag_and_drop_handler_1.DragAndDropHandler != null) {
            this.dnd_handler = new drag_and_drop_handler_1.DragAndDropHandler(this);
        }
        else {
            this.options.dragAndDrop = false;
        }
        if (scroll_handler_1["default"] != null) {
            this.scroll_handler = new scroll_handler_1["default"](this);
        }
        if (key_handler_1["default"] != null && select_node_handler_1["default"] != null) {
            this.key_handler = new key_handler_1["default"](this);
        }
        this._initData();
        this.element.click(jQuery.proxy(this._click, this));
        this.element.dblclick(jQuery.proxy(this._dblclick, this));
        if (this.options.useContextMenu) {
            this.element.on("contextmenu", jQuery.proxy(this._contextmenu, this));
        }
    };
    JqTreeWidget.prototype._deinit = function () {
        this.element.empty();
        this.element.off();
        if (this.key_handler) {
            this.key_handler.deinit();
        }
        this.tree = new node_1.Node({}, true);
        _super.prototype._deinit.call(this);
    };
    JqTreeWidget.prototype._mouseCapture = function (position_info) {
        if (this.options.dragAndDrop && this.dnd_handler) {
            return this.dnd_handler.mouseCapture(position_info);
        }
        else {
            return false;
        }
    };
    JqTreeWidget.prototype._mouseStart = function (position_info) {
        if (this.options.dragAndDrop && this.dnd_handler) {
            return this.dnd_handler.mouseStart(position_info);
        }
        else {
            return false;
        }
    };
    JqTreeWidget.prototype._mouseDrag = function (position_info) {
        if (this.options.dragAndDrop && this.dnd_handler) {
            var result = this.dnd_handler.mouseDrag(position_info);
            if (this.scroll_handler) {
                this.scroll_handler.checkScrolling();
            }
            return result;
        }
        else {
            return false;
        }
    };
    JqTreeWidget.prototype._mouseStop = function (position_info) {
        if (this.options.dragAndDrop && this.dnd_handler) {
            return this.dnd_handler.mouseStop(position_info);
        }
        else {
            return false;
        }
    };
    JqTreeWidget.prototype._initData = function () {
        if (this.options.data) {
            this._loadData(this.options.data, null);
        }
        else {
            var data_url = this._getDataUrlInfo(null);
            if (data_url) {
                this._loadDataFromUrl(null, null, null);
            }
            else {
                this._loadData([], null);
            }
        }
    };
    JqTreeWidget.prototype._getDataUrlInfo = function (node) {
        var _this = this;
        var data_url = this.options.dataUrl || this.element.data("url");
        var getUrlFromString = function () {
            var url_info = { url: data_url };
            if (node && node.id) {
                // Load on demand of a subtree; add node parameter
                var data = { node: node.id };
                // tslint:disable-next-line: no-string-literal
                url_info["data"] = data;
            }
            else {
                // Add selected_node parameter
                var selected_node_id = _this._getNodeIdToBeSelected();
                if (selected_node_id) {
                    var data = { selected_node: selected_node_id };
                    // tslint:disable-next-line: no-string-literal
                    url_info["data"] = data;
                }
            }
            return url_info;
        };
        if (jQuery.isFunction(data_url)) {
            return data_url(node);
        }
        else if (jQuery.type(data_url) === "string") {
            return getUrlFromString();
        }
        else {
            return data_url;
        }
    };
    JqTreeWidget.prototype._getNodeIdToBeSelected = function () {
        if (this.options.saveState && this.save_state_handler) {
            return this.save_state_handler.getNodeIdToBeSelected();
        }
        else {
            return null;
        }
    };
    JqTreeWidget.prototype._initTree = function (data) {
        var _this = this;
        var doInit = function () {
            if (!_this.is_initialized) {
                _this.is_initialized = true;
                _this._triggerEvent("tree.init");
            }
        };
        this.tree = new this.options.nodeClass(null, true, this.options.nodeClass);
        if (this.select_node_handler) {
            this.select_node_handler.clear();
        }
        this.tree.loadFromData(data);
        var must_load_on_demand = this._setInitialState();
        this._refreshElements(null);
        if (!must_load_on_demand) {
            doInit();
        }
        else {
            // Load data on demand and then init the tree
            this._setInitialStateOnDemand(doInit);
        }
    };
    // Set initial state, either by restoring the state or auto-opening nodes
    // result: must load nodes on demand?
    JqTreeWidget.prototype._setInitialState = function () {
        var _this = this;
        var restoreState = function () {
            // result: is state restored, must load on demand?
            if (!(_this.options.saveState && _this.save_state_handler)) {
                return [false, false];
            }
            else {
                var state = _this.save_state_handler.getStateFromStorage();
                if (!state) {
                    return [false, false];
                }
                else {
                    var must_load_on_demand_1 = _this.save_state_handler.setInitialState(state);
                    // return true: the state is restored
                    return [true, must_load_on_demand_1];
                }
            }
        };
        var autoOpenNodes = function () {
            // result: must load on demand?
            if (_this.options.autoOpen === false) {
                return false;
            }
            var max_level = _this._getAutoOpenMaxLevel();
            var must_load_on_demand = false;
            _this.tree.iterate(function (node, level) {
                if (node.load_on_demand) {
                    must_load_on_demand = true;
                    return false;
                }
                else if (!node.hasChildren()) {
                    return false;
                }
                else {
                    node.is_open = true;
                    return level !== max_level;
                }
            });
            return must_load_on_demand;
        };
        // tslint:disable-next-line: prefer-const
        var _a = restoreState(), is_restored = _a[0], must_load_on_demand = _a[1];
        if (!is_restored) {
            must_load_on_demand = autoOpenNodes();
        }
        return must_load_on_demand;
    };
    // Set the initial state for nodes that are loaded on demand
    // Call cb_finished when done
    JqTreeWidget.prototype._setInitialStateOnDemand = function (cb_finished) {
        var _this = this;
        var restoreState = function () {
            if (!(_this.options.saveState && _this.save_state_handler)) {
                return false;
            }
            else {
                var state = _this.save_state_handler.getStateFromStorage();
                if (!state) {
                    return false;
                }
                else {
                    _this.save_state_handler.setInitialStateOnDemand(state, cb_finished);
                    return true;
                }
            }
        };
        var autoOpenNodes = function () {
            var max_level = _this._getAutoOpenMaxLevel();
            var loading_count = 0;
            var loadAndOpenNode = function (node) {
                loading_count += 1;
                _this._openNode(node, false, function () {
                    loading_count -= 1;
                    openNodes();
                });
            };
            var openNodes = function () {
                _this.tree.iterate(function (node, level) {
                    if (node.load_on_demand) {
                        if (!node.is_loading) {
                            loadAndOpenNode(node);
                        }
                        return false;
                    }
                    else {
                        _this._openNode(node, false, null);
                        return level !== max_level;
                    }
                });
                if (loading_count === 0) {
                    cb_finished();
                }
            };
            openNodes();
        };
        if (!restoreState()) {
            autoOpenNodes();
        }
    };
    JqTreeWidget.prototype._getAutoOpenMaxLevel = function () {
        if (this.options.autoOpen === true) {
            return -1;
        }
        else {
            return parseInt(this.options.autoOpen, 10);
        }
    };
    JqTreeWidget.prototype._click = function (e) {
        var click_target = this._getClickTarget(e.target);
        if (click_target) {
            if (click_target.type === "button") {
                this.toggle(click_target.node, this.options.slide);
                e.preventDefault();
                e.stopPropagation();
            }
            else if (click_target.type === "label") {
                var node = click_target.node;
                var event_1 = this._triggerEvent("tree.click", {
                    node: node,
                    click_event: e
                });
                if (!event_1.isDefaultPrevented()) {
                    this._selectNode(node, true);
                }
            }
        }
    };
    JqTreeWidget.prototype._dblclick = function (e) {
        var click_target = this._getClickTarget(e.target);
        if (click_target && click_target.type === "label") {
            this._triggerEvent("tree.dblclick", {
                node: click_target.node,
                click_event: e
            });
        }
    };
    JqTreeWidget.prototype._getClickTarget = function (element) {
        var $target = jQuery(element);
        var $button = $target.closest(".jqtree-toggler");
        if ($button.length) {
            var node = this._getNode($button);
            if (node) {
                return {
                    type: "button",
                    node: node
                };
            }
        }
        else {
            var $el = $target.closest(".jqtree-element");
            if ($el.length) {
                var node = this._getNode($el);
                if (node) {
                    return {
                        type: "label",
                        node: node
                    };
                }
            }
        }
        return null;
    };
    JqTreeWidget.prototype._getNode = function ($element) {
        var $li = $element.closest("li.jqtree_common");
        if ($li.length === 0) {
            return null;
        }
        else {
            return $li.data("node");
        }
    };
    JqTreeWidget.prototype._contextmenu = function (e) {
        var $div = jQuery(e.target).closest("ul.jqtree-tree .jqtree-element");
        if ($div.length) {
            var node = this._getNode($div);
            if (node) {
                e.preventDefault();
                e.stopPropagation();
                this._triggerEvent("tree.contextmenu", {
                    node: node,
                    click_event: e
                });
                return false;
            }
        }
        return null;
    };
    JqTreeWidget.prototype._saveState = function () {
        if (this.options.saveState && this.save_state_handler) {
            this.save_state_handler.saveState();
        }
    };
    JqTreeWidget.prototype._selectCurrentNode = function () {
        var node = this.getSelectedNode();
        if (node) {
            var node_element = this._getNodeElementForNode(node);
            if (node_element) {
                node_element.select();
            }
        }
    };
    JqTreeWidget.prototype._deselectCurrentNode = function () {
        var node = this.getSelectedNode();
        if (node) {
            this.removeFromSelection(node);
        }
    };
    JqTreeWidget.prototype._getDefaultClosedIcon = function () {
        if (this.options.rtl) {
            // triangle to the left
            return "&#x25c0;";
        }
        else {
            // triangle to the right
            return "&#x25ba;";
        }
    };
    JqTreeWidget.prototype._getRtlOption = function () {
        if (this.options.rtl != null) {
            return this.options.rtl;
        }
        else {
            var data_rtl = this.element.data("rtl");
            if (data_rtl != null && data_rtl !== false) {
                return true;
            }
            else {
                return false;
            }
        }
    };
    JqTreeWidget.prototype._notifyLoading = function (is_loading, node, $el) {
        if (this.options.onLoading) {
            this.options.onLoading(is_loading, node, $el);
        }
    };
    JqTreeWidget.prototype._selectNode = function (node, must_toggle) {
        var _this = this;
        if (must_toggle === void 0) { must_toggle = false; }
        if (!this.select_node_handler) {
            return;
        }
        var canSelect = function () {
            if (_this.options.onCanSelectNode) {
                return (_this.options.selectable &&
                    _this.options.onCanSelectNode(node));
            }
            else {
                return _this.options.selectable;
            }
        };
        var openParents = function () {
            var parent = node.parent;
            if (parent && parent.parent && !parent.is_open) {
                _this.openNode(parent, false);
            }
        };
        var saveState = function () {
            if (_this.options.saveState && _this.save_state_handler) {
                _this.save_state_handler.saveState();
            }
        };
        if (!node) {
            // Called with empty node -> deselect current node
            this._deselectCurrentNode();
            saveState();
            return;
        }
        if (!canSelect()) {
            return;
        }
        if (this.select_node_handler.isNodeSelected(node)) {
            if (must_toggle) {
                this._deselectCurrentNode();
                this._triggerEvent("tree.select", {
                    node: null,
                    previous_node: node
                });
            }
        }
        else {
            var deselected_node = this.getSelectedNode();
            this._deselectCurrentNode();
            this.addToSelection(node);
            this._triggerEvent("tree.select", {
                node: node,
                deselected_node: deselected_node
            });
            openParents();
        }
        saveState();
    };
    JqTreeWidget.prototype._loadData = function (data, parent_node) {
        if (!data) {
            return;
        }
        else {
            this._triggerEvent("tree.load_data", { tree_data: data });
            if (parent_node) {
                this._deselectNodes(parent_node);
                this._loadSubtree(data, parent_node);
            }
            else {
                this._initTree(data);
            }
            if (this.isDragging() && this.dnd_handler) {
                this.dnd_handler.refresh();
            }
        }
    };
    JqTreeWidget.prototype._deselectNodes = function (parent_node) {
        if (this.select_node_handler) {
            var selected_nodes_under_parent = this.select_node_handler.getSelectedNodesUnder(parent_node);
            for (var _i = 0, selected_nodes_under_parent_1 = selected_nodes_under_parent; _i < selected_nodes_under_parent_1.length; _i++) {
                var n = selected_nodes_under_parent_1[_i];
                this.select_node_handler.removeFromSelection(n);
            }
        }
    };
    JqTreeWidget.prototype._loadSubtree = function (data, parent_node) {
        parent_node.loadFromData(data);
        parent_node.load_on_demand = false;
        parent_node.is_loading = false;
        this._refreshElements(parent_node);
    };
    JqTreeWidget.prototype._loadDataFromUrl = function (url_info_param, parent_node, on_finished) {
        var _this = this;
        var $el = null;
        var url_info = url_info_param;
        var addLoadingClass = function () {
            $el = parent_node ? jQuery(parent_node.element) : _this.element;
            $el.addClass("jqtree-loading");
            _this._notifyLoading(true, parent_node, $el);
        };
        var removeLoadingClass = function () {
            if ($el) {
                $el.removeClass("jqtree-loading");
                _this._notifyLoading(false, parent_node, $el);
            }
        };
        var parseUrlInfo = function () {
            if (jQuery.type(url_info) === "string") {
                return { url: url_info };
            }
            if (!url_info.method) {
                url_info.method = "get";
            }
            return url_info;
        };
        var handeLoadData = function (data) {
            removeLoadingClass();
            _this._loadData(data, parent_node);
            if (on_finished && jQuery.isFunction(on_finished)) {
                on_finished();
            }
        };
        var getDataFromResponse = function (response) {
            return jQuery.isArray(response) || typeof response === "object"
                ? response
                : response != null ? jQuery.parseJSON(response) : [];
        };
        var filterData = function (data) {
            return _this.options.dataFilter ? _this.options.dataFilter(data) : data;
        };
        var handleSuccess = function (response) {
            var data = filterData(getDataFromResponse(response));
            handeLoadData(data);
        };
        var handleError = function (response) {
            removeLoadingClass();
            if (_this.options.onLoadFailed) {
                _this.options.onLoadFailed(response);
            }
        };
        var loadDataFromUrlInfo = function () {
            var _url_info = parseUrlInfo();
            jQuery.ajax(jQuery.extend({}, _url_info, {
                method: url_info.method != null
                    ? url_info.method.toUpperCase()
                    : "GET",
                cache: false,
                dataType: "json",
                success: handleSuccess,
                error: handleError
            }));
        };
        if (!url_info_param) {
            // Generate url for node
            url_info = this._getDataUrlInfo(parent_node);
        }
        addLoadingClass();
        if (!url_info) {
            removeLoadingClass();
            return;
        }
        else if (jQuery.isArray(url_info)) {
            handeLoadData(url_info);
            return;
        }
        else {
            loadDataFromUrlInfo();
            return;
        }
    };
    JqTreeWidget.prototype._loadFolderOnDemand = function (node, slide, on_finished) {
        var _this = this;
        if (slide === void 0) { slide = true; }
        node.is_loading = true;
        this._loadDataFromUrl(null, node, function () {
            _this._openNode(node, slide, on_finished);
        });
    };
    JqTreeWidget.defaults = {
        animationSpeed: "fast",
        autoOpen: false,
        saveState: false,
        dragAndDrop: false,
        selectable: true,
        useContextMenu: true,
        onCanSelectNode: null,
        onSetStateFromStorage: null,
        onGetStateFromStorage: null,
        onCreateLi: null,
        onIsMoveHandle: null,
        // Can this node be moved?
        onCanMove: null,
        // Can this node be moved to this position? function(moved_node, target_node, position)
        onCanMoveTo: null,
        onLoadFailed: null,
        autoEscape: true,
        dataUrl: null,
        // The symbol to use for a closed node - ► BLACK RIGHT-POINTING POINTER
        // http://www.fileformat.info/info/unicode/char/25ba/index.htm
        closedIcon: null,
        // The symbol to use for an open node - ▼ BLACK DOWN-POINTING TRIANGLE
        // http://www.fileformat.info/info/unicode/char/25bc/index.htm
        openedIcon: "&#x25bc;",
        slide: true,
        nodeClass: node_1.Node,
        dataFilter: null,
        keyboardSupport: true,
        openFolderDelay: 500,
        rtl: false,
        onDragMove: null,
        onDragStop: null,
        buttonLeft: true,
        onLoading: null,
        tabIndex: 0
    };
    return JqTreeWidget;
}(mouse_widget_1["default"]));
simple_widget_1["default"].register(JqTreeWidget, "tree");


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var version = "1.4.4";
exports["default"] = version;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var jQuery = __webpack_require__(2);
var node_1 = __webpack_require__(0);
var util_1 = __webpack_require__(1);
var DragAndDropHandler = /** @class */ (function () {
    function DragAndDropHandler(tree_widget) {
        this.tree_widget = tree_widget;
        this.hovered_area = null;
        this.hit_areas = [];
        this.is_dragging = false;
        this.current_item = null;
        this.position_info = null;
    }
    DragAndDropHandler.prototype.mouseCapture = function (position_info) {
        var $element = jQuery(position_info.target);
        if (!this.mustCaptureElement($element)) {
            return null;
        }
        if (this.tree_widget.options.onIsMoveHandle &&
            !this.tree_widget.options.onIsMoveHandle($element)) {
            return null;
        }
        var node_element = this.tree_widget._getNodeElement($element);
        if (node_element && this.tree_widget.options.onCanMove) {
            if (!this.tree_widget.options.onCanMove(node_element.node)) {
                node_element = null;
            }
        }
        this.current_item = node_element;
        return this.current_item != null;
    };
    DragAndDropHandler.prototype.generateHitAreas = function () {
        if (!this.current_item) {
            this.hit_areas = [];
        }
        else {
            var hit_areas_generator = new HitAreasGenerator(this.tree_widget.tree, this.current_item.node, this.getTreeDimensions().bottom);
            this.hit_areas = hit_areas_generator.generate();
        }
    };
    DragAndDropHandler.prototype.mouseStart = function (position_info) {
        if (!this.current_item) {
            return false;
        }
        else {
            this.refresh();
            var offset = jQuery(position_info.target).offset();
            var left = offset ? offset.left : 0;
            var top_1 = offset ? offset.top : 0;
            var node = this.current_item.node;
            var node_name = this.tree_widget.options.autoEscape
                ? util_1.html_escape(node.name)
                : node.name;
            this.drag_element = new DragElement(node_name, position_info.page_x - left, position_info.page_y - top_1, this.tree_widget.element);
            this.is_dragging = true;
            this.position_info = position_info;
            this.current_item.$element.addClass("jqtree-moving");
            return true;
        }
    };
    DragAndDropHandler.prototype.mouseDrag = function (position_info) {
        if (!this.current_item || !this.drag_element) {
            return false;
        }
        else {
            this.drag_element.move(position_info.page_x, position_info.page_y);
            this.position_info = position_info;
            var area = this.findHoveredArea(position_info.page_x, position_info.page_y);
            var can_move_to = this.canMoveToArea(area);
            if (can_move_to && area) {
                if (!area.node.isFolder()) {
                    this.stopOpenFolderTimer();
                }
                if (this.hovered_area !== area) {
                    this.hovered_area = area;
                    // If this is a closed folder, start timer to open it
                    if (this.mustOpenFolderTimer(area)) {
                        this.startOpenFolderTimer(area.node);
                    }
                    else {
                        this.stopOpenFolderTimer();
                    }
                    this.updateDropHint();
                }
            }
            else {
                this.removeHover();
                this.removeDropHint();
                this.stopOpenFolderTimer();
            }
            if (!area) {
                if (this.tree_widget.options.onDragMove) {
                    this.tree_widget.options.onDragMove(this.current_item.node, position_info.original_event);
                }
            }
            return true;
        }
    };
    DragAndDropHandler.prototype.mouseStop = function (position_info) {
        this.moveItem(position_info);
        this.clear();
        this.removeHover();
        this.removeDropHint();
        this.removeHitAreas();
        var current_item = this.current_item;
        if (this.current_item) {
            this.current_item.$element.removeClass("jqtree-moving");
            this.current_item = null;
        }
        this.is_dragging = false;
        this.position_info = null;
        if (!this.hovered_area && current_item) {
            if (this.tree_widget.options.onDragStop) {
                this.tree_widget.options.onDragStop(current_item.node, position_info.original_event);
            }
        }
        return false;
    };
    DragAndDropHandler.prototype.refresh = function () {
        this.removeHitAreas();
        if (this.current_item) {
            this.generateHitAreas();
            this.current_item = this.tree_widget._getNodeElementForNode(this.current_item.node);
            if (this.is_dragging) {
                this.current_item.$element.addClass("jqtree-moving");
            }
        }
    };
    DragAndDropHandler.prototype.mustCaptureElement = function ($element) {
        return !$element.is("input,select,textarea");
    };
    DragAndDropHandler.prototype.canMoveToArea = function (area) {
        if (!area || !this.current_item) {
            return false;
        }
        else if (this.tree_widget.options.onCanMoveTo) {
            var position_name = node_1.getPositionName(area.position);
            return this.tree_widget.options.onCanMoveTo(this.current_item.node, area.node, position_name);
        }
        else {
            return true;
        }
    };
    DragAndDropHandler.prototype.removeHitAreas = function () {
        this.hit_areas = [];
    };
    DragAndDropHandler.prototype.clear = function () {
        if (this.drag_element) {
            this.drag_element.remove();
            this.drag_element = null;
        }
    };
    DragAndDropHandler.prototype.removeDropHint = function () {
        if (this.previous_ghost) {
            this.previous_ghost.remove();
        }
    };
    DragAndDropHandler.prototype.removeHover = function () {
        this.hovered_area = null;
    };
    DragAndDropHandler.prototype.findHoveredArea = function (x, y) {
        var dimensions = this.getTreeDimensions();
        if (x < dimensions.left ||
            y < dimensions.top ||
            x > dimensions.right ||
            y > dimensions.bottom) {
            return null;
        }
        var low = 0;
        var high = this.hit_areas.length;
        while (low < high) {
            // tslint:disable-next-line: no-bitwise
            var mid = (low + high) >> 1;
            var area = this.hit_areas[mid];
            if (y < area.top) {
                high = mid;
            }
            else if (y > area.bottom) {
                low = mid + 1;
            }
            else {
                return area;
            }
        }
        return null;
    };
    DragAndDropHandler.prototype.mustOpenFolderTimer = function (area) {
        var node = area.node;
        return (node.isFolder() &&
            !node.is_open &&
            area.position === node_1.Position.Inside);
    };
    DragAndDropHandler.prototype.updateDropHint = function () {
        if (!this.hovered_area) {
            return;
        }
        // remove previous drop hint
        this.removeDropHint();
        // add new drop hint
        var node_element = this.tree_widget._getNodeElementForNode(this.hovered_area.node);
        this.previous_ghost = node_element.addDropHint(this.hovered_area.position);
    };
    DragAndDropHandler.prototype.startOpenFolderTimer = function (folder) {
        var _this = this;
        var openFolder = function () {
            _this.tree_widget._openNode(folder, _this.tree_widget.options.slide, function () {
                _this.refresh();
                _this.updateDropHint();
            });
        };
        this.stopOpenFolderTimer();
        this.open_folder_timer = setTimeout(openFolder, this.tree_widget.options.openFolderDelay);
    };
    DragAndDropHandler.prototype.stopOpenFolderTimer = function () {
        if (this.open_folder_timer) {
            clearTimeout(this.open_folder_timer);
            this.open_folder_timer = null;
        }
    };
    DragAndDropHandler.prototype.moveItem = function (position_info) {
        var _this = this;
        if (this.current_item &&
            this.hovered_area &&
            this.hovered_area.position !== node_1.Position.None &&
            this.canMoveToArea(this.hovered_area)) {
            var moved_node_1 = this.current_item.node;
            var target_node_1 = this.hovered_area.node;
            var position_1 = this.hovered_area.position;
            var previous_parent = moved_node_1.parent;
            if (position_1 === node_1.Position.Inside) {
                this.hovered_area.node.is_open = true;
            }
            var doMove = function () {
                _this.tree_widget.tree.moveNode(moved_node_1, target_node_1, position_1);
                _this.tree_widget.element.empty();
                _this.tree_widget._refreshElements(null);
            };
            var event_1 = this.tree_widget._triggerEvent("tree.move", {
                move_info: {
                    moved_node: moved_node_1,
                    target_node: target_node_1,
                    position: node_1.getPositionName(position_1),
                    previous_parent: previous_parent,
                    do_move: doMove,
                    original_event: position_info.original_event
                }
            });
            if (!event_1.isDefaultPrevented()) {
                doMove();
            }
        }
    };
    DragAndDropHandler.prototype.getTreeDimensions = function () {
        // Return the dimensions of the tree. Add a margin to the bottom to allow
        // to drag-and-drop after the last element.
        var offset = this.tree_widget.element.offset();
        if (!offset) {
            return { left: 0, top: 0, right: 0, bottom: 0 };
        }
        else {
            var el = this.tree_widget.element;
            var width = el.width() || 0;
            var height = el.height() || 0;
            var left = offset.left + this.tree_widget._getScrollLeft();
            return {
                left: left,
                top: offset.top,
                right: left + width,
                bottom: offset.top + height + 16
            };
        }
    };
    return DragAndDropHandler;
}());
exports.DragAndDropHandler = DragAndDropHandler;
var VisibleNodeIterator = /** @class */ (function () {
    function VisibleNodeIterator(tree) {
        this.tree = tree;
    }
    VisibleNodeIterator.prototype.iterate = function () {
        var _this = this;
        var is_first_node = true;
        var _iterateNode = function (node, next_node) {
            var must_iterate_inside = (node.is_open || !node.element) && node.hasChildren();
            var $element = null;
            if (node.element) {
                $element = jQuery(node.element);
                if (!$element.is(":visible")) {
                    return;
                }
                if (is_first_node) {
                    _this.handleFirstNode(node);
                    is_first_node = false;
                }
                if (!node.hasChildren()) {
                    _this.handleNode(node, next_node, $element);
                }
                else if (node.is_open) {
                    if (!_this.handleOpenFolder(node, $element)) {
                        must_iterate_inside = false;
                    }
                }
                else {
                    _this.handleClosedFolder(node, next_node, $element);
                }
            }
            if (must_iterate_inside) {
                var children_length_1 = node.children.length;
                node.children.forEach(function (_, i) {
                    if (i === children_length_1 - 1) {
                        _iterateNode(node.children[i], null);
                    }
                    else {
                        _iterateNode(node.children[i], node.children[i + 1]);
                    }
                });
                if (node.is_open && $element) {
                    _this.handleAfterOpenFolder(node, next_node);
                }
            }
        };
        _iterateNode(this.tree, null);
    };
    return VisibleNodeIterator;
}());
var HitAreasGenerator = /** @class */ (function (_super) {
    __extends(HitAreasGenerator, _super);
    function HitAreasGenerator(tree, current_node, tree_bottom) {
        var _this = _super.call(this, tree) || this;
        _this.current_node = current_node;
        _this.tree_bottom = tree_bottom;
        return _this;
    }
    HitAreasGenerator.prototype.generate = function () {
        this.positions = [];
        this.last_top = 0;
        this.iterate();
        return this.generateHitAreas(this.positions);
    };
    HitAreasGenerator.prototype.generateHitAreas = function (positions) {
        var previous_top = -1;
        var group = [];
        var hit_areas = [];
        for (var _i = 0, positions_1 = positions; _i < positions_1.length; _i++) {
            var position = positions_1[_i];
            if (position.top !== previous_top && group.length) {
                if (group.length) {
                    this.generateHitAreasForGroup(hit_areas, group, previous_top, position.top);
                }
                previous_top = position.top;
                group = [];
            }
            group.push(position);
        }
        this.generateHitAreasForGroup(hit_areas, group, previous_top, this.tree_bottom);
        return hit_areas;
    };
    HitAreasGenerator.prototype.handleOpenFolder = function (node, $element) {
        if (node === this.current_node) {
            // Cannot move inside current item
            // Stop iterating
            return false;
        }
        // Cannot move before current item
        if (node.children[0] !== this.current_node) {
            this.addPosition(node, node_1.Position.Inside, this.getTop($element));
        }
        // Continue iterating
        return true;
    };
    HitAreasGenerator.prototype.handleClosedFolder = function (node, next_node, $element) {
        var top = this.getTop($element);
        if (node === this.current_node) {
            // Cannot move after current item
            this.addPosition(node, node_1.Position.None, top);
        }
        else {
            this.addPosition(node, node_1.Position.Inside, top);
            // Cannot move before current item
            if (next_node !== this.current_node) {
                this.addPosition(node, node_1.Position.After, top);
            }
        }
    };
    HitAreasGenerator.prototype.handleFirstNode = function (node) {
        if (node !== this.current_node) {
            this.addPosition(node, node_1.Position.Before, this.getTop(jQuery(node.element)));
        }
    };
    HitAreasGenerator.prototype.handleAfterOpenFolder = function (node, next_node) {
        if (node === this.current_node || next_node === this.current_node) {
            // Cannot move before or after current item
            this.addPosition(node, node_1.Position.None, this.last_top);
        }
        else {
            this.addPosition(node, node_1.Position.After, this.last_top);
        }
    };
    HitAreasGenerator.prototype.handleNode = function (node, next_node, $element) {
        var top = this.getTop($element);
        if (node === this.current_node) {
            // Cannot move inside current item
            this.addPosition(node, node_1.Position.None, top);
        }
        else {
            this.addPosition(node, node_1.Position.Inside, top);
        }
        if (next_node === this.current_node || node === this.current_node) {
            // Cannot move before or after current item
            this.addPosition(node, node_1.Position.None, top);
        }
        else {
            this.addPosition(node, node_1.Position.After, top);
        }
    };
    HitAreasGenerator.prototype.getTop = function ($element) {
        var offset = $element.offset();
        return offset ? offset.top : 0;
    };
    HitAreasGenerator.prototype.addPosition = function (node, position, top) {
        var area = {
            top: top,
            bottom: 0,
            node: node,
            position: position
        };
        this.positions.push(area);
        this.last_top = top;
    };
    HitAreasGenerator.prototype.generateHitAreasForGroup = function (hit_areas, positions_in_group, top, bottom) {
        // limit positions in group
        var position_count = Math.min(positions_in_group.length, 4);
        var area_height = Math.round((bottom - top) / position_count);
        var area_top = top;
        var i = 0;
        while (i < position_count) {
            var position = positions_in_group[i];
            hit_areas.push({
                top: area_top,
                bottom: area_top + area_height,
                node: position.node,
                position: position.position
            });
            area_top += area_height;
            i += 1;
        }
    };
    return HitAreasGenerator;
}(VisibleNodeIterator));
exports.HitAreasGenerator = HitAreasGenerator;
var DragElement = /** @class */ (function () {
    function DragElement(node_name, offset_x, offset_y, $tree) {
        this.offset_x = offset_x;
        this.offset_y = offset_y;
        this.$element = jQuery("<span class=\"jqtree-title jqtree-dragging\">" + node_name + "</span>");
        this.$element.css("position", "absolute");
        $tree.append(this.$element);
    }
    DragElement.prototype.move = function (page_x, page_y) {
        this.$element.offset({
            left: page_x - this.offset_x,
            top: page_y - this.offset_y
        });
    };
    DragElement.prototype.remove = function () {
        this.$element.remove();
    };
    return DragElement;
}());


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var util_1 = __webpack_require__(1);
var ElementsRenderer = /** @class */ (function () {
    function ElementsRenderer(tree_widget) {
        this.tree_widget = tree_widget;
        this.opened_icon_element = this.createButtonElement(tree_widget.options.openedIcon);
        this.closed_icon_element = this.createButtonElement(tree_widget.options.closedIcon);
    }
    ElementsRenderer.prototype.render = function (from_node) {
        if (from_node && from_node.parent) {
            this.renderFromNode(from_node);
        }
        else {
            this.renderFromRoot();
        }
    };
    ElementsRenderer.prototype.renderFromRoot = function () {
        var $element = this.tree_widget.element;
        $element.empty();
        this.createDomElements($element[0], this.tree_widget.tree.children, true, 1);
    };
    ElementsRenderer.prototype.renderFromNode = function (node) {
        // remember current li
        var $previous_li = jQuery(node.element);
        // create element
        var li = this.createLi(node, node.getLevel());
        this.attachNodeData(node, li);
        // add element to dom
        $previous_li.after(li);
        // remove previous li
        $previous_li.remove();
        // create children
        if (node.children) {
            this.createDomElements(li, node.children, false, node.getLevel() + 1);
        }
    };
    ElementsRenderer.prototype.createDomElements = function (element, children, is_root_node, level) {
        var ul = this.createUl(is_root_node);
        element.appendChild(ul);
        for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
            var child = children_1[_i];
            var li = this.createLi(child, level);
            ul.appendChild(li);
            this.attachNodeData(child, li);
            if (child.hasChildren()) {
                this.createDomElements(li, child.children, false, level + 1);
            }
        }
    };
    ElementsRenderer.prototype.attachNodeData = function (node, li) {
        node.element = li;
        jQuery(li).data("node", node);
    };
    ElementsRenderer.prototype.createUl = function (is_root_node) {
        var class_string;
        var role;
        if (!is_root_node) {
            class_string = "";
            role = "group";
        }
        else {
            class_string = "jqtree-tree";
            role = "tree";
            if (this.tree_widget.options.rtl) {
                class_string += " jqtree-rtl";
            }
        }
        var ul = document.createElement("ul");
        ul.className = "jqtree_common " + class_string;
        ul.setAttribute("role", role);
        return ul;
    };
    ElementsRenderer.prototype.createLi = function (node, level) {
        var is_selected = Boolean(this.tree_widget.select_node_handler &&
            this.tree_widget.select_node_handler.isNodeSelected(node));
        var li = node.isFolder()
            ? this.createFolderLi(node, level, is_selected)
            : this.createNodeLi(node, level, is_selected);
        if (this.tree_widget.options.onCreateLi) {
            this.tree_widget.options.onCreateLi(node, jQuery(li), is_selected);
        }
        return li;
    };
    ElementsRenderer.prototype.createFolderLi = function (node, level, is_selected) {
        var button_classes = this.getButtonClasses(node);
        var folder_classes = this.getFolderClasses(node, is_selected);
        var icon_element = node.is_open
            ? this.opened_icon_element
            : this.closed_icon_element;
        // li
        var li = document.createElement("li");
        li.className = "jqtree_common " + folder_classes;
        li.setAttribute("role", "presentation");
        // div
        var div = document.createElement("div");
        div.className = "jqtree-element jqtree_common";
        div.setAttribute("role", "presentation");
        li.appendChild(div);
        // button link
        var button_link = document.createElement("a");
        button_link.className = button_classes;
        button_link.appendChild(icon_element.cloneNode(true));
        button_link.setAttribute("role", "presentation");
        button_link.setAttribute("aria-hidden", "true");
        if (this.tree_widget.options.buttonLeft) {
            div.appendChild(button_link);
        }
        // title span
        div.appendChild(this.createTitleSpan(node.name, level, is_selected, node.is_open, true));
        if (!this.tree_widget.options.buttonLeft) {
            div.appendChild(button_link);
        }
        return li;
    };
    ElementsRenderer.prototype.createNodeLi = function (node, level, is_selected) {
        var li_classes = ["jqtree_common"];
        if (is_selected) {
            li_classes.push("jqtree-selected");
        }
        var class_string = li_classes.join(" ");
        // li
        var li = document.createElement("li");
        li.className = class_string;
        li.setAttribute("role", "presentation");
        // div
        var div = document.createElement("div");
        div.className = "jqtree-element jqtree_common";
        div.setAttribute("role", "presentation");
        li.appendChild(div);
        // title span
        div.appendChild(this.createTitleSpan(node.name, level, is_selected, node.is_open, false));
        return li;
    };
    ElementsRenderer.prototype.createTitleSpan = function (node_name, level, is_selected, is_open, is_folder) {
        var title_span = document.createElement("span");
        var classes = "jqtree-title jqtree_common";
        if (is_folder) {
            classes += " jqtree-title-folder";
        }
        title_span.className = classes;
        title_span.setAttribute("role", "treeitem");
        title_span.setAttribute("aria-level", "" + level);
        title_span.setAttribute("aria-selected", util_1.getBoolString(is_selected));
        title_span.setAttribute("aria-expanded", util_1.getBoolString(is_open));
        if (is_selected) {
            title_span.setAttribute("tabindex", this.tree_widget.options.tabIndex);
        }
        title_span.innerHTML = this.escapeIfNecessary(node_name);
        return title_span;
    };
    ElementsRenderer.prototype.getButtonClasses = function (node) {
        var classes = ["jqtree-toggler", "jqtree_common"];
        if (!node.is_open) {
            classes.push("jqtree-closed");
        }
        if (this.tree_widget.options.buttonLeft) {
            classes.push("jqtree-toggler-left");
        }
        else {
            classes.push("jqtree-toggler-right");
        }
        return classes.join(" ");
    };
    ElementsRenderer.prototype.getFolderClasses = function (node, is_selected) {
        var classes = ["jqtree-folder"];
        if (!node.is_open) {
            classes.push("jqtree-closed");
        }
        if (is_selected) {
            classes.push("jqtree-selected");
        }
        if (node.is_loading) {
            classes.push("jqtree-loading");
        }
        return classes.join(" ");
    };
    ElementsRenderer.prototype.escapeIfNecessary = function (value) {
        if (this.tree_widget.options.autoEscape) {
            return util_1.html_escape(value);
        }
        else {
            return value;
        }
    };
    ElementsRenderer.prototype.createButtonElement = function (value) {
        if (typeof value === "string") {
            // convert value to html
            var div = document.createElement("div");
            div.innerHTML = value;
            return document.createTextNode(div.innerHTML);
        }
        else {
            return jQuery(value)[0];
        }
    };
    return ElementsRenderer;
}());
exports["default"] = ElementsRenderer;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var KeyHandler = /** @class */ (function () {
    function KeyHandler(tree_widget) {
        this.tree_widget = tree_widget;
        if (tree_widget.options.keyboardSupport) {
            jQuery(document).on("keydown.jqtree", jQuery.proxy(this.handleKeyDown, this));
        }
    }
    KeyHandler.prototype.deinit = function () {
        jQuery(document).off("keydown.jqtree");
    };
    KeyHandler.prototype.moveDown = function () {
        var node = this.tree_widget.getSelectedNode();
        if (node) {
            return this.selectNode(node.getNextNode());
        }
        else {
            return false;
        }
    };
    KeyHandler.prototype.moveUp = function () {
        var node = this.tree_widget.getSelectedNode();
        if (node) {
            return this.selectNode(node.getPreviousNode());
        }
        else {
            return false;
        }
    };
    KeyHandler.prototype.moveRight = function () {
        var node = this.tree_widget.getSelectedNode();
        if (!node) {
            return true;
        }
        else if (!node.isFolder()) {
            return true;
        }
        else {
            // folder node
            if (node.is_open) {
                // Right moves to the first child of an open node
                return this.selectNode(node.getNextNode());
            }
            else {
                // Right expands a closed node
                this.tree_widget.openNode(node);
                return false;
            }
        }
    };
    KeyHandler.prototype.moveLeft = function () {
        var node = this.tree_widget.getSelectedNode();
        if (!node) {
            return true;
        }
        else if (node.isFolder() && node.is_open) {
            // Left on an open node closes the node
            this.tree_widget.closeNode(node);
            return false;
        }
        else {
            // Left on a closed or end node moves focus to the node's parent
            return this.selectNode(node.getParent());
        }
    };
    KeyHandler.prototype.handleKeyDown = function (e) {
        if (!this.canHandleKeyboard()) {
            return true;
        }
        else {
            var key = e.which;
            switch (key) {
                case KeyHandler.DOWN:
                    return this.moveDown();
                case KeyHandler.UP:
                    return this.moveUp();
                case KeyHandler.RIGHT:
                    return this.moveRight();
                case KeyHandler.LEFT:
                    return this.moveLeft();
                default:
                    return true;
            }
        }
    };
    KeyHandler.prototype.selectNode = function (node) {
        if (!node) {
            return true;
        }
        else {
            this.tree_widget.selectNode(node);
            if (this.tree_widget.scroll_handler &&
                !this.tree_widget.scroll_handler.isScrolledIntoView(jQuery(node.element).find(".jqtree-element"))) {
                this.tree_widget.scrollToNode(node);
            }
            return false;
        }
    };
    KeyHandler.prototype.canHandleKeyboard = function () {
        return (this.tree_widget.options.keyboardSupport &&
            this.isFocusOnTree() &&
            this.tree_widget.getSelectedNode() != null);
    };
    KeyHandler.prototype.isFocusOnTree = function () {
        var active_element = document.activeElement;
        return (active_element &&
            active_element.tagName === "SPAN" &&
            this.tree_widget._containsElement(active_element));
    };
    KeyHandler.LEFT = 37;
    KeyHandler.UP = 38;
    KeyHandler.RIGHT = 39;
    KeyHandler.DOWN = 40;
    return KeyHandler;
}());
exports["default"] = KeyHandler;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
/*
This widget does the same a the mouse widget in jqueryui.
*/
var simple_widget_1 = __webpack_require__(3);
var MouseWidget = /** @class */ (function (_super) {
    __extends(MouseWidget, _super);
    function MouseWidget() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MouseWidget.prototype.setMouseDelay = function (mouse_delay) {
        this.mouse_delay = mouse_delay;
    };
    MouseWidget.prototype._init = function () {
        this.$el.on("mousedown.mousewidget", jQuery.proxy(this._mouseDown, this));
        this.$el.on("touchstart.mousewidget", jQuery.proxy(this._touchStart, this));
        this.is_mouse_started = false;
        this.mouse_delay = 0;
        this._mouse_delay_timer = null;
        this._is_mouse_delay_met = true;
        this.mouse_down_info = null;
    };
    MouseWidget.prototype._deinit = function () {
        this.$el.off("mousedown.mousewidget");
        this.$el.off("touchstart.mousewidget");
        var $document = jQuery(document);
        $document.off("mousemove.mousewidget");
        $document.off("mouseup.mousewidget");
    };
    MouseWidget.prototype._mouseDown = function (e) {
        // Is left mouse button?
        if (e.which !== 1) {
            return;
        }
        var result = this._handleMouseDown(this._getPositionInfo(e));
        if (result) {
            e.preventDefault();
        }
        return result;
    };
    MouseWidget.prototype._handleMouseDown = function (position_info) {
        // We may have missed mouseup (out of window)
        if (this.is_mouse_started) {
            this._handleMouseUp(position_info);
        }
        this.mouse_down_info = position_info;
        if (!this._mouseCapture(position_info)) {
            return;
        }
        this._handleStartMouse();
        return true;
    };
    MouseWidget.prototype._handleStartMouse = function () {
        var $document = jQuery(document);
        $document.on("mousemove.mousewidget", jQuery.proxy(this._mouseMove, this));
        $document.on("touchmove.mousewidget", jQuery.proxy(this._touchMove, this));
        $document.on("mouseup.mousewidget", jQuery.proxy(this._mouseUp, this));
        $document.on("touchend.mousewidget", jQuery.proxy(this._touchEnd, this));
        if (this.mouse_delay) {
            this._startMouseDelayTimer();
        }
    };
    MouseWidget.prototype._startMouseDelayTimer = function () {
        var _this = this;
        if (this._mouse_delay_timer) {
            clearTimeout(this._mouse_delay_timer);
        }
        this._mouse_delay_timer = setTimeout(function () {
            _this._is_mouse_delay_met = true;
        }, this.mouse_delay);
        this._is_mouse_delay_met = false;
    };
    MouseWidget.prototype._mouseMove = function (e) {
        return this._handleMouseMove(e, this._getPositionInfo(e));
    };
    MouseWidget.prototype._handleMouseMove = function (e, position_info) {
        if (this.is_mouse_started) {
            this._mouseDrag(position_info);
            return e.preventDefault();
        }
        if (this.mouse_delay && !this._is_mouse_delay_met) {
            return true;
        }
        if (this.mouse_down_info) {
            this.is_mouse_started =
                this._mouseStart(this.mouse_down_info) !== false;
        }
        if (this.is_mouse_started) {
            this._mouseDrag(position_info);
        }
        else {
            this._handleMouseUp(position_info);
        }
        return !this.is_mouse_started;
    };
    MouseWidget.prototype._getPositionInfo = function (e) {
        return {
            page_x: e.pageX,
            page_y: e.pageY,
            target: e.target,
            original_event: e
        };
    };
    MouseWidget.prototype._mouseUp = function (e) {
        return this._handleMouseUp(this._getPositionInfo(e));
    };
    MouseWidget.prototype._handleMouseUp = function (position_info) {
        var $document = jQuery(document);
        $document.off("mousemove.mousewidget");
        $document.off("touchmove.mousewidget");
        $document.off("mouseup.mousewidget");
        $document.off("touchend.mousewidget");
        if (this.is_mouse_started) {
            this.is_mouse_started = false;
            this._mouseStop(position_info);
        }
    };
    MouseWidget.prototype._touchStart = function (e) {
        var touch_event = e.originalEvent;
        if (touch_event.touches.length > 1) {
            return;
        }
        var touch = touch_event.changedTouches[0];
        return this._handleMouseDown(this._getPositionInfo(touch));
    };
    MouseWidget.prototype._touchMove = function (e) {
        var touch_event = e.originalEvent;
        if (touch_event.touches.length > 1) {
            return;
        }
        var touch = touch_event.changedTouches[0];
        return this._handleMouseMove(e, this._getPositionInfo(touch));
    };
    MouseWidget.prototype._touchEnd = function (e) {
        var touch_event = e.originalEvent;
        if (touch_event.touches.length > 1) {
            return;
        }
        var touch = touch_event.changedTouches[0];
        return this._handleMouseUp(this._getPositionInfo(touch));
    };
    return MouseWidget;
}(simple_widget_1["default"]));
exports["default"] = MouseWidget;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var util_1 = __webpack_require__(1);
var SaveStateHandler = /** @class */ (function () {
    function SaveStateHandler(tree_widget) {
        this.tree_widget = tree_widget;
    }
    SaveStateHandler.prototype.saveState = function () {
        var state = JSON.stringify(this.getState());
        if (this.tree_widget.options.onSetStateFromStorage) {
            this.tree_widget.options.onSetStateFromStorage(state);
        }
        else if (this.supportsLocalStorage()) {
            localStorage.setItem(this.getKeyName(), state);
        }
    };
    SaveStateHandler.prototype.getStateFromStorage = function () {
        var json_data = this._loadFromStorage();
        if (json_data) {
            return this._parseState(json_data);
        }
        else {
            return null;
        }
    };
    SaveStateHandler.prototype.getState = function () {
        var _this = this;
        var getOpenNodeIds = function () {
            var open_nodes = [];
            _this.tree_widget.tree.iterate(function (node) {
                if (node.is_open && node.id && node.hasChildren()) {
                    open_nodes.push(node.id);
                }
                return true;
            });
            return open_nodes;
        };
        var getSelectedNodeIds = function () {
            return _this.tree_widget.getSelectedNodes().map(function (n) { return n.id; });
        };
        return {
            open_nodes: getOpenNodeIds(),
            selected_node: getSelectedNodeIds()
        };
    };
    /*
    Set initial state
    Don't handle nodes that are loaded on demand

    result: must load on demand
    */
    SaveStateHandler.prototype.setInitialState = function (state) {
        if (!state) {
            return false;
        }
        else {
            var must_load_on_demand = false;
            if (state.open_nodes) {
                must_load_on_demand = this._openInitialNodes(state.open_nodes);
            }
            if (state.selected_node) {
                this._resetSelection();
                this._selectInitialNodes(state.selected_node);
            }
            return must_load_on_demand;
        }
    };
    SaveStateHandler.prototype.setInitialStateOnDemand = function (state, cb_finished) {
        if (state) {
            this._setInitialStateOnDemand(state.open_nodes, state.selected_node, cb_finished);
        }
        else {
            cb_finished();
        }
    };
    SaveStateHandler.prototype.getNodeIdToBeSelected = function () {
        var state = this.getStateFromStorage();
        if (state && state.selected_node) {
            return state.selected_node[0];
        }
        else {
            return null;
        }
    };
    SaveStateHandler.prototype._parseState = function (json_data) {
        var state = jQuery.parseJSON(json_data);
        // Check if selected_node is an int (instead of an array)
        if (state && state.selected_node && util_1.isInt(state.selected_node)) {
            // Convert to array
            state.selected_node = [state.selected_node];
        }
        return state;
    };
    SaveStateHandler.prototype._loadFromStorage = function () {
        if (this.tree_widget.options.onGetStateFromStorage) {
            return this.tree_widget.options.onGetStateFromStorage();
        }
        else if (this.supportsLocalStorage()) {
            return localStorage.getItem(this.getKeyName());
        }
    };
    SaveStateHandler.prototype._openInitialNodes = function (node_ids) {
        var must_load_on_demand = false;
        for (var _i = 0, node_ids_1 = node_ids; _i < node_ids_1.length; _i++) {
            var node_id = node_ids_1[_i];
            var node = this.tree_widget.getNodeById(node_id);
            if (node) {
                if (!node.load_on_demand) {
                    node.is_open = true;
                }
                else {
                    must_load_on_demand = true;
                }
            }
        }
        return must_load_on_demand;
    };
    SaveStateHandler.prototype._selectInitialNodes = function (node_ids) {
        var select_count = 0;
        for (var _i = 0, node_ids_2 = node_ids; _i < node_ids_2.length; _i++) {
            var node_id = node_ids_2[_i];
            var node = this.tree_widget.getNodeById(node_id);
            if (node) {
                select_count += 1;
                if (this.tree_widget.select_node_handler) {
                    this.tree_widget.select_node_handler.addToSelection(node);
                }
            }
        }
        return select_count !== 0;
    };
    SaveStateHandler.prototype._resetSelection = function () {
        var select_node_handler = this.tree_widget.select_node_handler;
        if (select_node_handler) {
            var selected_nodes = select_node_handler.getSelectedNodes();
            selected_nodes.forEach(function (node) {
                select_node_handler.removeFromSelection(node);
            });
        }
    };
    SaveStateHandler.prototype._setInitialStateOnDemand = function (node_ids_param, selected_nodes, cb_finished) {
        var _this = this;
        var loading_count = 0;
        var node_ids = node_ids_param;
        var openNodes = function () {
            var new_nodes_ids = [];
            for (var _i = 0, node_ids_3 = node_ids; _i < node_ids_3.length; _i++) {
                var node_id = node_ids_3[_i];
                var node = _this.tree_widget.getNodeById(node_id);
                if (!node) {
                    new_nodes_ids.push(node_id);
                }
                else {
                    if (!node.is_loading) {
                        if (node.load_on_demand) {
                            loadAndOpenNode(node);
                        }
                        else {
                            _this.tree_widget._openNode(node, false, null);
                        }
                    }
                }
            }
            node_ids = new_nodes_ids;
            if (_this._selectInitialNodes(selected_nodes)) {
                _this.tree_widget._refreshElements(null);
            }
            if (loading_count === 0) {
                cb_finished();
            }
        };
        var loadAndOpenNode = function (node) {
            loading_count += 1;
            _this.tree_widget._openNode(node, false, function () {
                loading_count -= 1;
                openNodes();
            });
        };
        openNodes();
    };
    SaveStateHandler.prototype.getKeyName = function () {
        if (typeof this.tree_widget.options.saveState === "string") {
            return this.tree_widget.options.saveState;
        }
        else {
            return "tree";
        }
    };
    SaveStateHandler.prototype.supportsLocalStorage = function () {
        var testSupport = function () {
            // Is local storage supported?
            if (localStorage == null) {
                return false;
            }
            else {
                // Check if it's possible to store an item. Safari does not allow this in private browsing mode.
                try {
                    var key = "_storage_test";
                    sessionStorage.setItem(key, "value");
                    sessionStorage.removeItem(key);
                }
                catch (error) {
                    return false;
                }
                return true;
            }
        };
        if (this._supportsLocalStorage == null) {
            this._supportsLocalStorage = testSupport();
        }
        return this._supportsLocalStorage;
    };
    return SaveStateHandler;
}());
exports["default"] = SaveStateHandler;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var ScrollHandler = /** @class */ (function () {
    function ScrollHandler(tree_widget) {
        this.tree_widget = tree_widget;
        this.previous_top = -1;
        this.is_initialized = false;
    }
    ScrollHandler.prototype.checkScrolling = function () {
        this.ensureInit();
        this.checkVerticalScrolling();
        this.checkHorizontalScrolling();
    };
    ScrollHandler.prototype.scrollToY = function (top) {
        this.ensureInit();
        if (this.$scroll_parent) {
            this.$scroll_parent[0].scrollTop = top;
        }
        else {
            var offset = this.tree_widget.$el.offset();
            var tree_top = offset ? offset.top : 0;
            jQuery(document).scrollTop(top + tree_top);
        }
    };
    ScrollHandler.prototype.isScrolledIntoView = function ($element) {
        this.ensureInit();
        var element_bottom;
        var view_bottom;
        var element_top;
        var view_top;
        var el_height = $element.height() || 0;
        if (this.$scroll_parent) {
            view_top = 0;
            view_bottom = this.$scroll_parent.height() || 0;
            var offset = $element.offset();
            var original_top = offset ? offset.top : 0;
            element_top = original_top - this.scroll_parent_top;
            element_bottom = element_top + el_height;
        }
        else {
            view_top = jQuery(window).scrollTop() || 0;
            var window_height = jQuery(window).height() || 0;
            view_bottom = view_top + window_height;
            var offset = $element.offset();
            element_top = offset ? offset.top : 0;
            element_bottom = element_top + el_height;
        }
        return element_bottom <= view_bottom && element_top >= view_top;
    };
    ScrollHandler.prototype.getScrollLeft = function () {
        if (!this.$scroll_parent) {
            return 0;
        }
        else {
            return this.$scroll_parent.scrollLeft() || 0;
        }
    };
    ScrollHandler.prototype.initScrollParent = function () {
        var _this = this;
        var getParentWithOverflow = function () {
            var css_attributes = ["overflow", "overflow-y"];
            var hasOverFlow = function ($el) {
                for (var _i = 0, css_attributes_1 = css_attributes; _i < css_attributes_1.length; _i++) {
                    var attr = css_attributes_1[_i];
                    var overflow_value = $el.css(attr);
                    if (overflow_value === "auto" ||
                        overflow_value === "scroll") {
                        return true;
                    }
                }
                return false;
            };
            if (hasOverFlow(_this.tree_widget.$el)) {
                return _this.tree_widget.$el;
            }
            for (var _i = 0, _a = _this.tree_widget.$el.parents().get(); _i < _a.length; _i++) {
                var el = _a[_i];
                var $el = jQuery(el);
                if (hasOverFlow($el)) {
                    return $el;
                }
            }
            return null;
        };
        var setDocumentAsScrollParent = function () {
            _this.scroll_parent_top = 0;
            _this.$scroll_parent = null;
        };
        if (this.tree_widget.$el.css("position") === "fixed") {
            setDocumentAsScrollParent();
        }
        var $scroll_parent = getParentWithOverflow();
        if ($scroll_parent &&
            $scroll_parent.length &&
            $scroll_parent[0].tagName !== "HTML") {
            this.$scroll_parent = $scroll_parent;
            var offset = this.$scroll_parent.offset();
            this.scroll_parent_top = offset ? offset.top : 0;
        }
        else {
            setDocumentAsScrollParent();
        }
        this.is_initialized = true;
    };
    ScrollHandler.prototype.ensureInit = function () {
        if (!this.is_initialized) {
            this.initScrollParent();
        }
    };
    ScrollHandler.prototype.handleVerticalScrollingWithScrollParent = function (area) {
        var scroll_parent = this.$scroll_parent && this.$scroll_parent[0];
        if (!scroll_parent) {
            return;
        }
        var distance_bottom = this.scroll_parent_top + scroll_parent.offsetHeight - area.bottom;
        if (distance_bottom < 20) {
            scroll_parent.scrollTop += 20;
            this.tree_widget.refreshHitAreas();
            this.previous_top = -1;
        }
        else if (area.top - this.scroll_parent_top < 20) {
            scroll_parent.scrollTop -= 20;
            this.tree_widget.refreshHitAreas();
            this.previous_top = -1;
        }
    };
    ScrollHandler.prototype.handleVerticalScrollingWithDocument = function (area) {
        var scroll_top = jQuery(document).scrollTop() || 0;
        var distance_top = area.top - scroll_top;
        if (distance_top < 20) {
            jQuery(document).scrollTop(scroll_top - 20);
        }
        else {
            var window_height = jQuery(window).height() || 0;
            if (window_height - (area.bottom - scroll_top) < 20) {
                jQuery(document).scrollTop(scroll_top + 20);
            }
        }
    };
    ScrollHandler.prototype.checkVerticalScrolling = function () {
        var hovered_area = this.tree_widget.dnd_handler &&
            this.tree_widget.dnd_handler.hovered_area;
        if (hovered_area && hovered_area.top !== this.previous_top) {
            this.previous_top = hovered_area.top;
            if (this.$scroll_parent) {
                this.handleVerticalScrollingWithScrollParent(hovered_area);
            }
            else {
                this.handleVerticalScrollingWithDocument(hovered_area);
            }
        }
    };
    ScrollHandler.prototype.checkHorizontalScrolling = function () {
        var position_info = this.tree_widget.dnd_handler &&
            this.tree_widget.dnd_handler.position_info;
        if (!position_info) {
            return;
        }
        if (this.$scroll_parent) {
            this.handleHorizontalScrollingWithParent(position_info);
        }
        else {
            this.handleHorizontalScrollingWithDocument(position_info);
        }
    };
    ScrollHandler.prototype.handleHorizontalScrollingWithParent = function (position_info) {
        var $scroll_parent = this.$scroll_parent;
        var scroll_parent_offset = $scroll_parent && $scroll_parent.offset();
        if (!($scroll_parent && scroll_parent_offset)) {
            return;
        }
        var scroll_parent = $scroll_parent[0];
        var can_scroll_right = scroll_parent.scrollLeft + scroll_parent.clientWidth <
            scroll_parent.scrollWidth;
        var can_scroll_left = scroll_parent.scrollLeft > 0;
        var right_edge = scroll_parent_offset.left + scroll_parent.clientWidth;
        var left_edge = scroll_parent_offset.left;
        var is_near_right_edge = position_info.page_x > right_edge - 20;
        var is_near_left_edge = position_info.page_x < left_edge + 20;
        if (is_near_right_edge && can_scroll_right) {
            scroll_parent.scrollLeft = Math.min(scroll_parent.scrollLeft + 20, scroll_parent.scrollWidth);
        }
        else if (is_near_left_edge && can_scroll_left) {
            scroll_parent.scrollLeft = Math.max(scroll_parent.scrollLeft - 20, 0);
        }
    };
    ScrollHandler.prototype.handleHorizontalScrollingWithDocument = function (position_info) {
        var $document = jQuery(document);
        var scroll_left = $document.scrollLeft() || 0;
        var window_width = jQuery(window).width() || 0;
        var can_scroll_left = scroll_left > 0;
        var is_near_right_edge = position_info.page_x > window_width - 20;
        var is_near_left_edge = position_info.page_x - scroll_left < 20;
        if (is_near_right_edge) {
            $document.scrollLeft(scroll_left + 20);
        }
        else if (is_near_left_edge && can_scroll_left) {
            $document.scrollLeft(Math.max(scroll_left - 20, 0));
        }
    };
    return ScrollHandler;
}());
exports["default"] = ScrollHandler;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var SelectNodeHandler = /** @class */ (function () {
    function SelectNodeHandler(tree_widget) {
        this.tree_widget = tree_widget;
        this.clear();
    }
    SelectNodeHandler.prototype.getSelectedNode = function () {
        var selected_nodes = this.getSelectedNodes();
        if (selected_nodes.length) {
            return selected_nodes[0];
        }
        else {
            return false;
        }
    };
    SelectNodeHandler.prototype.getSelectedNodes = function () {
        if (this.selected_single_node) {
            return [this.selected_single_node];
        }
        else {
            var selected_nodes = [];
            for (var id in this.selected_nodes) {
                if (this.selected_nodes.hasOwnProperty(id)) {
                    var node = this.tree_widget.getNodeById(id);
                    if (node) {
                        selected_nodes.push(node);
                    }
                }
            }
            return selected_nodes;
        }
    };
    SelectNodeHandler.prototype.getSelectedNodesUnder = function (parent) {
        if (this.selected_single_node) {
            if (parent.isParentOf(this.selected_single_node)) {
                return [this.selected_single_node];
            }
            else {
                return [];
            }
        }
        else {
            var selected_nodes = [];
            for (var id in this.selected_nodes) {
                if (this.selected_nodes.hasOwnProperty(id)) {
                    var node = this.tree_widget.getNodeById(id);
                    if (node && parent.isParentOf(node)) {
                        selected_nodes.push(node);
                    }
                }
            }
            return selected_nodes;
        }
    };
    SelectNodeHandler.prototype.isNodeSelected = function (node) {
        if (!node) {
            return false;
        }
        else if (node.id != null) {
            if (this.selected_nodes[node.id]) {
                return true;
            }
            else {
                return false;
            }
        }
        else if (this.selected_single_node) {
            return this.selected_single_node.element === node.element;
        }
        else {
            return false;
        }
    };
    SelectNodeHandler.prototype.clear = function () {
        this.selected_nodes = {};
        this.selected_single_node = null;
    };
    SelectNodeHandler.prototype.removeFromSelection = function (node, include_children) {
        var _this = this;
        if (include_children === void 0) { include_children = false; }
        if (node.id == null) {
            if (this.selected_single_node &&
                node.element === this.selected_single_node.element) {
                this.selected_single_node = null;
            }
        }
        else {
            delete this.selected_nodes[node.id];
            if (include_children) {
                node.iterate(function () {
                    delete _this.selected_nodes[node.id];
                    return true;
                });
            }
        }
    };
    SelectNodeHandler.prototype.addToSelection = function (node) {
        if (node.id != null) {
            this.selected_nodes[node.id] = true;
        }
        else {
            this.selected_single_node = node;
        }
    };
    return SelectNodeHandler;
}());
exports["default"] = SelectNodeHandler;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var node_1 = __webpack_require__(0);
var NodeElement = /** @class */ (function () {
    function NodeElement(node, tree_widget) {
        this.init(node, tree_widget);
    }
    NodeElement.prototype.init = function (node, tree_widget) {
        this.node = node;
        this.tree_widget = tree_widget;
        if (!node.element) {
            node.element = this.tree_widget.element.get(0);
        }
        this.$element = jQuery(node.element);
    };
    NodeElement.prototype.addDropHint = function (position) {
        if (this.mustShowBorderDropHint(position)) {
            return new BorderDropHint(this.$element, this.tree_widget._getScrollLeft());
        }
        else {
            return new GhostDropHint(this.node, this.$element, position);
        }
    };
    NodeElement.prototype.select = function () {
        var $li = this.getLi();
        $li.addClass("jqtree-selected");
        $li.attr("aria-selected", "true");
        var $span = this.getSpan();
        $span.attr("tabindex", this.tree_widget.options.tabIndex);
        $span.focus();
    };
    NodeElement.prototype.deselect = function () {
        var $li = this.getLi();
        $li.removeClass("jqtree-selected");
        $li.attr("aria-selected", "false");
        var $span = this.getSpan();
        $span.removeAttr("tabindex");
        $span.blur();
    };
    NodeElement.prototype.getUl = function () {
        return this.$element.children("ul:first");
    };
    NodeElement.prototype.getSpan = function () {
        return this.$element
            .children(".jqtree-element")
            .find("span.jqtree-title");
    };
    NodeElement.prototype.getLi = function () {
        return this.$element;
    };
    NodeElement.prototype.mustShowBorderDropHint = function (position) {
        return position === node_1.Position.Inside;
    };
    return NodeElement;
}());
exports.NodeElement = NodeElement;
var FolderElement = /** @class */ (function (_super) {
    __extends(FolderElement, _super);
    function FolderElement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FolderElement.prototype.open = function (on_finished, slide, animationSpeed) {
        var _this = this;
        if (slide === void 0) { slide = true; }
        if (animationSpeed === void 0) { animationSpeed = "fast"; }
        if (!this.node.is_open) {
            this.node.is_open = true;
            var $button = this.getButton();
            $button.removeClass("jqtree-closed");
            $button.html("");
            var button_el = $button.get(0);
            if (button_el) {
                var icon = this.tree_widget.renderer.opened_icon_element.cloneNode(false);
                button_el.appendChild(icon);
            }
            var doOpen = function () {
                var $li = _this.getLi();
                $li.removeClass("jqtree-closed");
                var $span = _this.getSpan();
                $span.attr("aria-expanded", "true");
                if (on_finished) {
                    on_finished(_this.node);
                }
                _this.tree_widget._triggerEvent("tree.open", {
                    node: _this.node
                });
            };
            if (slide) {
                this.getUl().slideDown(animationSpeed, doOpen);
            }
            else {
                this.getUl().show();
                doOpen();
            }
        }
    };
    FolderElement.prototype.close = function (slide, animationSpeed) {
        var _this = this;
        if (slide === void 0) { slide = true; }
        if (animationSpeed === void 0) { animationSpeed = "fast"; }
        if (this.node.is_open) {
            this.node.is_open = false;
            var $button = this.getButton();
            $button.addClass("jqtree-closed");
            $button.html("");
            var button_el = $button.get(0);
            if (button_el) {
                var icon = this.tree_widget.renderer.closed_icon_element.cloneNode(false);
                button_el.appendChild(icon);
            }
            var doClose = function () {
                var $li = _this.getLi();
                $li.addClass("jqtree-closed");
                var $span = _this.getSpan();
                $span.attr("aria-expanded", "false");
                _this.tree_widget._triggerEvent("tree.close", {
                    node: _this.node
                });
            };
            if (slide) {
                this.getUl().slideUp(animationSpeed, doClose);
            }
            else {
                this.getUl().hide();
                doClose();
            }
        }
    };
    FolderElement.prototype.mustShowBorderDropHint = function (position) {
        return !this.node.is_open && position === node_1.Position.Inside;
    };
    FolderElement.prototype.getButton = function () {
        return this.$element
            .children(".jqtree-element")
            .find("a.jqtree-toggler");
    };
    return FolderElement;
}(NodeElement));
exports.FolderElement = FolderElement;
var BorderDropHint = /** @class */ (function () {
    function BorderDropHint($element, scroll_left) {
        var $div = $element.children(".jqtree-element");
        var el_width = $element.width() || 0;
        var width = Math.max(el_width + scroll_left - 4, 0);
        var el_height = $div.outerHeight() || 0;
        var height = Math.max(el_height - 4, 0);
        this.$hint = jQuery('<span class="jqtree-border"></span>');
        $div.append(this.$hint);
        this.$hint.css({ width: width, height: height });
    }
    BorderDropHint.prototype.remove = function () {
        this.$hint.remove();
    };
    return BorderDropHint;
}());
exports.BorderDropHint = BorderDropHint;
var GhostDropHint = /** @class */ (function () {
    function GhostDropHint(node, $element, position) {
        this.$element = $element;
        this.node = node;
        this.$ghost = jQuery("<li class=\"jqtree_common jqtree-ghost\"><span class=\"jqtree_common jqtree-circle\"></span>\n            <span class=\"jqtree_common jqtree-line\"></span></li>");
        if (position === node_1.Position.After) {
            this.moveAfter();
        }
        else if (position === node_1.Position.Before) {
            this.moveBefore();
        }
        else if (position === node_1.Position.Inside) {
            if (node.isFolder() && node.is_open) {
                this.moveInsideOpenFolder();
            }
            else {
                this.moveInside();
            }
        }
    }
    GhostDropHint.prototype.remove = function () {
        this.$ghost.remove();
    };
    GhostDropHint.prototype.moveAfter = function () {
        this.$element.after(this.$ghost);
    };
    GhostDropHint.prototype.moveBefore = function () {
        this.$element.before(this.$ghost);
    };
    GhostDropHint.prototype.moveInsideOpenFolder = function () {
        jQuery(this.node.children[0].element).before(this.$ghost);
    };
    GhostDropHint.prototype.moveInside = function () {
        this.$element.after(this.$ghost);
        this.$ghost.addClass("jqtree-inside");
    };
    return GhostDropHint;
}());


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.example_data = [
    {
        label: "node1",
        id: 123,
        int_property: 1,
        str_property: "1",
        children: [
            { label: "child1", id: 125, int_property: 2 },
            { label: "child2", id: 126 }
        ]
    },
    {
        label: "node2",
        id: 124,
        int_property: 3,
        str_property: "3",
        children: [{ label: "child3", id: 127 }]
    }
];
/*
example data 2:

-main
---c1
---c2
*/
exports.example_data2 = [
    {
        label: "main",
        children: [{ label: "c1" }, { label: "c2" }]
    }
];
function formatNodes(nodes) {
    var strings = nodes.map(function (node) { return node.name; });
    return strings.join(" ");
}
exports.formatNodes = formatNodes;
function isNodeClosed($node) {
    return ($node.is("li.jqtree-folder.jqtree-closed") &&
        $node.find("a:eq(0)").is("a.jqtree-toggler.jqtree-closed") &&
        $node.find("ul:eq(0)").is("ul"));
}
exports.isNodeClosed = isNodeClosed;
function isNodeOpen($node) {
    return ($node.is("li.jqtree-folder") &&
        $node.find("a:eq(0)").is("a.jqtree-toggler") &&
        $node.find("ul:eq(0)").is("ul") &&
        !$node.is("li.jqtree-folder.jqtree-closed") &&
        !$node.find("span:eq(0)").is("a.jqtree-toggler.jqtree-closed"));
}
exports.isNodeOpen = isNodeOpen;
function formatTitles($node) {
    var titles = $node.find(".jqtree-title").map(function (_, el) { return $(el).text(); });
    return titles.toArray().join(" ");
}
exports.formatTitles = formatTitles;
function doGetNodeByName(tree, name) {
    var result = tree.getNodeByName(name);
    if (!result) {
        throw Error("Node with name '" + name + "' not found");
    }
    return result;
}
exports.doGetNodeByName = doGetNodeByName;
function doGetNodeById(tree, id) {
    var result = tree.getNodeById(id);
    if (!result) {
        throw Error("Node with id '" + id + "' not found");
    }
    return result;
}
exports.doGetNodeById = doGetNodeById;


/***/ }),
/* 15 */,
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(17);


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
__webpack_require__(18);
__webpack_require__(19);
__webpack_require__(20);
QUnit.config.testTimeout = 5000;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var module = QUnit.module, test = QUnit.test;
var node_1 = __webpack_require__(0);
module("util");
test("getPositionName", function (assert) {
    assert.equal(node_1.getPositionName(node_1.Position.Before), "before");
    assert.equal(node_1.getPositionName(node_1.Position.After), "after");
    assert.equal(node_1.getPositionName(node_1.Position.Inside), "inside");
    assert.equal(node_1.getPositionName(node_1.Position.None), "none");
});
test("getPosition", function (assert) {
    assert.equal(node_1.getPosition("inside"), node_1.Position.Inside);
});


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var module = QUnit.module, test = QUnit.test;
var utils_for_test_1 = __webpack_require__(14);
var node_1 = __webpack_require__(0);
module("Tree");
test("constructor", function (assert) {
    // 1. Create node from string
    var node = new node_1.Node("n1");
    assert.equal(node.name, "n1");
    assert.equal(node.children.length, 0);
    assert.equal(node.parent, null);
    // 2. Create node from object
    var node2 = new node_1.Node({
        label: "n2",
        id: 123,
        parent: "abc",
        children: ["c"],
        url: "/"
    });
    assert.equal(node2.name, "n2");
    assert.equal(node2.id, 123);
    // tslint:disable-next-line: no-string-literal
    assert.equal(node2["url"], "/");
    // tslint:disable-next-line: no-string-literal
    assert.equal(node2["label"], undefined);
    assert.equal(node2.children.length, 0);
    assert.equal(node2.parent, null);
});
test("create tree from data", function (assert) {
    function checkData(tree) {
        assert.equal(utils_for_test_1.formatNodes(tree.children), "node1 node2", "nodes on level 1");
        assert.equal(utils_for_test_1.formatNodes(tree.children[0].children), "child1 child2", "children of node1");
        assert.equal(utils_for_test_1.formatNodes(tree.children[1].children), "child3", "children of node2");
        assert.equal(tree.children[0].id, 123, "id");
    }
    // - create tree from example data
    var tree = new node_1.Node({}, true);
    tree.loadFromData(utils_for_test_1.example_data);
    checkData(tree);
    // - create tree from new data format
    var data = [
        {
            label: "node1",
            id: 123,
            children: ["child1", "child2"] // nodes are only defined by a string
        },
        {
            label: "node2",
            id: 124,
            children: ["child3"]
        }
    ];
    var tree2 = new node_1.Node({}, true);
    tree2.loadFromData(data);
    checkData(tree2);
});
test("addChild", function (assert) {
    var tree = new node_1.Node("tree1", true);
    tree.addChild(new node_1.Node("abc"));
    tree.addChild(new node_1.Node("def"));
    assert.equal(utils_for_test_1.formatNodes(tree.children), "abc def", "children");
    var node = tree.children[0];
    if (!node.parent) {
        assert.ok(false, "Node has no parent");
    }
    else {
        assert.equal(node.parent.name, "tree1", "parent of node");
    }
});
test("addChildAtPosition", function (assert) {
    var tree = new node_1.Node({}, true);
    tree.addChildAtPosition(new node_1.Node("abc"), 0); // first
    tree.addChildAtPosition(new node_1.Node("ghi"), 2); // index 2 does not exist
    tree.addChildAtPosition(new node_1.Node("def"), 1);
    tree.addChildAtPosition(new node_1.Node("123"), 0);
    assert.equal(utils_for_test_1.formatNodes(tree.children), "123 abc def ghi", "children");
});
test("removeChild", function (assert) {
    var tree = new node_1.Node({}, true);
    var abc = new node_1.Node({ label: "abc", id: 1 });
    var def = new node_1.Node({ label: "def", id: 2 });
    var ghi = new node_1.Node({ label: "ghi", id: 3 });
    tree.addChild(abc);
    tree.addChild(def);
    tree.addChild(ghi);
    var jkl = new node_1.Node({ label: "jkl", id: 4 });
    def.addChild(jkl);
    assert.equal(utils_for_test_1.formatNodes(tree.children), "abc def ghi", "children");
    assert.equal(tree.id_mapping[2].name, "def");
    assert.equal(tree.id_mapping[4].name, "jkl");
    // remove 'def'
    tree.removeChild(def);
    assert.equal(utils_for_test_1.formatNodes(tree.children), "abc ghi", "children");
    assert.equal(tree.id_mapping[2], null);
    assert.equal(tree.id_mapping[4], null);
    // remove 'ghi'
    tree.removeChild(ghi);
    assert.equal(utils_for_test_1.formatNodes(tree.children), "abc", "children");
    // remove 'abc'
    tree.removeChild(abc);
    assert.equal(utils_for_test_1.formatNodes(tree.children), "", "children");
});
test("getChildIndex", function (assert) {
    // setup
    var tree = new node_1.Node({}, true);
    var abc = new node_1.Node("abc");
    var def = new node_1.Node("def");
    var ghi = new node_1.Node("ghi");
    tree.addChild(abc);
    tree.addChild(def);
    tree.addChild(ghi);
    // 1. Get child index of 'def'
    assert.equal(tree.getChildIndex(def), 1);
    // 2. Get child index of non-existing node
    assert.equal(tree.getChildIndex(new node_1.Node("xyz")), -1);
});
test("hasChildren", function (assert) {
    var tree = new node_1.Node({}, true);
    assert.equal(tree.hasChildren(), false, "tree without children");
    tree.addChild(new node_1.Node("abc"));
    assert.equal(tree.hasChildren(), true, "tree has children");
});
test("iterate", function (assert) {
    var tree = new node_1.Node({}, true);
    tree.loadFromData(utils_for_test_1.example_data);
    // iterate over all the nodes
    var nodes = [];
    tree.iterate(function (node) {
        nodes.push(node);
        return true;
    });
    assert.equal(utils_for_test_1.formatNodes(nodes), "node1 child1 child2 node2 child3", "all nodes");
    // iterate over nodes on first level
    var nodes2 = [];
    tree.iterate(function (node) {
        nodes2.push(node);
        return false;
    });
    assert.equal(utils_for_test_1.formatNodes(nodes2), "node1 node2", "nodes on first level");
    // add child 4
    var node124 = utils_for_test_1.doGetNodeById(tree, 124);
    var node3 = node124.children[0];
    node3.addChild(new node_1.Node("child4"));
    // test level parameter
    var nodes3 = [];
    tree.iterate(function (node, level) {
        nodes3.push(node.name + " " + level);
        return true;
    });
    assert.equal(nodes3.join(","), "node1 0,child1 1,child2 1,node2 0,child3 1,child4 2");
});
test("moveNode", function (assert) {
    var tree = new node_1.Node({}, true);
    tree.loadFromData(utils_for_test_1.example_data);
    /*
      node1
      ---child1
      ---child2
      node2
      ---child3
    */
    var node1 = tree.children[0];
    var node2 = tree.children[1];
    var child1 = node1.children[0];
    var child2 = node1.children[1];
    assert.equal(node2.name, "node2", "node2 name");
    assert.equal(child2.name, "child2", "child2 name");
    // move child2 after node2
    tree.moveNode(child2, node2, node_1.Position.After);
    /*
      node1
      ---child1
      node2
      ---child3
      child2
    */
    assert.equal(utils_for_test_1.formatNodes(tree.children), "node1 node2 child2", "tree nodes at first level");
    assert.equal(utils_for_test_1.formatNodes(node1.children), "child1", "node1 children");
    // move child1 inside node2
    // this means it's the first child
    tree.moveNode(child1, node2, node_1.Position.Inside);
    /*
      node1
      node2
      ---child1
      ---child3
      child2
    */
    assert.equal(utils_for_test_1.formatNodes(node2.children), "child1 child3", "node2 children");
    assert.equal(utils_for_test_1.formatNodes(node1.children), "", "node1 has no children");
    // move child2 before child1
    tree.moveNode(child2, child1, node_1.Position.Before);
    /*
      node1
      node2
      ---child2
      ---child1
      ---child3
    */
    assert.equal(utils_for_test_1.formatNodes(node2.children), "child2 child1 child3", "node2 children");
    assert.equal(utils_for_test_1.formatNodes(tree.children), "node1 node2", "tree nodes at first level");
});
test("initFromData", function (assert) {
    var data = {
        label: "main",
        children: [
            "c1",
            {
                label: "c2",
                id: 201
            }
        ]
    };
    var node = new node_1.Node({}, true);
    node.initFromData(data);
    assert.equal(node.name, "main");
    assert.equal(utils_for_test_1.formatNodes(node.children), "c1 c2", "children");
    assert.equal(node.children[1].id, 201);
});
test("getData", function (assert) {
    // 1. empty node
    var node = new node_1.Node({}, true);
    assert.deepEqual(node.getData(), []);
    // 2.node with data
    node.loadFromData([
        {
            label: "n1",
            children: [
                {
                    label: "c1"
                }
            ]
        }
    ]);
    assert.deepEqual(node.getData(), [
        {
            name: "n1",
            children: [
                {
                    name: "c1"
                }
            ]
        }
    ]);
    // 3. get data including parent
    var n1 = utils_for_test_1.doGetNodeByName(node, "n1");
    assert.deepEqual(n1.getData(true), [
        {
            name: "n1",
            children: [{ name: "c1" }]
        }
    ]);
});
test("addAfter", function (assert) {
    // setup
    var tree = new node_1.Node({}, true);
    tree.loadFromData(utils_for_test_1.example_data);
    /*
    -node1
    ---c1
    ---c2
    -node2
    ---c3
    */
    assert.equal(utils_for_test_1.formatNodes(tree.children), "node1 node2");
    // - Add 'node_b' after node2
    var node2 = utils_for_test_1.doGetNodeByName(tree, "node2");
    node2.addAfter("node_b");
    assert.equal(utils_for_test_1.formatNodes(tree.children), "node1 node2 node_b");
    var node_b = utils_for_test_1.doGetNodeByName(tree, "node_b");
    assert.equal(node_b.name, "node_b");
    // - Add 'node_a' after node1
    var node1 = utils_for_test_1.doGetNodeByName(tree, "node1");
    node1.addAfter("node_a");
    assert.equal(utils_for_test_1.formatNodes(tree.children), "node1 node_a node2 node_b");
    // - Add 'node_c' after node_b; new node is an object
    if (node_b) {
        node_b.addAfter({
            label: "node_c",
            id: 789
        });
    }
    var node_c = utils_for_test_1.doGetNodeByName(tree, "node_c");
    assert.equal(node_c.id, 789);
    assert.equal(utils_for_test_1.formatNodes(tree.children), "node1 node_a node2 node_b node_c");
    // - Add after root node; this is not possible
    assert.equal(tree.addAfter("node_x"), null);
});
test("addBefore", function (assert) {
    // setup
    var tree = new node_1.Node({}, true);
    tree.loadFromData(utils_for_test_1.example_data);
    // - Add 'node_0' before node1
    var node1 = utils_for_test_1.doGetNodeByName(tree, "node1");
    node1.addBefore("node0");
    assert.equal(utils_for_test_1.formatNodes(tree.children), "node0 node1 node2");
    // - Add before root node; this is not possile
    assert.equal(tree.addBefore("x"), null);
});
test("addParent", function (assert) {
    // setup
    var tree = new node_1.Node({}, true);
    tree.loadFromData(utils_for_test_1.example_data);
    // - Add node 'root' as parent of node1
    // Note that node also becomes a child of 'root'
    var node1 = utils_for_test_1.doGetNodeByName(tree, "node1");
    node1.addParent("root");
    var root = utils_for_test_1.doGetNodeByName(tree, "root");
    assert.equal(utils_for_test_1.formatNodes(root.children), "node1 node2");
    // - Add parent to root node; not possible
    assert.equal(tree.addParent("x"), null);
});
test("remove", function (assert) {
    // setup
    var tree = new node_1.Node({}, true);
    tree.loadFromData(utils_for_test_1.example_data);
    var child1 = utils_for_test_1.doGetNodeByName(tree, "child1");
    var node1 = utils_for_test_1.doGetNodeByName(tree, "node1");
    assert.equal(utils_for_test_1.formatNodes(node1.children), "child1 child2");
    assert.equal(child1.parent, node1);
    // 1. Remove child1
    child1.remove();
    assert.equal(utils_for_test_1.formatNodes(node1.children), "child2");
    assert.equal(child1.parent, null);
});
test("append", function (assert) {
    // setup
    var tree = new node_1.Node({}, true);
    tree.loadFromData(utils_for_test_1.example_data);
    var node1 = utils_for_test_1.doGetNodeByName(tree, "node1");
    // 1. Append child3 to node1
    node1.append("child3");
    assert.equal(utils_for_test_1.formatNodes(node1.children), "child1 child2 child3");
    // 2. Append subtree
    node1.append({
        name: "child4",
        children: [{ name: "child5" }]
    });
    assert.equal(utils_for_test_1.formatNodes(node1.children), "child1 child2 child3 child4");
    var child4 = utils_for_test_1.doGetNodeByName(node1, "child4");
    assert.equal(utils_for_test_1.formatNodes(child4.children), "child5");
});
test("prepend", function (assert) {
    // setup
    var tree = new node_1.Node({}, true);
    tree.loadFromData(utils_for_test_1.example_data);
    var node1 = utils_for_test_1.doGetNodeByName(tree, "node1");
    // 1. Prepend child0 to node1
    node1.prepend("child0");
    assert.equal(utils_for_test_1.formatNodes(node1.children), "child0 child1 child2");
    // 2. Prepend subtree
    node1.prepend({
        name: "child3",
        children: [{ name: "child4" }]
    });
    assert.equal(utils_for_test_1.formatNodes(node1.children), "child3 child0 child1 child2");
    var child3 = utils_for_test_1.doGetNodeByName(node1, "child3");
    assert.equal(utils_for_test_1.formatNodes(child3.children), "child4");
});
test("getNodeById", function (assert) {
    // setup
    var tree = new node_1.Node({}, true);
    tree.loadFromData(utils_for_test_1.example_data);
    // 1. Get node with id 124
    var node = utils_for_test_1.doGetNodeById(tree, 124);
    assert.equal(node.name, "node2");
    // 2. Delete node with id 124 and search again
    node.remove();
    assert.equal(tree.getNodeById(124), null);
    // 3. Add node with id 456 and search for it
    var child3 = utils_for_test_1.doGetNodeByName(tree, "child2");
    child3.append({
        id: 456,
        label: "new node"
    });
    var node2 = utils_for_test_1.doGetNodeById(tree, 456);
    assert.equal(node2.name, "new node");
});
test("getLevel", function (assert) {
    // setup
    var tree = new node_1.Node({}, true);
    tree.loadFromData(utils_for_test_1.example_data);
    // 1. get level for node1 and child1
    assert.equal(utils_for_test_1.doGetNodeByName(tree, "node1").getLevel(), 1);
    assert.equal(utils_for_test_1.doGetNodeByName(tree, "child1").getLevel(), 2);
});
test("loadFromData and id mapping", function (assert) {
    // - get node from empty tree
    var tree = new node_1.Node({}, true);
    assert.equal(tree.getNodeById(999), null);
    // - load example data in tree
    tree.loadFromData(utils_for_test_1.example_data);
    assert.equal(utils_for_test_1.doGetNodeById(tree, 124).name, "node2");
    var child2 = utils_for_test_1.doGetNodeById(tree, 126);
    child2.addChild(new node_1.Node({ label: "child4", id: 128 }));
    child2.addChild(new node_1.Node({ label: "child5", id: 129 }));
    // - load data in node child2
    child2.loadFromData(["abc", "def"]);
    assert.equal(tree.getNodeById(128), null);
    assert.equal(child2.children.length, 2);
    assert.equal(child2.children[0].name, "abc");
});
test("removeChildren", function (assert) {
    // - load example data
    var tree = new node_1.Node({}, true);
    tree.loadFromData(utils_for_test_1.example_data);
    // add child4 and child5
    var child2 = utils_for_test_1.doGetNodeById(tree, 126);
    assert.equal(child2.name, "child2");
    child2.addChild(new node_1.Node({ label: "child4", id: 128 }));
    child2.addChild(new node_1.Node({ label: "child5", id: 129 }));
    assert.equal(utils_for_test_1.doGetNodeById(tree, 128).name, "child4");
    // - remove children from child2
    child2.removeChildren();
    assert.equal(tree.getNodeById(128), null);
    assert.equal(child2.children.length, 0);
});
test("node with id 0", function (assert) {
    // - load node with id 0
    var tree = new node_1.Node({}, true);
    tree.loadFromData([
        {
            id: 0,
            label: "mynode"
        }
    ]);
    var node = utils_for_test_1.doGetNodeById(tree, 0);
    assert.equal(node.name, "mynode");
    // -- remove the node
    node.remove();
    assert.equal(tree.getNodeById(0), undefined);
});
test("getPreviousSibling", function (assert) {
    // setup
    var tree = new node_1.Node({}, true);
    tree.loadFromData(utils_for_test_1.example_data);
    // - getPreviousSibling
    var previous_sibling = utils_for_test_1.doGetNodeByName(tree, "child2").getPreviousSibling();
    if (!previous_sibling) {
        assert.ok(false, "Previous sibling not found");
    }
    else {
        assert.equal(previous_sibling.name, "child1");
    }
    assert.equal(tree.getPreviousSibling(), null);
    assert.equal(utils_for_test_1.doGetNodeByName(tree, "child1").getPreviousSibling(), null);
});
test("getNextSibling", function (assert) {
    // setup
    var tree = new node_1.Node({}, true);
    tree.loadFromData(utils_for_test_1.example_data);
    // - getNextSibling
    var next_sibling = utils_for_test_1.doGetNodeByName(tree, "node1").getNextSibling();
    if (!next_sibling) {
        assert.ok(false, "Next sibling not found");
    }
    else {
        assert.equal(next_sibling.name, "node2");
    }
    assert.equal(utils_for_test_1.doGetNodeByName(tree, "node2").getNextSibling(), null);
    assert.equal(tree.getNextSibling(), null);
});
test("getNodesByProperty", function (assert) {
    var tree = new node_1.Node({}, true);
    tree.loadFromData(utils_for_test_1.example_data);
    var nodes = tree.getNodesByProperty("name", "child1");
    assert.equal(nodes.length, 1);
    assert.equal(nodes[0].name, "child1");
});
test("getNodeByCallback", function (assert) {
    var tree = new node_1.Node({}, true);
    tree.loadFromData(utils_for_test_1.example_data);
    var node = tree.getNodeByCallback(function (n) { return n.name === "child1"; });
    if (!node) {
        assert.ok(false, "Node not found");
    }
    else {
        assert.equal(node.name, "child1");
    }
});


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
__webpack_require__(4);
var utils_for_test_1 = __webpack_require__(14);
var node_1 = __webpack_require__(0);
__webpack_require__(21);
var module = QUnit.module, test = QUnit.test;
module("jqtree", {
    beforeEach: function () {
        $("body").append('<div id="tree1"></div>');
    },
    afterEach: function () {
        var $tree = $("#tree1");
        $tree.tree("destroy");
        $tree.remove();
        $.mockjax.clear();
    }
});
test("create jqtree from data", function (assert) {
    $("#tree1").tree({
        data: utils_for_test_1.example_data
    });
    assert.equal($("#tree1").children().length, 1, "number of children on level 0");
    assert.ok($("#tree1")
        .children()
        .is("ul.jqtree-tree"), "first element is ul.jqtree-tree");
    assert.equal($("#tree1 ul.jqtree-tree > li").length, 2, "number of children on level 1");
    assert.ok($("#tree1 ul.jqtree-tree li:eq(0)").is("li.jqtree-folder.jqtree-closed"), "first child is li.jqtree-folder.jqtree-closed");
    assert.ok($("#tree1 ul.jqtree-tree li:eq(0) > .jqtree-element > a.jqtree-toggler").is("a.jqtree-toggler.jqtree-closed"), "button in first folder");
    assert.equal($("#tree1 ul.jqtree-tree li:eq(0) > .jqtree-element span.jqtree-title").text(), "node1");
});
test("toggle", function (assert) {
    // setup
    var done = assert.async();
    // create tree
    var $tree = $("#tree1");
    var $node1;
    var node1;
    $tree.tree({
        data: utils_for_test_1.example_data
    });
    $tree.on("tree.open", function () {
        assert.ok(!utils_for_test_1.isNodeClosed($node1), "node1 is open");
        // 2. close node1
        $tree.tree("toggle", node1);
    });
    $tree.on("tree.close", function () {
        assert.ok(utils_for_test_1.isNodeClosed($node1), "node1 is closed");
        done();
    });
    var tree = $tree.tree("getTree");
    node1 = tree.children[0];
    $node1 = $tree.find("ul.jqtree-tree li:eq(0)");
    // node1 is initially closed
    assert.ok(utils_for_test_1.isNodeClosed($node1), "node1 is closed");
    // 1. open node1
    $tree.tree("toggle", node1);
});
test("click event", function (assert) {
    var select_count = 0;
    // create tree
    var $tree = $("#tree1");
    $tree.tree({
        data: utils_for_test_1.example_data,
        selectable: true
    });
    var $node1 = $tree.find("ul.jqtree-tree li:first");
    var $text_span = $node1.find("span:first");
    $tree.on("tree.click", function (e) {
        assert.equal(e.node.name, "node1");
    });
    var done = assert.async();
    $tree.on("tree.select", function (e) {
        select_count += 1;
        if (select_count === 1) {
            assert.equal(e.node.name, "node1");
            assert.equal($tree.tree("getSelectedNode").name, "node1");
            // deselect
            $text_span.click();
        }
        else {
            assert.equal(e.node, null);
            assert.equal(e.previous_node.name, "node1");
            assert.equal($tree.tree("getSelectedNode"), false);
            done();
        }
    });
    // click on node1
    $text_span.click();
});
test("saveState", function (assert) {
    var $tree = $("#tree1");
    var saved_state;
    function setState(state) {
        saved_state = state;
    }
    function getState() {
        return saved_state;
    }
    function createTree() {
        $tree.tree({
            data: utils_for_test_1.example_data,
            saveState: true,
            onSetStateFromStorage: setState,
            onGetStateFromStorage: getState,
            selectable: true
        });
    }
    // create tree
    createTree();
    // nodes are initially closed
    var tree = $tree.tree("getTree");
    tree.iterate(function (node) {
        assert.ok(!node.is_open, "jqtree-closed");
        return true;
    });
    // open node1
    $tree.tree("toggle", tree.children[0]);
    // node1 is open
    assert.ok(tree.children[0].is_open, "node1 is_open");
    // select node2
    $tree.tree("selectNode", tree.children[1]);
    // node2 is selected
    assert.equal($tree.tree("getSelectedNode").name, "node2", "getSelectedNode (1)");
    // create tree again
    $tree.tree("destroy");
    createTree();
    var tree2 = $tree.tree("getTree");
    assert.ok(tree2.children[0].is_open, "node1 is_open");
    assert.ok(!tree2.children[1].is_open, "node2 is closed");
    // node2 is selected
    assert.equal($tree.tree("getSelectedNode").name, "node2", "getSelectedNode (2)");
});
test("getSelectedNode", function (assert) {
    var $tree = $("#tree1");
    // create tree
    $tree.tree({
        data: utils_for_test_1.example_data,
        selectable: true
    });
    // there is no node selected
    assert.equal($tree.tree("getSelectedNode"), false, "getSelectedNode");
    // select node1
    var tree = $tree.tree("getTree");
    var node1 = tree.children[0];
    $tree.tree("selectNode", node1);
    // node1 is selected
    assert.equal($tree.tree("getSelectedNode").name, "node1", "getSelectedNode");
});
test("toJson", function (assert) {
    // setup
    var $tree = $("#tree1");
    $tree.tree({
        data: utils_for_test_1.example_data
    });
    // 1. call toJson
    assert.equal($tree.tree("toJson"), '[{"name":"node1","id":123,"int_property":1,"str_property":"1",' +
        '"children":[{"name":"child1","id":125,"int_property":2},{"name":' +
        '"child2","id":126}]},{"name":"node2","id":124,"int_property":3,' +
        '"str_property":"3","children":[{"name":"child3","id":127}]}]');
    // Check that properties 'children', 'parent' and 'element' still exist.
    var tree = $tree.tree("getTree");
    assert.equal(tree.children.length, 2);
    assert.ok(tree.children[0].parent !== undefined, "parent");
    assert.ok($(tree.children[0].element).is("li"), "element");
});
test("loadData", function (assert) {
    // setup
    var $tree = $("#tree1");
    $tree.tree({
        data: utils_for_test_1.example_data,
        autoOpen: true
    });
    // first node is 'node1'
    assert.equal($tree.find("> ul > li:first .jqtree-element:first > span").text(), "node1");
    // - load new data
    $tree.tree("loadData", utils_for_test_1.example_data2);
    // first node is 'main'
    assert.equal($tree.find("> ul > li:first .jqtree-element:first > span").text(), "main");
    // - load new data under node 'child3'
    $tree.tree("loadData", utils_for_test_1.example_data);
    var child3 = $tree.tree("getNodeByName", "child3");
    var data = [
        { label: "c4", id: 200 },
        {
            label: "c5",
            id: 201,
            children: [{ label: "c6", id: 202 }]
        }
    ];
    $tree.tree("loadData", data, child3);
    // first node in html is still 'node1'
    assert.equal($tree
        .find("li:eq(0)")
        .find(".jqtree-element:eq(0) span.jqtree-title")
        .text(), "node1");
    // Node 'child3' now has a children 'c4' and 'c5'
    var $child3 = $tree.find("span:contains(child3)");
    var $li = $child3.closest("li");
    assert.equal($li
        .children("ul")
        .children("li:eq(0)")
        .find(".jqtree-element span.jqtree-title")
        .text(), "c4");
    // Node 'child3' must have toggler button
    assert.ok($child3.prev().is("a.jqtree-toggler"), "node 'child3' must have toggler button");
    // - select node 'c5' and load new data under 'child3'
    var c5 = $tree.tree("getNodeByName", "c5");
    $tree.tree("selectNode", c5);
    assert.equal($tree.tree("getSelectedNode").name, "c5");
    var data2 = [{ label: "c7" }, { label: "c8" }];
    $tree.tree("loadData", data2, child3);
    // c5 must be deselected
    assert.equal($tree.tree("getSelectedNode"), false);
    // - select c7; load new data under child3; note that c7 has no id
    $tree.tree("selectNode", $tree.tree("getNodeByName", "c7"));
    assert.equal($tree.tree("getSelectedNode").name, "c7");
    $tree.tree("loadData", ["c9"], child3);
    assert.equal($tree.tree("getSelectedNode"), false);
    // - select c9 (which has no id); load new nodes under child2
    $tree.tree("selectNode", $tree.tree("getNodeByName", "c9"));
    var child2 = $tree.tree("getNodeByName", "child2");
    $tree.tree("loadData", ["c10"], child2);
    assert.equal($tree.tree("getSelectedNode").name, "c9");
});
test("openNode and closeNode", function (assert) {
    // setup
    var $tree = $("#tree1");
    $tree.tree({
        data: utils_for_test_1.example_data
    });
    var node2 = $tree.tree("getNodeByName", "node2");
    assert.equal(node2.name, "node2");
    assert.equal(node2.is_open, undefined);
    // 1. open node2
    $tree.tree("openNode", node2, false);
    assert.equal(node2.is_open, true);
    assert.equal(utils_for_test_1.isNodeOpen($(node2.element)), true);
    // 2. close node2
    $tree.tree("closeNode", node2, false);
    assert.equal(node2.is_open, false);
    assert.equal(utils_for_test_1.isNodeClosed($(node2.element)), true);
    // 3. open child1
    var node1 = $tree.tree("getNodeByName", "node1");
    var child1 = $tree.tree("getNodeByName", "child1");
    // add a child to child1 so it is a folder
    $tree.tree("appendNode", "child1a", child1);
    // node1 is initialy closed
    assert.equal(node1.is_open, undefined);
    // open child1
    $tree.tree("openNode", child1, false);
    // node1 and child1 are now open1
    assert.equal(node1.is_open, true);
    assert.equal(child1.is_open, true);
});
function test_open_node_with_callback(slide, include_slide_param, assert) {
    // setup
    var $tree = $("#tree1");
    $tree.tree({
        data: utils_for_test_1.example_data
    });
    var node2 = $tree.tree("getNodeByName", "node2");
    // open node2
    var done = assert.async();
    function handleOpenNode(node) {
        assert.equal(node.name, "node2");
        assert.ok(node.is_open);
        done();
    }
    if (include_slide_param) {
        $tree.tree("openNode", node2, slide, handleOpenNode);
    }
    else {
        $tree.tree("openNode", node2, handleOpenNode);
    }
}
test("openNode with callback with slide true", function (assert) {
    test_open_node_with_callback(true, true, assert);
});
test("openNode with callback with slide false", function (assert) {
    test_open_node_with_callback(false, true, assert);
});
test("openNode with callback with slide null", function (assert) {
    test_open_node_with_callback(null, true, assert);
});
test("openNode with callback without slide param", function (assert) {
    test_open_node_with_callback(null, false, assert);
});
test("selectNode", function (assert) {
    // setup
    var $tree = $("#tree1");
    $tree.tree({
        data: utils_for_test_1.example_data,
        selectable: true
    });
    var node1 = $tree.tree("getTree").children[0];
    var node2 = $tree.tree("getTree").children[1];
    var child3 = node2.children[0];
    assert.equal(child3.name, "child3");
    assert.equal(node1.is_open, undefined);
    assert.equal(node2.is_open, undefined);
    assert.equal(child3.is_open, undefined);
    // -- select node 'child3', which is a child of 'node2'; must_open_parents = true
    $tree.tree("selectNode", child3, true);
    assert.equal($tree.tree("getSelectedNode").name, "child3");
    assert.equal(node1.is_open, undefined);
    assert.equal(node2.is_open, true);
    assert.equal(child3.is_open, undefined);
    // -- select node 'node1'
    $tree.tree("selectNode", node1);
    assert.equal($tree.tree("getSelectedNode").name, "node1");
    // -- is 'node1' selected?
    assert.equal($tree.tree("isNodeSelected", node1), true);
    // -- deselect
    $tree.tree("selectNode", null);
    assert.equal($tree.tree("getSelectedNode"), false);
    // -- is 'node1' selected?
    assert.equal($tree.tree("isNodeSelected", node1), false);
});
test("selectNode when another node is selected", function (assert) {
    // setup
    var $tree = $("#tree1");
    $tree.tree({
        data: utils_for_test_1.example_data,
        selectable: true
    });
    var node1 = $tree.tree("getTree").children[0];
    var node2 = $tree.tree("getTree").children[1];
    // -- select node 'node2'
    $tree.tree("selectNode", node2);
    assert.equal($tree.tree("getSelectedNode").name, "node2");
    // -- setting event
    // -- is node 'node2' named 'deselected_node' in object's attributes?
    var is_select_event_fired = false;
    $tree.on("tree.select", function (e) {
        assert.equal(e.deselected_node, node2);
        is_select_event_fired = true;
    });
    // -- select node 'node1'; node 'node2' is selected before it
    $tree.tree("selectNode", node1);
    assert.equal($tree.tree("getSelectedNode").name, "node1");
    assert.equal($tree.tree("isNodeSelected", node1), true);
    // event was fired
    assert.ok(is_select_event_fired);
});
test("click toggler", function (assert) {
    // setup
    var done = assert.async();
    var $tree = $("#tree1");
    $tree.tree({
        data: utils_for_test_1.example_data,
        selectable: true
    });
    var $title = $tree
        .find("li:eq(0)")
        .find("> .jqtree-element > span.jqtree-title");
    assert.equal($title.text(), "node1");
    var $toggler = $title.prev();
    assert.ok($toggler.is("a.jqtree-toggler.jqtree-closed"));
    $tree.on("tree.open", function (e) {
        // 2. handle 'open' event
        assert.equal(e.node.name, "node1");
        // 3. click toggler again
        $toggler.click();
    });
    $tree.on("tree.close", function (e) {
        assert.equal(e.node.name, "node1");
        done();
    });
    // 1. click toggler of 'node1'
    $toggler.click();
});
test("getNodeById", function (assert) {
    // setup
    var $tree = $("#tree1");
    $tree.tree({
        data: utils_for_test_1.example_data
    });
    var node2 = $tree.tree("getNodeByName", "node2");
    // 1. get 'node2' by id
    assert.equal($tree.tree("getNodeById", 124).name, "node2");
    // 2. get id that does not exist
    assert.equal($tree.tree("getNodeById", 333), null);
    // 3. get id by string
    assert.equal($tree.tree("getNodeById", "124").name, "node2");
    // 4. add node with string id; search by int
    $tree.tree("appendNode", {
        label: "abc",
        id: "234"
    });
    assert.equal($tree.tree("getNodeById", 234).name, "abc");
    assert.equal($tree.tree("getNodeById", "234").name, "abc");
    // 5. load subtree in node2
    var subtree_data = [
        {
            label: "sub1",
            id: 200,
            children: [{ label: "sub2", id: 201 }]
        }
    ];
    $tree.tree("loadData", subtree_data, node2);
    var t = $tree.tree("getTree");
    assert.notEqual(t, null);
    assert.equal($tree.tree("getNodeById", 200).name, "sub1");
    assert.equal($tree.tree("getNodeById", 201).name, "sub2");
});
test("autoOpen", function (assert) {
    var $tree = $("#tree1");
    function formatOpenFolders() {
        var open_nodes = [];
        $tree.find("li").each(
        // tslint:disable-next-line: only-arrow-functions
        function () {
            var $li = $(this);
            if ($li.is(".jqtree-folder") && !$li.is(".jqtree-closed")) {
                var label = $li
                    .children(".jqtree-element")
                    .find("span")
                    .text();
                open_nodes.push(label);
            }
        });
        return open_nodes.join(";");
    }
    /*
    -l1n1 (level 0)
    ----l2n1 (1)
    ----l2n2 (1)
    -------l3n1 (2)
    ----------l4n1 (3)
    -l1n2
    */
    var data = [
        {
            label: "l1n1",
            children: [
                "l2n1",
                {
                    label: "l2n2",
                    children: [
                        {
                            label: "l3n1",
                            children: ["l4n1"]
                        }
                    ]
                }
            ]
        },
        "l1n2"
    ];
    // 1. autoOpen is false
    $tree.tree({
        data: data,
        autoOpen: false
    });
    assert.equal(formatOpenFolders(), "");
    $tree.tree("destroy");
    // 2. autoOpen is true
    $tree.tree({
        data: data,
        autoOpen: true
    });
    assert.equal(formatOpenFolders(), "l1n1;l2n2;l3n1");
    $tree.tree("destroy");
    // 3. autoOpen level 1
    $tree.tree({
        data: data,
        autoOpen: 1
    });
    assert.equal(formatOpenFolders(), "l1n1;l2n2");
});
test("onCreateLi", function (assert) {
    // 1. init tree with onCreateLi
    var $tree = $("#tree1");
    $tree.tree({
        data: utils_for_test_1.example_data,
        onCreateLi: function (node, $li) {
            var $span = $li.children(".jqtree-element").find("span");
            $span.html("_" + node.name + "_");
        }
    });
    assert.equal($tree.find("span:eq(0)").text(), "_node1_");
});
test("save state", function (assert) {
    // Remove state from localstorage
    if (typeof localStorage !== "undefined") {
        localStorage.setItem("my_tree", "");
    }
    // 1. init tree
    var $tree = $("#tree1");
    $tree.tree({
        data: utils_for_test_1.example_data,
        selectable: true,
        saveState: "my_tree"
    });
    var tree = $tree.tree("getTree");
    assert.equal($tree.tree("getSelectedNode"), false);
    // 2. select node -> state is saved
    $tree.tree("selectNode", tree.children[0]);
    assert.equal($tree.tree("getSelectedNode").name, "node1");
    // 3. init tree again
    $tree.tree("destroy");
    $tree.tree({
        data: utils_for_test_1.example_data,
        selectable: true,
        saveState: "my_tree"
    });
    assert.equal($tree.tree("getSelectedNode").name, "node1");
});
test("generate hit areas", function (assert) {
    // setup
    var $tree = $("#tree1");
    $tree.tree({
        data: utils_for_test_1.example_data
    });
    // 1. get hit areas
    var node = $tree.tree("getNodeById", 123);
    var hit_areas = $tree.tree("testGenerateHitAreas", node);
    var strings = $.map(hit_areas, function (hit_area) {
        var position_name = node_1.getPositionName(hit_area.position);
        return hit_area.node.name + " " + position_name;
    });
    assert.equal(strings.join(";"), "node1 none;node2 inside;node2 after");
});
test("removeNode", function (assert) {
    // setup
    var $tree = $("#tree1");
    $tree.tree({
        data: utils_for_test_1.example_data,
        selectable: true
    });
    // 1. Remove selected node; node is 'child1'
    var child1 = $tree.tree("getNodeByName", "child1");
    $tree.tree("selectNode", child1);
    assert.equal($tree.tree("getSelectedNode").name, "child1");
    $tree.tree("removeNode", child1);
    assert.equal(utils_for_test_1.formatTitles($tree), "node1 child2 node2 child3");
    // getSelectedNode must now return false
    assert.equal($tree.tree("getSelectedNode"), false);
    // 2. No node is selected; remove child3
    $tree.tree("loadData", utils_for_test_1.example_data);
    var child3 = $tree.tree("getNodeByName", "child3");
    $tree.tree("removeNode", child3);
    assert.equal(utils_for_test_1.formatTitles($tree), "node1 child1 child2 node2");
    assert.equal($tree.tree("getSelectedNode"), false);
    // 3. Remove parent of selected node
    $tree.tree("loadData", utils_for_test_1.example_data);
    var child1a = $tree.tree("getNodeByName", "child1");
    var node1 = $tree.tree("getNodeByName", "node1");
    $tree.tree("selectNode", child1a);
    $tree.tree("removeNode", node1);
    // node is unselected
    assert.equal($tree.tree("getSelectedNode"), false);
    // 4. Remove unselected node without an id
    $tree.tree("loadData", utils_for_test_1.example_data2);
    var c1 = $tree.tree("getNodeByName", "c1");
    $tree.tree("removeNode", c1);
    assert.equal(utils_for_test_1.formatTitles($tree), "main c2");
});
test("appendNode", function (assert) {
    // setup
    var $tree = $("#tree1");
    $tree.tree({
        data: utils_for_test_1.example_data
    });
    var node1 = $tree.tree("getNodeByName", "node1");
    // 1. Add child3 to node1
    $tree.tree("appendNode", "child3", node1);
    assert.equal(utils_for_test_1.formatTitles($(node1.element)), "node1 child1 child2 child3");
    // 2. Add child4 to child1
    var child1 = $tree.tree("getNodeByName", "child1");
    // Node 'child1' does not have a toggler button
    assert.equal($(child1.element).find("> .jqtree-element > .jqtree-toggler").length, 0);
    $tree.tree("appendNode", "child4", child1);
    assert.equal(utils_for_test_1.formatTitles($(child1.element)), "child1 child4");
    // Node 'child1' must get a toggler button
    assert.equal($(child1.element).find("> .jqtree-element > .jqtree-toggler").length, 1);
});
test("prependNode", function (assert) {
    // setup
    var $tree = $("#tree1");
    $tree.tree({
        data: utils_for_test_1.example_data
    });
    var node1 = $tree.tree("getNodeByName", "node1");
    // 1. Prepend child0 to node1
    $tree.tree("prependNode", "child0", node1);
    assert.equal(utils_for_test_1.formatTitles($(node1.element)), "node1 child0 child1 child2");
});
test("init event for local data", function (assert) {
    // setup
    var done = assert.async();
    var $tree = $("#tree1");
    $tree.on("tree.init", function () {
        // Check that we can call functions in 'tree.init' event
        assert.equal($tree.tree("getNodeByName", "node2").name, "node2");
        done();
    });
    // init tree
    $tree.tree({
        data: utils_for_test_1.example_data
    });
});
test("init event for ajax", function (assert) {
    // setup
    var done = assert.async();
    var $tree = $("#tree1");
    $.mockjax({
        url: "/tree/",
        responseText: utils_for_test_1.example_data,
        logging: false
    });
    $tree.on("tree.init", function () {
        assert.equal($tree.tree("getNodeByName", "node2").name, "node2");
        done();
    });
    // init tree
    $tree.tree({
        dataUrl: "/tree/"
    });
});
test("updateNode", function (assert) {
    // setup
    var $tree = $("#tree1");
    $tree.tree({ data: utils_for_test_1.example_data });
    assert.equal(utils_for_test_1.formatTitles($tree), "node1 child1 child2 node2 child3");
    // -- update label
    var node2 = $tree.tree("getNodeByName", "node2");
    $tree.tree("updateNode", node2, "CHANGED");
    assert.equal(utils_for_test_1.formatTitles($tree), "node1 child1 child2 CHANGED child3");
    assert.equal(node2.name, "CHANGED");
    // -- update data
    $tree.tree("updateNode", node2, {
        name: "xyz",
        tag1: "abc"
    });
    assert.equal(utils_for_test_1.formatTitles($tree), "node1 child1 child2 xyz child3");
    assert.equal(node2.name, "xyz");
    assert.equal(node2.tag1, "abc");
    // - update id
    assert.equal(node2.id, 124);
    $tree.tree("updateNode", node2, { id: 555 });
    assert.equal(node2.id, 555);
    assert.equal(node2.name, "xyz");
    // get node by id
    var node_555 = $tree.tree("getNodeById", 555);
    assert.equal(node_555.name, "xyz");
    var node_124 = $tree.tree("getNodeById", 124);
    assert.equal(node_124, undefined);
    // update child1
    var child1 = $tree.tree("getNodeByName", "child1");
    $tree.tree("updateNode", child1, "child1a");
    assert.equal(utils_for_test_1.formatTitles($tree), "node1 child1a child2 xyz child3");
    // select child1
    $tree.tree("selectNode", child1);
    $tree.tree("updateNode", child1, "child1b");
    assert.ok($(child1.element).hasClass("jqtree-selected"));
    // add children to child1
    $tree.tree("updateNode", child1, {
        id: child1.id,
        name: "child1",
        children: [{ id: 5, name: "child1-1" }]
    });
    assert.equal(utils_for_test_1.formatTitles($tree), "node1 child1 child1-1 child2 xyz child3");
    // remove children
    $tree.tree("updateNode", child1, {
        id: child1.id,
        name: "child1",
        children: []
    });
    assert.equal(utils_for_test_1.formatTitles($tree), "node1 child1 child2 xyz child3");
});
test("moveNode", function (assert) {
    // setup
    var $tree = $("#tree1");
    $tree.tree({ data: utils_for_test_1.example_data });
    var child1 = $tree.tree("getNodeByName", "child1");
    var child2 = $tree.tree("getNodeByName", "child2");
    var node1 = $tree.tree("getNodeByName", "node1");
    var node2 = $tree.tree("getNodeByName", "node2");
    // -- Move child1 after node2
    $tree.tree("moveNode", child1, node2, "after");
    assert.equal(utils_for_test_1.formatTitles($tree), "node1 child2 node2 child3 child1");
    // -- Check that illegal moves are skipped
    $tree.tree("moveNode", node1, child2, "inside");
});
test("load on demand", function (assert) {
    // setup
    var done = assert.async();
    var $tree = $("#tree1");
    $tree.tree({
        data: [
            {
                id: 1,
                label: "node1",
                load_on_demand: true
            }
        ],
        dataUrl: "/tree/"
    });
    // tslint:disable-next-line: only-arrow-functions
    function handleResponse(options) {
        assert.equal(options.url, "/tree/", "2");
        assert.deepEqual(options.data, { node: 1 }, "3");
        this.responseText = [
            {
                id: 2,
                label: "child1"
            }
        ];
    }
    $.mockjax({
        url: "*",
        response: handleResponse,
        logging: false
    });
    // -- open node
    function handleOpenNode(node) {
        assert.equal(node.name, "node1");
        assert.equal(utils_for_test_1.formatTitles($tree), "node1 child1", "4");
        done();
    }
    var node1 = $tree.tree("getNodeByName", "node1");
    assert.equal(utils_for_test_1.formatTitles($tree), "node1", "1");
    $tree.tree("openNode", node1, handleOpenNode);
});
test("addNodeAfter", function (assert) {
    // setup
    var $tree = $("#tree1");
    $tree.tree({ data: utils_for_test_1.example_data });
    var node1 = $tree.tree("getNodeByName", "node1");
    // -- add node after node1
    $tree.tree("addNodeAfter", "node3", node1);
    assert.equal(utils_for_test_1.formatTitles($tree), "node1 child1 child2 node3 node2 child3");
});
test("addNodeBefore", function (assert) {
    // setup
    var $tree = $("#tree1");
    $tree.tree({ data: utils_for_test_1.example_data });
    var node1 = $tree.tree("getNodeByName", "node1");
    // -- add node before node1
    $tree.tree("addNodeBefore", "node3", node1);
    assert.equal(utils_for_test_1.formatTitles($tree), "node3 node1 child1 child2 node2 child3");
});
test("addParentNode", function (assert) {
    // setup
    var $tree = $("#tree1");
    $tree.tree({ data: utils_for_test_1.example_data });
    var child3 = $tree.tree("getNodeByName", "child3");
    // -- add parent to child3
    $tree.tree("addParentNode", "node3", child3);
    assert.equal(utils_for_test_1.formatTitles($tree), "node1 child1 child2 node2 node3 child3");
});
test("mouse events", function (assert) {
    // setup
    var $tree = $("#tree1");
    $tree.tree({
        data: utils_for_test_1.example_data,
        dragAndDrop: true,
        autoOpen: true
    });
    $tree.tree("setMouseDelay", 0);
    function getTitleElement(node_name) {
        var node = $tree.tree("getNodeByName", node_name);
        var $el = $(node.element);
        return $($el.find(".jqtree-title"));
    }
    var $node1 = getTitleElement("node1");
    var $child3 = getTitleElement("child3");
    // -- Move node1 inside child3
    // 1: trigger mousedown event on node1
    $node1.trigger($.Event("mousedown", { which: 1 }));
    // 2: trigger mouse move to child3
    var child3_offset = $child3.offset();
    $tree.trigger($.Event("mousemove", {
        pageX: child3_offset ? child3_offset.left : 0,
        pageY: child3_offset ? child3_offset.top : 0
    }));
    $tree.trigger("mouseup");
    assert.equal(utils_for_test_1.formatTitles($tree), "node2 child3 node1 child1 child2");
});
test("multiple select", function (assert) {
    // setup
    var $tree = $("#tree1");
    $tree.tree({ data: utils_for_test_1.example_data });
    var child1 = $tree.tree("getNodeByName", "child1");
    var child2 = $tree.tree("getNodeByName", "child2");
    // -- add nodes to selection
    // todo: more nodes as parameters?
    // todo: rename to 'selection.add' or 'selection' 'add'?
    $tree.tree("addToSelection", child1);
    $tree.tree("addToSelection", child2);
    // -- get selected nodes
    var selected_nodes = $tree.tree("getSelectedNodes");
    assert.equal(utils_for_test_1.formatNodes(selected_nodes), "child1 child2");
});
test("keyboard", function (assert) {
    // setup
    var $tree = $("#tree1");
    function keyDown(key) {
        $tree.trigger($.Event("keydown", { which: key }));
    }
    $tree.tree({ data: utils_for_test_1.example_data });
    var node1 = $tree.tree("getNodeByName", "node1");
    // select node1
    $tree.tree("selectNode", node1);
    assert.equal(node1.is_open, undefined);
    // - move down; -> node2
    keyDown(40);
    assert.equal($tree.tree("getSelectedNode").name, "node2");
    // - move up; -> back to node1
    keyDown(38);
    assert.equal($tree.tree("getSelectedNode").name, "node1");
    // - move right; open node1
    keyDown(39);
    assert.equal(node1.is_open, true);
    assert.equal($tree.tree("getSelectedNode").name, "node1");
    // - down -> child1
    keyDown(40);
    assert.equal($tree.tree("getSelectedNode").name, "child1");
    // - up -> node1
    keyDown(38);
    assert.equal($tree.tree("getSelectedNode").name, "node1");
    // - left ->  close
    keyDown(37);
    assert.equal(node1.is_open, false);
    assert.equal($tree.tree("getSelectedNode").name, "node1");
});
test("getNodesByProperty", function (assert) {
    // setup
    var $tree = $("#tree1");
    $tree.tree({
        data: utils_for_test_1.example_data
    });
    var node2 = $tree.tree("getNodeByName", "node2");
    // 1. get 'node1' by property
    assert.equal($tree.tree("getNodesByProperty", "int_property", 1)[0].name, "node1");
    // 2. get property that does not exist in any node
    assert.equal($tree.tree("getNodesByProperty", "int_property", 123).length, 0);
    // 3. get string property
    assert.equal($tree.tree("getNodesByProperty", "str_property", "1")[0].name, "node1");
    // 4. add node with string id; search by int
    $tree.tree("appendNode", {
        label: "abc",
        id: "234",
        str_property: "111",
        int_property: 111
    });
    assert.equal($tree.tree("getNodesByProperty", "int_property", 111)[0].name, "abc");
    assert.equal($tree.tree("getNodesByProperty", "str_property", "111")[0].name, "abc");
    // 5. load subtree in node2
    var subtree_data = [
        {
            label: "sub1",
            id: 200,
            int_property: 222,
            children: [{ label: "sub2", id: 201, int_property: 444 }]
        }
    ];
    $tree.tree("loadData", subtree_data, node2);
    var t = $tree.tree("getTree");
    assert.notEqual(t, null);
    assert.equal($tree.tree("getNodesByProperty", "int_property", 222)[0].name, "sub1");
    assert.equal($tree.tree("getNodesByProperty", "int_property", 444)[0].name, "sub2");
});
test("dataUrl extra options", function (assert) {
    var done = assert.async();
    var $tree = $("#tree1");
    $.mockjax({
        url: "*",
        response: function (options) {
            // 2. handle ajax request
            // expect 'headers' option
            assert.equal(options.url, "/tree2/");
            assert.deepEqual(options.headers, { abc: "def" });
            done();
        },
        logging: false
    });
    // 1. init tree
    // dataUrl contains 'headers' option
    $tree.tree({
        dataUrl: {
            url: "/tree2/",
            headers: { abc: "def" }
        }
    });
});
test("dataUrl is function", function (assert) {
    var done = assert.async();
    var $tree = $("#tree1");
    $.mockjax({
        url: "*",
        response: function (options) {
            // 2. handle ajax request
            // expect 'headers' option
            assert.equal(options.url, "/tree3/");
            assert.deepEqual(options.headers, { abc: "def" });
            done();
        },
        logging: false
    });
    // 1. init tree
    // dataUrl is a function
    $tree.tree({
        dataUrl: function () {
            return {
                url: "/tree3/",
                headers: { abc: "def" }
            };
        }
    });
});
test("getNodeByHtmlElement", function (assert) {
    var $tree = $("#tree1");
    $tree.tree({
        data: utils_for_test_1.example_data
    });
    var $el = $(".jqtree-title");
    // Get node for jquery element
    var node = $tree.tree("getNodeByHtmlElement", $el);
    assert.equal(node.name, "node1");
    // Same for html element
    var node2 = $tree.tree("getNodeByHtmlElement", $el[0]);
    assert.equal(node2.name, "node1");
});
test("onLoadFailed", function (assert) {
    $.mockjax({
        url: "/tree/",
        status: 500,
        responseText: "test error",
        logging: false
    });
    var done = assert.async();
    function handleLoadFailed(e) {
        assert.equal(e.responseText, "test error");
        done();
    }
    var $tree = $("#tree1");
    $tree.tree({
        dataUrl: "/tree/",
        onLoadFailed: handleLoadFailed
    });
});


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;


/***/ })
/******/ ]);