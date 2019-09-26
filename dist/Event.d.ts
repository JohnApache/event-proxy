import { EventName, EventCallback } from "./type";
export declare class UnionEvent {
    private _union_event_data_pool;
    _union_event: EventName[];
    private _cb;
    constructor(eventNames: EventName[], callback: EventCallback);
    emitEvent(eventName: EventName, data: any): void;
    checkEventDataReady(): boolean;
    private execEventCallback;
}
export declare class UnitEvent extends UnionEvent {
    constructor(eventName: EventName, callback: EventCallback);
}
