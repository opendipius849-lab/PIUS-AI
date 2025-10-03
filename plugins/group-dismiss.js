// group-dismiss.js
const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "demote",
    alias: ["d", "dismiss", "removeadmin"],
    desc: "Demotes a group admin to a normal member",
    category: "admin",
    react: "⬇️",
    filename: __filename
},
async (conn, mek, m, { from, q, isGroup, sender, isOwner, groupMetadata, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups.");

        const botOwnerJid = config.OWNER_NUMBER.replace('+','') + "@s.whatsapp.net";
        const isBotOwner = sender === botOwnerJid || isOwner;
        const isGroupCreator = groupMetadata?.owner === sender;

        if (!isAdmins && !isGroupCreator && !isBotOwner) {
            return reply("❌ Only group admins, the group creator, or the bot owner can use this command.");
        }
        if (!isBotAdmins) return reply("❌ I need to be an admin to use this command.");

        let number;
        if (m.quoted) {
            number = m.quoted.sender.split("@")[0];
        } else if (q) {
            number = q.replace(/[^0-9]/g, ""); // remove everything except digits
        } else {
            return reply("❌ Please reply to a message or provide a valid number to demote.");
        }

        const jid = number + "@s.whatsapp.net";
        const botJid = conn.user.id.split(":")[0] + "@s.whatsapp.net";

        if (jid === botJid) return reply("❌ The bot cannot demote itself.");
        if (jid === botOwnerJid) return reply("❌ The bot owner cannot be demoted.");

        // check if target is actually an admin
        const targetData = groupMetadata.participants.find(p => p.id === jid);
        if (!targetData) return reply("❌ This user is not in the group.");
        if (!targetData.admin) return reply("⚠️ This user is already a normal member.");

        await conn.groupParticipantsUpdate(from, [jid], "demote");
        reply(`✅ Successfully demoted @${number} to a normal member.`, { mentions: [jid] });

    } catch (error) {
        console.error("Demote command error:", error);
        reply("❌ Failed to demote the member.");
    }
});