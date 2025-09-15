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
        const rocketEmoji = "🚀";
        const globeEmoji = "🌐";
        const filledCircle = "⚫";
        const emptyCircle = "⚪";
        const barLength = 10;

        // ایک نیا میسج بھیجیں جو پراگریس بار کے طور پر اپ ڈیٹ ہو گا
        const loadingMessage = await conn.sendMessage(from, { text: `${rocketEmoji} Launching... [${globeEmoji}${filledCircle}${emptyCircle.repeat(barLength - 1)}] 10%` });

        // پراگریس بار کو 20% سے 100% تک لے جانے کے لیے لوپ
        for (let i = 20; i <= 100; i += 10) {
            const progress = i / 10;
            const filledBar = filledCircle.repeat(progress);
            const emptyBar = emptyCircle.repeat(barLength - progress);
            
            const progressText = `${rocketEmoji} Launching... [${globeEmoji}${filledBar}${emptyBar}] ${i}%`;
            
            await conn.sendMessage(from, { text: progressText, edit: loadingMessage.key });
            await sleep(500); // 500 ملی سیکنڈ کا انتظار تاکہ اپ ڈیٹ واضح ہو
        }

        // 100% پر پہنچنے کے بعد پنگ کا حساب شروع کریں
        const start = Date.now();
        
        // فائنل رزلٹ اسی میسج میں اپ ڈیٹ کریں
        const finalMessage = `*${rocketEmoji} Rocket Arrived!*
*${globeEmoji} Pong!*
*📟 Response Speed: ${Date.now() - start} ms*
*⚡ POWERED BY QADEER KHAN*`;

        await conn.sendMessage(from, { text: finalMessage, edit: loadingMessage.key });

    } catch (e) {
        console.error("Ping error:", e);
        reply(`❌ Error: ${e.message}`);
    }
});
