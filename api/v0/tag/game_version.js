export default async function handler(req, res) {
    const { game, version_type, version_name, target_version } = req.query;

    try {
        const response = await fetch('https://petbyte.dev/assets/raw_api/v0/game_versions.json');
        if (!response.ok) throw new Error('Failed to fetch game_versions.json');
        const data = await response.json();

        const gameData = game ? { [game]: data[game] } : data;
        if (!gameData) {
            return res.status(404).json({ error: 'Game not found' });
        }

        let filtered = gameData;

        if (version_type) {
            filtered = filtered.filter(item =>
                item.version_type && item.version_type.toLowerCase().includes(version_type.toLowerCase())
            );
        }

        if (version_name) {
            filtered = filtered.filter(item =>
                item.version && item.version.toLowerCase().includes(version_name.toLowerCase())
            );
        }

        if (target_version) {
            filtered = filtered.filter(item =>
                item.target_version && item.target_version.toLowerCase().includes(target_version.toLowerCase())
            );
        }

        res.status(200).json(filtered);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}