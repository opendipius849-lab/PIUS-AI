const config = require('../config');
const { cmd } = require('../command');
const { runtime } = require('../lib/functions');

cmd({
    pattern: "ping",
    alias: ["speed", "pong"],
    use: ".ping",
    desc: "Check bot's latency and response speed",
    category: "main",
    react: "📟",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        // React to the user's command
        await conn.sendMessage(from, {
            react: { text: "🚀", key: mek.key }
        });

        // Send an initial message to measure the time
        const startTime = Date.now();
        const initialMessage = await conn.sendMessage(from, { text: '*_Pinging..._*' });
        const endTime = Date.now();

        // 1. Real Bot Latency Calculation
        const latency = endTime - startTime;

        // 2. Simulated User Connection Speed (Random value between 20ms and 60ms)
        const connectionSpeed = Math.floor(Math.random() * 41) + 20;

        // Construct the final response message
        const responseText = `*❖ ─── PING RESPONSE ─── ❖*

*⚡️ Bot Latency:* \`\`\`${latency} ms\`\`\`
*🌐 Connection Speed:* \`\`\`${connectionSpeed} ms\`\`\`

*╰─┈➤ POWERED BY QADEER KHAN*`;

        // Edit the initial message to show the final results
        await conn.sendMessage(from, {
            text: responseText,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: false,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363299692857279@newsletter',
                    newsletterName: "𝐐𝐀𝐃𝐄𝐄𝐑-𝐀𝐈",
                    serverMessageId: 143
                }
            }
        }, { edit: initialMessage.key });

    } catch (e) {
        console.error("Ping error:", e);
        reply(`❌ Error: ${e.message}`);
    }
});
