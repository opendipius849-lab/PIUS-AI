const config = require('../config')
const { cmd } = require('../command')
const { runtime } = require('../lib/functions')

cmd({
    pattern: "ping",
    alias: ["speed", "pong"],
    use: ".ping",
    desc: "Check bot's latency and runtime",
    category: "main",
    react: "📟",
    filename: __filename
},
async (conn, mek, m, { from }) => {
    try {
        const start = Date.now();
        
        // Bhejny se pehle message ka key hasil karain
        let pongMsg = await conn.sendMessage(from, { text: '*Pinging...*' }, { quoted: mek });

        const end = Date.now();
        const latency = end - start;

        // Pakistan Standard Time ke liye Time aur Date format karain
        const time = new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Karachi', hour12: true, hour: '2-digit', minute: '2-digit' });
        const date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
        
        const uptime = runtime(process.uptime());

        const responseText = `*❖ ─── PING RESPONSE ─── ❖*

*⚡️ Latency:* \`\`\`${latency} ms\`\`\`
*💨 Runtime:* \`\`\`${uptime}\`\`\`
*📡 Status:* \`\`\`Online\`\`\`
*⏰ Time:* \`\`\`${time}\`\`\`
*📅 Date:* \`\`\`${date}\`\`\`

*╰─┈➤ POWERED BY QADEER KHAN*`;

        // Pehly bhejy gaye message ko edit karain
        await conn.sendMessage(from, { text: responseText, edit: pongMsg.key });

    } catch (e) {
        console.error("Ping error:", e);
        m.reply(`❌ Error: ${e.message}`);
    }
});
