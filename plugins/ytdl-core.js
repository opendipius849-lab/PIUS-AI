const { cmd } = require("../command");
const fs = require("fs");
const ytdl = require("@distube/ytdl-core");
const yts = require("yt-search"); // for searching

// 🎵 PLAY (AUDIO)
cmd({
  pattern: "play",
  alias: ["song", "mp3"],
  desc: "Download YouTube Audio",
  category: "downloader",
  react: "🎶",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply("Please provide a YouTube link or search query.\n\nExample: .play pasoori");

    let url = q;
    // If not a YouTube link, search for it
    if (!q.includes("youtube.com") && !q.includes("youtu.be")) {
      let search = await yts(q);
      if (!search.videos || search.videos.length === 0) {
        return reply("No results found.");
      }
      url = search.videos[0].url; // take first result
    }

    const filePath = "./temp_audio.mp3";
    const stream = ytdl(url, { filter: "audioonly", quality: "highestaudio" });
    const writeStream = fs.createWriteStream(filePath);

    stream.pipe(writeStream);

    writeStream.on("finish", async () => {
      await conn.sendMessage(from, {
        audio: { url: filePath },
        mimetype: "audio/mpeg"
      }, { quoted: mek });

      fs.unlinkSync(filePath); // delete temp file
    });

  } catch (err) {
    console.log(err);
    reply("❌ Error while downloading audio.");
  }
});

// 🎥 VIDEO
cmd({
  pattern: "video",
  alias: ["vid", "ytv"],
  desc: "Download YouTube Video",
  category: "downloader",
  react: "📹",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply("Please provide a YouTube link or search query.\n\nExample: .video pasoori");

    let url = q;
    // If not a YouTube link, search for it
    if (!q.includes("youtube.com") && !q.includes("youtu.be")) {
      let search = await yts(q);
      if (!search.videos || search.videos.length === 0) {
        return reply("No results found.");
      }
      url = search.videos[0].url;
    }

    const filePath = "./temp_video.mp4";
    const stream = ytdl(url, { quality: "highestvideo" });
    const writeStream = fs.createWriteStream(filePath);

    stream.pipe(writeStream);

    writeStream.on("finish", async () => {
      await conn.sendMessage(from, {
        video: { url: filePath },
        caption: "📥 Here is your video"
      }, { quoted: mek });

      fs.unlinkSync(filePath); // delete temp file
    });

  } catch (err) {
    console.log(err);
    reply("❌ Error while downloading video.");
  }
});