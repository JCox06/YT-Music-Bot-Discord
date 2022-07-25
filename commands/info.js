const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const getPlayer = require("../player/audioManager");
const { getCurrentlyPlaying } = require("../player/audioManager");
const config = require("../config");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Shows information about the currently playing song"),

  async execute(interaction) {
    
    const playing = getCurrentlyPlaying(interaction.member.guild);

    if (playing) {

      let name;

      if (!playing.name) {
        name = "Nothing is playing right now";
      }

      name = playing.name;

      const embed = new MessageEmbed()
        .setColor(config.colour)
        .setTitle(`Playing Song ${name}`)
        .setURL(playing.link)
        .addFields(
          { name: "Song title", value: name, inline: true },
          {name: "Duration", value: playing.duration, inline: true},
          { name: "Requester", value: playing.member, inline: true },
          { name: "Play Status", value: playing.status, inline: true },
          { name: "Link", value: playing.link }
        );
      
      await interaction.reply({ embeds: [embed] });
    } else {
      const embed = new MessageEmbed()
        .setColor(config.colour)
        .setTitle("Player Information")
        .setFooter({text: "Long Live The Empire!"})
        .addFields(
          { name: "Error", value: "No player was found for this server", inline: true},
          { name: "Status", value: "Disconnected", inline: true}
        );
      await interaction.reply({ embeds: [embed] });
    }
  }
};