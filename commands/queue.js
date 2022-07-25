const { getQueue } = require("../player/audioManager");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Song = require("../player/song");
const { addSong } = require("../player/audioManager");
const { MessageEmbed } = require("discord.js");
const config = require("../config");

const VISIBLE_ITEMS = 10;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Allow you to see the currently active queue"),
  
  async execute(interaction) {
    const queue = getQueue(interaction.member.guild);

    if (!queue) {
      const embed = this.buildEmbed(null, 0);
      await interaction.reply({ embeds: [embed] });
      return;
    }

    const originalLength = queue.length;

    const mQueue = queue;

    
    if (mQueue.length <= VISIBLE_ITEMS) {
      const embed = this.buildEmbed(mQueue, originalLength);
      await interaction.reply({ embeds: [embed] });
      return;
    }
      
      //To get the first 10 songs in the queue
      //1) Reverse the Array
      //2) Splice arry(arr.length - 10, 10)
      //3) Reverse array again

    mQueue.reverse();
    mQueue.splice(mQueue.length - VISIBLE_ITEMS, VISIBLE_ITEMS);
    mQueue.reverse();

    for (let i = 0; i < mQueue.length; i++) {
      const embed = this.buildEmbed(mQueue, originalLength);
      await interaction.reply({ embeds: [embed] });
      return;
    }

    await interaction.reply("Something went wrong please try again later");
  },

  buildEmbed(simplieifedQueue, numebrOfSongs) {
    const embed = new MessageEmbed()
      .setTitle("Queue Information")
      .addField("Songs in queue", `${numebrOfSongs} songs`, true)
      .addField("Page", "Showing page One", true)
      .setColor(config.colour);
    
    if (numebrOfSongs === 0) {
      embed.addField("No songs", "It looks like there are no songs in the queue");
    } else {
      for (let i = 0; i < simplieifedQueue.length; i++) {
        embed.addField(`Song ${i + 1}`, `${simplieifedQueue[i].name} requested by ${simplieifedQueue[i].member.displayName}`);
      }
    }

    return embed;
  }
};