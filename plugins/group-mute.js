const config = require('../config')
const { cmd } = require('../command')

cmd({
    pattern: "mute",
    alias: ["groupmute"],
    react: "🔇",
    desc: "Mute the group (Only admins can send messages).",
    category: "group",
    filename: __filename
},           
async (conn, mek, m, { from, isGroup, isOwner, sender, groupMetadata, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups.");
        
        // Check if the user is the group creator
        const isGroupCreator = groupMetadata.owner && groupMetadata.owner === sender;

        // ROBUST CHECK: Allows Group Admin, Group Creator, or Bot Owner
        if (!isAdmins && !isGroupCreator && !isOwner) {
            return reply("❌ Only group admins, the group creator, or the bot owner can use this command.");
        }
        
        if (!isBotAdmins) return reply("❌ I need to be an admin to mute the group.");

        await conn.groupSettingUpdate(from, "announcement");
        reply("✅ Group has been muted. Only admins can send messages.");
    } catch (e) {
        console.error("Error muting group:", e);
        reply("❌ Failed to mute the group. Please try again.");
    }
});
