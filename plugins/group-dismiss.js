// group-dismiss.js
const { cmd } = require('../command');

cmd({
    pattern: "demote",
    alias: ["d", "dismiss", "removeadmin"],
    desc: "Demotes a group admin to a normal member",
    category: "admin",
    react: "⬇️",
    filename: __filename
},
async(conn, mek, m, { from, q, isGroup, sender, isOwner, groupMetadata, isBotAdmins, isAdmins, reply }) => {
    
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
    } else {
        return reply("❌ Please reply to a message or provide a number to demote.");
    }

    const botNumber = conn.user.id.split(":")[0];
    if (number === botNumber) return reply("❌ The bot cannot demote itself.");

    const jid = number + "@s.whatsapp.net";

    try {
        await conn.groupParticipantsUpdate(from, [jid], "demote");
        reply(`✅ Successfully demoted @${number} to a normal member.`, { mentions: [jid] });
    } catch (error) {
        console.error("Demote command error:", error);
        reply("❌ Failed to demote the member.");
    }
});
