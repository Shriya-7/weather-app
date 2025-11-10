# Weather CLI

Small Node.js CLI that fetches and prints the current weather for a city using the free wttr.in service (no API key required).

Usage:

```bash
node index.js "New York"
```

Example output:

```
Weather in New York: 15°C (59°F), Partly cloudy — feels like 14°C — humidity 72%
```

Notes:
- The CLI uses `https` and the wttr.in JSON endpoint: `https://wttr.in/<CITY>?format=j1`.
- If the city is omitted the script will print usage and exit.
- This is intentionally simple; feel free to extend it (add units, forecasts, or caching).
# weather-app