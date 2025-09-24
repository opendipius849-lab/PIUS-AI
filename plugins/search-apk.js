const { cmd } = require("../command");
const axios = require("axios");

cmd({
    pattern: "playstore",
    react: '📲',
    alias: ["ps", "app"],
    desc: "Search for an app on the Play Store",
    category: "search",
    filename: __filename
},
async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        if (!q) return reply("❌ Please provide an app name to search.");

        // React: Processing ⏳
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        const apiUrl = `https://apis.davidcyriltech.my.id/search/playstore?q=${encodeURIComponent(q)}`;
        const response = await axios.get(apiUrl);

        if (!response.data.success || !response.data.result) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("❌ No results found for the given app name.");
        }

        const app = response.data.result;

        // WhatsApp Verified (Blue Tick) wala reply object
        const verifiedReply = {
            key: {
                participant: `0@s.whatsapp.net`,
                fromMe: false,
                remoteJid: "status@broadcast"
            },
            message: {
                extendedTextMessage: {
                    text: "Qadeer-AI Official",
                    contextInfo: {
                        mentionedJid: [],
                        verifiedBizName: "Qadeer-AI"
                    }
                }
            }
        };

        const infoMessage = `
📲 *ᴘʟᴀʏ sᴛᴏʀᴇ sᴇᴀʀᴄʜ*
╭═══════~👑~═══════╮
│• 📌 Name: ${app.title}
│• 📖 Summary: ${app.summary}
│• 📥 Installs: ${app.installs}
│• ⭐ Rating: ${app.score}
│• 💲 Price: ${app.price}
│• 📦 Size: ${app.size || 'Not available'}
│• 📱 Android: ${app.androidVersion}
│• 👨‍💻 Developer: ${app.developer}
│• 📅 Released: ${app.released}
│• 🔄 Updated: ${app.updated}
│• 🔗 Link: ${app.url}
╰═══════~👑~═══════╯
*𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚀𝙰𝙳𝙴𝙴𝚁 𝙺𝙷𝙰𝙽*`.trim();

        // Common contextInfo for both image and text messages
        const contextInfo = {
            mentionedJid: [sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363299692857279@newsletter',
                newsletterName: "𝐐𝐀𝐃𝐄𝐄𝐑-𝐀𝐈",
                serverMessageId: 143
            }
        };

        if (app.icon) {
            await conn.sendMessage(
                from,
                {
                    image: { url: app.icon },
                    caption: infoMessage,
                    contextInfo: contextInfo
                },
                { quoted: verifiedReply } // Use the verified reply object here
            );
        } else {
            await conn.sendMessage(
                from,
                {
                    text: infoMessage,
                    contextInfo: contextInfo
                },
                { quoted: verifiedReply } // Use the verified reply object here
            );
        }

        // React: Success ✅
        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error("Play Store Error:", error);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        reply("❌ Error searching for the app. Please try again.");
    }
});
