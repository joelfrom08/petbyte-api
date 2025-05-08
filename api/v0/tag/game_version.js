import fetch from 'node-fetch';

export default async function handler(req, res) {
    const { game, version_name, version_type, target_version, before, after, during, aliases, tags } = req.query;

    try {
        const response = await fetch('https://petbyte.dev/assets/raw_api/v0/game_versions.json');
        if (!response.ok) throw new Error('Failed to fetch game_versions.json');
        const jsonData = await response.json();

        const { info, info2, opt_alias, ...games } = jsonData;

        let activeGames = games;

        // Resolve opt_alias if game param is provided
        let selectedGames = game
            ? {
                  [opt_alias[game] || game]: games[opt_alias[game] || game],
              }
            : games;

        let results = [];

        for (const [gameName, versions] of Object.entries(selectedGames)) {
            if (!versions) continue;
            let filtered = versions;

            if (version_name) {
                filtered = filtered.filter(v =>
                    v.version.toLowerCase().includes(version_name.toLowerCase())
                );
            }

            if (version_type) {
                filtered = filtered.filter(v =>
                    v.version_type && v.version_type.toLowerCase().includes(version_type.toLowerCase())
                );
            }

            if (target_version) {
                filtered = filtered.filter(v =>
                    v.target_version && v.target_version.toLowerCase().includes(target_version.toLowerCase())
                );
            }

            if (aliases) {
                const aliasList = aliases.toLowerCase().split(',');
                filtered = filtered.filter(v =>
                    v.aliases && v.aliases.some(a => aliasList.includes(a.toLowerCase()))
                );
            }

            if (tags) {
                const tagList = tags.toLowerCase().split(',');
                filtered = filtered.filter(v =>
                    v.tags && v.tags.some(t => tagList.includes(t.toLowerCase()))
                );
            }

            if (before || after || during) {
                filtered = filtered.filter(v => {
                    const release = new Date(v.release_time);
                    if (before && release >= new Date(before)) return false;
                    if (after && release <= new Date(after)) return false;
                    if (during) {
                        const prefix = during;
                        return v.release_time.startsWith(prefix);
                    }
                    return true;
                });
            }

            results.push(...filtered.map(v => ({ game: gameName, ...v })));
        }

        res.status(200).json({
            info,
            info2,
            count: results.length,
            results,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
