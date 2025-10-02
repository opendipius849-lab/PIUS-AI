// group-newgc.js
const { cmd } = require('../command');
const config = require('../config');

cmd({
  pattern: "newgc",
  category: "owner", // Changed to owner for security
  desc: "Create a new group and add participants.",
  filename: __filename,
}, async (conn, mek, m, { from, isOwner, q, reply }) => {
  try {
    // Only bot owner can create new groups
    if (!isOwner) {
        return reply(`❌ This command is restricted to the bot owner.`);
    }

    if (!q) {
      return reply(`Usage: ${config.PREFIX}newgc Group Name;number1,number2,...`);
    }

    const [groupName, numbersString] = q.split(";");
    
    if (!groupName || !numbersString) {
      return reply(`Usage: ${config.PREFIX}newgc Group Name;number1,number2,...`);
    }

    const participantJids = numbersString.split(",").map(number => `${number.trim()}@s.whatsapp.net`);

    const group = await conn.groupCreate(groupName, participantJids);
    const inviteLink = await conn.groupInviteCode(group.id);

    await conn.sendMessage(group.id, { text: `🎉 Welcome to ${groupName}! The group was created by the Bot.` });

    reply(`✅ Group created successfully!\nInvite Link: https://chat.whatsapp.com/${inviteLink}`);
  } catch (e) {
    return reply(`*An error occurred:*\n${e.message}`);
  }
});
