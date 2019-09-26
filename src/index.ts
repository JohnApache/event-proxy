import EventPool from "./EventPool";
import { EventName, EventCallback } from "./type";
import { UnitEvent, UnionEvent } from "./Event";
import { uniqueArray } from './util';

type UnRegister = () => void;

class EventProxy extends EventPool {
	static create(): EventProxy {
		return new EventProxy();
	}

     /**
	 * 绑定事件
	 * @param {EventName | EventName[]} event
	 * @param {EventCallback} callback 
     * @returns {UnRegister}
	 */
	register(eventName: EventName | EventName[], callback: EventCallback): UnRegister {
		if (eventName.length <= 0) throw new Error("EventName cannot be empty!");
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
    
	on(eventName: EventName | EventName[], callback: EventCallback): UnRegister {
        return this.register(eventName, callback);
    }

    bind(eventName: EventName | EventName[], callback: EventCallback): UnRegister {
        return this.register(eventName, callback);
    }

    subscribe(eventName: EventName | EventName[], callback: EventCallback): UnRegister {
        return this.register(eventName, callback);
    }
    
    /**
	 * 绑定单次事件
	 * @param {EventName | EventName[]} event
	 * @param {EventCallback} callback 
     * @returns {UnRegister}
	 */
    once(eventName: EventName | EventName[], callback: EventCallback): UnRegister {
        const ug = this.register(eventName, (...data) => {
            callback(...data); ug();
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
    bindNTime(eventName: EventName | EventName[], bindTime: number, callback: EventCallback): UnRegister {
        if(bindTime <= 0) throw new Error("bindTime can't less than 1");
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
    wait(eventName: EventName | EventName[], waitCount: number, callback: EventCallback): UnRegister {
        if(waitCount <= 0) throw new Error("waitCount can't less than 1");
        let waitQueue: any[] = [];
        const ug = this.register(eventName, (...data) => {
            if(waitQueue.push(data) < waitCount) return;
            callback(...waitQueue); waitQueue = [];
        });
        return ug;
    }

    /**
	 * 主动触发事件
	 * @param {EventName} event
	 * @param {any | undefined} data  //传递给回调函数的data
     * @returns {void}
	 */
	emit(eventName: EventName, data?: any): void {
		this.emitEvent(eventName, data);
    }
    
    done(eventName: EventName, data?: any): void {
		this.emit(eventName, data);
    }

}

export default EventProxy;
