export const roles = Object.freeze({
  ADMIN: Symbol("admin"),
  VISITOR: Symbol("visitor")
});

export class User {
  id;
  name;
  role;

  constructor(id, name, role) {
    // console.log(`---> new User(${id}, ${name}, ${role}))`);
    this.id = id;
    this.name = name;
    this.role = role;
  }
}
