// group-admin.js
const { cmd } = require('../command');

cmd({
    pattern: "admin",
    alias: ["takeadmin", "makeadmin"],
    desc: "Take adminship for the bot owner",
    category: "owner",
    react: "👑",
    filename: __filename
},
async (conn, mek, m, { from, sender, isBotAdmins, isGroup, isOwner, reply }) => {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    if (!isBotAdmins) return reply("❌ I need to be an admin to perform this action.");

    // Check if the user is the bot owner
    if (!isOwner) {
        return reply("❌ This command is restricted to the bot owner only.");
    }

    try {
        const groupMetadata = await conn.groupMetadata(from);
        const userParticipant = groupMetadata.participants.find(p => p.id === sender);
        
        if (userParticipant?.admin) {
            return reply("ℹ️ You're already an admin in this group.");
        }

        await conn.groupParticipantsUpdate(from, [sender], "promote");
        return reply("✅ Successfully granted you admin rights!");
        
    } catch (error) {
        console.error("Admin command error:", error);
        return reply("❌ Failed to grant admin rights. Error: " + error.message);
    }
});
