const config = require('../config')
let fs = require('fs')
const os = require("os")
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')

cmd({
    pattern: "ping",
    alias: ["speed", "pong", "ping2", "ping3"],
    use: ".ping",
    desc: "Check bot's latency",
    category: "main",
    react: "📟",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    // Command chaltay hi time note karlein
    const start = Date.now();

    try {
        // Sirf command par react karega
        await conn.sendMessage(from, {
            react: { text: "🚀", key: mek.key }
        });

        // Message bhejnay se pehle time note karein
        const end = Date.now();
        const ping = end - start; // Total time calculate karein

        // Message ke liye waqt aur tareekh hasil karein
        const now = new Date();
        const time = now.toLocaleTimeString('en-PK', { timeZone: 'Asia/Karachi', hour: '2-digit', minute: '2-digit' });
        const date = now.toLocaleDateString('en-PK', { timeZone: 'Asia/Karachi', day: '2-digit', month: 'short', year: 'numeric' });

        // Naya aur behtar final message
        const finalMessage = `*❖ ─── PING RESPONSE ─── ❖*

*⚡️ Latency:* \`${ping} ms\`
*📡 Status:* \`Online\`
*⏰ Time:* \`${time}\`
*📅 Date:* \`${date}\`

*╰─┈➤ POWERED BY QADEER KHAN*`;

        // Final message ko original command ke reply mein bhej dein
        await conn.sendMessage(from, { text: finalMessage }, { quoted: mek });

    } catch (e) {
        console.error("Ping error:", e);
        reply(`❌ Error: ${e.message}`);
    }
});
