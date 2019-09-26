const EventProxy = require('../dist');

const ep = EventProxy.create();

const EVENT_LABEL_1 = 'EVENT_LABEL_1';
const EVENT_LABEL_2 = 'EVENT_LABEL_2';
const EVENT_LABEL_3 = 'EVENT_LABEL_3';
const EVENT_LABEL_4 = 'EVENT_LABEL_4';


ep.on(EVENT_LABEL_1, (data) => {
    console.log('[on unit event]', data);
})

ep.on([EVENT_LABEL_1, EVENT_LABEL_2], (data1, data2) => {
    console.log('[on union event]', data1, data2);
})

ep.wait(EVENT_LABEL_2, 2,  (data) => {
    console.log('[wait unit event]', data);
})

ep.once([EVENT_LABEL_1, EVENT_LABEL_2, EVENT_LABEL_3], (data) => {
    console.log('[once union event]', data);
})

ep.bindNTime(EVENT_LABEL_4, 2, (data) => {
    console.log('[bindNTime unit event]', data);
})

ep.emit(EVENT_LABEL_1, {
    payload: new Date() + EVENT_LABEL_1
});


ep.emit(EVENT_LABEL_1, {
    payload: new Date + EVENT_LABEL_1
});


ep.emit(EVENT_LABEL_1, {
    payload: new Date + EVENT_LABEL_1
});

ep.emit(EVENT_LABEL_2, {
    payload: new Date + EVENT_LABEL_2
});

ep.emit(EVENT_LABEL_2, {
    payload: new Date + EVENT_LABEL_2
});

ep.emit(EVENT_LABEL_2, {
    payload: new Date + EVENT_LABEL_2
});

ep.emit(EVENT_LABEL_3, {
    payload: new Date + EVENT_LABEL_3
});

ep.emit(EVENT_LABEL_3, {
    payload: new Date + EVENT_LABEL_3
});

ep.emit(EVENT_LABEL_3, {
    payload: new Date + EVENT_LABEL_3
});

ep.emit(EVENT_LABEL_4, {
    payload: new Date + EVENT_LABEL_4
});
ep.emit(EVENT_LABEL_4, {
    payload: new Date + EVENT_LABEL_4
});
ep.emit(EVENT_LABEL_4, {
    payload: new Date + EVENT_LABEL_4
});
