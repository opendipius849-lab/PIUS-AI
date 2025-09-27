const {
    cmd
} = require("../command");
const fetch = require("node-fetch");
const yts = require("yt-search");

//================================================================
// PLAY COMMAND (AUDIO)
//================================================================
cmd({
    pattern: "play1",
    alias: ["song1"],
    desc: "Download YouTube Audio",
    category: 'downloader',
    react: '💖',
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) {
            return reply("Please provide a YouTube link or search query.\n\nExample: .play1 madine wale");
        }

        let youtubeUrl;
        if (q.includes('youtube.com') || q.includes("youtu.be")) {
            youtubeUrl = q;
        } else {
            let search = await yts(q);
            if (!search || !search.videos || search.videos.length === 0) {
                return reply("No results found for your query.");
            }
            youtubeUrl = search.videos[0].url;
        }

        // Fetching from YOUR NEW API
        const apiResponse = await fetch('https://qadeer-api-50395a2ced2f.herokuapp.com/api/audio?url=' + encodeURIComponent(youtubeUrl));
        const apiData = await apiResponse.json();

        if (!apiData.status || !apiData.result.media.audio_url) {
            return reply("Failed to fetch audio. Please try again.");
        }

        let { audio_url } = apiData.result.media;
        
        await conn.sendMessage(from, {
            audio: { url: audio_url },
            mimetype: "audio/mpeg",
            ptt: false
        }, { quoted: mek });

    } catch (e) {
        reply("❌ Error while fetching audio.");
        console.log(e);
    }
});

//================================================================
// VIDEO COMMAND
//================================================================
cmd({
    pattern: 'video1',
    alias: ["vid1", "ytv1"],
    desc: "Download YouTube Video",
    category: 'downloader',
    react: '🪄',
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) {
            return reply("Please provide a YouTube link or search query.\n\nExample: .video Pasoori");
        }

        let youtubeUrl;
        if (q.includes("youtube.com") || q.includes('youtu.be')) {
            youtubeUrl = q;
        } else {
            let search = await yts(q);
            if (!search || !search.videos || search.videos.length === 0) {
                return reply("No results found for your query.");
            }
            youtubeUrl = search.videos[0].url;
        }

        // Fetching from YOUR NEW API
        const apiResponse = await fetch("https://qadeer-api-50395a2ced2f.herokuapp.com/api/video?url=" + encodeURIComponent(youtubeUrl));
        const apiData = await apiResponse.json();

        if (!apiData.status || !apiData.result.media.video_url) {
            return reply("Failed to fetch video. Please try again.");
        }

        // Getting the direct video_url from your new API
        let { video_url } = apiData.result.media;

        await conn.sendMessage(from, {
            video: { url: video_url },
            caption: "ᴘᴏᴡᴇʀᴇᴅ ʙʏ ǫᴀᴅᴇᴇʀ ᴋʜᴀɴ"
        }, { quoted: mek });

    } catch (e) {
        reply("❌ Error while fetching video.");
        console.log(e);
    }
});
