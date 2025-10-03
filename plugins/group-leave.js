// group-leave.js
const { sleep } = require('../lib/functions');
const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "leave",
    alias: ["left", "leftgc", "leavegc"],
    desc: "Bot leaves the group",
    react: "👋",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, sender, isOwner, reply }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups.");

        // double check owner number from config
        const botOwnerJid = config.OWNER_NUMBER.replace('+', '') + "@s.whatsapp.net";
        const isBotOwner = sender === botOwnerJid || isOwner;

        if (!isBotOwner) {
            return reply("❌ Only the bot owner can use this command.");
        }

        await reply("Okay, goodbye everyone! 👋");
        await sleep(1000); // small delay before leaving
        await conn.groupLeave(from);

    } catch (e) {
        console.error("Error leaving group:", e);
        // bot will already leave, so no reply possible after
    }
});