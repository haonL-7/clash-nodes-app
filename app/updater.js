const https = require('https');
const http = require('http');

const YAML_URLS = [
  'https://cdn.jsdelivr.net/gh/haonL-7/clash-nodes@main/latest.yaml',
  'https://raw.githubusercontent.com/haonL-7/clash-nodes/main/latest.yaml'
];

/**
 * Fetch text from a URL (supports both http and https).
 */
function fetchText(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { timeout: 30000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Follow redirects
        fetchText(res.headers.location).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject).on('timeout', function() {
      this.destroy();
      reject(new Error('Request timed out'));
    });
  });
}

/**
 * Parse latest.yaml and extract proxy nodes.
 * Returns { nodes: [{n, r}, ...], lastModified: string }
 */
async function fetchAndParseNodes() {
  let yamlContent = null;

  for (const url of YAML_URLS) {
    try {
      yamlContent = await fetchText(url);
      if (yamlContent) break;
    } catch (e) {
      console.warn(`Failed to fetch from ${url}:`, e.message);
    }
  }

  if (!yamlContent) {
    throw new Error('All YAML URLs failed');
  }

  const nodes = parseYamlProxies(yamlContent);
  return {
    nodes,
    count: nodes.length,
    lastModified: new Date().toISOString()
  };
}

/**
 * Parse YAML content and extract proxy entries with region classification.
 * This is a lightweight parser for the Clash YAML format — it looks for
 * the 'proxies:' section and extracts each entry.
 */
function parseYamlProxies(yaml) {
  const nodes = [];
  const lines = yaml.split('\n');

  let inProxies = false;
  let currentProxy = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect start of proxies section
    if (/^proxies:\s*$/.test(line)) {
      inProxies = true;
      continue;
    }

    // Detect end of proxies section (next top-level key)
    if (inProxies && /^[a-zA-Z]/.test(line) && !line.startsWith('  ') && !line.startsWith('-')) {
      // Save last proxy if any
      if (currentProxy && currentProxy.name) {
        nodes.push({ n: currentProxy.name, r: classifyRegion(currentProxy.name) });
      }
      break;
    }

    if (inProxies) {
      // New proxy entry starts with "- name:" or "  name:"
      const nameMatch = line.match(/^\s*-?\s*name:\s*(.+)$/);
      if (nameMatch) {
        // Save previous proxy
        if (currentProxy && currentProxy.name) {
          nodes.push({ n: currentProxy.name, r: classifyRegion(currentProxy.name) });
        }
        currentProxy = { name: nameMatch[1].trim() };
      }
    }
  }

  // Don't forget the last proxy
  if (currentProxy && currentProxy.name) {
    nodes.push({ n: currentProxy.name, r: classifyRegion(currentProxy.name) });
  }

  return nodes;
}

/**
 * Classify a node name into a region code.
 * Mirrors the logic from build_html.py and Rust parser.rs.
 */
function classifyRegion(name) {
  const lower = name.toLowerCase();

  // Japan
  if (/日本|jp|japan|tokyo|osaka|東京|大阪/i.test(lower)) {
    return 'jp';
  }

  // US
  if (/美国|美國|usa|united\s*states|california|los\s*angeles|san\s*jose|new\s*york|seattle|chicago|texas|atlanta|minnesota|arizona|scottsdale|south\s*carolina|cloudflare/i.test(lower)) {
    return 'us';
  }
  // US prefix pattern: "US美國丨..." or "us something"
  if (/^us[美丨|]/.test(lower)) {
    return 'us';
  }

  // France
  if (/法国|法國|france|french|paris|^fr/i.test(lower)) {
    return 'fr';
  }

  return 'other';
}

/**
 * Check if update is available (lightweight HEAD request).
 */
async function checkUpdateAvailable() {
  for (const url of YAML_URLS) {
    try {
      const client = url.startsWith('https') ? https : http;
      const lastModified = await new Promise((resolve, reject) => {
        client.request(url, { method: 'HEAD', timeout: 15000 }, (res) => {
          resolve(res.headers['last-modified'] || null);
        }).on('error', reject).on('timeout', function() {
          this.destroy();
          reject(new Error('Timeout'));
        }).end();
      });

      if (lastModified) {
        return {
          updated: true,
          lastModified,
          url
        };
      }
    } catch (e) {
      continue;
    }
  }
  return { updated: false };
}

module.exports = { fetchAndParseNodes, checkUpdateAvailable, classifyRegion };
