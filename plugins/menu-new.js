const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime, sleep } = require('../lib/functions');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

cmd({
    pattern: 'menu',
    desc: 'Show interactive menu system',
    category: 'main',
    filename: __filename
}, async (client, message, afk, { from, reply }) => {

    await client.sendMessage(afk.key['remoteJid'], { react: { text: '🤖', key: afk.key } });

    try {
        const verifiedReply = {
            key: {
                participant: `0@s.whatsapp.net`,
                fromMe: false,
                remoteJid: "status@broadcast"
            },
            message: {
                extendedTextMessage: {
                    text: "",
                    contextInfo: {
                        mentionedJid: [],
                        verifiedBizName: "Qadeer-AI"
                    }
                }
            }
        };

        const initialMenuText = `            ║ 𝐐𝐀𝐃𝐄𝐄𝐑-𝐀𝐈 ║ 
                      
╔═════════════╗
║ 👤 *Owner* : *${config.OWNER_NAME}*
║ 📦 *Library* : *Baileys Pro*
║ 🚦 *Mode* : *[ ${config.MODE} ]*
║ 🔖 *Prefix* : *[ ${config.PREFIX} ]*
║ 📌 *Version* : *4.0.0*
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
│ 1️⃣2️⃣  🔐  *Privacy Menu*
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

        let menuMessage;
        try {
            menuMessage = await client.sendMessage(from, {
                image: { url: 'https://qu.ax/Pusls.jpg' },
                caption: initialMenuText,
                contextInfo: contextInfo
            }, { quoted: verifiedReply });
        } catch (e) {
            console.log('Image send failed, falling back to text');
            menuMessage = await client.sendMessage(from, { text: initialMenuText, contextInfo: contextInfo }, { quoted: verifiedReply });
        }

        const menuMessageId = menuMessage.key.id;

        const menuOptions = {
            '1': {
                title: '📥 *Download Menu* 📥',
                content: `╭✧〈 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 𝐌𝐄𝐍𝐔 〉
┃🜸 fb
┃🜸 fb1
┃🜸 fb2
┃🜸 mediafire
┃🜸 ig 
┃🜸 tiktok
┃🜸 ringtone
┃🜸 apk
┃🜸 apk2
┃🜸 gitclone
┃🜸 pindl
┃🜸 rw
┃🜸 play
┃🜸 video
╰────────────๏
> *© 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚀𝙰𝙳𝙴𝙴𝚁 𝙰𝙸 🤖* `,
                image: true
            },
            '2': {
                title: '👥 *Group Menu* 👥',
                content: `╭✧〈 𝐆𝐑𝐎𝐔𝐏 𝐌𝐄𝐍𝐔 〉
┃🜸 requestlist
┃🜸 acceptall
┃🜸 rejectall
┃🜸 admin
┃🜸 add
┃🜸 demote
┃🜸 kick
┃🜸 promote
┃🜸 demote
┃🜸 dismiss
┃🜸 updategdesc
┃🜸 updategname
┃🜸 ginfo
┃🜸 join
┃🜸 invite
┃🜸 ginfo
┃🜸 leave
┃🜸 delete
┃🜸 lockgc
┃🜸 unlockgc
┃🜸 newgc
┃🜸 mute
┃🜸 out
┃🜸 promote
┃🜸 poll
┃🜸 revoke
┃🜸 hidetag
┃🜸 tagall
┃🜸 removemembers
┃🜸 removeadmins
┃🜸 removeall2
┃🜸 mute
┃🜸 unmute
┃🜸 tagall
┃🜸 tagadmins
┃🜸 broadcast
╰────────────๏
> *© 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚀𝙰𝙳𝙴𝙴𝚁 𝙰𝙸 🤖* `,
                image: true
            },
            '3': {
                title: '😄 *Fun Menu* 😄',
                content: `╭✧〈 𝐅𝐔𝐍 𝐌𝐄𝐍𝐔 〉
┃🜸 flirt
┃🜸 character
┃🜸 repeat
┃🜸 shayari
┃🜸 hack
┃🜸 happy
┃🜸 angry
┃🜸 shy
┃🜸 sad
┃🜸 hot
┃🜸 confused
┃🜸 heart
┃🜸 nikal
┃🜸 moon
┃🜸 compatibility
┃🜸 aura
┃🜸 roast
┃🜸 compliment
┃🜸 8ball
┃🜸 lovetest
┃🜸 quote
┃🜸 marige
┃🜸 bacha
┃🜸 bachi 
╰────────────๏
> *© 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚀𝙰𝙳𝙴𝙴𝚁 𝙰𝙸 🤖* `,
                image: true
            },
            '4': {
                title: '👑 *Owner Menu* 👑',
                content: `╭✧〈 𝐎𝐖𝐍𝐄𝐑 𝐌𝐄𝐍𝐔 〉
┃🜸 owner
┃🜸 restart
┃🜸 vv
┃🜸 vv2
┃🜸 block
┃🜸 unblock
┃🜸 setsudo
┃🜸 delsudo
┃🜸 listsudo
┃🜸 ban
┃🜸 unban
┃🜸 listban
┃🜸 update
┃🜸 gjid
┃🜸 help
┃🜸 jid-all
┃🜸 gjid
┃🜸 clearchats
┃🜸 setpp
┃🜸 broadcast
┃🜸 shutdown
┃🜸 setpassword
┃🜸 viewpassword
┃🜸 share
╰────────────๏
> *© 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚀𝙰𝙳𝙴𝙴𝚁 𝙰𝙸 🤖* `,
                image: true
            },
            '5': {
                title: '🤖 *AI Menu* 🤖',
                content: `╭✧〈 𝐀𝐈 𝐌𝐄𝐍𝐔 〉
┃🜸 ai
┃🜸 creat-img or imagine
┃🜸 aivoice
╰────────────๏
> *© 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚀𝙰𝙳𝙴𝙴𝚁 𝙰𝙸 🤖* `,
                image: true
            },
            '6': {
                title: '🔎 *Search Menu* 🔍',
                content: `╭✧〈 𝐒𝐄𝐀𝐑𝐂𝐇 𝐌𝐄𝐍𝐔 〉
┃🜸 yts
┃🜸 define
┃🜸 sgithub
┃🜸 playstore
┃🜸 repo
┃🜸 srepo
╰────────────๏
> *© 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚀𝙰𝙳𝙴𝙴𝚁 𝙰𝙸 🤖* `,
                image: true
            },
            '7': {
                title: '🔄 *Convert Menu* 🔄',
                content: `╭✧〈 𝐓𝐎𝐎𝐋𝐒 𝐌𝐄𝐍𝐔 〉
┃🜸 calculate
┃🜸 emojimix
┃🜸 fancy
┃🜸 take
┃🜸 emoji
┃🜸 gpass
┃🜸 trt
┃🜸 shorturl
┃🜸 tourl
┃🜸 sticker2img
┃🜸 vsticker
┃🜸 toptt
┃🜸 topdf
┃🜸 attp
┃🜸 tts2
┃🜸 tts3
╰────────────๏
> *© 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚀𝙰𝙳𝙴𝙴𝚁 𝙰𝙸 🤖* `,
                image: true
            },
            '8': {
                title: '📌 *Utility Menu* 📌',
                content: `╭✧〈 𝐔𝐓𝐈𝐋𝐓𝐘 𝐌𝐄𝐍𝐔 〉
┃🜸 caption
┃🜸 jid
┃🜸 save
┃🜸 take
┃🜸 sticker
┃🜸 person
┃🜸 report
┃🜸 reportlist
┃🜸 tempmail
┃🜸 checkmail
┃🜸 requestunban
╰────────────๏
> *© 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚀𝙰𝙳𝙴𝙴𝚁 𝙰𝙸 🤖* `,
                image: true
            },
            '9': {
                title: '🏠 *Main Menu* 🏠',
                content: `╭✧〈 𝐌𝐀𝐈𝐍 𝐌𝐄𝐍𝐔 〉
┃🜸 praytime
┃🜸 quran
┃🜸 menu
┃🜸 menu2
┃🜸 ping
┃🜸 ping2
┃🜸 speed
┃🜸 alive
┃🜸 alive2
┃🜸 setalive
┃🜸 runtime
┃🜸 repo
┃🜸 owner
┃🜸 restart
┃🜸 creator
╰────────────๏
> *© 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚀𝙰𝙳𝙴𝙴𝚁 𝙰𝙸 🤖* `,
                image: true
            },
            '10': {
                title: '⚙️ *Settings Menu* ⚙️',
                content: `╭✧〈 𝐒𝐄𝐓𝐓𝐈𝐍𝐆𝐒 𝐌𝐄𝐍𝐔 〉
┃🜸 admin-events
┃🜸 welcome
┃🜸 mode or setmode
┃🜸 auto-typing
┃🜸 mention-reply
┃🜸 always-online
┃🜸 auto-recording
┃🜸 auto-seen
┃🜸 status-react
┃🜸 status-reply
┃🜸 auto-react
┃🜸 auto-reply
┃🜸 auto-sticker
┃🜸 anti-bad
┃🜸 read-message
╰────────────๏
> *© 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚀𝙰𝙳𝙴𝙴𝚁 𝙰𝙸 🤖* `,
                image: true
            },
            '11': {
                title: '🎨 *Logo Maker* 🎨',
                content: `╭✧〈 𝐋𝐎𝐆𝐎 𝐌𝐀𝐊𝐄𝐑 〉
┃🜸 neonlight
┃🜸 blackpink
┃🜸 dragonball
┃🜸 3dcomic
┃🜸 america
┃🜸 naruto
┃🜸 sadgirl
┃🜸 clouds
┃🜸 futuristic
┃🜸 3dpaper
┃🜸 eraser
┃🜸 sunset
┃🜸 leaf
┃🜸 galaxy
┃🜸 sans
┃🜸 boom
┃🜸 hacker
┃🜸 devilwings
┃🜸 nigeria
┃🜸 bulb
┃🜸 angelwings
┃🜸 zodiac
┃🜸 luxury
┃🜸 paint
┃🜸 frozen
┃🜸 castle
┃🜸 tatoo
┃🜸 valorant
┃🜸 bear
┃🜸 typography
┃🜸 birthday
╰────────────๏
> *© 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚀𝙰𝙳𝙴𝙴𝚁 𝙰𝙸 🤖* `,
                image: true
            },
            '12': {
                title: '🔐 *Privacy Menu* 🔐',
                content: `╭✧〈 𝐏𝐑𝐈𝐕𝐀𝐂𝐘 𝐌𝐄𝐍𝐔 〉
┃🜸 privacy
┃🜸 blocklist
┃🜸 getbio
┃🜸 setppall
┃🜸 setonline
┃🜸 setpp
┃🜸 setmyname
┃🜸 updatebio
┃🜸 groupsprivacy
┃🜸 getprivacy
┃🜸 getpp
╰────────────๏
> *© 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚀𝙰𝙳𝙴𝙴𝚁 𝙰𝙸 🤖* `,
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
                            text: '❌ *Invalid Option!* ❌\n\nPlease reply with a number between 1-12 to select a menu.\n\n*Example:* Reply with "1" for Download Menu\n\n> *© 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚀𝙰𝙳𝙴𝙴𝚁 𝙰𝙸 🤖* ',
                            contextInfo: contextInfo
                        }, { quoted: incomingMessage });
                    }
                }
            } catch (error) {
                console.log('Message handler error:', error);
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