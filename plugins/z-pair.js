const { cmd, commands } = require('../command');
const axios = require('axios');

cmd({
    pattern: "pair",
    alias: ["getpair", "clonebot"],
    react: "✅",
    desc: "Get pairing code for 𝐐𝐀𝐃𝐄𝐄𝐑-𝐀𝐈 🤖",
    category: "main",
    use: ".pair 923xxxxxxx",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, senderNumber, reply }) => {
    try {
        // Extract phone number from command, or use the sender's number if no number is provided
        const phoneNumber = q ? q.trim().replace(/[^0-9]/g, '') : senderNumber.replace(/[^0-9]/g, '');

        // Validate phone number format
        if (!phoneNumber || phoneNumber.length < 10 || phoneNumber.length > 15) {
            return await reply("❌ Please provide a valid phone number without `+`\nExample: `.pair 923xxxxxxx`");
        }

        // Make API request to the correct endpoint to get pairing code
        // The endpoint was changed from /code to /get-code
        const response = await axios.get(`https://lite-session-5q7b.onrender.com/get-code?number=${encodeURIComponent(phoneNumber)}`);

        // Check if the response contains the code
        if (!response.data || !response.data.code) {
            return await reply("❌ Failed to retrieve pairing code. Please try again later.");
        }

        const pairingCode = response.data.code;
        const doneMessage = "> *𝐐𝐀𝐃𝐄𝐄𝐑-𝐀𝐈 PAIRING COMPLETED*";

        // Send initial message with formatting
        await reply(`${doneMessage}\n\n*Your pairing code is:* ${pairingCode}`);

        // Optional 2-second delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Send the clean code again for easy copying
        await reply(`${pairingCode}`);

    } catch (error) {
        console.error("Pair command error:", error);
        await reply("❌ An error occurred while trying to get the pairing code. Please check the logs.");
    }
});
