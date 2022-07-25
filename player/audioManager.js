const AudioPlayer = require("./audioPlayer");
const audioPlayers = new Map();


module.exports.addSong = (guild, channel, song) => {
  //Check to see if player already exists
  const id = guild.id;
  if (audioPlayers.has(id)) {
    // => Audio Player is currently active in a guild
    const player = audioPlayers.get(id).addSong(song);
  } else {
    // => First time audio player setup
    const player = new AudioPlayer(guild, channel, song);
    audioPlayers.set(guild.id, player);
  }
};

module.exports.getCurrentlyPlaying = (guild) => {
  //Check to see if player exists
  if (audioPlayers.has(guild.id)) {
    // => Audio player exists
    const player = audioPlayers.get(guild.id);

    if (player.getCurrentlyPlaying() === null) {
      return null;
    }

    const info = {
      name: player.getCurrentlyPlaying().name,
      member: player.getCurrentlyPlaying().member.displayName,
      link: player.getCurrentlyPlaying().source,
      status: player.getStatus(),
      duration: `${player.getCurrentlyPlaying().duration} mins`
    };

    return info;
  } 

  //If no player exists
  return null;
}

module.exports.getQueue = (guild) => {
  const id = guild.id;
  //Check to see if the player exists
  if (audioPlayers.has(id)) {
    const player = audioPlayers.get(id);
    return player.queue;
  }

  return null;
}

module.exports.stop = (guild) => {
  const id = guild.id;

  const player = audioPlayers.get(id);
  player.destroy();
  return audioPlayers.delete(id);
  
};

module.exports.getActiveAudioPlayers = () => {
  return audioPlayers.size;
}