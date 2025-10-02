// group-poll.js
const { cmd } = require('../command');
const config = require('../config');

cmd({
  pattern: "poll",
  category: "group",
  desc: "Create a poll with a question and options in the group.",
  filename: __filename,
}, async (conn, mek, m, { from, isGroup, q, sender, groupMetadata, isAdmins, isOwner, reply }) => {
  try {
    if (!isGroup) return reply("This command is only for groups.");

    const isGroupCreator = groupMetadata.owner && groupMetadata.owner === sender;
    if (!isAdmins && !isGroupCreator && !isOwner) {
        return reply("❌ Only group admins, the group creator, or the bot owner can create polls.");
    }

    let [question, optionsString] = q.split(";");
    
    if (!question || !optionsString) {
      return reply(`Usage: ${config.PREFIX}poll question;option1,option2,option3...`);
    }

    let options = optionsString.split(",").map(opt => opt.trim()).filter(opt => opt);

    if (options.length < 2) {
      return reply("❌ Please provide at least two options for the poll.");
    }

    await conn.sendMessage(from, {
      poll: {
        name: question.trim(),
        values: options,
        selectableCount: 1,
      }
    }, { quoted: mek });
  } catch (e) {
    return reply(`*An error occurred:*\n${e.message}`);
  }
});
