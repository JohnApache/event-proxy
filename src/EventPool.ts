import { EventName } from "./type";
import { UnionEvent, UnitEvent } from "./Event";

interface EventCallbackPool {
	[key: string]: UnionEvent[];
}

class EventPool {
	private _event_cb_pool: EventCallbackPool = {};

	protected addEvent(eventName: EventName, event: UnitEvent): void {
		if (!this._event_cb_pool[eventName]) {
			this._event_cb_pool[eventName] = [];
		}
		this._event_cb_pool[eventName].push(event);
	}

	protected addUnionEvent(eventNames: EventName[], event: UnionEvent): void {
		eventNames.forEach(evn => {
			this.addEvent(evn, event);
        });
	}

	protected removeEvent(eventName: EventName, event: UnitEvent): void {
		const pool = this._event_cb_pool[eventName];
		if (!pool) return;
		const filterPool = pool.filter(ev => ev !== event);
		this._event_cb_pool[eventName] = filterPool;
		if (filterPool.length === 0) {
			delete this._event_cb_pool[eventName];
		}
	}

	protected removeUnionEvent(eventNames: EventName[], event: UnionEvent): void {
		eventNames.forEach(evn => {
			this.removeEvent(evn, event);
		});
	}

	protected emitEvent(eventName: EventName, data: any): void {
        const pool = this._event_cb_pool[eventName];
        pool && pool.forEach(ev => ev.emitEvent(eventName, data));
    }
    
}

export default EventPool;
