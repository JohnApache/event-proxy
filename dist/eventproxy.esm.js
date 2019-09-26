class EventPool {
    constructor() {
        this._event_cb_pool = {};
    }
    addEvent(eventName, event) {
        if (!this._event_cb_pool[eventName]) {
            this._event_cb_pool[eventName] = [];
        }
        this._event_cb_pool[eventName].push(event);
    }
    addUnionEvent(eventNames, event) {
        eventNames.forEach(evn => {
            this.addEvent(evn, event);
        });
    }
    removeEvent(eventName, event) {
        const pool = this._event_cb_pool[eventName];
        if (!pool)
            return;
        const filterPool = pool.filter(ev => ev !== event);
        this._event_cb_pool[eventName] = filterPool;
        if (filterPool.length === 0) {
            delete this._event_cb_pool[eventName];
        }
    }
    removeUnionEvent(eventNames, event) {
        eventNames.forEach(evn => {
            this.removeEvent(evn, event);
        });
    }
    emitEvent(eventName, data) {
        const pool = this._event_cb_pool[eventName];
        pool && pool.forEach(ev => ev.emitEvent(eventName, data));
    }
}

class UnionEvent {
    constructor(eventNames, callback) {
        this._union_event_data_pool = {};
        this._union_event = [];
        eventNames.forEach(v => {
            this._union_event_data_pool[v] = [];
        });
        this._union_event = eventNames;
        this._cb = callback;
    }
    emitEvent(eventName, data) {
        const pool = this._union_event_data_pool[eventName];
        pool && pool.push(data);
        this.checkEventDataReady() && this.execEventCallback();
    }
    checkEventDataReady() {
        return this._union_event.every(v => {
            return this._union_event_data_pool[v].length > 0;
        });
    }
    execEventCallback() {
        const callbackData = [];
        this._union_event.forEach(v => {
            callbackData.push(this._union_event_data_pool[v].pop());
        });
        this._cb(...callbackData);
    }
}
class UnitEvent extends UnionEvent {
    constructor(eventName, callback) {
        super([eventName], callback);
    }
}

const uniqueArray = (sourceArray) => {
    const uniqueArray = [];
    sourceArray.forEach(v => {
        if (uniqueArray.indexOf(v) === -1) {
            uniqueArray.push(v);
        }
    });
    return uniqueArray;
};

class EventProxy extends EventPool {
    static create() {
        return new EventProxy();
    }
    /**
    * 绑定事件
    * @param {EventName | EventName[]} event
    * @param {EventCallback} callback
    * @returns {UnRegister}
    */
    register(eventName, callback) {
        if (eventName.length <= 0)
            throw new Error("EventName cannot be empty!");
        if (typeof eventName === "string") {
            const ev = new UnitEvent(eventName, callback);
            this.addEvent(eventName, ev);
            return this.removeEvent.bind(this, eventName, ev);
        }
        eventName = uniqueArray(eventName);
        const uev = new UnionEvent(eventName, callback);
        this.addUnionEvent(eventName, uev);
        return this.removeUnionEvent.bind(this, eventName, uev);
    }
    on(eventName, callback) {
        return this.register(eventName, callback);
    }
    bind(eventName, callback) {
        return this.register(eventName, callback);
    }
    subscribe(eventName, callback) {
        return this.register(eventName, callback);
    }
    /**
     * 绑定单次事件
     * @param {EventName | EventName[]} event
     * @param {EventCallback} callback
     * @returns {UnRegister}
     */
    once(eventName, callback) {
        const ug = this.register(eventName, (...data) => {
            callback(...data);
            ug();
        });
        return ug;
    }
    /**
     * 绑定N次事件
     * @param {EventName | EventName[]} event
     * @param {number} bindTime // 绑定事件次数
     * @param {EventCallback} callback
     * @returns {UnRegister}
     */
    bindNTime(eventName, bindTime, callback) {
        if (bindTime <= 0)
            throw new Error("bindTime can't less than 1");
        let emitCount = 0;
        const ug = this.register(eventName, (...data) => {
            emitCount++;
            callback(...data);
            (emitCount >= bindTime) && ug();
        });
        return ug;
    }
    /**
     * 绑定等待事件
     * @param {EventName | EventName[]} event
     * @param {number} waitCount // 等待次数
     * @param {EventCallback} callback
     * @returns {UnRegister}
     */
    wait(eventName, waitCount, callback) {
        if (waitCount <= 0)
            throw new Error("waitCount can't less than 1");
        let waitQueue = [];
        const ug = this.register(eventName, (...data) => {
            if (waitQueue.push(data) < waitCount)
                return;
            callback(...waitQueue);
            waitQueue = [];
        });
        return ug;
    }
    /**
     * 主动触发事件
     * @param {EventName} event
     * @param {any | undefined} data  //传递给回调函数的data
     * @returns {void}
     */
    emit(eventName, data) {
        this.emitEvent(eventName, data);
    }
    done(eventName, data) {
        this.emit(eventName, data);
    }
}

export default EventProxy;
