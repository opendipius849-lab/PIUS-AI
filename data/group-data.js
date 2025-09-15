const { DATABASE } = require('../database');
const { DataTypes } = require('sequelize');
const Sequelize = require('sequelize');

const GroupMember = DATABASE.define('GroupMember', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    groupId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    messageCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    lastSeen: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

(async () => {
    try {
        await GroupMember.sync({ alter: true });
        console.log('GroupMember model synchronized with database.');
    } catch (error) {
        console.error('Failed to sync GroupMember model:', error);
    }
})();

const saveMessageCount = async (groupId, senderId) => {
    try {
        const [member, created] = await GroupMember.findOrCreate({
            where: { id: senderId, groupId: groupId },
            defaults: {
                messageCount: 1,
                lastSeen: new Date()
            }
        });

        if (!created) {
            member.messageCount++;
            member.lastSeen = new Date();
            await member.save();
        }

    } catch (e) {
        console.error("Error saving message count:", e);
    }
};

const getGroupMembersMessageCount = async (groupId) => {
    try {
        const members = await GroupMember.findAll({
            where: { groupId: groupId },
            attributes: ['id', ['messageCount', 'count']],
            order: [['messageCount', 'DESC']]
        });
        return members;
    } catch (e) {
        console.error("Error fetching message count:", e);
        return [];
    }
};

const getInactiveGroupMembers = async (groupId) => {
    try {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const inactiveMembers = await GroupMember.findAll({
            where: {
                groupId: groupId,
                lastSeen: {
                    [Sequelize.Op.lt]: sevenDaysAgo
                }
            },
            attributes: ['id']
        });
        return inactiveMembers;
    } catch (e) {
        console.error("Error fetching inactive members:", e);
        return [];
    }
};

module.exports = {
    saveMessageCount,
    getGroupMembersMessageCount,
    getInactiveGroupMembers,
};
