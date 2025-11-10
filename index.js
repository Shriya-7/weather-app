const https = require('https');

// Simple Node CLI to fetch weather for a city using wttr.in (no API key required).
// Usage: node index.js "New York"

function printUsageAndExit() {
  console.log('Usage: node index.js "City Name"');
  process.exit(1);
}

const city = process.argv.slice(2).join(' ');
if (!city) {
  printUsageAndExit();
}

const url = `https://wttr.in/${encodeURIComponent(city)}?format=j1`;

https.get(url, { headers: { 'User-Agent': 'node.js' } }, (res) => {
  const { statusCode } = res;
  const contentType = res.headers['content-type'] || '';

  let error;
  if (statusCode !== 200) {
    error = new Error('Request Failed. Status Code: ' + statusCode);
  }
  if (error) {
    console.error(error.message);
    // consume response data to free up memory
    res.resume();
    return;
  }

  let rawData = '';
  res.setEncoding('utf8');
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      const parsed = JSON.parse(rawData);

      // wttr.in returns `current_condition` array and `nearest_area` for area names
      const current = parsed.current_condition && parsed.current_condition[0];
      const area = parsed.nearest_area && parsed.nearest_area[0] && parsed.nearest_area[0].areaName && parsed.nearest_area[0].areaName[0] && parsed.nearest_area[0].areaName[0].value;

      if (!current) {
        console.error('Could not find weather data for:', city);
        process.exitCode = 2;
        return;
      }

      const tempC = current.temp_C;
      const tempF = current.temp_F;
      const desc = (current.weatherDesc && current.weatherDesc[0] && current.weatherDesc[0].value) || 'No description';
      const feelsLikeC = current.FeelsLikeC || null;
      const humidity = current.humidity || null;

      const displayName = area || city;

      let summary = `Weather in ${displayName}: ${tempC}°C (${tempF}°F), ${desc}`;
      if (feelsLikeC) summary += ` — feels like ${feelsLikeC}°C`;
      if (humidity) summary += ` — humidity ${humidity}%`;

      console.log(summary);
    } catch (e) {
      console.error('Error parsing weather data:', e.message);
      process.exitCode = 3;
    }
  });

}).on('error', (e) => {
  console.error('Request error:', e.message);
  process.exitCode = 1;
});
