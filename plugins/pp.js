const { cmd } = require('../command');
const { generateProfilePicture } = require('../lib/functions'); // Assumed path for the function
const fs = require("fs");

cmd({
    pattern: "fullpp",
    alias: ["updatepp", "ppfull"],
    desc: "Sets the bot's profile picture using a quoted image.",
    category: "owner",
    react: '🍂',
    filename: __filename
}, async (conn, mek, m, { reply, isOwner, botNumber }) => {

    // --- Security Check: Only the owner can use this command ---
    if (!isOwner) {
        return reply("❌ *Owner Command* - This command is restricted to the bot owner only.");
    }

    // --- Input Validation: Check if an image is quoted ---
    if (!m.quoted || m.quoted.mtype !== 'imageMessage') {
        return reply("Please quote an image to set it as the profile picture.");
    }

    try {
        // --- Download the quoted image ---
        const mediaPath = await conn.downloadAndSaveMediaMessage(m.quoted);

        // --- Generate the profile picture thumbnail ---
        const { img } = await generateProfilePicture(mediaPath);

        // --- Update the bot's profile picture ---
        await conn.updateProfilePicture(botNumber, img);

        // --- Clean up the downloaded file ---
        fs.unlinkSync(mediaPath);

        reply("✅ Bot's profile picture has been updated successfully!");

    } catch (error) {
        console.error("Full PP Error:", error);
        reply(`❌ An error occurred while updating the profile photo: ${error.message}`);
    }
});
