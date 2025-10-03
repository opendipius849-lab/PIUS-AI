const config = require('../config')
const { cmd } = require('../command')

cmd({
    pattern: "revoke",
    alias: ["revokegrouplink", "resetglink", "revokelink"],
    react: "🖇️",
    desc: "Reset the group link",
    category: "group",
    filename: __filename
},           
async (conn, mek, m, { from, isGroup, isOwner, sender, groupMetadata, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply("❌ This command only works in groups.");

        const botOwnerJid = config.OWNER_NUMBER.replace('+','') + "@s.whatsapp.net";
        const isBotOwner = sender === botOwnerJid || isOwner;
        const isGroupCreator = groupMetadata?.owner === sender;

        if (!isAdmins && !isGroupCreator && !isBotOwner) {
            return reply("❌ Only group admins, the group creator, or the bot owner can reset the link.");
        }

        if (!isBotAdmins) return reply("❌ I need to be an admin to reset the group link.");

        await conn.groupRevokeInvite(from);
        const newLink = await conn.groupInviteCode(from);

        reply(`✅ Group link has been reset!\n\n🔗 New Link: https://chat.whatsapp.com/${newLink}`);
    } catch (e) {
        console.error("Revoke error:", e);
        reply("❌ Failed to reset the group link.");
    }
});