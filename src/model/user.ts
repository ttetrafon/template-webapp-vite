export const roles = Object.freeze({
  ADMIN: Symbol("admin"),
  VISITOR: Symbol("visitor")
});

export class User {
  id: string | number;
  name: string;
  role: symbol;

  constructor(id: string | number, name: string, role: symbol) {
    // console.log(`---> new User(${id}, ${name}, ${role}))`);
    this.id = id;
    this.name = name;
    this.role = role;
  }
}
