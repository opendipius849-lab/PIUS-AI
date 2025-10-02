const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')

cmd({
    pattern: "tagall",
    react: "🔊",
    alias: ["gc_tagall"],
    desc: "To Tag all Members",
    category: "group",
    use: '.tagall [message]',
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isOwner, sender, groupMetadata, participants, isAdmins, reply, args }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups.");
        
        // Robust Permission Check (Admin, Group Creator, or Bot Owner)
        const isGroupCreator = groupMetadata.owner && groupMetadata.owner === sender;
        if (!isAdmins && !isGroupCreator && !isOwner) {
            return reply("❌ Only group admins, the group creator, or the bot owner can use this command.");
        }

        if (!participants || participants.length === 0) {
            return reply("❌ Failed to get the member list for this group.");
        }

        // Better way to get the message
        const message = args.join(" ") || "Attention Everyone"; 

        const groupName = groupMetadata.subject;
        const totalMembers = participants.length;

        const emojis = ['📢', '🔊', '🌐', '🔰', '❤‍🩹', '🤍', '🖤', '🩵', '📝', '💗', '🔖', '🪩', '📦', '🎉', '🛡️', '💸', '⏳', '🗿', '🚀', '🎧', '🪀', '⚡', '🚩', '🍁', '🗣️', '👻', '⚠️', '🔥'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        let teks = `▢ Group : *${groupName}*\n▢ Members : *${totalMembers}*\n▢ Message: *${message}*\n\n┌───⊷ *MENTIONS*\n`;

        for (const mem of participants) {
            teks += `${randomEmoji} @${mem.id.split('@')[0]}\n`;
        }

        teks += "└──✪ 𝐐𝐀𝐃𝐄𝐄𝐑 ┃ 𝐀𝐈 ✪──";

        await conn.sendMessage(from, { 
            text: teks, 
            mentions: participants.map(a => a.id) 
        }, { quoted: mek });

    } catch (e) {
        console.error("TagAll Error:", e);
        reply(`❌ *An error occurred.*\n\n${e.message || e}`);
    }
});
