// generate-icons.js
// Lance avec : node generate-icons.js
// Génère les icônes PWA dans /public/icons/

const fs = require("fs");
const path = require("path");

// SVG de l'icône Daara (mosquée + calligraphie)
const svgIcon = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <!-- Fond vert forêt -->
  <rect width="512" height="512" rx="100" fill="#1b3a2a"/>

  <!-- Motif géométrique subtil -->
  <circle cx="256" cy="256" r="200" fill="none" stroke="#c9a227" stroke-width="4" opacity="0.2"/>
  <circle cx="256" cy="256" r="160" fill="none" stroke="#c9a227" stroke-width="2" opacity="0.15"/>

  <!-- Dôme mosquée -->
  <ellipse cx="256" cy="210" rx="90" ry="70" fill="#c9a227"/>
  <rect x="166" y="200" width="180" height="20" fill="#c9a227"/>

  <!-- Corps mosquée -->
  <rect x="150" y="220" width="212" height="120" rx="4" fill="#f0d060"/>

  <!-- Minaret gauche -->
  <rect x="130" y="190" width="28" height="150" rx="4" fill="#c9a227"/>
  <ellipse cx="144" cy="190" rx="16" ry="22" fill="#1b3a2a"/>
  <ellipse cx="144" cy="190" rx="10" ry="14" fill="#c9a227"/>

  <!-- Minaret droit -->
  <rect x="354" y="190" width="28" height="150" rx="4" fill="#c9a227"/>
  <ellipse cx="368" cy="190" rx="16" ry="22" fill="#1b3a2a"/>
  <ellipse cx="368" cy="190" rx="10" ry="14" fill="#c9a227"/>

  <!-- Porte -->
  <rect x="228" y="270" width="56" height="70" rx="28" fill="#1b3a2a"/>

  <!-- Lettre arabe دارة -->
  <text x="256" y="168" font-family="serif" font-size="52" fill="#1b3a2a" text-anchor="middle" font-weight="bold">دارة</text>
</svg>
`;

const outDir = path.join(__dirname, "public", "icons");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Écrire les SVG (à convertir manuellement en PNG ou via sharp)
[192, 512].forEach((size) => {
  const svgPath = path.join(outDir, `icon-${size}.svg`);
  fs.writeFileSync(svgPath, svgIcon(size));
  console.log(`✅ Créé: ${svgPath}`);
});

console.log(`
📝 INSTRUCTIONS:
  1. Les fichiers SVG ont été créés dans /public/icons/
  2. Convertis-les en PNG avec un outil en ligne :
     → https://svgtopng.com (gratuit)
     → ou installe sharp: npm install sharp
  3. Renomme en icon-192.png et icon-512.png
  4. L'app sera alors installable comme PWA !
`);
