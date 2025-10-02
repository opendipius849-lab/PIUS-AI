// group-gname.js
const { cmd } = require('../command')

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

        const isGroupCreator = groupMetadata.owner && groupMetadata.owner === sender;
        if (!isAdmins && !isGroupCreator && !isOwner) {
            return reply("❌ Only group admins, the group creator, or the bot owner can use this command.");
        }
        if (!isBotAdmins) return reply("❌ I need to be an admin to update the group name.");
        if (!q) return reply("❌ Please provide a new group name.");

        await conn.groupUpdateSubject(from, q);
        reply(`✅ Group name has been updated to: *${q}*`);
    } catch (e) {
        console.error("Error updating group name:", e);
        reply("❌ Failed to update the group name.");
    }
});
