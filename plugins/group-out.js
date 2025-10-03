const config = require('../config')
const { cmd } = require('../command')

cmd({
    pattern: "out",
    alias: ["ck"],
    desc: "Remove members with a specific country code",
    category: "admin",
    react: "❌",
    filename: __filename
},           
async (conn, mek, m, { from, q, isGroup, isOwner, sender, groupMetadata, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups.");

        const botOwnerJid = config.OWNER_NUMBER.replace('+','') + "@s.whatsapp.net";
        const isBotOwner = sender === botOwnerJid || isOwner;
        const isGroupCreator = groupMetadata?.owner === sender;

        if (!isAdmins && !isGroupCreator && !isBotOwner) {
            return reply("❌ Only group admins, the group creator, or the bot owner can use this command.");
        }

        if (!isBotAdmins) return reply("❌ I need to be an admin to remove members.");

        if (!q) return reply("❌ Please provide a country code. Example: .out 92");

        const countryCode = q.trim();
        if (!/^\d+$/.test(countryCode)) return reply("❌ Invalid country code.");

        const participants = groupMetadata.participants;
        const targets = participants.filter(p => p.id.startsWith(countryCode) && !p.admin);

        if (!targets.length) return reply(`❌ No members found with code +${countryCode}`);

        const jids = targets.map(p => p.id);
        await conn.groupParticipantsUpdate(from, jids, "remove");

        reply(`✅ Removed ${targets.length} members with code +${countryCode}`);
    } catch (e) {
        console.error("Out error:", e);
        reply("❌ Failed to remove members.");
    }
});