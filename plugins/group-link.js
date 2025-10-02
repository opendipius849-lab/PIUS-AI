// group-link.js
const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "invite",
    alias: ["glink", "grouplink"],
    desc: "Get group invite link.",
    category: "group",
    filename: __filename,
}, async (conn, mek, m, { from, isGroup, sender, isOwner, groupMetadata, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply("❌ This command is only for groups.");

        const isGroupCreator = groupMetadata.owner && groupMetadata.owner === sender;
        if (!isAdmins && !isGroupCreator && !isOwner) {
            return reply("❌ Only group admins, the group creator, or the bot owner can use this command.");
        }
        if (!isBotAdmins) return reply("❌ I need to be an admin to get the invite link.");

        const inviteCode = await conn.groupInviteCode(from);
        const inviteLink = `https://chat.whatsapp.com/${inviteCode}`;

        return reply(`*Here is the group invite link:*\n${inviteLink}`);
        
    } catch (error) {
        console.error("Error in invite command:", error);
        reply(`An error occurred: ${error.message}`);
    }
});
