//menu-new.js
const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const axios = require('axios');

cmd({
    pattern: 'menu',
    desc: 'Show interactive menu system',
    category: 'main',
    filename: __filename
}, async (client, message, afk, { from, reply }) => {

    await client.sendMessage(afk.key['remoteJid'], { react: { text: '🤖', key: afk.key } });

    try {
        const initialMenuText = `            ║ 𝐐𝐀𝐃𝐄𝐄𝐑-𝐀𝐈 ║ 
                      
╔═════════════╗
║ 👤 *Owner* : *${config.OWNER_NAME}*
║ 📦 *Library* : *Baileys AI*
║ 🚦 *Mode* : *[ ${config.MODE} ]*
║ 🔖 *Prefix* : *[ ${config.PREFIX} ]*
║ 📌 *Version* : *4.0.0 Global*
╚═════════╝

📲 *Reply this message with a number to access a menu.*
⚠️ *Some commands might not be in this menu so use ${config.PREFIX}allmenu or ${config.PREFIX}menu2 command*

╭─ ✨ 𝗖𝗔𝗧𝗘𝗚𝗢𝗥𝗜𝗘𝗦 ─╮
│ 1️⃣  ⬇️  *Download Menu*
│ 2️⃣  💬  *Group Commands*
│ 3️⃣  🎉  *Fun Menu*
│ 4️⃣  🛠️  *Owner Menu*
│ 5️⃣  🧠  *AI Menu*
│ 6️⃣  🔎  *Search Menu*
│ 7️⃣  🔧  *Convert Menu*
│ 8️⃣  🧰  *Utilities*
│ 9️⃣  🏠  *Main Menu*
│ 🔟  ⚙️  *Settings*
│ 1️⃣1️⃣  🎨  *Logo Maker*
╰───────────╯

> *© 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚀𝙰𝙳𝙴𝙴𝚁 𝙰𝙸 🤖* `;

        const contextInfo = {
            mentionedJid: [afk.sender],
            forwardingScore: 2,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363345872435489@newsletter',
                newsletterName: '𝚀𝙰𝙳𝙴𝙴𝚁_𝙺𝙷𝙰𝙽',
                serverMessageId: 143
            }
        };

        const sendInitialImage = async () => {
            try {
                return await client.sendMessage(from, {
                    image: { url: 'https://qu.ax/Pusls.jpg' },
                    caption: initialMenuText,
                    contextInfo: contextInfo
                }, { quoted: message });
            } catch (e) {
                console.log('Image send failed, falling back to text');
                return await client.sendMessage(from, { text: initialMenuText, contextInfo: contextInfo }, { quoted: message });
            }
        };

        const sendFollowUpAudio = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));
                await client.sendMessage(from, {
                    audio: { url: 'https://github.com/Qadeer-Xtech/TOFAN-DATA/raw/refs/heads/main/autovoice/menunew.m4a' },
                    mimetype: 'audio/mp4',
                    ptt: true
                }, { quoted: message });
            } catch (e) {
                console.log('Audio send failed, continuing without it');
            }
        };

        let menuMessage;
        try {
            [menuMessage] = await Promise.all([
                Promise.race([sendInitialImage(), new Promise((_, reject) => setTimeout(() => reject(new Error('Image send timeout')), 10000))]),
                Promise.race([sendFollowUpAudio(), new Promise((_, reject) => setTimeout(() => reject(new Error('Audio send timeout')), 8000))])
            ]);
        } catch (error) {
            console.log("Handler error:", error);
            if (!menuMessage) {
                menuMessage = await client.sendMessage(from, { text: initialMenuText, contextInfo: contextInfo }, { quoted: message });
            }
        }

        const menuMessageId = menuMessage.key.id;

        const menuOptions = {
            '1': {
                title: '📥 *Download Menu* 📥',
                content: `╭━━━〔 *Download Menu* 〕 \n┃★│ • pindl [url]\n┃★│ • ig [url]\n┃★│ • tiktok [url]\n┃★│ • video2 [url]\n┃★│ • ringtone\n┃★│ • song\n┃★│ • gitclone [url]\n┃★│ • play3 [name]\n┃╰──────────────\n╰━━━━━━━━━━━━━━━┈⊷\n> *© 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚀𝙰𝙳𝙴𝙴𝚁 𝙰𝙸 🤖* `,
                image: true
            },
            '2': {
                title: '👥 *Group Menu* 👥',
                content: `╭━━━〔 *Group Menu* 〕 \n┃★│ • antilinkkick\n┃★│ • delete\n┃★│ • deletelink\n┃★│ • antilink\n┃★╰──────────────\n╰━━━━━━━━━━━━━━━┈⊷\n> *© 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚀𝙰𝙳𝙴𝙴𝚁 𝙰𝙸 🤖* `,
                image: true
            },
            '3': {
                title: '😄 *Fun Menu* 😄',
                content: `╭━━━〔 *Fun Menu* 〕\n┃★│ • flirt\n┃★│ • repeat\n┃★│ • emoji\n┃★│ • hack\n┃★│ • img\n┃★│ • character\n┃★│ • tts2\n┃★│ • tts3\n┃★╰──────────────\n╰━━━━━━━━━━━━━━━┈⊷\n> *© 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚀𝙰𝙳𝙴𝙴𝚁 𝙰𝙸 🤖* `,
                image: true
            },
            '4': {
                title: '👑 *Owner Menu* 👑',
                content: `╭━━━〔 *Owner Menu* 〕\n┃★│ • block\n┃★│ • unblock\n┃★│ • vv\n┃★│ • vv2\n┃★│ • restart\n┃★│ • get\n┃★│ • gjid\n┃★│ • deletereport\n┃★│ • shutdown\n┃★│ • setpassword\n┃★│ • viewpassword\n┃★╰──────────────\n╰━━━━━━━━━━━━━━━┈⊷\n> *© 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚀𝙰𝙳𝙴𝙴𝚁 𝙰𝙸 🤖* `,
                image: true
            },
            '5': {
                title: '🤖 *AI Menu* 🤖',
                content: `╭━━━〔 *AI Menu* 〕\n┃★│ • ai\n┃★│ • fluxai\n┃★│ • stablediffusion\n┃★│ • stabilityai\n┃★╰──────────────\n╰━━━━━━━━━━━━━━━┈⊷\n> *© 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚀𝙰𝙳𝙴𝙴𝚁 𝙰𝙸 🤖* `,
                image: true
            },
            '6': {
                title: '🔎 *Search Menu* 🔍',
                content: `╭━━━〔 *Search Menu* 〕\n┃★│ • define\n┃★│ • yts\n┃★│ • srepo\n┃★│ • sgithub\n┃★│ • tiktoksearch\n┃★│ • tiktokstalk\n┃★╰──────────────\n╰━━━━━━━━━━━━━━━┈⊷\n> *© 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚀𝙰𝙳𝙴𝙴𝚁 𝙰𝙸 🤖* `,
                image: true
            },
            '7': {
                title: '🔄 *Convert Menu* 🔄',
                content: `╭━━━〔 *Convert Menu* 〕\n┃★│ • attp\n┃★╰──────────────\n╰━━━━━━━━━━━━━━━┈⊷\n> *© 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚀𝙰𝙳𝙴𝙴𝚁 𝙰𝙸 🤖* `,
                image: true
            },
            '8': {
                title: '📌 *Utility Menu* 📌',
                content: `╭━━━〔 *Utility Menu* 〕\n┃★│ • tempmail\n┃★│ • checkmail\n┃★│ • jid\n┃★│ • person\n┃★│ • send\n┃★│ • report\n┃★│ • reportlist\n┃★╰──────────────\n╰━━━━━━━━━━━━━━━┈⊷\n> *© 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚀𝙰𝙳𝙴𝙴𝚁 𝙰𝙸 🤖* `,
                image: true
            },
            '09': {
                title: '🏠 *Main Menu* 🏠',
                content: `╭━━━〔 *Main Menu* 〕\n┃★│ • alive\n┃★│ • alive2\n┃★│ • ping\n┃★│ • uptime\n┃★│ • setalive\n┃★│ • menu\n┃★│ • menu2\n┃★╰──────────────\n╰━━━━━━━━━━━━━━━┈⊷\n> *© 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚀𝙰𝙳𝙴𝙴𝚁 𝙰𝙸 🤖* `,
                image: true
            },
            '10': {
                title: '⚙️ *Settings Menu* ⚙️',
                content: `╭━━━〔 *Settings Menu* 〕\n┃★│ • admin-events\n┃★│ • always-online\n┃★│ • auto-reply\n┃★│ • auto-react\n┃★│ • auto-recording\n┃★│ • auto-seen]\n┃★│ • auto-typing\n┃★│ • status-react\n┃★│ • anti-bad\n┃★│ • status-reply\n┃★│ • auto-sticker\n┃★│ • mention-reply\n┃★│ • read-message\n┃★│ • env\n┃★│ • setmode public/private\n┃★│ • welcome\n┃★╰──────────────\n╰━━━━━━━━━━━━━━━┈⊷\n> *© 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚀𝙰𝙳𝙴𝙴𝚁 𝙰𝙸 🤖* `,
                image: true
            },
            // NEW: 11 Logo Maker (keeps formatting & font style like you sent)
            '11': {
                title: '🎨 *Logo Maker* 🎨',
                content: `╭━━━〔 *Logo Maker* 〕\n┃★│ • 3dcomic\n┃★│ • 3dpaper\n┃★│ • america\n┃★│ • angelwings\n┃★│ • bear\n┃★│ • birthday\n┃★│ • blackpink\n┃★│ • boom\n┃★│ • bulb\n┃★│ • castke\n┃★│ • cat\n┃★│ • clouds\n┃★│ • deadpool\n┃★│ • devilwings\n┃★│ • dragonball\n┃★│ • eraser\n┃★│ • frozen\n┃★│ • futuristic\n┃★│ • galaxy\n┃★│ • hacker\n┃★│ • leaf\n┃★│ • luxury\n┃★│ • naruto\n┃★│ • neonlight\n┃★│ • khan\n┃★│ • paint\n┃★│ • pornhub\n┃★│ • sadgirl\n┃★│ • sans\n┃★│ • sunset\n┃★│ • tatoo\n┃★│ • thor\n┃★│ • typography\n┃★│ • valorant\n┃★│ • zodiac\n┃★╰──────────────\n╰━━━━━━━━━━━━━━━┈⊷\n> *© 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚀𝙰𝙳𝙴𝙴𝚁 𝙰𝙸 🤖* `,
                image: true
            }
        };

        const messageHandler = async (update) => {
            try {
                const incomingMessage = update.messages[0];
                if (!incomingMessage?.message || !incomingMessage.key?.remoteJid) return;

                const isReplyToMenu = incomingMessage.message?.extendedTextMessage?.contextInfo?.stanzaId === menuMessageId;

                if (isReplyToMenu) {
                    const userResponse = incomingMessage.message.conversation || incomingMessage.message.extendedTextMessage?.text;
                    const remoteJid = incomingMessage.key.remoteJid;

                    if (menuOptions[userResponse]) {
                        const selectedMenu = menuOptions[userResponse];
                        try {
                            if (selectedMenu.image) {
                                await client.sendMessage(remoteJid, {
                                    image: { url: 'https://qu.ax/Pusls.jpg' },
                                    caption: selectedMenu.content,
                                    contextInfo: contextInfo
                                }, { quoted: incomingMessage });
                            } else {
                                await client.sendMessage(remoteJid, { text: selectedMenu.content, contextInfo: contextInfo }, { quoted: incomingMessage });
                            }
                            await client.sendMessage(remoteJid, { react: { text: '✅', key: incomingMessage.key } });
                        } catch (err) {
                            console.log('Menu reply error:', err);
                            await client.sendMessage(remoteJid, { text: selectedMenu.content, contextInfo: contextInfo }, { quoted: incomingMessage });
                        }
                    } else {
                        await client.sendMessage(remoteJid, {
                            text: '❌ *Invalid Option!* ❌\n\nPlease reply with a number between 1-11 to select a menu.\n\n*Example:* Reply with "1" for Download Menu\n\n> *© 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚀𝙰𝙳𝙴𝙴𝚁 𝙰𝙸 🤖* ',
                            contextInfo: contextInfo
                        }, { quoted: incomingMessage });
                    }
                }
            } catch (error) {
                console.log('Menu system is currently busy. Please try again later.\n\n> *© 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚀𝙰𝙳𝙴𝙴𝚁 𝙰𝙸 🤖* ', error);
            }
        };

        client.ev.on('messages.upsert', messageHandler);

        setTimeout(() => {
            client.ev.off('messages.upsert', messageHandler);
        }, 300000); // 5 minutes

    } catch (error) {
        console.error('Menu send error:', error);
        try {
            await client.sendMessage(from, { text: '❌ Menu system is currently busy. Please try again later.\n\n> *© 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚀𝙰𝙳𝙴𝙴𝚁 𝙰𝙸 🤖* ' }, { quoted: message });
        } catch (finalError) {
            console.log('Final error handling failed:', finalError);
        }
    }
});