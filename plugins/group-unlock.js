const config = require('../config')
const { cmd } = require('../command')

cmd({
    pattern: "unlockgc",
    alias: ["unlock"],
    react: "🔓",
    desc: "Unlock the group (Allows new members to join).",
    category: "group",
    filename: __filename
},           
async (conn, mek, m, { from, isGroup, isOwner, sender, groupMetadata, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups.");

        const botOwnerJid = config.OWNER_NUMBER.replace('+','') + "@s.whatsapp.net";
        const isBotOwner = sender === botOwnerJid || isOwner;
        const isGroupCreator = groupMetadata?.owner === sender;

        if (!isAdmins && !isGroupCreator && !isBotOwner) {
            return reply("❌ Only group admins, the group creator, or the bot owner can unlock the group.");
        }

        if (!isBotAdmins) return reply("❌ I need to be an admin to unlock the group.");

        await conn.groupSettingUpdate(from, "unlocked");
        reply("✅ Group has been unlocked. New members can join.");
    } catch (e) {
        console.error("Error unlocking group:", e);
        reply("❌ Failed to unlock the group. Please try again.");
    }
});