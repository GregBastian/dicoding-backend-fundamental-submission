require('dotenv').config();
const amqp = require('amqplib');
const PlaylistService = require('./services/postgres/PlaylistService');
const PlaylistSongsService = require('./services/postgres/PlaylistSongsService');
const MailSender = require('./services/mailSender/MailSender');
const Listener = require('./services/listener/listener');

const init = async () => {
  const playlistsService = new PlaylistService();
  const playlistSongsService = new PlaylistSongsService(playlistsService);
  const mailSender = new MailSender();
  const listener = new Listener(playlistsService, playlistSongsService, mailSender);

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue(process.env.PLAYLIST_CHANNEL_NAME, {
    durable: true,
  });

  channel.consume(process.env.PLAYLIST_CHANNEL_NAME,
    listener.listen, { noAck: true });

  console.log(`Consumer berjalan pada ${process.env.RABBITMQ_SERVER}`);
};

init();
