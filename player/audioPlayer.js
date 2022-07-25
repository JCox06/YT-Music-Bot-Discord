const { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection, AudioPlayerStatus, AudioPlayerIdleState} = require("@discordjs/voice");
const Song = require("./song");
const ytdl = require("ytdl-core");
const { Guild } = require("discord.js");
const fs = require("fs"); 
const path = require("path");
const { info, error, warn } = require("../logging");

class ServerAudioPlayer {

  constructor(guild, channel, song) {

    info("Creating new audio player");


    this.queue = [];
    this.skipVoters = new Set();
    this.guild = guild;
    this.player = createAudioPlayer();
    this.join(channel);

    this.queue.push(song);
    this.getNextSong();
    
    this.player.on(AudioPlayerStatus.Idle, () => {
      if (this.queue.length !== 0) {
        info("Getting next resource from queue");
        this.getNextSong();
      } else {
        warn("Queue was 0 and therefore no next resource. Going idle...");
      }
    });
  }

  join(channel) {
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator
    });

    this.vc = channel;
    connection.subscribe(this.player);
  }

  addSong(song) {
    this.queue.push(song);

    if (this.getStatus() === "idle") {
      info("Audio player is idle, force starting next song");
      this.getNextSong();
    }
  }


  getNextSong() {

    info("Attemting to play next song");

    const song = this.queue[0];
  
    this.stream = ytdl(song.source, {
      filter: "audioonly",
      fmt: "mp3",
      highWaterMark: 1 << 62,
      liveBuffer: 1 << 62,
      dlChunkSize: 0,
      bitrate: 128,
    });

    const resource = createAudioResource(this.stream);

    this.player.play(resource);

    //Remove the currently playing song from the queue
    
    this.currentlyPlaying = this.queue.shift();
  }

  getCurrentlyPlaying() {

    if (this.player.state.status == AudioPlayerStatus.Idle) {
      return null;
    } else {
      return this.currentlyPlaying;
    }

  }

  pausePlayer() {
    this.player.pause();
  }

  resume() {
    this.player.unpause();
  }

  getStatus() {
    return this.player.state.status;
  }

  skip() {
    this.skipVoters = new Set();
    this.player.stop();
    this.stream.destroy();
    this.getNextSong();
  }

  voteSkip(userID) {
    this.skipVoters.add(userID);
    const listeners = this.vc.voice.members.size;
    const majority = listeners / 2;

    if (this.skipVoters.size > majority) {
      //Then Skip
      this.skip();
    }
  }

  getNumberOfVoters() {
    return this.skipVoters.size;
  }
  
  destroy() {
    this.player.stop();
    this.stream.destroy();
    const voiceConnection = getVoiceConnection(this.guild.id);
    voiceConnection.destroy(); 
  }

}
module.exports = ServerAudioPlayer;