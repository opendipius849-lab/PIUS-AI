// group-kick.js
const { cmd } = require('../command');

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

        const isGroupCreator = groupMetadata.owner && groupMetadata.owner === sender;
        if (!isAdmins && !isGroupCreator && !isOwner) {
            return reply("❌ Only group admins, the group creator, or the bot owner can use this command.");
        }
        if (!isBotAdmins) return reply("❌ I need to be an admin to kick members.");

        const target = m.quoted?.sender || m.mentionedJid?.[0];
        if (!target) return reply("❌ Reply to a message or mention a user to kick!");
        
        const botId = conn.user.id;
        if (target === botId) return reply("❌ I cannot kick myself from the group.");

        await conn.groupParticipantsUpdate(from, [target], "remove");

        await reply(`🚫 @${target.split('@')[0]} has been kicked!`, {
            mentions: [target]
        });

    } catch (error) {
        console.error("[KICK ERROR]", error);
        reply("❌ Failed to kick. The user might be the group creator.");
    }
});
