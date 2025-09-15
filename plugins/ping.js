const config = require('../config');
let fs = require('fs');
const os = require("os");
const { cmd, commands } = require('../command');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions');

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
    try {
        const start = Date.now();
        const reactionEmoji = "🚀"; // ہم نے یہاں ایک مخصوص راکٹ ایموجی سیٹ کر دی ہے۔
        const rocketEmoji = "🚀"; // راکٹ ایموجی
        const globeEmoji = "🌍"; // گلوب ایموجی

        await conn.sendMessage(from, {
            react: { text: reactionEmoji, key: mek.key }
        });

        // یہاں ہم ایک میسج بھیجتے ہیں جو پراگریس بار کے طور پر اپ ڈیٹ ہو گا۔
        const loadingMessage = await conn.sendMessage(from, { text: `${rocketEmoji} Launching... [${globeEmoji}▬▬▬▬▬] 10%` });

        // پراگریس بار کو 10% سے 100% تک لے جانے کے لیے ایک لوپ
        for (let i = 20; i <= 100; i += 10) {
            const progress = i / 10;
            const filled = '█'.repeat(progress); // filled bar
            const empty = '░'.repeat(10 - progress); // empty bar
            const progressText = `${rocketEmoji} Launching... [${globeEmoji}${filled}${empty}] ${i}%`;

            // میسج کو اپ ڈیٹ کریں
            await conn.sendMessage(from, { text: progressText, edit: loadingMessage.key });
            await sleep(500); // 500 ملی سیکنڈ کا انتظار کریں تاکہ اپ ڈیٹ واضح ہو
        }

        const end = Date.now();
        const ping = end - start;

        // فائنل رزلٹ بھیجیں
        const resultMessage = `*${rocketEmoji} 🚀Rocket Arrived🚀!*
*${globeEmoji} Pong!*
*📟 Response Speed: ${ping} ms*
*⚡ 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚀𝙰𝙳𝙴𝙴𝚁 𝙺𝙷𝙰𝙽*`;

        await conn.sendMessage(from, {
            text: resultMessage,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: false,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363345872435489@newsletter',
                    newsletterName: "𝐐𝐀𝐃𝐄𝐄𝐑-𝐀𝐈",
                    serverMessageId: 143
                }
            }
        }, { quoted: loadingMessage });

    } catch (e) {
        console.error("Ping error:", e);
        reply(`❌ Error: ${e.message}`);
    }
});
