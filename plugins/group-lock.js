const config = require('../config')
const { cmd } = require('../command')

cmd({
    pattern: "lockgc",
    alias: ["lock"],
    react: "🔒",
    desc: "Lock the group (Prevents new members from joining).",
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
        
        if (!isBotAdmins) return reply("❌ I need to be an admin to lock the group.");

        await conn.groupSettingUpdate(from, "locked");
        reply("✅ Group has been locked. New members cannot join.");
    } catch (e) {
        console.error("Error locking group:", e);
        reply("❌ Failed to lock the group. Please try again.");
    }
});
