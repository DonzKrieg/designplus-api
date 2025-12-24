const UserService = require('../services/userService');

class UserController {
    static async getUsers(req, res) {
        try {
            const users = await UserService.getAllUsers();
            res.json({
                success: true,
                data: users
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getUser(req, res) {
        try {
            const user = await UserService.getUserById(req.params.id);
            res.json({ success: true, data: user });
        } catch (error) {
            res.status(404).json({ success: false, message: error.message });
        }
    }

    static async createUser(req, res) {
        try {
            const user = await UserService.createUser(req.body);
            res.status(201).json({ success: true, data: user });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    static async updateUser(req, res) {
        try {
            const user = await UserService.updateUser(req.params.id, req.body);
            res.json({ success: true, data: user });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    static async deleteUser(req, res) {
        try {
            await UserService.deleteUser(req.params.id);
            res.json({ success: true, message: 'User deleted' });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}

module.exports = UserController;
