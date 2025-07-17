require('dotenv').config();

// Hardcoding the values for direct use
const TELEGRAM_BOT_TOKEN = '7299251669:AAHujPtNZVNXo-rNa3_lh0TRZMden5i5Pwg';
const TELEGRAM_CHAT_ID = '1656921222';

const sendTelegramMessage = async (message) => {
    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });

        const data = await response.json();
        console.log('Telegram notification sent:', data);
        return data;
    } catch (error) {
        console.error('Error sending Telegram notification:', error);
        throw error;
    }
};

module.exports = { sendTelegramMessage }; 