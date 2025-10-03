// group-gname.js
const { cmd } = require('../command')
const config = require('../config')

cmd({
    pattern: "updategname",
    alias: ["upgname", "gname"],
    react: "📝",
    desc: "Change the group name.",
    category: "group",
    filename: __filename
},           
async (conn, mek, m, { from, isGroup, isOwner, sender, groupMetadata, isAdmins, isBotAdmins, q, reply }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups.");

        const botOwnerJid = config.OWNER_NUMBER.replace('+','') + "@s.whatsapp.net";
        const isBotOwner = sender === botOwnerJid || isOwner;
        const isGroupCreator = groupMetadata?.owner === sender;

        if (!isAdmins && !isGroupCreator && !isBotOwner) {
            return reply("❌ Only group admins, the group creator, or the bot owner can use this command.");
        }

        if (!isBotAdmins) return reply("❌ I need to be an admin to update the group name.");
        if (!q) return reply("❌ Please provide a new group name.");

        if (q.length > 25) return reply("❌ Group name cannot exceed 25 characters.");

        await conn.groupUpdateSubject(from, q);
        reply(`✅ Group name has been updated to: *${q}*`);

    } catch (e) {
        console.error("Error updating group name:", e);
        reply("❌ Failed to update the group name. Please try again.");
    }
});