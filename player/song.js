const { getInfo } = require("ytdl-core");


class Song {

  constructor(member, query) {
    this.member = member;
    this.query = query;
    this.name = "[Waiting for server...]";
    this.findSongUrl();
    this.getSongDetails();
  }

  findSongUrl() {
    if (this.query.startsWith("https://www.youtube.com")) {
      this.source = this.query;
    }

    //Need to implement a way to search for a query.
    //In the meantime, just use the source as the query
    this.source = this.query;
  }

  async getSongDetails() {
    //console.log("Getting song info")
    //const info = await getInfo(this.source);
    //this.name = info.videoDetails.title;
    //this.duration = Math.round(info.videoDetails.lengthSeconds / 60);
    this.name = "SERVER.ERROR";
    this.duration = "SERVER.ERROR";
  }
}

module.exports = Song;