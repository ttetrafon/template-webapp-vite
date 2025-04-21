import { generalNames } from "../data/enums.js";
import { roles, User } from "../model/user.js";

class State {
  #observables;

  constructor() {
    if (!State.instance) {
      State.instance = this;
    }

    this.#observables = {};

    let userUuid = Math.random();
    try {
      userUuid = crypto.randomUUID();
    } catch(err) {}
    this.createObservable(
      generalNames.OBSERVABLE_USER.description,
      new User(userUuid, "", roles.VISITOR)
    );

    return State.instance;
  }

  /**
   *
   * @param {String} observable
   * @param {Object} obj
   */
  createObservable(observable, obj) {
    let onChange = (property, newValue) => {
      console.log(`Property '${property}' changed to:`, newValue, "... calling subscribers!");
      Object.keys(this.#observables[observable].listeners).forEach(subscriber =>
        this.#observables[observable].listeners[subscriber](subscriber, property, newValue)
      );
    };

    let proxy = new Proxy(obj, {
      get(target, prop, receiver) {
        const value = target[prop];
        if (value instanceof Function) {
          return function(...args) {
            return value.apply(this === receiver ? target : this, args);
          };
        }
        return value;
      },
      set(target, prop, value, receiver) {
        if (target[prop] !== value) {
          onChange(prop, value);
        }
        return Reflect.set(target, prop, value, receiver);
      },
      deleteProperty(target, prop) {
        onChange(prop, undefined);
        return Reflect.deleteProperty(target, prop);
      }
    });

    this.#observables[observable] = {
      proxy: proxy,
      listeners: {}
    }
  }

  /**
   *
   * @param {String} observable: the name of the object
   * @param {String} subscriber: the name of the subscriber
   * @param {Function} callback: the function called in the subscriber when the
   */
  subscribeToObservable(observable, subscriber, callback) {
    if (this.#observables.hasOwnProperty(observable) && !this.#observables[observable].listeners.hasOwnProperty(subscriber)) {
      this.#observables[observable].listeners[subscriber] = callback;
    }
  }

  unsubscribeFromObservable(observable, subscriber) {
    if (this.#observables.hasOwnProperty(observable) && this.#observables[observable].listeners.hasOwnProperty(subscriber)) {
      delete this.#observables[observable].listeners[subscriber];
    }
  }

  updateObservable(observable, prop, value) {
    if (this.#observables.hasOwnProperty(observable)) {
      this.#observables[observable].proxy[prop] = value;
    }
  }
}

const instance = new State();
Object.freeze(instance);
export default instance;