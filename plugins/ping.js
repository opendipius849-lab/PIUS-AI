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

        // WhatsApp Verified (Blue Tick) wala reply object
        const verifiedReply = {
            key: {
                participant: `0@s.whatsapp.net`,
                fromMe: false,
                remoteJid: "status@broadcast"
            },
            message: {
                extendedTextMessage: {
                    text: "Qadeer-AI Official Status",
                    contextInfo: {
                        mentionedJid: [],
                        // Yeh line blue tick add karti hai
                        verifiedBizName: "Qadeer-AI"
                    }
                }
            }
        };

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

        // Final message ko naye verified reply ke sath bhej dein
        await conn.sendMessage(from, {
            text: finalMessage,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363345872435489@newsletter',
                    newsletterName: "𝐐𝐀𝐃𝐄𝐄𝐑-𝐀𝐈",
                    serverMessageId: 143
                }
            }
        }, { quoted: verifiedReply }); // Yahan 'mek' ki jagah naya reply object istemal kiya gaya hai

    } catch (e) {
        console.error("Ping error:", e);
        reply(`❌ Error: ${e.message}`);
    }
});
