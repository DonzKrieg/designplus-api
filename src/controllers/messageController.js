const messageService = require('../services/messageService');

const getMessages = async (req, res) => {
    try {
        const userId = req.user.id;

        const data = await messageService.getChatHistory(userId);

        res.json({
            status: 'success',
            data: data
        });
    } catch (error) {
        console.error('Error getting messages:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Internal Server Error'
        });
    }
};

const sendMessage = async (req, res) => {
    try {
        const userId = req.user.id;
        const { message } = req.body;

        const data = await messageService.sendUserMessage(userId, message);

        res.status(201).json({
            status: 'success',
            message: 'Message sent successfully',
            data: data
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Internal Server Error'
        });
    }
};

module.exports = {
    getMessages,
    sendMessage
};