import { generalNames } from "../library/data/enums.ts";
import { roles, User } from "../model/user.ts";

type ObservableEntry = {
  proxy: Record<string, any>;
  listeners: Record<string, (subscriber: string, property: string, newValue: unknown) => void>;
};

class State {
  static instance: State;
  #observables: Record<string, ObservableEntry>;

  constructor() {
    if (!State.instance) {
      State.instance = this;
    }

    this.#observables = {};

    let userUuid: string | number = Math.random();
    try {
      userUuid = crypto.randomUUID();
    } catch(err) {}
    this.createObservable(
      generalNames.OBSERVABLE_USER.description,
      new User(userUuid, "", roles.VISITOR)
    );

    return State.instance;
  }

  createObservable(observable: string, obj: object) {
    let onChange = (property: string, newValue: unknown) => {
      console.log(`Property '${property}' changed to:`, newValue, "... calling subscribers!");
      Object.keys(this.#observables[observable].listeners).forEach(subscriber =>
        this.#observables[observable].listeners[subscriber](subscriber, property, newValue)
      );
    };

    let proxy = new Proxy(obj as Record<string, any>, {
      get(target, prop, receiver) {
        const value = target[prop as string];
        if (value instanceof Function) {
          return function(...args: unknown[]) {
            return value.apply(this === receiver ? target : this, args);
          };
        }
        return value;
      },
      set(target, prop, value, receiver) {
        if (target[prop as string] !== value) {
          onChange(prop as string, value);
        }
        return Reflect.set(target, prop, value, receiver);
      },
      deleteProperty(target, prop) {
        onChange(prop as string, undefined);
        return Reflect.deleteProperty(target, prop);
      }
    });

    this.#observables[observable] = {
      proxy: proxy,
      listeners: {}
    }
  }

  subscribeToObservable(observable: string, subscriber: string, callback: (subscriber: string, property: string, newValue: unknown) => void) {
    if (Object.prototype.hasOwnProperty.call(this.#observables, observable) && !Object.prototype.hasOwnProperty.call(this.#observables[observable].listeners, subscriber)) {
      this.#observables[observable].listeners[subscriber] = callback;
    }
  }

  unsubscribeFromObservable(observable: string, subscriber: string) {
    if (Object.prototype.hasOwnProperty.call(this.#observables, observable) && Object.prototype.hasOwnProperty.call(this.#observables[observable].listeners, subscriber)) {
      delete this.#observables[observable].listeners[subscriber];
    }
  }

  updateObservable(observable: string, prop: string, value: unknown) {
    if (Object.prototype.hasOwnProperty.call(this.#observables, observable)) {
      this.#observables[observable].proxy[prop] = value;
    }
  }

  getValueFromObservable(observable: string, prop: string): Promise<unknown> {
    if (Object.prototype.hasOwnProperty.call(this.#observables, observable)) {
      return Promise.resolve(this.#observables[observable].proxy[prop]);
    }
    return Promise.resolve(null);
  }
}

const instance = new State();
Object.freeze(instance);
export default instance;
