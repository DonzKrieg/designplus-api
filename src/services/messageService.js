const messageRepository = require('../repositories/messageRepository');

const getChatHistory = async (userId) => {
    // 2. Ambil data pesan dari repository
    const messages = await messageRepository.getMessagesByUserId(userId);

    // 3. Format data (Mapping) agar frontend mudah membacanya
    return messages.map(msg => ({
        id: msg.id,
        message: msg.message,
        is_admin: Boolean(msg.is_admin_reply),
        sender_name: msg.is_admin_reply ? 'Admin Support' : 'You',
        created_at: msg.created_at
    }));
};

const sendUserMessage = async (userId, messageContent) => {
    if (!messageContent) {
        throw new Error('Message content is required');
    }

    // 2. Siapkan data
    const now = new Date();
    const messageData = {
        user_id: userId,
        message: messageContent,
        created_at: now,
        updated_at: now
    };

    // 3. Simpan ke DB via Repository
    const result = await messageRepository.createMessage(messageData);
    
    return {
        id: result.insertId,
        ...messageData,
        is_admin: false,
        sender_name: 'You'
    };
};

module.exports = {
    getChatHistory,
    sendUserMessage
};