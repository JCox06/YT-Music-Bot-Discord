const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const os = require("os");
const osu = require("node-os-utils")
const { getActiveAudioPlayers } = require("../player/audioManager");
const { get } = require("http");
const config = require("../config");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Shows statistics"),
  
  async execute(interaction) {
    const latency = Date.now() - interaction.createdTimestamp;
    const arch = os.arch();
    const usage = await osu.cpu.usage();
    const mem = await osu.mem.info();
    

    const embed = new MessageEmbed()
      .setTitle("System Statistics")
      .addFields(
        {name: "Active Audio Players", value: `${getActiveAudioPlayers()} players`, inline: true},
        { name: "System Latency (ms)", value: latency.toString(), inline: true},
        { name: "System Platform", value: arch.toString(), inline: true},
        { name: "CPU utilization", value: usage.toString(), inline: true },
        { name: "Free Memory (MB)", value: mem.freeMemMb.toString(), inline: true }
    )

      .setColor(config.colour);
    
    await interaction.reply({ embeds: [embed] });
  }
}