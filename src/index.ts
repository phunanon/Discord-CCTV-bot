import assert from 'assert';
import * as dotenv from 'dotenv';
dotenv.config();
import { ActivityType, ChannelType, VoiceChannel } from 'discord.js';
import { IntentsBitField, Client } from 'discord.js';
import { joinVoiceChannel, VoiceConnection } from '@discordjs/voice';

const client = new Client({
  intents: [IntentsBitField.Flags.Guilds, 'GuildVoiceStates'],
});

const connections = new Map<string, [VoiceChannel, VoiceConnection]>();

setInterval(async () => {
  const myId = client.user?.id;
  if (!myId) return;
  //Get all channels in all guilds
  const guilds = [...client.guilds.cache.values()];
  const channels = guilds
    .map(guild =>
      guild.channels.cache
        .filter(x => x.type === ChannelType.GuildVoice)
        .sort((a, b) => a.position - b.position)
        .first(),
    )
    .filter(x => !!x);
  //Check if anybody except this bot are in each channel
  for (const channel of channels) {
    const connection = connections.get(channel.id);
    if (channel.members.size === 1 && connection) {
      connection[1].disconnect();
      connections.delete(channel.id);
      continue;
    }
    if (connection) continue;
    if (channel.members.size) {
      const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
      });
      connections.set(channel.id, [channel, connection]);
    }
  }
}, 10_000);

client.on('ready', () => {
  client.user?.setActivity({
    name: "Smile, you're on camera.",
    type: ActivityType.Custom,
  });
  console.log('Logged in as', client.user?.tag);
});

assert(
  process.env.DISCORD_TOKEN,
  'DISCORD_TOKEN must be set in environment variables',
);
client.login(process.env.DISCORD_TOKEN).catch(err => {
  console.error('Failed to login to Discord:', err);
  process.exit(1);
});
