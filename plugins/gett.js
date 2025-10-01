const { cmd, commands } = require('../command');
const fs = require('fs');
const path = require('path');

cmd({
    pattern: "get",
    alias: ["source", "js"],
    desc: "Fetch the full source code of a command as a file.",
    category: "owner",
    react: "📜",
    filename: __filename
},
async (conn, mek, m, { from, args, reply, sender, isPrivateOwner }) => { 
    try {
        // Sirf owner hi is command ko use kar sakta hai
        if (!isPrivateOwner) {
            return reply("❌ Access Denied! This command is for the Owner only.");
        }

        if (!args[0]) {
            return reply("❌ Please provide a command name. Example: `.get alive`");
        }

        const commandName = args[0].toLowerCase();
        const commandData = commands.find(cmd => cmd.pattern === commandName || (cmd.alias && cmd.alias.includes(commandName)));

        if (!commandData) {
            return reply(`❌ Command "${commandName}" not found!`);
        }

        const commandPath = commandData.filename;

        // Check karein ke file mojood hai ya nahi
        if (!fs.existsSync(commandPath)) {
            return reply(`❌ Source file not found for command: ${commandName}`);
        }

        // File ke content ko read karein
        const fileBuffer = fs.readFileSync(commandPath);
        const fileName = path.basename(commandPath);

        // Caption tayar karein
        const captionText = `⬤───〔 *📜 Command Source* 〕───⬤
*❖ Command:* ${commandName}
*❖ File Name:* ${fileName}

> 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚀𝙰𝙳𝙴𝙴𝚁-𝙰𝙸`;

        // Sirf file (document) ko caption ke sath bhejein
        await conn.sendMessage(from, { 
            document: fileBuffer, // File ka content
            mimetype: 'text/javascript',
            fileName: fileName,
            caption: captionText, // Caption file ke sath jayega
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363299692857279@newsletter',
                    newsletterName: '𝐐𝐀𝐃𝐄𝐄𝐑-𝐀𝐈',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in .get command:", e);
        reply(`❌ An unexpected error occurred: ${e.message}`);
    }
});
