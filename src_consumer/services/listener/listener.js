const autoBind = require('auto-bind');

class Listener {
  constructor(playlistsService, playlistSongsService, mailSender) {
    this._playlistsService = playlistsService;
    this._playlistSongsService = playlistSongsService;
    this._mailSender = mailSender;

    autoBind(this);
  }

  async listen(message) {
    try {
      const { playlistId, targetEmail } = JSON.parse(message.content.toString());

      const playlistName = await this._playlistsService.getPlaylistName(playlistId);
      const songs = await this._playlistSongsService.getSongsFromPlaylistId(playlistId);
      const result = await this._mailSender.sendEmail(
        targetEmail,
        playlistName,
        JSON.stringify(songs),
      );
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Listener;
