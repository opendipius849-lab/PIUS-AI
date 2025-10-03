// group-kick.js
const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "kick",
    alias: ["remove", "k"],
    desc: "Instantly remove any member",
    category: "admin",
    react: "🗑️",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, sender, isOwner, groupMetadata, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply("❌ This command works only in groups!");

        // robust checks
        const botOwnerJid = config.OWNER_NUMBER.replace('+', '') + "@s.whatsapp.net";
        const isBotOwner = sender === botOwnerJid || isOwner;
        const isGroupCreator = groupMetadata?.owner === sender;

        if (!isAdmins && !isGroupCreator && !isBotOwner) {
            return reply("❌ Only group admins, the group creator, or the bot owner can use this command.");
        }

        if (!isBotAdmins) return reply("❌ I need to be an admin to kick members.");

        // get target (quoted or mentioned)
        const target = m.quoted?.sender || (m.mentionedJid && m.mentionedJid[0]);
        if (!target) return reply("❌ Reply to a message or mention a user to kick!");

        const botId = conn.user?.id || conn.user?.jid;
        if (target === botId) return reply("❌ I cannot kick myself from the group.");

        // try kicking
        await conn.groupParticipantsUpdate(from, [target], "remove");

        await conn.sendMessage(from, {
            text: `🚫 @${target.split('@')[0]} has been kicked!`,
            mentions: [target]
        }, { quoted: mek });

    } catch (error) {
        console.error("[KICK ERROR]", error);
        reply("❌ Failed to kick. The user might be the group creator or protected.");
    }
});