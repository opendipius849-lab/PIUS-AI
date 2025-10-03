// group-gdesc.js
const { cmd } = require('../command')
const config = require('../config')

cmd({
    pattern: "updategdesc",
    alias: ["upgdesc", "gdesc"],
    react: "📜",
    desc: "Change the group description.",
    category: "group",
    filename: __filename
},           
async (conn, mek, m, { from, isGroup, isOwner, sender, groupMetadata, isAdmins, isBotAdmins, q, reply }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups.");

        const botOwnerJid = config.OWNER_NUMBER.replace('+','') + "@s.whatsapp.net";
        const isBotOwner = sender === botOwnerJid || isOwner;
        const isGroupCreator = groupMetadata?.owner === sender;

        // Allow → group admins OR group creator OR bot owner
        if (!isAdmins && !isGroupCreator && !isBotOwner) {
            return reply("❌ Only group admins, the group creator, or the bot owner can use this command.");
        }

        if (!isBotAdmins) return reply("❌ I need to be an admin to update the group description.");
        if (!q) return reply("❌ Please provide a new group description.");

        if (q.length > 500) {
            return reply("❌ Group description cannot exceed 500 characters.");
        }

        await conn.groupUpdateDescription(from, q);
        reply("✅ Group description has been updated successfully.");

    } catch (e) {
        console.error("Error updating group description:", e);
        reply("❌ Failed to update the group description. Please try again.");
    }
});