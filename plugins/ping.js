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
    try {
        const rocketEmoji = "🚀";
        const globeEmoji = "🌐";
        const barChar = "─";
        const barLength = 10;
        
        await conn.sendMessage(from, {
            react: { text: "🚀", key: mek.key }
        });

        const loadingMessage = await conn.sendMessage(from, { text: `${rocketEmoji} Launching... [${globeEmoji}${barChar.repeat(barLength - 1)}] 10%` });

        for (let i = 20; i <= 100; i += 10) {
            const progress = i / 10;
            const filledBar = barChar.repeat(progress - 1);
            const emptyBar = barChar.repeat(barLength - progress);
            
            const progressText = `${rocketEmoji} Launching... [${filledBar}${rocketEmoji}${emptyBar}] ${i}%`;
            
            await conn.sendMessage(from, { text: progressText, edit: loadingMessage.key });
            await sleep(500); 
        }

        const start = Date.now();
        
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
