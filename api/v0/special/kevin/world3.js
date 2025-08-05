export default function handler(req, res) {
  const worldStartDate = new Date('2023-07-12T19:34:21+01:00');
  const now = new Date();

  const msDiff = now - worldStartDate;
  const days = msDiff / (1000 * 60 * 60 * 24);
  const years = days / 365.25;
  
  const roundedYears = (Math.floor(years * 1000) / 1000).toFixed(3);

  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send(roundedYears);
}
