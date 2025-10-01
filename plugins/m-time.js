const { cmd } = require('../command');
const { runtime } = require('../lib/functions');
const config = require('../config');
const pkg = require('../package.json');

cmd({
    pattern: "uptime",
    alias: ["runtime", "run"],
    desc: "Show bot uptime with stylish formats",
    category: "main",
    react: "⏱️",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const formatUptime = (seconds) => {
            const days = Math.floor(seconds / (3600 * 24));
            const hours = Math.floor((seconds % (3600 * 24)) / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = Math.floor(seconds % 60);
            
            let timeString = '';
            if (days > 0) timeString += `${days}d `;
            if (hours > 0) timeString += `${hours}h `;
            if (minutes > 0) timeString += `${minutes}m `;
            timeString += `${secs}s`;
            
            return timeString.trim();
        };

        const uptime = formatUptime(process.uptime());
        
        await conn.sendMessage(from, { 
            text: `‎*╭───────────────━┈⍟*
‎*┋* *𝚀𝙰𝙳𝙴𝙴𝚁-𝙰𝙸 𝚁𝚄𝙽𝙽𝙸𝙽𝙶 𝚂𝚃𝙰𝚃𝚄𝚂*
‎*┋*
‎*┋* > 🟢 Online for: ${uptime}
‎*┋*
‎*┋* > 🔢 Seconds: ${seconds}
‎*┋*
‎*┋* 𝐎𝐰𝐧𝐞𝐫:➠ *_𝐐𝐀𝐃𝐄𝐄𝐑 𝐊𝐇𝐀𝐍_* 
‎*╰───────────────━┈⍟*`,
            contextInfo: {
                isForwarded: true,
                forwardingScore: 999
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in uptime command:", e);
        reply(`❌ Error checking uptime: ${e.message}`);
    }
});
