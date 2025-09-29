const config = require('../config');
const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions'); // Make sure you have fetchJson in your functions

// --- YOUTUBE API KEY ---
// Note: It's better to move this to your config.js file for security
const YOUTUBE_API_KEY = "AIzaSyCAmBLhKtsTEUY2VbHmDetEjP_BFSzUL9Y"; 
const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/";

/**
 * Helper function to format large numbers with commas
 * e.g., 1000000 -> 1,000,000
 */
function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

/*
 * ---------------------------------------------------------------------------
 * COMMAND 1: YTSEARCH
 * ---------------------------------------------------------------------------
 */
cmd({
    pattern: "ytsearch",
    alias: ["yts"],
    use: '.ytsearch <query>',
    react: "🔎",
    desc: "Search for videos on YouTube using the official API.",
    category: "search",
    filename: __filename
},
async(conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply('*Please provide a search term.*\n_Example: .ytsearch latest songs_');
        if (!YOUTUBE_API_KEY) return reply('*YouTube API key is not set up!*');

        const searchUrl = `${YOUTUBE_API_URL}search?part=snippet&q=${encodeURIComponent(q)}&key=${YOUTUBE_API_KEY}&maxResults=10&type=video`;

        const response = await fetchJson(searchUrl);

        if (!response.items || response.items.length === 0) {
            return reply(`*No video results found for "${q}"*`);
        }

        let message = `*🔍 Search Results for: ${q}*\n\n`;
        response.items.forEach((video, index) => {
            message += `*${index + 1}. ${video.snippet.title}*\n` +
                       `*Channel:* ${video.snippet.channelTitle}\n` +
                       `*Link:* https://www.youtube.com/watch?v=${video.id.videoId}\n\n`;
        });

        await conn.sendMessage(m.from, { text: message.trim() }, { quoted: mek });

    } catch (e) {
        console.error("YTSEARCH ERROR:", e);
        // Check for specific quota error
        if (e.message && e.message.includes('403')) {
             reply('*Error: Could not fetch search results. The daily API quota may have been exceeded.*');
        } else {
             reply('*An error occurred while searching. Please try again later.*');
        }
    }
});

/*
 * ---------------------------------------------------------------------------
 * COMMAND 2: YTVIDEO
 * ---------------------------------------------------------------------------
 */
cmd({
    pattern: "ytvideo",
    alias: ["ytinfo"],
    use: '.ytvideo <youtube_video_url>',
    react: "📊",
    desc: "Get detailed statistics of a YouTube video.",
    category: "search",
    filename: __filename
},
async(conn, mek, m, { q, reply }) => {
    try {
        if (!q || !q.includes('youtu')) return reply('*Please provide a valid YouTube video URL.*');
        if (!YOUTUBE_API_KEY) return reply('*YouTube API key is not set up!*');

        // Regex to extract video ID from various YouTube URL formats
        const videoIdMatch = q.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        if (!videoIdMatch) {
            return reply('*Could not extract video ID from the URL. Please use a valid YouTube video link.*');
        }
        const videoId = videoIdMatch[1];

        const videoUrl = `${YOUTUBE_API_URL}videos?part=snippet,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`;
        
        const response = await fetchJson(videoUrl);

        if (!response.items || response.items.length === 0) {
            return reply('*Could not find details for this video. It might be private or deleted.*');
        }

        const video = response.items[0];
        const snippet = video.snippet;
        const stats = video.statistics;

        const message = `*📊 YouTube Video Details 📊*\n\n` +
                        `*📝 Title:* ${snippet.title}\n` +
                        `*📺 Channel:* ${snippet.channelTitle}\n` +
                        `*📅 Published:* ${new Date(snippet.publishedAt).toLocaleDateString('en-GB')}\n\n` +
                        `*📈 Views:* ${formatNumber(stats.viewCount)}\n` +
                        `*👍 Likes:* ${formatNumber(stats.likeCount)}\n` +
                        `*💬 Comments:* ${formatNumber(stats.commentCount || 0)}\n\n` +
                        `*🔗 Link:* ${q}`;

        await conn.sendMessage(m.from, { text: message.trim() }, { quoted: mek });

    } catch (e) {
        console.error("YTVIDEO ERROR:", e);
        if (e.message && e.message.includes('403')) {
             reply('*Error: Could not fetch video details. The daily API quota may have been exceeded.*');
        } else {
             reply('*An error occurred while fetching video details.*');
        }
    }
});
