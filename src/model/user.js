export const roles = Object.freeze({
  ADMIN: Symbol("admin"),
  VISITOR: Symbol("visitor")
});

export class User {
  #id;
  #name;
  #role;

  constructor(id, name, role) {
    this.#id = id;
    this.#name = name;
    this.#role = role;
  }

  whoIs() {
    console.log(`name=${this.#name} [#id=${this.#id}]; role=${this.#role.description}`);
  }
}
