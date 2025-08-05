export default function handler(req, res) {
  const copy_pasta = "Hey there, fellow Twitch enthusiasts! Want to join the coolest club in town? Become a Prime Sub member and unlock emotes so spicy, they'll make your chat rivals green with envy! Plus, you get the satisfaction of knowing you're supporting a streamer who's just one Prime Sub away from achieving world domination... or at least getting a pizza tonight. Prime Sub: Because who needs savings when you can have emotes? Use your FREE Twitch Prime subscripton on twitch.tv/spudd1es today!"

  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send(copy_pasta);
}
