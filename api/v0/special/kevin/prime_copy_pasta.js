export default function handler(req, res) {
  const copy_pasta = "Hey there, fellow Twitch gremlins! Want to join the coolest club in town? Become a Prime Sub member and unlock emotes so spicy, they'll make your chat rivals green with envy! Plus, you'll be satisfied supporting a streamer just one Prime Sub away from world dominations… or at least affording pizza. Prime Sub: Who needs savings when you can have emotes? Use your FREE sub on twitch.tv/spudd1es today!"

  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send(copy_pasta);
}
