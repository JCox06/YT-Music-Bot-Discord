const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { stop } = require("../player/audioManager");
const config = require("../config");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Destorys the currently playing resource and disconnects the bot from the active channel"),
  
  
  async execute(interaction) {
    const result = stop(interaction.guild);

    if (result) {
      const embed = new MessageEmbed()
        .setColor(config.colour)
        .setTitle("Audio Player")
        .setDescription("Destroyed all resources and disconected the bot");
      await interaction.reply({ embeds: [embed] });
      return;
    } else {
      const embed = new MessageEmbed()
      .setColor(config.colour)
      .setTitle("Audio Player")
        .setDescription("Please ensure there is currently an active player");
      
      await interaction.reply({ embeds: [embed] });
    }
  }
}