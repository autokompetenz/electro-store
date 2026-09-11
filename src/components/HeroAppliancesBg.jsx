export default function HeroAppliancesBg() {
  return (
    <svg
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        opacity: 0.06,
        pointerEvents: 'none',
        zIndex: 0,
      }}
      viewBox="0 0 1200 600"
      fill="none"
      stroke="var(--bark)"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Lave-linge — haut gauche */}
      <g transform="translate(80, 60) scale(0.55)">
        <rect x="48" y="42" width="104" height="120" rx="14" />
        <rect x="48" y="44" width="104" height="30" rx="9" />
        <circle cx="68" cy="59" r="7" />
        <circle cx="102" cy="59" r="12" />
        <circle cx="100" cy="124" r="38" />
        <circle cx="100" cy="124" r="27" strokeDasharray="3 6" />
      </g>

      {/* Réfrigérateur — haut droite */}
      <g transform="translate(920, 30) scale(0.5)">
        <rect x="54" y="32" width="92" height="136" rx="10" />
        <path d="M54 62h92" />
        <path d="M132 70v14M132 104v26" />
      </g>

      {/* Aspirateur robot — centre gauche */}
      <g transform="translate(160, 340) scale(0.48)">
        <circle cx="100" cy="110" r="46" />
        <circle cx="100" cy="110" r="32" strokeDasharray="2 6" />
        <circle cx="100" cy="82" r="13" />
        <path d="M100 102v-24" />
        <path d="M112 92l14-10" />
      </g>

      {/* Lave-vaisselle — centre */}
      <g transform="translate(520, 370) scale(0.45)">
        <rect x="50" y="36" width="100" height="130" rx="10" />
        <rect x="56" y="68" width="88" height="92" rx="6" />
        <path d="M62 84h76" />
        <circle cx="80" cy="118" r="13" />
        <circle cx="108" cy="118" r="13" />
      </g>

      {/* Four — centre droite */}
      <g transform="translate(780, 350) scale(0.42)">
        <rect x="44" y="24" width="112" height="34" rx="7" />
        <circle cx="70" cy="41" r="9" />
        <circle cx="130" cy="41" r="9" />
        <rect x="60" y="78" width="80" height="88" rx="8" />
        <rect x="68" y="86" width="64" height="60" rx="6" />
      </g>

      {/* Micro-ondes — bas gauche */}
      <g transform="translate(40, 380) scale(0.4)">
        <rect x="38" y="44" width="124" height="114" rx="12" />
        <rect x="48" y="56" width="88" height="90" rx="8" />
        <circle cx="92" cy="112" r="24" />
        <rect x="142" y="56" width="16" height="90" rx="4" />
      </g>

      {/* Petit cuisine / friteuse — haut milieu */}
      <g transform="translate(500, 40) scale(0.48)">
        <rect x="64" y="46" width="78" height="104" rx="16" />
        <circle cx="103" cy="124" r="26" />
        <circle cx="103" cy="124" r="18" />
        <rect x="72" y="58" width="58" height="14" rx="4" />
      </g>

      {/* Lave-linge mini — bas droite */}
      <g transform="translate(1020, 380) scale(0.44)">
        <rect x="48" y="42" width="104" height="120" rx="14" />
        <rect x="48" y="44" width="104" height="30" rx="9" />
        <circle cx="100" cy="124" r="38" />
        <circle cx="100" cy="124" r="27" strokeDasharray="3 6" />
      </g>

      {/* Réfrigérateur mini — milieu */}
      <g transform="translate(340, 180) scale(0.38)">
        <rect x="54" y="32" width="92" height="136" rx="10" />
        <path d="M54 62h92" />
        <path d="M132 70v14M132 104v26" />
      </g>

      {/* Aspirateur — bas milieu */}
      <g transform="translate(680, 200) scale(0.4)">
        <circle cx="100" cy="110" r="46" />
        <circle cx="100" cy="82" r="13" />
        <path d="M100 102v-24" />
        <path d="M112 92l14-10" />
        <path d="M72 148l-8 6h16l-8-6" />
        <path d="M128 148l8 6h-16l8-6" />
      </g>
    </svg>
  );
}
