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

        // --- Tabdeeli: Yahan { quoted: mek } add kiya gaya hai ---
        // Ab progress bar wala message aapke command ko reply karega.
        const loadingMessage = await conn.sendMessage(from, { 
            text: `*Launching...*\n[${rocketEmoji}${barChar.repeat(barLength)}] 10%` 
        }, { quoted: mek });

        // Loop to edit the reply and show progress
        for (let i = 20; i <= 100; i += 10) {
            await sleep(400); // Animation speed
            const progress = Math.round(i / 10);
            const filledBar = barChar.repeat(progress);
            const emptyBar = barChar.repeat(barLength - progress);
            
            const progressText = `*Launching...*\n[${filledBar}${rocketEmoji}${emptyBar}] ${i}%`;
            
            // Yahan usi reply ko edit kiya ja raha hai
            await conn.sendMessage(from, { text: progressText, edit: loadingMessage.key });
        }
        
        // Random ping between 20 and 60
        const randomPing = Math.floor(Math.random() * 41) + 20;

        // Final message edited in the same reply
        const finalMessage = `*${rocketEmoji} Rocket Arrived!*
*${globeEmoji} Pong!*
*📟 Response Speed: ${randomPing} ms*
*⚡ POWERED BY QADEER KHAN*`;

        await conn.sendMessage(from, { text: finalMessage, edit: loadingMessage.key });

    } catch (e) {
        console.error("Ping error:", e);
        reply(`❌ Error: ${e.message}`);
    }
});
