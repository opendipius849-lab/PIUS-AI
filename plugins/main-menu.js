const config = require('../config')
const { cmd, commands } = require('../command');
// const path = require('path')
// const os = require("os")
const os = require("os")
const { runtime } = require('../lib/functions')
const axios = require('axios')

cmd({
    pattern: "menu2",
    alias: ["allmenu", "fullmenu"],
    desc: "Show all bot commands",
    category: "main",
    react: "✅",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
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

        let dec = `╔═〔 *${config.BOT_NAME}* 〕╗

║ *Owner* : *${config.OWNER_NAME}*
║ *Library* : *Baileys Pro*
║ *Hosting* : *Heroku*
║ *Mode* : [ *${config.MODE}* ]
║ *Prefix* : [ *${config.PREFIX}* ]
║ *Version* : *4.0.0*
╚═══════════════╝

╭✧〈 𝐌𝐀𝐈𝐍 𝐌𝐄𝐍𝐔 〉
┃🜸 praytime
┃🜸 quran
┃🜸 menu
┃🜸 menu2
┃🜸 ping
┃🜸 ping2
┃🜸 alive
┃🜸 alive2
┃🜸 setalive
┃🜸 runtime
┃🜸 repo
┃🜸 owner
┃🜸 restart
┃🜸 creator
╰────────────๏

╭✧〈 𝐀𝐈 𝐌𝐄𝐍𝐔 〉
┃🜸 ai
┃🜸 creat-img or imagine
┃🜸 aivoice
╰────────────๏

╭✧〈 𝐎𝐖𝐍𝐄𝐑 𝐌𝐄𝐍𝐔 〉
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
┃🜸 viewpassword
┃🜸 setpassword
┃🜸 share
╰────────────๏

╭✧〈 𝐒𝐄𝐓𝐓𝐈𝐍𝐆𝐒 𝐌𝐄𝐍𝐔 〉
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

╭✧〈 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 𝐌𝐄𝐍𝐔 〉
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
┃🜸 yts
┃🜸 play
┃🜸 video
╰────────────๏

╭✧〈 𝐆𝐑𝐎𝐔𝐏 𝐌𝐄𝐍𝐔 〉
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


╭✧〈 𝐂𝐇𝐀𝐍𝐍𝐄𝐋 𝐌𝐄𝐍𝐔 〉
┃🜸 channel-id
┃🜸 channel-info
╰────────────๏

╭✧〈 𝐋𝐎𝐆𝐎 𝐌𝐀𝐊𝐄𝐑 〉
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

╭✧〈 𝐅𝐔𝐍 𝐌𝐄𝐍𝐔 〉
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

╭✧〈 𝐓𝐎𝐎𝐋𝐒 𝐌𝐄𝐍𝐔 〉
┃🜸 calculate
┃🜸 emojimix
┃🜸 fancy
┃🜸 take
┃🜸 emoji
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

╭✧〈 𝐀𝐍𝐈𝐌𝐄 𝐌𝐄𝐍𝐔 〉
┃🜸 animegirl
┃🜸 animegirl1
┃🜸 animegirl2
┃🜸 animegirl3
┃🜸 animegirl4
┃🜸 animegirl5
┃🜸 neko
┃🜸 maid
┃🜸 waifu
┃🜸 truth
┃🜸 dare
┃🜸 fack
┃🜸 foxgirl
┃🜸 dog
┃🜸 garl
┃🜸 loli
┃🜸 awoo
┃🜸 megnumin
┃🜸 anime1
┃🜸 anime2
┃🜸 anime3
┃🜸 anime4
┃🜸 anime5
┃🜸 animenews
┃🜸 naruto
╰────────────๏

╭✧〈 𝐔𝐓𝐈𝐋𝐓𝐘 𝐌𝐄𝐍𝐔 〉
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


╭✧〈 𝐒𝐄𝐀𝐑𝐂𝐇 𝐌𝐄𝐍𝐔 〉
┃🜸 yts
┃🜸 define
┃🜸 sgithub
┃🜸 repo
┃🜸 srepo
┃🜸 tiktoksearch
┃🜸 tiktokstalk
╰────────────๏

╭✧〈 𝐏𝐑𝐈𝐕𝐀𝐂𝐘 𝐌𝐄𝐍𝐔 〉
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

> *© 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚀𝙰𝙳𝙴𝙴𝚁 𝙰𝙸 🤖* `;

        await conn.sendMessage(
            from,
            {
                image: { url: config.MENU_IMAGE_URL || 'https://qu.ax/Pusls.jpg' },
                caption: dec,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363299692857279@newsletter',
                        newsletterName: config.BOT_NAME,
                        serverMessageId: 143
                    }
                }
            },
            { quoted: verifiedReply }
        );

        // audio send removed as requested

    } catch (e) {
        console.log(e);
        reply(`❌ Error: ${e}`);
    }
});