const { Client, GatewayIntentBits } = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require("@discordjs/voice");
const play = require("play-dl");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const TOKEN = process.env.TOKEN;

// CONFIGURE THIS:
const GUILD_ID = "YOUR_SERVER_ID";
const VOICE_CHANNEL_ID = "YOUR_VC_ID";
const STREAM_URL = "https://stream-ssl.radionomy.com/ABCJAZZ"; // example radio

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const guild = client.guilds.cache.get(GUILD_ID);
  const channel = guild.channels.cache.get(VOICE_CHANNEL_ID);

  const connection = joinVoiceChannel({
    channelId: VOICE_CHANNEL_ID,
    guildId: GUILD_ID,
    adapterCreator: guild.voiceAdapterCreator
  });

  const stream = await play.stream(STREAM_URL);
  const resource = createAudioResource(stream.stream, {
    inputType: stream.type
  });

  const player = createAudioPlayer();
  player.play(resource);

  connection.subscribe(player);
});

client.login(TOKEN);
