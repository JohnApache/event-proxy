import {expect} from 'chai';
import EventProxy from '../src/index';

describe('eventproxy 方法测试', () => {
    let ep: EventProxy;
    beforeEach(() => {
        ep = new EventProxy();
    })

    it('EventProxy.create静态方法可以返回一个EventProxy实例', () => {
        const ep = EventProxy.create();
        expect(ep instanceof EventProxy).to.be.true;
    })

    it('ep.register 能够注册单个事件', (done) => {
        const emitData = {
            payload: new Date()
        }
        const EVENT_NAME = 'Test'
        ep.register(EVENT_NAME, (data) => {
            expect(data).to.be.equal(emitData);
            done();
        });
        setTimeout(() => {
            ep.emit(EVENT_NAME, emitData)
        }, 100);
    })

    it('ep.register 能够注册联合事件', (done) => {
        const emitData1 = {
            payload: new Date()
        }
        const emitData2 = {
            payload: Math.random()
        }
        const EVENT_NAME_1 = 'Test1';
        const EVENT_NAME_2 = 'Test2';
        ep.register([EVENT_NAME_1, EVENT_NAME_2], (...data) => {
            expect(data).to.be.deep.equal([emitData1, emitData2]);
        });
        setTimeout(() => {
            ep.emit(EVENT_NAME_2, emitData2);
            setTimeout(() => {
                ep.emit(EVENT_NAME_1, emitData1);
                done();
            }, 100)
        }, 100);
    });

    it('ep.once 注册单次事件触发一次后自动卸载', () => {
        let count = 0;
        const EVENT_NAME = 'Test1';
        ep.once(EVENT_NAME, () => {
            count++;
        });
        ep.emit(EVENT_NAME);
        expect(count).to.be.equal(1);
        ep.emit(EVENT_NAME);
        expect(count).to.be.equal(1);
        ep.emit(EVENT_NAME);
        expect(count).to.be.equal(1);
    })

    it('ep.once 注册单事件返回函数是一个卸载函数', () => {
        let count = 0;
        const EVENT_NAME = 'Test1';
        const ug = ep.register(EVENT_NAME, () => {
            count++;
        });
        ep.emit(EVENT_NAME);
        expect(count).to.be.equal(1);
        ep.emit(EVENT_NAME);
        expect(count).to.be.equal(2);
        ug();
        ep.emit(EVENT_NAME);
        expect(count).to.be.equal(2);
        ep.emit(EVENT_NAME);
        expect(count).to.be.equal(2);
    })

    it('ep.once 注册联合事件返回函数也是一个卸载函数', () => {
        let count = 0;
        const EVENT_NAME_1 = 'Test1';
        const EVENT_NAME_2 = 'Test2';
        const ug = ep.register([EVENT_NAME_2, EVENT_NAME_1], () => {
            count++;
        });
        ep.emit(EVENT_NAME_1);
        expect(count).to.be.equal(0);
        ep.emit(EVENT_NAME_2);
        expect(count).to.be.equal(1);
        ep.emit(EVENT_NAME_1);
        expect(count).to.be.equal(1);
        ep.emit(EVENT_NAME_2);
        expect(count).to.be.equal(2);
        ug();
        ep.emit(EVENT_NAME_1);
        expect(count).to.be.equal(2);
        ep.emit(EVENT_NAME_2);
        expect(count).to.be.equal(2);
        ep.emit(EVENT_NAME_1);
        expect(count).to.be.equal(2);
        ep.emit(EVENT_NAME_2);
        expect(count).to.be.equal(2);
    })

    it('ep.once 注册单次事件也可以绑定联合事件', () => {
        let count = 0;
        const EVENT_NAME_1 = 'Test1';
        const EVENT_NAME_2 = 'Test2';
        ep.once([EVENT_NAME_1, EVENT_NAME_2], () => {
            count++;
        });
        ep.emit(EVENT_NAME_1);
        expect(count).to.be.equal(0);
        ep.emit(EVENT_NAME_2);
        expect(count).to.be.equal(1);
        ep.emit(EVENT_NAME_1);
        expect(count).to.be.equal(1);
        ep.emit(EVENT_NAME_2);
        expect(count).to.be.equal(1);
        ep.emit(EVENT_NAME_1);
        expect(count).to.be.equal(1);
        ep.emit(EVENT_NAME_2);
        expect(count).to.be.equal(1);
    })

    it('ep.wait 绑定等待事件 可以等待事件触发指定次数后 一次性输出等待期间所有内容', () => {
        let count = 0;
        const emitData = {
            payload: new Date()
        }
        const EVENT_NAME = 'TEST';
        ep.wait(EVENT_NAME, 3, (...data) => {
            count ++;
            expect(data).to.be.deep.equal([[emitData],[emitData],[emitData]]);
        })

        ep.emit(EVENT_NAME, emitData);
        expect(count).to.be.equal(0);
        ep.emit(EVENT_NAME, emitData);
        expect(count).to.be.equal(0);
        ep.emit(EVENT_NAME, emitData);
        expect(count).to.be.equal(1);

        ep.emit(EVENT_NAME, emitData);
        expect(count).to.be.equal(1);
        ep.emit(EVENT_NAME, emitData);
        expect(count).to.be.equal(1);
        ep.emit(EVENT_NAME, emitData);
        expect(count).to.be.equal(2);
    })

    it('ep.wait 绑定等待事件还可以绑定联合事件触发', () => {
        let count = 0;
        const emitData1 = {
            payload: new Date()
        }
        const emitData2 = {
            payload: Math.random()
        }
        const EVENT_NAME_1 = 'TEST1';
        const EVENT_NAME_2 = 'TEST2';
        ep.wait([EVENT_NAME_1, EVENT_NAME_2], 3, (...data) => {
            count ++;
            expect(data).to.be.deep.equal([[emitData1, emitData2],[emitData1, emitData2],[emitData1, emitData2]]);
        })

        ep.emit(EVENT_NAME_1, emitData1);
        expect(count).to.be.equal(0);
        ep.emit(EVENT_NAME_2, emitData2);
        expect(count).to.be.equal(0);
        ep.emit(EVENT_NAME_1, emitData1);
        expect(count).to.be.equal(0);
        ep.emit(EVENT_NAME_2, emitData2);
        expect(count).to.be.equal(0);
        ep.emit(EVENT_NAME_1, emitData1);
        expect(count).to.be.equal(0);
        ep.emit(EVENT_NAME_2, emitData2);
        expect(count).to.be.equal(1);

        ep.emit(EVENT_NAME_1, emitData1);
        expect(count).to.be.equal(1);
        ep.emit(EVENT_NAME_2, emitData2);
        expect(count).to.be.equal(1);
        ep.emit(EVENT_NAME_1, emitData1);
        expect(count).to.be.equal(1);
        ep.emit(EVENT_NAME_2, emitData2);
        expect(count).to.be.equal(1);
        ep.emit(EVENT_NAME_1, emitData1);
        expect(count).to.be.equal(1);
        ep.emit(EVENT_NAME_2, emitData2);
        expect(count).to.be.equal(2);
    })
    
    it('ep.wait 绑定等待事件返回一个卸载函数', () => {
        let count = 0;
        const emitData = {
            payload: new Date()
        }
        const EVENT_NAME = 'TEST';
        const ug = ep.wait(EVENT_NAME, 3, (...data) => {
            count ++;
        })

        ep.emit(EVENT_NAME, emitData);
        expect(count).to.be.equal(0);
        ep.emit(EVENT_NAME, emitData);
        expect(count).to.be.equal(0);
        ug()
        ep.emit(EVENT_NAME, emitData);
        expect(count).to.be.equal(0);
        ep.emit(EVENT_NAME, emitData);
        expect(count).to.be.equal(0);
    })

    it('ep.bindNTime 绑定N次事件，可以指定绑定事件次数，当事件触发次数达到指定次数就会卸载', () => {
        let count = 0;
        const EVENT_NAME = 'TEST';
        ep.bindNTime(EVENT_NAME, 3, () => {
            count ++;
        })

        ep.emit(EVENT_NAME);
        expect(count).to.be.equal(1);
        ep.emit(EVENT_NAME);
        expect(count).to.be.equal(2);
        ep.emit(EVENT_NAME);
        expect(count).to.be.equal(3);
        ep.emit(EVENT_NAME);
        expect(count).to.be.equal(3);
        ep.emit(EVENT_NAME);
        expect(count).to.be.equal(3);
    })


    it('ep.bindNTime 绑定N次事件，可以绑定联合事件', () => {
        let count = 0;
        const EVENT_NAME_1 = 'TEST1';
        const EVENT_NAME_2 = 'TEST2';
        ep.bindNTime([EVENT_NAME_1, EVENT_NAME_2], 3, () => {
            count ++;
        })

        ep.emit(EVENT_NAME_1);
        expect(count).to.be.equal(0);
        ep.emit(EVENT_NAME_1);
        expect(count).to.be.equal(0);
        ep.emit(EVENT_NAME_1);
        expect(count).to.be.equal(0);
        ep.emit(EVENT_NAME_1);
        expect(count).to.be.equal(0);
        ep.emit(EVENT_NAME_1);
        expect(count).to.be.equal(0);

        ep.emit(EVENT_NAME_2);
        expect(count).to.be.equal(1);
        ep.emit(EVENT_NAME_2);
        expect(count).to.be.equal(2);
        ep.emit(EVENT_NAME_2);
        expect(count).to.be.equal(3);
        ep.emit(EVENT_NAME_2);
        expect(count).to.be.equal(3);
        ep.emit(EVENT_NAME_2);
        expect(count).to.be.equal(3);
    })

    it('ep.bindNTime 绑定N次事件 也返回一个 卸载函数，可以提前卸载事件', () => {
        let count = 0;
        const EVENT_NAME = 'TEST';
        const ug = ep.bindNTime(EVENT_NAME, 3, () => {
            count ++;
        })

        ep.emit(EVENT_NAME);
        expect(count).to.be.equal(1);
        ug()
        ep.emit(EVENT_NAME);
        expect(count).to.be.equal(1);
        ep.emit(EVENT_NAME);
        expect(count).to.be.equal(1);
        ep.emit(EVENT_NAME);
        expect(count).to.be.equal(1);
    })

    it('class 继承方法使用 EventProxy也可以', () => {
        const EVENT_NAME = 'Test';
        class SomeComponent extends EventProxy {
            constructor() {
                super();
                this.componentDidMount();
            }

            componentDidMount(): void {
                this.on(EVENT_NAME, (data) => {
                    expect(data).to.be.deep.equal({
                        type: EVENT_NAME
                    });
                })
            }

            render(): void {
                setTimeout(() => {
                    this.emit(EVENT_NAME, {
                        type: EVENT_NAME
                    })
                }, 100)
            }
        }
        
        const component = new SomeComponent();
        component.render();
    })
})