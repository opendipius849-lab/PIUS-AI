const { cmd, commands } = require('../command');
const axios = require('axios');

cmd({
    pattern: "pair",
    alias: ["getpair", "clonebot"],
    react: "✅",
    desc: "Get pairing code for 𝐐𝐀𝐃𝐄𝐄𝐑-𝐀𝐈 🤖",
    category: "main",
    use: ".pair",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, senderNumber, reply }) => {
    try {
        // Step 1: Check if a phone number was provided after the command
        if (!q) {
            return await reply("❌ Please provide a phone number with country code.\n*Example:* `.pair 923xxxxxxx`");
        }

        // Step 2: Extract and clean the phone number from the arguments
        const phoneNumber = q.trim().replace(/[^0-9]/g, '');

        // Step 3: Validate the cleaned phone number's format and length
        if (!phoneNumber || phoneNumber.length < 10 || phoneNumber.length > 15) {
            return await reply("❌ The phone number you provided is invalid. Please enter a valid number with the country code, without the `+` sign.\n*Example:* `.pair 923xxxxxxx`");
        }

        // Make API request to get pairing code
        const response = await axios.get(`https://lite-session-5q7b.onrender.com/get-code?number=${encodeURIComponent(phoneNumber)}`);

        // Check if the response from the API is valid
        if (!response.data || !response.data.code) {
            return await reply("❌ Failed to retrieve pairing code. The service might be down. Please try again later.");
        }

        const pairingCode = response.data.code;
        const doneMessage = "> *𝐐𝐀𝐃𝐄𝐄𝐑-𝐀𝐈 PAIRING COMPLETED*";

        // Send initial message with the pairing code
        await reply(`${doneMessage}\n\n*Your pairing code is:* ${pairingCode}`);

        // Optional 2-second delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Send the clean code again for easy copying
        await reply(`${pairingCode}`);

    } catch (error) {
        console.error("Pair command error:", error);
        await reply("❌ An error occurred while trying to get the pairing code. Please check the server logs for more details.");
    }
});
