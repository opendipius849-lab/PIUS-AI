// Zaroori modules import kiye ja rahe hain
const { cmd } = require('../command');
const moment = require('moment-timezone');

// Bot command define kiya ja raha hai
cmd({
    pattern: "requestunban",
    alias: ["unban", "unbanrequest"],
    desc: "Generates a personalized unban request with your number and name.",
    category: "tools",
    react: "📄",
    filename: __filename
},
async (conn, mek, m, { from, reply, text }) => { // 'text' ko yahan add kiya hai

    try {
        // User ke input ko '|' se split kiya ja raha hai
        const args = text.split('|').map(arg => arg.trim());

        // Check kiya ja raha hai ke user ne sahi format use kiya hai ya nahi
        if (args.length < 2 || !args[0] || !args[1]) {
            return reply(
                `*❌ Invalid Format!*\n\n` +
                `Please use the correct format:\n` +
                `*.requestunban | [Number with Country Code] | [Your Name]*\n\n` +
                `*Example:*\n` +
                `.requestunban | +923001234567 | Qadeer Ahmad`
            );
        }

        // User ke input se number aur naam nikala ja raha hai
        const phoneNumber = args[0];
        const yourName = args[1];

        // Ek quote message ka object banaya ja raha hai taake reply professional lage
        const quotedMessage = {
            key: {
                fromMe: false,
                participant: '0@s.whatsapp.net',
                remoteJid: 'status@broadcast'
            },
            message: {
                contactMessage: {
                    displayName: 'WhatsApp Support',
                    vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:WhatsApp Support\nORG:WhatsApp Inc.\nTEL;type=CELL;type=VOICE;waid=19753123456:+1 975-312-3456\nEND:VCARD'
                }
            }
        };

        // Behtar aur asar dar appeal messages ki list
        const appealMessages = [
            'I am writing to appeal the suspension of my WhatsApp account. I believe this action was taken in error, as I have always adhered to your Terms of Service. My account is crucial for my personal and professional communications. I kindly request a manual review of my account activity to prove my compliance and a prompt reinstatement.',
            'My WhatsApp account has been banned, and I am certain this is a misunderstanding. I have thoroughly reviewed the WhatsApp Terms of Service and can confirm that my usage has always been compliant. It is likely that an automated system has mistakenly flagged my account. I urge you to conduct a human review of my case and reinstate my account as it is vital for my daily activities.',
            'I am writing to formally request the reactivation of my WhatsApp number. The suspension was unexpected as I use the service in accordance with your policies. I do not use any third-party applications, nor do I engage in spamming or sending unsolicited bulk messages. This ban appears to be a mistake, and I request a thorough investigation and the restoration of my access.',
            'As a long-term, responsible user of WhatsApp, I was shocked to find my account has been banned. My usage is strictly for communicating with family, friends, and colleagues, and I can assure you that I have not violated any terms. I strongly suspect my account was suspended due to a system error. Could you please prioritize a manual review of my account and lift this ban?',
            'This is a formal appeal regarding the wrongful suspension of my WhatsApp account. I contest this ban as I have not violated the Terms of Service. My activity is limited to standard personal and small group messaging. I request an immediate and thorough manual investigation into this matter and the prompt restoration of my account services to avoid further disruption.'
        ];

        const randomMessage = appealMessages[Math.floor(Math.random() * appealMessages.length)];
        const currentTime = moment.tz("Asia/Karachi").format('HH:mm:ss');
        const currentDate = moment.tz("Asia/Karachi").format('DD/MM/YYYY');

        // Final message template banaya ja raha hai user ke diye gaye number aur naam ke sath
        const finalMessage =
            `📢 *WHATSAPP UNBAN REQUEST TEMPLATE* 📢\n\n` +
            `🕒 Time: ${currentTime}\n` +
            `📅 Date: ${currentDate}\n\n` +
            `📄 *Message to send to WhatsApp Support:*\n` +
            `----------------------------------------\n` +
            `To: support@whatsapp.com\n` +
            `Subject: Urgent Appeal for Wrongful Account Suspension\n\n` +
            `Dear WhatsApp Support Team,\n\n` +
            `${randomMessage}\n\n` +
            `*Phone Number:* ${phoneNumber}\n\n` + // Yahan user ka number add ho gaya
            `Thank you for your prompt attention to this matter.\n\n` +
            `Sincerely,\n` +
            `*${yourName}*\n` + // Yahan user ka naam add ho gaya
            `----------------------------------------\n\n` +
            `📌 Copy the above message and send it to *support@whatsapp.com* via email.`;

        // User ko image ke sath final message template bheja ja raha hai
        await conn.sendMessage(from, {
            image: {
                url: 'https://qu.ax/Pusls.jpg'
            },
            caption: finalMessage,
            contextInfo: {
                externalAdReply: {
                    title: 'WhatsApp Unban Request',
                    body: 'Use this to appeal your banned account',
                    mediaType: 1,
                    renderLargerThumbnail: false,
                    thumbnailUrl: 'https://qu.ax/Pusls.jpg',
                    sourceUrl: 'mailto:support@whatsapp.com'
                }
            }
        }, {
            quoted: quotedMessage
        });

    } catch (err) {
        // Agar koi error aye to console mein log karo aur user ko message bhejo
        console.error("Error in requestunban command:", err);
        reply('❌ Error generating unban request.');
    }
});
