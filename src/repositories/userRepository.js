const User = require('../models/User');

class UserRepository {
    static async create(userData) {
        const newUser = new User(userData);
        return await newUser.save();
    }

    static async getUserWhislist(userId) {
        const userWishlist = await User.findById(userId).populate({
            path: 'wishlists'
        });
        return userWishlist.wishlists;
    }

    static async createWishlistEntry(userId, productId) {
        const wishlistItem = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { wishlists: productId } },
            { new: true }
        );
        return wishlistItem;
    }

    static async deleteWishlist(userId, productId) {
        const updateUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { wishlists: productId } },
            { new: true }
        );
        if(!updateUser) {
            throw new Error('User tidak ditemukan');
        }
        return updateUser;
    }

    static async findAll() {
        const users = await User.find();
        return users;
    }

    static async findByEmail(email) {
        const userByEmail = await User.findOne({email: email});
        return userByEmail;
    }

    static async findById(id) {
        const userId = await User.findById(id);
        return userId;
    }

    static async update(id, userData) {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            userData,
            { new: true }
        );
        return updatedUser;
    }

    static async updateRole(id, role) {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { role: role },
            { new: true }
        );
        return updatedUser;
    }

    static async updatePassword(id, hashedPassword) {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { password: hashedPassword },
            { new: true }
        );
        return updatedUser;
    }

    static async delete(id) {
        await User.findByIdAndDelete(id);
    }
}

module.exports = UserRepository;