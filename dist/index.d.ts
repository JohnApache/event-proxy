import EventPool from "./EventPool";
import { EventName, EventCallback } from "./type";
declare type UnRegister = () => void;
declare class EventProxy extends EventPool {
    static create(): EventProxy;
    /**
    * 绑定事件
    * @param {EventName | EventName[]} event
    * @param {EventCallback} callback
    * @returns {UnRegister}
    */
    register(eventName: EventName | EventName[], callback: EventCallback): UnRegister;
    on(eventName: EventName | EventName[], callback: EventCallback): UnRegister;
    bind(eventName: EventName | EventName[], callback: EventCallback): UnRegister;
    subscribe(eventName: EventName | EventName[], callback: EventCallback): UnRegister;
    /**
     * 绑定单次事件
     * @param {EventName | EventName[]} event
     * @param {EventCallback} callback
     * @returns {UnRegister}
     */
    once(eventName: EventName | EventName[], callback: EventCallback): UnRegister;
    /**
     * 绑定N次事件
     * @param {EventName | EventName[]} event
     * @param {number} bindTime // 绑定事件次数
     * @param {EventCallback} callback
     * @returns {UnRegister}
     */
    bindNTime(eventName: EventName | EventName[], bindTime: number, callback: EventCallback): UnRegister;
    /**
     * 绑定等待事件
     * @param {EventName | EventName[]} event
     * @param {number} waitCount // 等待次数
     * @param {EventCallback} callback
     * @returns {UnRegister}
     */
    wait(eventName: EventName | EventName[], waitCount: number, callback: EventCallback): UnRegister;
    /**
     * 主动触发事件
     * @param {EventName} event
     * @param {any | undefined} data  //传递给回调函数的data
     * @returns {void}
     */
    emit(eventName: EventName, data?: any): void;
    done(eventName: EventName, data?: any): void;
}
export default EventProxy;
