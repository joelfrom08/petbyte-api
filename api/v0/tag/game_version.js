import fetch from 'node-fetch';

export default async function handler(req, res) {
    const { game, version_name, version_type, target_version, before, after, during, aliases, tags, strict_target, strict_version_type, strict_version_name, strict_aliases, strict_tags } = req.query;

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

            const strictVersionName = req.query.strict_version_name === 'true';

            if (version_name) {
                filtered = filtered.filter(v => {
                    if (!v.target_version) return false;
                    if (strictVersionName) {
                        return v.version.toLowerCase() === version_name.toLowerCase();
                    } else {
                        return v.version.toLowerCase().includes(version_name.toLowerCase());
                    }
                });
            }

            const strictVersionType = req.query.strict_version_type === 'true';

            if (version_type) {
                filtered = filtered.filter(v => {
                    if (!v.version_type) return false;
                    if (strictVersionType) {
                        return v.version_type.toLowerCase() === version_type.toLowerCase();
                    } else {
                        return v.version_type.toLowerCase().includes(version_type.toLowerCase());
                    }
                });
            }

            const strictTarget = req.query.strict_target === 'true';

            if (target_version) {
                filtered = filtered.filter(v => {
                    if (!v.target_version) return false;
                    if (strictTarget) {
                        return v.target_version.toLowerCase() === target_version.toLowerCase();
                    } else {
                        return v.target_version.toLowerCase().includes(target_version.toLowerCase());
                    }
                });
            }

            const strictAliases = req.query.strict_aliases === 'true';

            if (aliases) {
                const aliasList = aliases.toLowerCase().split(',');
                filtered = filtered.filter(v => {
                    if (!v.aliases) return false;
                    v.aliases && v.aliases.some(a =>
                        strictAliases
                            ? aliasList.includes(a.toLowerCase())
                            : aliasList.some(alias => a.toLowerCase().includes(alias))
                    )
                });
            }

            const strictTags = req.query.strict_tags === 'true';

            if (tags) {
                const tagList = tags.toLowerCase().split(',');
                filtered = filtered.filter(v => {
                    if (!v.aliases) return false;
                    v.tags && v.tags.some(t =>
                        strictTags
                            ? tagList.includes(t.toLowerCase())
                            : tagList.some(tag => t.toLowerCase().includes(tag))
                    )
                });
            }

            if (before || after || during) {
                filtered = filtered.filter(v => {
                    const release = new Date(v.release_time);
            
                    if (before) {
                        const beforeDate = new Date(before);
                        if (release >= beforeDate) return false;
                    }
                    if (after) {
                        const afterDate = new Date(after);
                        if (release <= afterDate) return false;
                    }
                    if (during) {
                        const duringParts = during.split('T')[0]; // remove time if present
                        if (!v.release_time.startsWith(duringParts)) return false;
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
