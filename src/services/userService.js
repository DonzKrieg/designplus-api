const UserRepository = require('../repositories/userRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const admin = require("../config/serviceAccountKey.json");

class UserService {
    static async register(userData) {
        const existingUser = await UserRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error('Email sudah terdaftar');
        }
        
        const saltRounds = 10;

        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

        const user = await UserRepository.create({
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            role: 'user',
            phone: userData.phone
        });

        return user;
    }

    static async login(userData) {
        const user = await UserRepository.findByEmail(userData.email);
        if(!user) {
            throw new Error('Email atau password salah');
        }

        const isMatch = await bcrypt.compare(userData.password, user.password);
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

    static async googleLoginOrRegister({ name, email, google_id, avatar }) {
        // 1. Cari user berdasarkan email
        let user = await UserRepository.findByEmail(email);

        if (!user) {
            // 2. Jika user tidak ditemukan, buat user baru (Register otomatis)
            // Password dikosongkan atau diisi string acak karena login via Google
            user = await UserRepository.create({
                name,
                email,
                google_id,
                avatar,
                password: await bcrypt.hash(Math.random().toString(36), 10),
                role: 'user'
            });
        } else {
            // 3. Jika user ada tapi belum punya google_id, update google_id-nya
            if (!user.google_id) {
                user = await UserRepository.update(user.id, { google_id, avatar });
            }
        }

        // 4. Generate JWT Token (samakan dengan logika login manual Anda)
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return { user, token };
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
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        await UserRepository.updatePassword(userId, hashedPassword);

        return true;
    }

    static async getAllUsers() {
        return UserRepository.findAll();
    }

    static async getUserWishlists(userId) {
        return UserRepository.getUserWhislist(userId);
    }

    static async addUserWishlist(userId, productId) {
        return UserRepository.createWishlistEntry(userId, productId);
    }

    static async deleteUserWishlist(userId, productId) {
        // const wishlist = await UserRepository.getUserWhislist(userId);
        // if(!wishlist || wishlist.user_id !== userId) {
        //     throw new Error('Wishlist tidak ditemukan');
        // }
        return UserRepository.deleteWishlist(userId, productId);
    }

    static async getUserById(id) {
        const user = await UserRepository.findById(id);
        if (!user) throw new Error('User not found');
        return user;
    }

    static async updateUser(id, data) {
        await this.getUserById(id);
        return await UserRepository.update(id, data);
    }

    static async updateUserRole(id, role) {
        await this.getUserById(id);
        return await UserRepository.updateRole(id, role);
    }

    static async deleteUser(id) {
        return UserRepository.delete(id);
    }
}

module.exports = UserService;