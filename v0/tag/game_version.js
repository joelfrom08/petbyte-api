export default async function handler(req, res) {
    const { game, version_type, version_name, target_version } = req.query;

    try {
        const response = await fetch('https://petbyte.dev/assets/raw_api/v0/game_versions.json');
        if (!response.ok) throw new Error('Failed to fetch game_versions.json');
        const data = await response.json();

        let games = game ? { [game]: data[game] } : data;
        let results = [];

        for (const [gameName, versions] of Object.entries(games)) {
            let filtered = versions;

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

            results.push(...filtered.map(item => ({ game: gameName, ...item })));
        }

        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
