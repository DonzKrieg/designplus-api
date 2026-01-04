const UserRepository = require('../repositories/userRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const admin = require("../config/serviceAccountKey.json");

class UserService {
    
    // --- METHOD BARU: SYNC FIREBASE USER ---
    static async syncFirebaseUser(data) {
        // 1. Cek user berdasarkan firebase_uid
        const userByFirebaseUid = await UserRepository.findByFirebaseUid(data.firebase_uid);
        if(userByFirebaseUid){
            return userByFirebaseUid;
        }
        // 1. Cek apakah user sudah ada berdasarkan Email
        // (Kita cek email dulu supaya user Web yang login di Mobile datanya nyambung)
        const userByEmail = await UserRepository.findByEmail(data.email);

        if (userByEmail) {
            // OPTIONAL: Jika user ada tapi belum punya firebase_uid, update datanya di sini.
            // Untuk saat ini kita kembalikan saja user yang sudah ada.
            await UserRepository.updateFirebaseUid(userByEmail.id, data.firebase_uid);
            return {id: userByEmail, firebase_uid: data.firebase_uid};
        }

        // 2. Jika user belum ada, kita buat baru (Register otomatis dari Mobile)
        
        // Generate password dummy/acak karena user ini login pakai Google/Firebase
        // Kita tidak akan pernah pakai password ini untuk login manual
        const dummyPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(dummyPassword, 12);

        // Panggil Repository untuk simpan
        // Pastikan UserRepository.create Anda sudah support kolom 'firebase_uid' & 'phone'
        const newUser = await UserRepository.create({
            name: data.name,
            email: data.email,
            password: hashedPassword, 
            role: 'user', // Default role
            phone: data.phone,
            firebase_uid: data.firebase_uid // ID KTP dari Firebase
        });

        return newUser;
    }
    // ----------------------------------------

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

    static async loginFromFirebase(firebaseUid) {
        // 1. Cari user berdasarkan firebaseUid
        const user = await UserRepository.findByFirebaseUid(firebaseUid);
        if(!user){
            throw new Error('User belum terdaftar');
        }

        // 2. Generate JWT Internal buat akses API
        const payload = {
            id: user.id,
            role: user.role,
            authType: 'mobile'
        }

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN}
        );

        // 3. Kembalikan user tanpa token jwt
        return{
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            firebase_uid: user.firebase_uid,
            token
        };
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

    static async firebaseGetMe(firebaseUid) {
        const user = UserRepository.findByFirebaseUid(firebaseUid);
        if(!user){
            throw new Error('User tidak ditemukan');
        }
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

    static async getUserByFirebaseUid(firebaseUid) {
        const user = await UserRepository.findByFirebaseUid(firebaseUid);
        if(!user) throw new Error('User not found');
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