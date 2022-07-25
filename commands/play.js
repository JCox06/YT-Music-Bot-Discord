const { SlashCommandBuilder } = require("@discordjs/builders");
const Song = require("../player/song");
const { addSong } = require("../player/audioManager");
const { MessageEmbed } = require("discord.js");
const config = require("../config");


module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song through video link or search query")
    .addStringOption((option) =>
      option.setName("source")
        .setDescription("Source for audio playback")
        .setRequired(true)),
  
  
  async execute(interaction) {
    const audioSource = interaction.options.getString("source");


    if (interaction.member.voice.channel && !interaction.member.voice.deaf) {


      const song = new Song(interaction.member, audioSource);
      addSong(interaction.guild, interaction.member.voice.channel, song);

      const embed = new MessageEmbed()
        .setTitle("Added Song")
        .setDescription(`Added song to the queue`)
        .setColor(config.colour);
      
  
      await interaction.reply({embeds: [embed]});

    } else {
      await interaction.reply({ content: "Please ensure that you are in a channel and undefened", ephemeral: true });
      return;
    }

    
  }
};