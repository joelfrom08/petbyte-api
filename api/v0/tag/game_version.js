export default async function handler(req, res) {
    const { game, version_type } = req.query;

    try {
        const response = await fetch('https://petbyte.dev/assets/raw_api/v0/game_versions.json');
        if (!response.ok) throw new Error('Failed to fetch game_versions.json');
        const data = await response.json();

        // Validate game
        const gameData = data[game];
        if (!gameData) {
            return res.status(404).json({ error: 'Game not found' });
        }

        let filtered = gameData;

        // Apply version_type filter if provided
        if (version_type) {
            filtered = filtered.filter(item =>
                item.version_type && item.version_type.toLowerCase().includes(version_type.toLowerCase())
            );
        }

        res.status(200).json(filtered);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
