# EventProxy
event proxy plug-in implemented with TS
用ts实现的事件代理插件

## 安装方法
```javascript
    npm install @dking/event-proxy 
```

## 示例

### 创建事件代理实例
```js
    import EventProxy from '@dking/event-proxy';
    const ep1 = EventProxy.create();
    const ep2 = new EventProxy();

    class SomeComponent extends EventProxy {
        componentDidMount() {
            this.on('Test', (data) => {
                
            })
        }
    }

```

### 单事件绑定
```js
    import EventProxy from '@dking/event-proxy';
    const ep = EventProxy.create();
    ep.on('Test', (payload) => {
        console.log(payload);
    })
    // 别名
    ep.register('Test1', (payload) => {
        console.log(payload);
    })
    ep.subscribe('Test1', (payload) => {
        console.log(payload);
    })
    ep.bind('Test1', (payload) => {
        console.log(payload);
    })

    setTimeout(() => {
        ep.emit('Test1', {
            time: new Date()
        })
    }, 1000)
```

### 联合事件绑定 
当事件都触发后才会触发的事件
```js
    import EventProxy from '@dking/event-proxy';
    const ep = EventProxy.create();
    ep.on(['Test1', 'Test2'], (...payload) => {
        console.log(...payload);
    })
    setTimeout(() => {
        ep.emit('Test1', {
            time: new Date()
        })
    }, 1000)
    setTimeout(() => {
        ep.emit('Test2', {
            time: new Date()
        })
    }, 1000)
```

### once只监视一次的绑定方式
该绑定方法 会在事件触发后 立即解绑
```js
    import EventProxy from '@dking/event-proxy';
    const ep = EventProxy.create();
    fetch(url, options).then(function(response) {
        {`... 复杂业务 ...`}
        ep.done('Test1', data);
    })
    fetch(url, options).then(function(response) {
        {`... 复杂业务 ...`}
        ep.done('Test2', data);
    })
    ep.once(['Test1', 'Test2'], (v1, v2) => {
        {`... 只执行一次的业务 ... `}
    })
```

### bindNTime 绑定 N 次 事件
该绑定方法 会在事件触发 指定 次数后 解绑， 当 n = 1 时 和 once 效果相同
```js
    import EventProxy from '@dking/event-proxy';
    const ep = EventProxy.create();
    ep.bindNTime('Test', 2 /* 指定绑定次数 */, (v) => {
        console.log(v);
    })

    ep.done('Test', {
        time: new Date()
    })

    ep.done('Test', {
        time: new Date()
    })

    ep.done('Test', {
        time: new Date()
    }) // 该事件不会触发
```

### wait绑定的事件
该绑定方法 会等待事件触发 指定次数后 ，才触发回调函数
```js
    import EventProxy from '@dking/event-proxy';
    const ep = EventProxy.create();
    const fetch1 = () => {
        fetch(url, options).then(function(response) {
            {`... 复杂业务 ...`}
            ep.emit('Test1', data1);
        })
    }
     const fetch2 = () => {
        fetch(url, options).then(function(response) {
            {`... 复杂业务 ...`}
            ep.emit('Test2', data2);
        })
    }
    fetch1();
    fetch2(); //第一次满足条件不会触发
    fetch1();
    fetch2(); //第二次满足条件才会触发
    
    ep.wait(['Test1', 'Test2'], 2/* 等待深度 */, (v1, v2) => {
        {`... 执行的业务 ... `}
        {v1 == [data1, data2]} //等于每一层深度的所有data数组
    })
```

### 取消监视某事件
```js
    import EventProxy from '@dking/event-proxy';
    const ep = EventProxy.create();
    const unregister = ep.register(['Test1', 'Test2'], (data1, data2) => {
        console.log(data1, data2)
    });  //register的返回了卸载函数
    unregister(); // 可以取消解绑事件
    ep.emit('Test1', {
        time: new Date()
    })

    ep.emit('Test2', {
        time: new Date()
    })
```

### 继承的方式使用 EventProxy
```js
    import EventProxy from '@dking/event-proxy';
    const ep = EventProxy.create();
    const EVENT_NAME_1 = 'Test1';
    const EVENT_NAME_2 = 'Test1';
    class SomeComponent extends EventProxy {
        componentDidMount() {
            const ug1 = this.on(EVENT_NAME_1, (data) => {
                console.log(data);
            })
            const ug2 = this.on(EVENT_NAME_2, (data) => {
                console.log(data);
            })

            this.ugs = [ug1, ug2];
        }
        componentWillUnMount() {
            this.ugs && this.ugs.forEach(ug => ug());
        }

        run(): void {
            setTimeout(() => {
                this.emit(EVENT_NAME_1, {
                    type: EVENT_NAME_1
                })
            }, 100)

            setTimeout(() => {
                this.emit(EVENT_NAME_2, {
                    type: EVENT_NAME_2
                })
            }, 100)
        }
    }

    const component = new SomeComponent();
    component.componentDidMount();
    component.run();
    component.componentWillUnMount();
    component.run(); // 没有事件会触发
```
