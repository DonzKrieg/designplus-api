const UserRepository = require('../repositories/userRepository');

class UserService {
    static async getAllUsers() {
        return UserRepository.findAll();
    }

    static async getUserById(id) {
        const user = await UserRepository.findById(id);
        if (!user) throw new Error('User not found');
        return user;
    }

    static async createUser(data) {
        if (!data.name || !data.email || !data.password) {
            throw new Error('Field tidak lengkap');
        }
        return UserRepository.create(data);
    }

    static async updateUser(id, data) {
        return UserRepository.update(id, data);
    }

    static async deleteUser(id) {
        return UserRepository.delete(id);
    }
}

module.exports = UserService;
