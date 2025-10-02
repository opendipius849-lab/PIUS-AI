// group-add.js
const { cmd } = require('../command');

cmd({
    pattern: "add",
    alias: ["a", "invite"],
    desc: "Adds a member to the group",
    category: "admin",
    react: "➕",
    filename: __filename
},
async (conn, mek, m, { from, q, isGroup, sender, isOwner, groupMetadata, isBotAdmins, isAdmins, reply }) => {
    
    if (!isGroup) return reply("❌ This command can only be used in groups.");

    const isGroupCreator = groupMetadata.owner && groupMetadata.owner === sender;
    if (!isAdmins && !isGroupCreator && !isOwner) {
        return reply("❌ Only group admins, the group creator, or the bot owner can use this command.");
    }
    if (!isBotAdmins) return reply("❌ I need to be an admin to use this command.");

    let number;
    if (m.quoted) {
        number = m.quoted.sender.split("@")[0];
    } else if (q && q.includes("@")) {
        number = q.replace(/[@\s]/g, '');
    } else if (q && /^\d+$/.test(q)) {
        number = q;
    } else {
        return reply("❌ Please reply to a message, mention a user, or provide a number to add.");
    }

    const jid = number + "@s.whatsapp.net";

    try {
        await conn.groupParticipantsUpdate(from, [jid], "add");
        reply(`✅ Successfully added @${number}`, { mentions: [jid] });
    } catch (error) {
        console.error("Add command error:", error);
        reply("❌ Failed to add the member. They may have blocked the bot or have privacy settings enabled.");
    }
});
