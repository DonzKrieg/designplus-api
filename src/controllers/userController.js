const UserRepository = require("../repositories/userRepository");
const UserService = require("../services/userService");
const bcrypt = require('bcrypt');

class UserController {

    static async mobileSync(req, res) {
        try {
            // Data dari Middleware (Firebase Token)
            const { uid, email } = req.user;
            
            // Data tambahan dari Body (dikirim dari Flutter)
            const { firstName, lastName, phone } = req.body;

            // PENTING: Anda harus memastikan UserService memiliki method ini.
            // Jika belum, Anda harus membuatnya di UserService.js (lihat panduan di bawah kode ini).
            // Logic: Cek apakah firebase_uid ada? Jika tidak, create user baru.
            const user = await UserService.syncFirebaseUser({
                firebase_uid: uid,
                email: email,
                name: `${firstName} ${lastName}`, 
                phone: phone,
                role: 'user'
            });

            res.status(200).json({
                success: true,
                message: "Sinkronisasi berhasil",
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    firebase_uid: user.firebase_uid
                },
            });
        } catch (error) {
            console.error("Mobile Sync Error:", error);
            res.status(500).json({
                success: false,
                message: error.message || "Gagal sinkronisasi ke database"
            });
        }
    }

    static async register(req, res) {
        try {
            const { name, email, password } = req.body;

            const user = await UserService.register(name, email, password);

            res.status(201).json({
                success: true,
                message: "User berhasil didaftarkan",
                data: user,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const token = await UserService.login(email, password);
            res.status(200).json({
                success: true,
                token,
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message: error.message,
            });
        }
    }

    static async loginFirebase(req, res, next) {
        try {
            // Data dari firebase middleware
            const { firebase_uid } = req.user;
            const user = await UserService.loginFromFirebase(firebase_uid);

            res.status(200).json({
                success: true,
                message: 'Login mobile berhasil',
                data: user
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message: error.message,
            });
        };
    };
    static async getMe(req, res) {
        res.json({
            success: true,
            data: {
                id: req.user.id,
                email: req.user.email,
                role: req.user.role,
            },
        });
    }

    static async firebaseGetMe(req, res) {
        try {
            const firebaseUid = req.user.firebase_uid;
            res.json({
                success: true,
                firebaseUid: firebaseUid,
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        };
    };

    static async getUsers(req, res) {
        try {
            const users = await UserService.getAllUsers();
            res.json({
                success: true,
                data: users,
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

    static async updatePassword(req, res) {
        try {
            const userId = req.user.id;
            const { current_password, new_password } = req.body;

            if (!userId) {
                return res.status(404).json({ message: 'User tidak ditemukan' });
            };

            if(!current_password || !new_password) {
                return res.status(400).json({
                    success: false,
                    message: 'Password lama dan baru wajib diisi'
                });
            }

            await UserService.updatePassword(userId, current_password, new_password);

            return res.status(200).json({
                success: true,
                message: 'Password berhasil diubah'
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        };
    };

    static async updateRole(req, res) {
        try {
            const { id } = req.params;
            const { role } = req.body;

            const allowedRoles = ["user", "admin"];

            if (!allowedRoles.includes(role)) {
                return res.status(400).json({
                    success: false,
                    message: "Role tidak valid",
                });
            }

            await UserService.updateRole(id, role);

            res.json({
                success: true,
                message: `Role user berhasil diubah menjadi ${role}`,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    static async updateUser(req, res) {
        try {
            const userId = req.params.id;
            const user = await UserService.updateUser(userId, req.body);
            res.json({ success: true, data: user });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    static async deleteUser(req, res) {
        try {
            await UserService.deleteUser(req.params.id);
            res.json({ success: true, message: "User deleted" });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}

module.exports = UserController;
