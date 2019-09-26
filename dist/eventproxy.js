(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.EventProxy = factory());
}(this, function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var EventPool = /** @class */ (function () {
        function EventPool() {
            this._event_cb_pool = {};
        }
        EventPool.prototype.addEvent = function (eventName, event) {
            if (!this._event_cb_pool[eventName]) {
                this._event_cb_pool[eventName] = [];
            }
            this._event_cb_pool[eventName].push(event);
        };
        EventPool.prototype.addUnionEvent = function (eventNames, event) {
            var _this = this;
            eventNames.forEach(function (evn) {
                _this.addEvent(evn, event);
            });
        };
        EventPool.prototype.removeEvent = function (eventName, event) {
            var pool = this._event_cb_pool[eventName];
            if (!pool)
                return;
            var filterPool = pool.filter(function (ev) { return ev !== event; });
            this._event_cb_pool[eventName] = filterPool;
            if (filterPool.length === 0) {
                delete this._event_cb_pool[eventName];
            }
        };
        EventPool.prototype.removeUnionEvent = function (eventNames, event) {
            var _this = this;
            eventNames.forEach(function (evn) {
                _this.removeEvent(evn, event);
            });
        };
        EventPool.prototype.emitEvent = function (eventName, data) {
            var pool = this._event_cb_pool[eventName];
            pool && pool.forEach(function (ev) { return ev.emitEvent(eventName, data); });
        };
        return EventPool;
    }());

    var UnionEvent = /** @class */ (function () {
        function UnionEvent(eventNames, callback) {
            var _this = this;
            this._union_event_data_pool = {};
            this._union_event = [];
            eventNames.forEach(function (v) {
                _this._union_event_data_pool[v] = [];
            });
            this._union_event = eventNames;
            this._cb = callback;
        }
        UnionEvent.prototype.emitEvent = function (eventName, data) {
            var pool = this._union_event_data_pool[eventName];
            pool && pool.push(data);
            this.checkEventDataReady() && this.execEventCallback();
        };
        UnionEvent.prototype.checkEventDataReady = function () {
            var _this = this;
            return this._union_event.every(function (v) {
                return _this._union_event_data_pool[v].length > 0;
            });
        };
        UnionEvent.prototype.execEventCallback = function () {
            var _this = this;
            var callbackData = [];
            this._union_event.forEach(function (v) {
                callbackData.push(_this._union_event_data_pool[v].pop());
            });
            this._cb.apply(this, callbackData);
        };
        return UnionEvent;
    }());
    var UnitEvent = /** @class */ (function (_super) {
        __extends(UnitEvent, _super);
        function UnitEvent(eventName, callback) {
            return _super.call(this, [eventName], callback) || this;
        }
        return UnitEvent;
    }(UnionEvent));

    var uniqueArray = function (sourceArray) {
        var uniqueArray = [];
        sourceArray.forEach(function (v) {
            if (uniqueArray.indexOf(v) === -1) {
                uniqueArray.push(v);
            }
        });
        return uniqueArray;
    };

    var EventProxy = /** @class */ (function (_super) {
        __extends(EventProxy, _super);
        function EventProxy() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        EventProxy.create = function () {
            return new EventProxy();
        };
        /**
        * 绑定事件
        * @param {EventName | EventName[]} event
        * @param {EventCallback} callback
        * @returns {UnRegister}
        */
        EventProxy.prototype.register = function (eventName, callback) {
            if (eventName.length <= 0)
                throw new Error("EventName cannot be empty!");
            if (typeof eventName === "string") {
                var ev = new UnitEvent(eventName, callback);
                this.addEvent(eventName, ev);
                return this.removeEvent.bind(this, eventName, ev);
            }
            eventName = uniqueArray(eventName);
            var uev = new UnionEvent(eventName, callback);
            this.addUnionEvent(eventName, uev);
            return this.removeUnionEvent.bind(this, eventName, uev);
        };
        EventProxy.prototype.on = function (eventName, callback) {
            return this.register(eventName, callback);
        };
        EventProxy.prototype.bind = function (eventName, callback) {
            return this.register(eventName, callback);
        };
        EventProxy.prototype.subscribe = function (eventName, callback) {
            return this.register(eventName, callback);
        };
        /**
         * 绑定单次事件
         * @param {EventName | EventName[]} event
         * @param {EventCallback} callback
         * @returns {UnRegister}
         */
        EventProxy.prototype.once = function (eventName, callback) {
            var ug = this.register(eventName, function () {
                var data = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    data[_i] = arguments[_i];
                }
                callback.apply(void 0, data);
                ug();
            });
            return ug;
        };
        /**
         * 绑定N次事件
         * @param {EventName | EventName[]} event
         * @param {number} bindTime // 绑定事件次数
         * @param {EventCallback} callback
         * @returns {UnRegister}
         */
        EventProxy.prototype.bindNTime = function (eventName, bindTime, callback) {
            if (bindTime <= 0)
                throw new Error("bindTime can't less than 1");
            var emitCount = 0;
            var ug = this.register(eventName, function () {
                var data = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    data[_i] = arguments[_i];
                }
                emitCount++;
                callback.apply(void 0, data);
                (emitCount >= bindTime) && ug();
            });
            return ug;
        };
        /**
         * 绑定等待事件
         * @param {EventName | EventName[]} event
         * @param {number} waitCount // 等待次数
         * @param {EventCallback} callback
         * @returns {UnRegister}
         */
        EventProxy.prototype.wait = function (eventName, waitCount, callback) {
            if (waitCount <= 0)
                throw new Error("waitCount can't less than 1");
            var waitQueue = [];
            var ug = this.register(eventName, function () {
                var data = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    data[_i] = arguments[_i];
                }
                if (waitQueue.push(data) < waitCount)
                    return;
                callback.apply(void 0, waitQueue);
                waitQueue = [];
            });
            return ug;
        };
        /**
         * 主动触发事件
         * @param {EventName} event
         * @param {any | undefined} data  //传递给回调函数的data
         * @returns {void}
         */
        EventProxy.prototype.emit = function (eventName, data) {
            this.emitEvent(eventName, data);
        };
        EventProxy.prototype.done = function (eventName, data) {
            this.emit(eventName, data);
        };
        return EventProxy;
    }(EventPool));

    return EventProxy;

}));
