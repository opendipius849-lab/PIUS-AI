// group-leave.js
const { sleep } = require('../lib/functions');
const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "leave",
    alias: ["left", "leftgc", "leavegc"],
    desc: "Leave the group",
    react: "👋",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isOwner, reply }) => {
    try {
        if (!isGroup) return reply("This command can only be used in groups.");
        
        // Correct owner check using isOwner flag
        if (!isOwner) {
            return reply("❌ Only the bot owner can use this command.");
        }

        await reply("Okay, goodbye everyone! 👋");
        await sleep(1000); // Small delay
        await conn.groupLeave(from);

    } catch (e) {
        console.error(e);
        // Cannot send a reply after leaving, so just log the error
    }
});
