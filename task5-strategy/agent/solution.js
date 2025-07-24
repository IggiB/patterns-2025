'use strict';

class Strategy {
    #name;
    #supportedActions;
    #agents =  new Map();

    constructor(strategyName, supportedActions) {
        this.#name = strategyName;
        this.#supportedActions = supportedActions;
    }

    registerBehaviour(implementationName, behaviour) {
        if (typeof implementationName !== 'string') {
            throw new Error('Implementation name expected to be string');
        }

        if (typeof behaviour !== 'object') {
            throw new Error(`Behaviour expected to be an object with keys: ${this.actions.toString()}`);
        }

        const actionsNames = Object.keys(behaviour);
        const unsupportedActions = actionsNames.filter((actionName) => !this.supportedActions.includes(actionName));
        if (unsupportedActions.length) {
            throw new Error(`Tried to register a behaviour with unsupported actions: ${unsupportedActions.toString()}`);
        }

        for (const actionName in behaviour) {
            if (typeof behaviour[actionName] !== 'function') {
                throw new Error(`Key ${actionName} expected to be function`);
            }
        }

        this.#agents.set(implementationName, behaviour);
    }

    getBehaviour(implementationName) {
        const behaviour = this.#agents.get(implementationName);
        if (!behaviour) {
            throw new Error(`Strategy "${implementationName}" is not found`);
        }

        return behaviour;
    }

    getBehaviourAction(implementationName, actionName) {
        const behaviour = this.#agents.get(implementationName);
        if (!behaviour) {
            throw new Error(`Strategy "${implementationName}" is not found`);
        }
        const handler = behaviour[actionName];
        if (!handler) {
            throw new Error(`Action "${actionName}" for strategy "${implementationName}" is not found`);
        }
        return handler;
    }
}



// Usage
const NOTIFY_ACTIONS = {
  NOTIFY: 'notify',
  MULTICAST: 'multicast',
};
const NOTIFY_IMPLEMENTATIONS = {
  EMAIL: 'email',
  SMS: 'sms',
};

const notifyStrategy = new Strategy('notification', Object.values(NOTIFY_ACTIONS));

notifyStrategy.registerBehaviour(NOTIFY_IMPLEMENTATIONS.EMAIL, {
    [NOTIFY_ACTIONS.NOTIFY]: (to, message) => {
        console.log(`Sending "email" notification to <${to}>`);
        console.log(`message length: ${message.length}`);
    },
    [NOTIFY_ACTIONS.MULTICAST]: (message) => {
        console.log(`Sending "email" notification to all`);
        console.log(`message length: ${message.length}`);
    },
});
notifyStrategy.registerBehaviour(NOTIFY_IMPLEMENTATIONS.SMS, {
    [NOTIFY_ACTIONS.NOTIFY]: (to, message) => {
        console.log(`Sending "sms" notification to <${to}>`);
        console.log(`message length: ${message.length}`);
    },
    [NOTIFY_ACTIONS.MULTICAST]: (message) => {
        console.log(`Sending "sms" notification to all`);
        console.log(`message length: ${message.length}`);
    },
});


const smsNotifier = notifyStrategy.getBehaviour(NOTIFY_IMPLEMENTATIONS.SMS);
smsNotifier.notify('+380501234567', 'Hello world');
smsNotifier.multicast('Hello world');


const notifyBySms = notifyStrategy.getBehaviourAction(NOTIFY_IMPLEMENTATIONS.EMAIL, NOTIFY_ACTIONS.NOTIFY);
notifyBySms('+380501234567', 'Hello world 2');

const multicastNotifyBySms = notifyStrategy.getBehaviourAction(NOTIFY_IMPLEMENTATIONS.SMS, NOTIFY_ACTIONS.MULTICAST);
multicastNotifyBySms('Multicast message');

try {
    notifyStrategy.getBehaviour('unsupported');
} catch (e) {
    console.log(e.message);
}

try {
    notifyStrategy.getBehaviourAction(NOTIFY_IMPLEMENTATIONS.EMAIL, 'unsupported');
} catch (e) {
    console.log(e.message);
}

