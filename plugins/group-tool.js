const { cmd } = require('../command');
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// remove only member
cmd({
    pattern: "removemembers",
    alias: ["kickall", "endgc", "endgroup"],
    desc: "Remove all non-admin members from the group.",
    react: "🎉",
    category: "group",
    filename: __filename,
}, 
async (conn, mek, m, {
    from, groupMetadata, groupAdmins, isBotAdmins, sender, isOwner, reply, isGroup
}) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups.");

        const isGroupCreator = groupMetadata.owner && groupMetadata.owner === sender;

        if (!isOwner && !isGroupCreator) {
            return reply("❌ Only the bot owner or group creator can use this command.");
        }

        if (!isBotAdmins) {
            return reply("❌ I need to be an admin to execute this command.");
        }

        const allParticipants = groupMetadata.participants;
        const nonAdminParticipants = allParticipants.filter(member => !groupAdmins.includes(member.id));

        if (nonAdminParticipants.length === 0) {
            return reply("ℹ️ There are no non-admin members to remove.");
        }

        reply(`🚨 Removing ${nonAdminParticipants.length} non-admin members...`);

        for (let participant of nonAdminParticipants) {
            try {
                await conn.groupParticipantsUpdate(from, [participant.id], "remove");
                await sleep(2000);
            } catch (e) {
                console.error(`Failed to remove ${participant.id}:`, e);
            }
        }

        reply("✅ Successfully removed all non-admin members from the group.");
    } catch (e) {
        console.error("Error removing non-admin users:", e);
        reply("❌ An error occurred while trying to remove non-admin members.");
    }
});


// remove only admins
cmd({
    pattern: "removeadmins",
    alias: ["kickadmins", "kickall3", "deladmins"],
    desc: "Remove all admin members from the group, excluding the bot and bot owner.",
    react: "🎉",
    category: "group",
    filename: __filename,
}, 
async (conn, mek, m, {
    from, isGroup, groupMetadata, groupAdmins, isBotAdmins, sender, isOwner, reply
}) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups.");

        const isGroupCreator = groupMetadata.owner && groupMetadata.owner === sender;

        if (!isOwner && !isGroupCreator) {
            return reply("❌ Only the bot owner or group creator can use this command.");
        }

        if (!isBotAdmins) {
            return reply("❌ I need to be an admin to execute this command.");
        }

        const botNumber = conn.user.id;
        const allParticipants = groupMetadata.participants;
        const adminParticipants = allParticipants.filter(
            member => groupAdmins.includes(member.id) && member.id !== botNumber && member.id !== groupMetadata.owner
        );

        if (adminParticipants.length === 0) {
            return reply("ℹ️ There are no admin members to remove.");
        }

        reply(`🚨 Removing ${adminParticipants.length} admin members (excluding bot and group creator)...`);

        for (let participant of adminParticipants) {
            try {
                await conn.groupParticipantsUpdate(from, [participant.id], "remove");
                await sleep(2000);
            } catch (e) {
                console.error(`Failed to remove ${participant.id}:`, e);
            }
        }

        reply("✅ Successfully removed all admin members (excluding bot and group creator).");
    } catch (e) {
        console.error("Error removing admins:", e);
        reply("❌ An error occurred while trying to remove admins.");
    }
});


// remove admins and members both
cmd({
    pattern: "removeall2",
    alias: ["kickall2", "endgc2", "endgroup2"],
    desc: "Remove all members and admins from the group, excluding the bot and bot owner.",
    react: "🎉",
    category: "group",
    filename: __filename,
}, 
async (conn, mek, m, {
    from, isGroup, groupMetadata, isBotAdmins, sender, isOwner, reply
}) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups.");

        const isGroupCreator = groupMetadata.owner && groupMetadata.owner === sender;

        if (!isOwner && !isGroupCreator) {
            return reply("❌ Only the bot owner or group creator can use this command.");
        }

        if (!isBotAdmins) {
            return reply("❌ I need to be an admin to execute this command.");
        }

        const botNumber = conn.user.id;
        const allParticipants = groupMetadata.participants;
        const participantsToRemove = allParticipants.filter(
            participant => participant.id !== botNumber && participant.id !== groupMetadata.owner
        );

        if (participantsToRemove.length === 0) {
            return reply("ℹ️ No members to remove (after excluding bot and group creator).");
        }

        reply(`🚨 Removing ${participantsToRemove.length} members (excluding bot and group creator)...`);

        for (let participant of participantsToRemove) {
            try {
                await conn.groupParticipantsUpdate(from, [participant.id], "remove");
                await sleep(2000);
            } catch (e) {
                console.error(`Failed to remove ${participant.id}:`, e);
            }
        }

        reply("✅ Successfully removed all members (excluding bot and group creator).");
    } catch (e) {
        console.error("Error removing members:", e);
        reply("❌ An error occurred while trying to remove members.");
    }
});