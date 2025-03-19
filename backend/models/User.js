const PouchDB = require('pouchdb');
const db = new PouchDB('users');

class User {
  static async createUser(username, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      _id: username,
      password: hashedPassword,
      role: 'user'
    };
    await createUser(user);
    return user;
  }

  static async findUser(username) {
    try {
      const user = await db.get(username);
      return user;
    } catch (error) {
      return null;
    }
  }

  static async validateUser(username, password) {
    const user = await this.findUser(username);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }
}

module.exports = User;