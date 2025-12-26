const UserRepository = require('../repositories/userRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserService {
    static async register(name, email, password) {
        const existingUser = await UserRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('Email sudah terdaftar');
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await UserRepository.create({
            name,
            email,
            password: hashedPassword,
            role: 'user'
        });

        return user;
    }

    static async login(email, password) {
        const user = await UserRepository.findByEmail(email);

        if (!user) {
            throw new Error('Email atau password salah');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new Error('Email atau password salah');
        }

        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
            algorithm: 'HS256'
        });

        return token;
    }

    static async updateRole(userId, role) {
        const user = await UserRepository.findById(userId);

        if (!user) {
            throw new Error('User tidak ditemukan');
        }

        await UserRepository.updateRole(userId, role);
    }

    static async updatePassword(userId, currentPassword, newPassword) {
        const user = await UserRepository.findById(userId);
        if(!user) {
            throw new Error('User tidak ditemukan');
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if(!isMatch) {
            throw new Error('Password lama tidak sesuai');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await UserRepository.updatePassword(userId, hashedPassword);

        return true;
    }

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
        await this.getUserById(id);
        return await UserRepository.update(id, data);
    }

    static async deleteUser(id) {
        return UserRepository.delete(id);
    }
}

module.exports = UserService;
