// group-link.js
const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "invite",
    alias: ["glink", "grouplink"],
    desc: "Get group invite link.",
    category: "group",
    filename: __filename,
}, 
async (conn, mek, m, { from, isGroup, sender, isOwner, groupMetadata, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply("❌ This command is only for groups.");

        // check for bot owner, group creator, admins
        const botOwnerJid = config.OWNER_NUMBER.replace('+', '') + "@s.whatsapp.net";
        const isBotOwner = sender === botOwnerJid || isOwner;
        const isGroupCreator = groupMetadata?.owner === sender;

        if (!isAdmins && !isGroupCreator && !isBotOwner) {
            return reply("❌ Only group admins, the group creator, or the bot owner can use this command.");
        }

        if (!isBotAdmins) return reply("❌ I need to be an admin to fetch the invite link.");

        const inviteCode = await conn.groupInviteCode(from);
        const inviteLink = `https://chat.whatsapp.com/${inviteCode}`;

        reply(`✅ *Group Invite Link:*\n${inviteLink}`);
        
    } catch (error) {
        console.error("Error in invite command:", error);
        reply(`❌ An error occurred: ${error.message}`);
    }
});