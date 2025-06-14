
class TypedArrayFactory {
    static #types = {
        'uint8': Uint8Array,
        'uint16': Uint16Array,
        'uint32': Uint32Array,
        'int8': Int8Array,
        'int16': Int16Array,
        'int32': Int32Array,
    };

    static create(type, size) {
        const TypedArray = TypedArrayFactory.#types[type];

        if (!TypedArray) {
            throw new Error('Unsupported array type');
        }

        return new TypedArray(size);
    }
}

class Pool {
    #instances;
    constructor(factory, options) {
        this.factory = factory;
        this.options = options;
        this.#init();
    }

    static create(factory, options) {
        return new Pool(factory, options);
    }

    getInstance() {
        return this.#instances.pop() ?? this.factory();
    }

    addInstance(instance) {
        if (this.#instances.length < this.options.max) {
            this.#instances.push(instance);
        }
        return instance;
    }

    #init() {
        this.#instances = Array.from({ length: this.options.size }, () => this.factory());
    }
}

//usage
const bufferSize = 4096;
const fabric = () => TypedArrayFactory.create('uint8', bufferSize);
const pool = Pool.create(fabric, { size: 10, max: 15 });

const instance = pool.getInstance();
console.log({ instance });
pool.addInstance(instance);
