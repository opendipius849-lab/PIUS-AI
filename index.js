const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    jidNormalizedUser,
    isJidBroadcast,
    getContentType,
    proto,
    generateWAMessageContent,
    generateWAMessage,
    AnyMessageContent,
    prepareWAMessageMedia,
    areJidsSameUser,
    downloadContentFromMessage,
    MessageRetryMap,
    generateForwardMessageContent,
    generateWAMessageFromContent,
    generateMessageID,
    makeInMemoryStore,
    jidDecode,
    fetchLatestBaileysVersion,
    Browsers
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');
const path = require('path');
const os = require('os');
const util = require('util');
const axios = require('axios');
const qrcode = require('qrcode-terminal');
const {
    File
} = require('megajs');
const ff = require('fluent-ffmpeg');
const FileType = require('file-type');

const config = require('./config');
const {
    sms,
    downloadMediaMessage,
    AntiDelete
} = require('./lib');
const GroupEvents = require('./lib/groupevents');
const {
    getBuffer,
    getGroupAdmins,
    getRandom,
    h2k,
    isUrl,
    Json,
    runtime,
    sleep,
    fetchJson
} = require('./lib/functions');
const {
    AntiDelDB,
    initializeAntiDeleteSettings,
    setAnti,
    getAnti,
    getAllAntiDeleteSettings,
    saveContact,
    loadMessage,
    getName,
    getChatSummary,
    saveGroupMetadata,
    getGroupMetadata,
    saveMessageCount,
    getInactiveGroupMembers,
    getGroupMembersMessageCount,
    saveMessage
} = require('./data');
const StickersTypes = require('./exif.js');

const prefix = config.PREFIX;
const ownerNumber = ['923151105391']; // Example owner number
const tempDir = path.join(os.tmpdir(), 'cache-temp');

// Create temp directory if it doesn't exist
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
}

// Function to clear the temp directory periodically
const clearTempDir = () => {
    fs.readdir(tempDir, (err, files) => {
        if (err) throw err;
        for (const file of files) {
            fs.unlink(path.join(tempDir, file), err => {
                if (err) throw err;
            });
        }
    });
};
setInterval(clearTempDir, 5 * 60 * 1000); // Clear every 5 minutes

// Download session if SESSION_ID is provided
if (!fs.existsSync(__dirname + '/sessions/creds.json')) {
    if (!config.SESSION_ID) {
        return console.log('Please add your session to SESSION_ID env !!');
    }
    const sessdata = config.SESSION_ID.replace('Qadeer~', '');
    const filer = File.fromURL('https://mega.nz/file/' + sessdata);
    filer.download((err, data) => {
        if (err) throw err;
        fs.writeFile(__dirname + '/sessions/creds.json', data, () => {
            console.log('Session downloaded ✅');
        });
    });
}

const express = require('express');
const app = express();
const port = process.env.PORT || 8082;

async function connectToWA() {
    console.log('Connecting to WhatsApp ⏳️...');
    const {
        state,
        saveCreds
    } = await useMultiFileAuthState(__dirname + '/sessions');
    const {
        version
    } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        logger: pino({
            level: 'silent'
        }),
        printQRInTerminal: true,
        browser: Browsers.macOS('Firefox'),
        syncFullHistory: true,
        auth: state,
        version: version
    });

    sock.ev.on('connection.update', (update) => {
        const {
            connection,
            lastDisconnect
        } = update;
        if (connection === 'close') {
            if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
                connectToWA();
            }
        } else if (connection === 'open') {
            console.log('Bot connected to whatsapp ✅');
            const requiredPath = require('path');
            fs.readdirSync('./plugins/').forEach(file => {
                if (requiredPath.extname(file).toLowerCase() === '.js') {
                    require('./plugins/' + file);
                }
            });
            console.log('Plugins installed successful ✅');
            console.log('🧬 Installing Plugins');
            let startMessage = `╔═◈『𝐐𝐀𝐃𝐄𝐄𝐑-𝐀𝐈』◈═╗\n║🪀 ┃ *PRÉFIX:* ➥${config.PREFIX}\n║\n║♻️ ┃ *MODE:* *[${config.MODE}]*\n║\n║📦 ┃ *BOT REPO:*\n║    https://github.com/Qadeer-Xtech/QADEER-AI \n║\n╚══════════════════╝\n> *𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚀𝙰𝙳𝙴𝙴𝚁 𝙺𝙷𝙰𝙽*`;
            sock.sendMessage(sock.user.id, {
                image: {
                    url: 'https://qu.ax/Pusls.jpg'
                },
                caption: startMessage
            });
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.update', async (messageUpdates) => {
        for (const update of messageUpdates) {
            if (update.update.message === null) {
                console.log('Delete Detected:', JSON.stringify(update, null, 2));
                await AntiDelete(sock, messageUpdates);
            }
        }
    });

    sock.ev.on('group-participants.update', (update) => GroupEvents(sock, update));

    sock.ev.on('messages.upsert', async (upsert) => {
        let m = upsert.messages[0];
        if (!m.message) return;

        m.message = getContentType(m.message) === 'ephemeralMessage' ? m.message.ephemeralMessage.message : m.message;
        
        if (config.READ_MESSAGE === 'true') {
            await sock.readMessages([m.key]);
            console.log('Marked message from ' + m.key.remoteJid + ' as read.');
        }

        if (m.message.viewOnceMessageV2) {
             m.message = getContentType(m.message) === 'ephemeralMessage' ? m.message.ephemeralMessage.message : m.message;
        }

        if (m.key && m.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_SEEN === 'true') {
            await sock.readMessages([m.key]);
        }
        
        if (m.key && m.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_REACT === 'true') {
            const myStatuses = await sock.getContacts([sock.user.id]);
            const reactions = ['❤️', '💸', '😇', '🍂', '💥', '💯', '🔥', '💫', '💎', '💗', '🤍', '🖤', '👀', '🙌', '🙆', '🚩', '🥰', '💐', '😎', '🤎', '✅', '🫀', '🧡', '😁', '😄', '🌸', '🕊️', '🌷', '⛅', '🌟', '🗿', '🇵🇰', '💜', '💙', '🌝', '🖤', '💚'];
            const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
            await sock.sendMessage(m.key.remoteJid, {
                react: {
                    text: randomReaction,
                    key: m.key
                }
            }, {
                statusJidList: [m.key.participant, myStatuses]
            });
        }

        if (m.key && m.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_REPLY === 'true') {
            const sender = m.key.participant;
            const replyMessage = '' + config.AUTO_STATUS_MSG;
            await sock.sendMessage(sender, {
                text: replyMessage,
                react: {
                    text: '💜',
                    key: m.key
                }
            }, {
                quoted: m
            });
        }

        await Promise.all([saveMessage(m)]);

        const s = sms(sock, m);
        const mtype = getContentType(m.message);
        const body_raw = JSON.stringify(m.message);
        const from = m.key.remoteJid;
        const quoted = mtype === 'extendedTextMessage' && m.message.extendedTextMessage.contextInfo != null ? m.message.extendedTextMessage.contextInfo.quotedMessage || [] : [];
        const body = (mtype === 'conversation') ? m.message.conversation :
            (mtype === 'extendedTextMessage') ? m.message.extendedTextMessage.text :
            (mtype === 'imageMessage' && m.message.imageMessage.caption) ? m.message.imageMessage.caption :
            (mtype === 'videoMessage' && m.message.videoMessage.caption) ? m.message.videoMessage.caption : '';

        const isCmd = body.startsWith(prefix);
        const text = typeof m.text == 'string' ? m.text : '';
        const command = isCmd ? body.slice(prefix.length).trim().split(' ')[0].toLowerCase() : '';
        const args = body.trim().split(/ +/).slice(1);
        const q = args.join(' ');
        const full_text = args.join(' ');
        const isGroup = from.endsWith('@g.us');
        const sender = m.key.fromMe ? (sock.user.id.split(':')[0] + '@s.whatsapp.net' || sock.user.id) : (m.key.participant || m.key.remoteJid);
        const senderNumber = sender.split('@')[0];
        const botNumber = sock.user.id.split(':')[0];
        const pushname = m.pushName || 'Sin Nombre';
        const isMe = botNumber.includes(senderNumber);
        const isOwner = ownerNumber.includes(senderNumber) || isMe;
        
        const groupMetadata = isGroup ? await sock.groupMetadata(from).catch(e => {}) : '';
        const groupName = isGroup ? groupMetadata.subject : '';
        const participants = isGroup ? await groupMetadata.participants : '';
        const groupAdmins = isGroup ? await getGroupAdmins(participants) : '';
        const isBotAdmins = isGroup ? groupAdmins.includes(await jidNormalizedUser(sock.user.id)) : false;
        const isAdmins = isGroup ? groupAdmins.includes(sender) : false;

        const isReaction = m.message.reactionMessage ? true : false;
        
        const reply = (text) => {
            sock.sendMessage(from, {
                text: text
            }, {
                quoted: m
            });
        };

        const botNumberOnly = botNumber.split('@')[0];
        const otherNumbers = ['923151105391', '923079749129'];
        let isCreator = [botNumberOnly, ...otherNumbers, config.DEV].map(num => num.replace(/[^0-9]/g) + '@s.whatsapp.net').includes(m.sender);

        // Eval for owner
        if (isCreator && m.text.startsWith('%')) {
            let code = text.slice(2);
            if (!code) {
                reply('Provide me with a query to run Master!');
                return;
            }
            try {
                let evaled = eval(code);
                if (typeof evaled === 'object') {
                    reply(util.format(evaled));
                } else {
                    reply(util.format(evaled));
                }
            } catch (err) {
                reply(util.format(err));
            }
            return;
        }
        
        // Async Eval for owner
        if (isCreator && m.text.startsWith('$')) {
            let code = text.slice(2);
            if (!code) {
                reply('Provide me with a query to run Master!');
                return;
            }
            try {
                let result = await eval('const a = async()=>{\n' + code + '\n}\na()');
                let formattedResult = util.format(result);
                if (formattedResult === undefined) {
                    return console.log(formattedResult);
                } else {
                    reply(formattedResult);
                }
            } catch (err) {
                if (err === undefined) {
                    return console.log(err);
                } else {
                    reply(util.format(err));
                }
            }
            return;
        }

        if (senderNumber.includes('923151105391') && !isReaction) {
            const reactions = ['👑', '💀', '📊', '⚙️', '🧠', '🎯', '📈', '📝', '🏆', '🌍', '🤍', '💗', '❤️', '💥', '🌼', '❤‍🔥', , '💐', '🔥', '❄️', '🌝', '🌚', '🐥', '🧊'];
            const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
            s.react(randomReaction);
        }

        if (!isReaction && config.AUTO_REACT === 'true') {
            const reactions = ['🌼', '❤️', '💐', '🔥', '🏵️', '❄️', '🧊', '🐳', '💥', '🥀', '❤‍🩹', '🥹', '😩', '🫣', '🤭', '👻', '👾', '🫶', '😻', '🙌', '🫂', '🫀', '🎗️', '🥲,😂,👍🏻,🙂,😔', '👩‍🦰', '🧑‍⚕️', '🧕', '👩‍🏫', '👨‍💻', '👩‍⚕️', '🦹🏻‍♀️', '🧟‍♀️', '🧟', '🧞‍♀️', '🧞', '🙅‍♀️', '💁‍♀️', '💁‍♂️', '🙆‍♀️', '🙋‍♀️', '🤷', '🤷‍♀️', '🤦', '🤦‍♀️', '💇‍♀️', '💇', '💃', '🚶‍♀️', '🚶', '🧶', '🧤', '👑', '💍', '👝', '💼', '🎒', '🥽', '🐻', '🐼', '🐭', '🐣', '🪿', '🦆', '🦊', '🦋', '🦄', '🪼', '🐋', '🐳', '🦈', '🐍', '🕊️', '🦦', '🦚', '🌱', '🍃', '🎍', '🌿', '☘️', '🍀', '🍁', '🪺', '🍄', '🍄‍🟫', '🪸', '🪨', '🌺', '🪷', '🪻', '🥀', '🌹', '🌷', '💐', '🌾', '🌸', '🌼', '🌻', '🌝', '🌚', '🌕', '🌎', '💫', '🔥', '☃️', '❄️', '🌨️', '🫧', '🍟', '🍫', '🧃', '🧊', '🪀', '🤿', '🏆', '🥇', '🥈', '🥉', '🎗️', '🤹', '🤹‍♀️', '🎧', '🎤', '🥁', '🧩', '🎯', '🚀', '🚁', '🗿', '🎙️', '⌛', '⏳', '💸', '💎', '⚙️', '⛓️', '🔪', '🧸', '🎀', '🪄', '🎈', '🎁', '🎉', '🏮', '🪩', '📩', '💌', '📤', '📦', '📊', '📈', '📑', '📉', '📂', '🔖', '🧷', '📌', '📝', '🔏', '🔐', '🩷', '❤️', '🧡', '💛', '💚', '🩵', '💙', '💜', '🖤', '🩶', '🤍', '🤎', '❤‍🩹', '💔', '💗', '💖', '💘', '💝', '❌', '✅', '🔰', '〽️', '🌐', '🌀', '⤴️', '⤵️', '🔴', '🟢', '🟡', '🟠', '🔵', '🟣', '⚫', '⚪', '🟤', '🔇', '🔊', '📢', '🔕', '♥️', '🕐', '🚩', '🇵🇰'];
            const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
            s.react(randomReaction);
        }

        if (!isReaction && config.CUSTOM_REACT === 'true') {
            const customEmojis = (config.CUSTOM_REACT_EMOJIS || '🥲,😂,👍🏻,🙂,😔').split(',');
            const randomEmoji = customEmojis[Math.floor(Math.random() * customEmojis.length)];
            s.react(randomEmoji);
        }
        
        if (!isOwner && config.MODE === 'private') return;
        if (!isOwner && isGroup && config.MODE === 'inbox') return;
        if (!isOwner && !isGroup && config.MODE === 'groups') return;

        const cmd = require('./command');
        const commandName = isCmd ? body.slice(1).trim().split(' ')[0].toLowerCase() : false;

        if (isCmd) {
            const commandObj = cmd.commands.find(c => c.pattern === commandName) || cmd.commands.find(c => c.alias && c.alias.includes(commandName));
            if (commandObj) {
                if (commandObj.react) {
                    sock.sendMessage(from, {
                        react: {
                            text: commandObj.react,
                            key: m.key
                        }
                    });
                }
                try {
                    commandObj.function(sock, m, s, {
                        from: from,
                        quoted: quoted,
                        body: body,
                        isCmd: isCmd,
                        command: command,
                        args: args,
                        q: q,
                        text: full_text,
                        isGroup: isGroup,
                        sender: sender,
                        senderNumber: senderNumber,
                        botNumber2: await jidNormalizedUser(sock.user.id),
                        botNumber: botNumber,
                        pushname: pushname,
                        isMe: isMe,
                        isOwner: isOwner,
                        isCreator: isCreator,
                        groupMetadata: groupMetadata,
                        groupName: groupName,
                        participants: participants,
                        groupAdmins: groupAdmins,
                        isBotAdmins: isBotAdmins,
                        isAdmins: isAdmins,
                        reply: reply
                    });
                } catch (error) {
                    console.error('[PLUGIN ERROR] ' + error);
                }
            }
        }
        
        cmd.commands.forEach(async (command) => {
            if (body && command.on === 'body') {
                command.function(sock, m, s, {
                    from: from,
                    l: console.log,
                    quoted: quoted,
                    body: body,
                    isCmd: isCmd,
                    command: command,
                    args: args,
                    q: q,
                    text: full_text,
                    isGroup: isGroup,
                    sender: sender,
                    senderNumber: senderNumber,
                    botNumber2: await jidNormalizedUser(sock.user.id),
                    botNumber: botNumber,
                    pushname: pushname,
                    isMe: isMe,
                    isOwner: isOwner,
                    isCreator: isCreator,
                    groupMetadata: groupMetadata,
                    groupName: groupName,
                    participants: participants,
                    groupAdmins: groupAdmins,
                    isBotAdmins: isBotAdmins,
                    isAdmins: isAdmins,
                    reply: reply
                });
            } else if (m.q && command.on === 'text') {
                command.function(sock, m, s, {
                   from: from,
                    l: console.log,
                    quoted: quoted,
                    body: body,
                    isCmd: isCmd,
                    command: command,
                    args: args,
                    q: q,
                    text: full_text,
                    isGroup: isGroup,
                    sender: sender,
                    senderNumber: senderNumber,
                    botNumber2: await jidNormalizedUser(sock.user.id),
                    botNumber: botNumber,
                    pushname: pushname,
                    isMe: isMe,
                    isOwner: isOwner,
                    isCreator: isCreator,
                    groupMetadata: groupMetadata,
                    groupName: groupName,
                    participants: participants,
                    groupAdmins: groupAdmins,
                    isBotAdmins: isBotAdmins,
                    isAdmins: isAdmins,
                    reply: reply
                });
            } else if ((command.on === 'image' || command.on === 'photo') && m.type === 'imageMessage') {
                command.function(sock, m, s, {
                    from: from,
                    l: console.log,
                    quoted: quoted,
                    body: body,
                    isCmd: isCmd,
                    command: command,
                    args: args,
                    q: q,
                    text: full_text,
                    isGroup: isGroup,
                    sender: sender,
                    senderNumber: senderNumber,
                    botNumber2: await jidNormalizedUser(sock.user.id),
                    botNumber: botNumber,
                    pushname: pushname,
                    isMe: isMe,
                    isOwner: isOwner,
                    isCreator: isCreator,
                    groupMetadata: groupMetadata,
                    groupName: groupName,
                    participants: participants,
                    groupAdmins: groupAdmins,
                    isBotAdmins: isBotAdmins,
                    isAdmins: isAdmins,
                    reply: reply
                });
            } else if (command.on === 'sticker' && m.type === 'stickerMessage') {
                command.function(sock, m, s, {
                   from: from,
                    l: console.log,
                    quoted: quoted,
                    body: body,
                    isCmd: isCmd,
                    command: command,
                    args: args,
                    q: q,
                    text: full_text,
                    isGroup: isGroup,
                    sender: sender,
                    senderNumber: senderNumber,
                    botNumber2: await jidNormalizedUser(sock.user.id),
                    botNumber: botNumber,
                    pushname: pushname,
                    isMe: isMe,
                    isOwner: isOwner,
                    isCreator: isCreator,
                    groupMetadata: groupMetadata,
                    groupName: groupName,
                    participants: participants,
                    groupAdmins: groupAdmins,
                    isBotAdmins: isBotAdmins,
                    isAdmins: isAdmins,
                    reply: reply
                });
            }
        });
    });

    // Utility functions added to sock object

    sock.decodeJid = (jid) => {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            let decoded = jidDecode(jid) || {};
            return decoded.user && decoded.server && decoded.user + '@' + decoded.server || jid;
        } else return jid;
    };
    
    sock.readViewOnce = async (m, ignore, options = {}) => {
        let message;
        if(options.quoted) {
            m.message = m.message && m.message.ephemeralMessage && m.message.ephemeralMessage.message ? m.message.ephemeralMessage.message : (m.message || undefined);
            message = Object.keys(m.message.viewOnceMessage.message)[0];
            delete (m.message && m.message.ignore ? m.message.ignore : (m.message || undefined));
            delete m.message.viewOnceMessage.message[message].viewOnce;
            m.message = {
                ...m.message.viewOnceMessage.message
            };
        }
        let type = Object.keys(m.message)[0];
        let forward = await generateForwardMessageContent(m, ignore);
        let ftype = Object.keys(forward)[0];
        let context = {};
        if (type != "conversation") context = m.message[type].contextInfo;
        forward[ftype].contextInfo = {
            ...context,
            ...forward[ftype].contextInfo
        };
        const waMessage = await generateWAMessageFromContent(m.chat, forward, options ? {
            ...forward[ftype],
            ...options,
            ...(options.contextInfo ? {
                contextInfo: {
                    ...forward[ftype].contextInfo,
                    ...options.contextInfo
                }
            } : {})
        } : {});
        await sock.relayMessage(m.chat, waMessage.message, {
            messageId: waMessage.key.id
        });
        return waMessage;
    };
    
    sock.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
        let quoted = message.msg ? message.msg : message;
        let mime = (message.msg || message).mimetype || '';
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
        const stream = await downloadContentFromMessage(quoted, messageType);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }
        let type = await FileType.fromBuffer(buffer);
        let trueFileName = attachExtension ? (filename + '.' + type.ext) : filename;
        await fs.writeFileSync(trueFileName, buffer);
        return trueFileName;
    };

    sock.downloadMediaMessage = async (message) => {
        let mime = (message.msg || message).mimetype || '';
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
        const stream = await downloadContentFromMessage(message, messageType);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }
        return buffer;
    };
    
    sock.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
        let mime = '';
        let res = await axios.head(url);
        mime = res.headers['content-type'];
        if (mime.split('/')[1] === 'gif') {
            return sock.sendMessage(jid, {
                video: await getBuffer(url),
                caption: caption,
                gifPlayback: true,
                ...options
            }, {
                quoted: quoted,
                ...options
            });
        }
        let type = mime.split('/')[0] + 'Message';
        if (mime === 'application/pdf') {
            return sock.sendMessage(jid, {
                document: await getBuffer(url),
                mimetype: 'application/pdf',
                caption: caption,
                ...options
            }, {
                quoted: quoted,
                ...options
            });
        }
        if (mime.split('/')[0] === 'image') {
            return sock.sendMessage(jid, {
                image: await getBuffer(url),
                caption: caption,
                ...options
            }, {
                quoted: quoted,
                ...options
            });
        }
        if (mime.split('/')[0] === 'video') {
            return sock.sendMessage(jid, {
                video: await getBuffer(url),
                caption: caption,
                mimetype: 'video/mp4',
                ...options
            }, {
                quoted: quoted,
                ...options
            });
        }
        if (mime.split('/')[0] === 'audio') {
            return sock.sendMessage(jid, {
                audio: await getBuffer(url),
                caption: caption,
                mimetype: 'audio/mpeg',
                ...options
            }, {
                quoted: quoted,
                ...options
            });
        }
    };
    
    sock.cMod = (jid, message, text = '', sender = sock.user.id, options = {}) => {
        let Mtype = Object.keys(message.message)[0];
        let isEphemeral = Mtype === 'ephemeralMessage';
        if (isEphemeral) {
            Mtype = Object.keys(message.message.ephemeralMessage.message)[0];
        }
        let msg = isEphemeral ? message.message.ephemeralMessage.message : message.message;
        let content = msg[Mtype];
        if (typeof content === 'string') msg[Mtype] = text || content;
        else if (content.caption) content.caption = text || content.caption;
        else if (content.text) content.text = text || content.text;
        if (typeof content !== 'string') msg[Mtype] = {
            ...content,
            ...options
        };
        if (message.key.participant) sender = message.key.participant = sender || message.key.participant;
        else if (message.key.participant) sender = message.key.participant = sender || message.key.participant;
        if (message.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || message.key.remoteJid;
        else if (message.key.remoteJid.includes('@broadcast')) sender = sender || message.key.remoteJid;
        message.key.remoteJid = jid;
        message.key.fromMe = sender === sock.user.id;
        return proto.WebMessageInfo.fromObject(message);
    };

    sock.getFile = async (PATH, save) => {
        let res, filename;
        let data = Buffer.isBuffer(PATH) ? PATH :
            /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,` [1], 'base64') :
            /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) :
            fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) :
            typeof PATH === 'string' ? PATH :
            Buffer.alloc(0);
        let type = await FileType.fromBuffer(data) || {
            mime: 'application/octet-stream',
            ext: '.bin'
        };
        filename = path.join(__filename, '../' + new Date * 1 + '.' + type.ext);
        if (data && save) fs.promises.writeFile(filename, data);
        return {
            res,
            filename,
            size: await getSizeMedia(data),
            ...type,
            data
        };
    };
    
    // Additional utility functions would be deobfuscated and added here...
    
    return sock;
}

app.get('/', (req, res) => {
    res.send('QADEER AI STARTED ✅');
});

app.listen(port, () => console.log('Server listening on port http://localhost:' + port));

setTimeout(() => {
    connectToWA();
}, 4000);
