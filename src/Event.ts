import { EventName, EventCallback } from "./type";


interface UnionEventDataPool {
    [key: string]: any[]
}

export class UnionEvent {
    private _union_event_data_pool: UnionEventDataPool = {};
    public _union_event: EventName[] = [];
    private _cb: EventCallback;
    constructor(eventNames: EventName[], callback: EventCallback) {
        eventNames.forEach(v => {
            this._union_event_data_pool[v] = []
        })
        this._union_event = eventNames;
        this._cb = callback;
    }   
    
    emitEvent(eventName: EventName, data: any): void {
        const pool = this._union_event_data_pool[eventName];
        pool && pool.push(data);
        this.checkEventDataReady() && this.execEventCallback();
    }
    
    checkEventDataReady(): boolean {
        return this._union_event.every(v => {
            return this._union_event_data_pool[v].length > 0;
        })
    }

    private execEventCallback(): void {
        const callbackData:any[] = [];
        this._union_event.forEach(v => {
            callbackData.push(this._union_event_data_pool[v].pop())
        });
        this._cb(...callbackData);
    }
}

export class UnitEvent extends UnionEvent {
    constructor(eventName: EventName, callback: EventCallback) {
        super([eventName], callback);
    }
}