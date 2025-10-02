// group-info.js
const config = require('../config')
const { cmd } = require('../command')
const { getBuffer } = require('../lib/functions')

cmd({
    pattern: "ginfo",
    react: "🥏",
    alias: ["groupinfo"],
    desc: "Get group information.",
    category: "group",
    use: '.ginfo',
    filename: __filename
},
async (conn, mek, m, { from, isGroup, sender, isOwner, isBotAdmins, isAdmins, reply, groupMetadata, participants }) => {
    try {
        if (!isGroup) return reply(`❌ This command only works in group chats.`);
        
        const isGroupCreator = groupMetadata.owner && groupMetadata.owner === sender;
        if (!isAdmins && !isGroupCreator && !isOwner) {
            return reply("❌ Only group admins, the group creator, or the bot owner can use this command.");
        }
        if (!isBotAdmins) return reply(`❌ I need *admin* rights to fetch group details.`);

        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(from, 'image');
        } catch {
            ppUrl = 'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png';
        }

        const groupAdmins = participants.filter(p => p.admin);
        const listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`).join('\n');
        const owner = groupMetadata.owner || "unknown";

        const gdata = `*「 Group Information 」*\n
*Group Name* : ${groupMetadata.subject}
*Group ID* : ${groupMetadata.id}
*Participants* : ${groupMetadata.size}
*Group Creator* : @${owner.split('@')[0]}
*Description* : ${groupMetadata.desc?.toString() || 'No description'}\n
*Admins (${groupAdmins.length})*:\n${listAdmin}`

        await conn.sendMessage(from, {
            image: { url: ppUrl },
            caption: gdata,
            mentions: groupAdmins.map(v => v.id).concat([owner])
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply(`❌ An error occurred:\n\n${e.message}`);
    }
});
