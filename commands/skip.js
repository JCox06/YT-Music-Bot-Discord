const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const getPlayer = require("../player/audioManager");
const { getCurrentlyPlaying } = require("../player/audioManager");
const config = require("../config");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song through video link or search query")
    .addBooleanOption((option) =>
      option.setName("force")
        .setDescription("Force Skip")
        .setRequired(false)),
  
  
  
  async execute() {
    const force = interaction.options.getString("force");

    if (force) {
      //Skip the Song
    } else {
      //Add player to skip queue
    } 
  }
}