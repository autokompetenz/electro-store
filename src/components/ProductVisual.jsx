const INK = '#2A2A2B';
const INK_SOFT = 'rgba(0,0,0,0.35)';
const TERRA = '#57BB4F';
const TERRA_SOFT = 'rgba(87,187,79,0.4)';
const CREAM = '#FFFFFF';
const SAND = '#E9E9EB';
const OLIVE = '#FF8B00';

const visuals = {
  'lave-linge': (
    <>
      <rect x={48} y={42} width={104} height={120} rx={14} fill={CREAM} stroke={INK} strokeWidth="2.5" />
      <rect x={48} y={44} width={104} height={30} rx={9} fill={SAND} stroke={INK} strokeWidth="1.5" />
      <circle cx={68} cy={59} r={7} fill={CREAM} stroke={INK} strokeWidth="2" />
      <circle cx={102} cy={59} r={12} fill={CREAM} stroke={INK} strokeWidth="2" />
      <circle cx={102} cy={59} r={3.5} fill={TERRA} stroke="none" />
      <circle cx={100} cy={124} r={38} stroke={INK} strokeWidth="2.5" />
      <circle cx={100} cy={124} r={27} stroke={TERRA} strokeWidth="2" />
      <circle cx={100} cy={124} r={34} stroke={INK_SOFT} strokeWidth="1.5" strokeDasharray="3 6" />
      <path d="M85 128c4-9 9-9 13 0s9 9 14 0" stroke={OLIVE} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M60 162h6M134 162h6" stroke={INK} strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  'refrigerateur': (
    <>
      <rect x={54} y={32} width={92} height={136} rx={10} fill={CREAM} stroke={INK} strokeWidth="2.5" />
      <path d="M54 62h92" stroke={INK_SOFT} strokeWidth="1.5" />
      <path d="M96 50v-10" stroke={TERRA} strokeWidth="3" strokeLinecap="round" />
      <path d="M100 50c-8-6-18-6-25 0" stroke={OLIVE} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M100 48c-4.5-3-10-3-14 0" stroke={OLIVE} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx={100} cy={47} r={2} fill={OLIVE} stroke="none" />
      <path d="M132 70v14M132 104v26" stroke={TERRA} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M78 78v18" stroke={INK_SOFT} strokeWidth="2" strokeLinecap="round" />
      <path d="M58 168h6M136 168h6" stroke={INK} strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  'lave-vaisselle': (
    <>
      <rect x={50} y={36} width={100} height={130} rx={10} fill={CREAM} stroke={INK} strokeWidth="2.5" />
      <rect x={56} y={68} width={88} height={92} rx={6} fill={SAND} stroke={INK} strokeWidth="2" />
      <path d="M62 84h76" stroke={TERRA} strokeWidth="4" strokeLinecap="round" />
      <circle cx={80} cy={118} r={13} fill={CREAM} stroke={INK} strokeWidth="2" />
      <circle cx={108} cy={118} r={13} fill={CREAM} stroke={INK} strokeWidth="2" />
      <circle cx={80} cy={118} r={5} fill={TERRA_SOFT} stroke="none" />
      <circle cx={108} cy={118} r={5} fill={TERRA_SOFT} stroke="none" />
      <path d="M80 100l-10 12M108 100l10 12" stroke={INK_SOFT} strokeWidth="2" strokeLinecap="round" />
      <path d="M64 166h6M130 166h6" stroke={INK} strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  'four-plaque': (
    <>
      <rect x={44} y={24} width={112} height={34} rx={7} fill={CREAM} stroke={INK} strokeWidth="2.5" />
      <circle cx={70} cy={41} r={9} stroke={TERRA} strokeWidth="2.5" />
      <circle cx={70} cy={41} r={3} fill={TERRA} stroke="none" />
      <circle cx={130} cy={41} r={9} stroke={TERRA} strokeWidth="2.5" />
      <circle cx={130} cy={41} r={3} fill={TERRA} stroke="none" />
      <path d="M52 71h96" stroke={INK_SOFT} strokeWidth="2" strokeLinecap="round" />
      <rect x={60} y={78} width={80} height={88} rx={8} fill={CREAM} stroke={INK} strokeWidth="2.5" />
      <rect x={68} y={86} width={64} height={60} rx={6} fill={SAND} stroke={INK} strokeWidth="2" />
      <line x1={74} y1={126} x2={126} y2={126} stroke={INK_SOFT} strokeWidth="2" />
      <ellipse cx={100} cy={114} rx={19} ry={6} stroke={INK_SOFT} strokeWidth="2" />
      <path d="M88 108c6-7 18-7 24 0" stroke={OLIVE} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M62 176l4-8M138 176l4-8" stroke={INK} strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  'micro-ondes': (
    <>
      <rect x={38} y={44} width={124} height={114} rx={12} fill={CREAM} stroke={INK} strokeWidth="2.5" />
      <rect x={48} y={56} width={88} height={90} rx={8} fill={SAND} stroke={INK} strokeWidth="2" />
      <circle cx={92} cy={112} r={24} fill={CREAM} stroke={INK} strokeWidth="2" />
      <circle cx={92} cy={112} r={17} stroke={TERRA} strokeWidth="2" />
      <circle cx={92} cy={112} r={2.5} fill={TERRA} stroke="none" />
      <rect x={82} y={88} width={20} height={20} rx={3} fill={SAND} stroke={INK} strokeWidth="1.5" />
      <path d="M100 92l4 12" stroke={INK_SOFT} strokeWidth="2" strokeLinecap="round" />
      <rect x={142} y={56} width={16} height={90} rx={4} fill={SAND} stroke={INK} strokeWidth="2" />
      <circle cx={150} cy={80} r={5} fill={CREAM} stroke={INK} strokeWidth="2" />
      <circle cx={150} cy={100} r={5} fill={CREAM} stroke={INK} strokeWidth="2" />
      <path d="M148 66v2" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <path d="M52 170h6M148 170h6" stroke={INK} strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  'aspirateur': (
    <>
      <circle cx={100} cy={110} r={46} fill={CREAM} stroke={INK} strokeWidth="3" />
      <circle cx={100} cy={110} r={32} stroke={INK_SOFT} strokeWidth="1.5" strokeDasharray="2 6" />
      <circle cx={100} cy={82} r={13} fill={SAND} stroke={INK} strokeWidth="2.5" />
      <circle cx={100} cy={82} r={4} fill={TERRA} stroke="none" />
      <path d="M100 102v-24" stroke={TERRA} strokeWidth="3" strokeLinecap="round" />
      <path d="M112 92l14-10" stroke={OLIVE} strokeWidth="3" strokeLinecap="round" />
      <path d="M72 148l-8 6h16l-8-6" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M128 148l8 6h-16l8-6" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
  'petit-cuisine': (
    <>
      <rect x={64} y={46} width={78} height={104} rx={16} fill={CREAM} stroke={INK} strokeWidth="2.5" />
      <circle cx={103} cy={124} r={26} fill={SAND} stroke={INK} strokeWidth="2" />
      <circle cx={103} cy={124} r={18} stroke={TERRA} strokeWidth="2" />
      <circle cx={97} cy={118} r={2} fill={TERRA} stroke="none" />
      <circle cx={109} cy={118} r={2} fill={TERRA} stroke="none" />
      <circle cx={97} cy={130} r={2} fill={TERRA} stroke="none" />
      <circle cx={109} cy={130} r={2} fill={TERRA} stroke="none" />
      <rect x={72} y={58} width={58} height={14} rx={4} fill={INK} stroke="none" />
      <path d="M103 36v10" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <path d="M90 88l4-6M116 88l4-6" stroke={INK_SOFT} strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
};

visuals.default = visuals['petit-cuisine'];

export default function ProductVisual({ category, size = 160, style }) {
  const node = visuals[category] || visuals.default;
  return (
    <svg
      width={size}
      height={size}
      style={style}
      viewBox="0 0 200 200"
      fill="none"
      stroke={INK}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx={100} cy={184} rx={58} ry={9} fill="rgba(0,0,0,0.06)" stroke="none" />
      {node}
    </svg>
  );
}