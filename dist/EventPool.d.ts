import { EventName } from "./type";
import { UnionEvent, UnitEvent } from "./Event";
declare class EventPool {
    private _event_cb_pool;
    protected addEvent(eventName: EventName, event: UnitEvent): void;
    protected addUnionEvent(eventNames: EventName[], event: UnionEvent): void;
    protected removeEvent(eventName: EventName, event: UnitEvent): void;
    protected removeUnionEvent(eventNames: EventName[], event: UnionEvent): void;
    protected emitEvent(eventName: EventName, data: any): void;
}
export default EventPool;
