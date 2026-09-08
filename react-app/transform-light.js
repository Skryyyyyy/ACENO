import fs from 'fs';

const filePath = 'C:/IQOO/react-app/src/components/MobileAppView.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace dark chassis and containers
content = content.replace(/bg-\[#090A0C\]/g, 'bg-[#F8FAFC]');
content = content.replace(/bg-\[#0e1014\]/g, 'bg-white');
content = content.replace(/bg-\[#14171d\]/g, 'bg-slate-50');
content = content.replace(/bg-\[#1c2027\]/g, 'bg-slate-100');
content = content.replace(/bg-\[#1d2129\]/g, 'bg-slate-100');
content = content.replace(/bg-\[#1c1414\]/g, 'bg-red-50');
content = content.replace(/bg-black\/40/g, 'bg-slate-100/80');
content = content.replace(/bg-black\/60/g, 'bg-slate-100');

// Replace borders
content = content.replace(/border-white\/10/g, 'border-slate-200');
content = content.replace(/border-white\/5/g, 'border-slate-100');
content = content.replace(/border-white\/20/g, 'border-slate-300');
content = content.replace(/border-white\/30/g, 'border-slate-300');
content = content.replace(/border-white\/15/g, 'border-slate-200');

// Replace text colors
content = content.replace(/text-white/g, 'text-slate-900');
content = content.replace(/text-slate-400/g, 'text-slate-500');
content = content.replace(/text-slate-300/g, 'text-slate-700');

// Replace primary action buttons
content = content.replace(/bg-white text-black font-extrabold/g, 'bg-slate-900 text-white font-black hover:bg-slate-800 shadow-md');
content = content.replace(/bg-white text-black/g, 'bg-slate-900 text-white hover:bg-slate-800');

// SVG stroke and fills
content = content.replace(/stroke-white/g, 'stroke-slate-900');
content = content.replace(/fill="#FFFFFF"/g, 'fill="#0F172A"');
content = content.replace(/stroke="rgba\(255,255,255,0.08\)"/g, 'stroke="rgba(0,0,0,0.06)"');

// Status bar
content = content.replace(/<div className="w-28 h-6 bg-black/g, '<div className="w-28 h-6 bg-slate-100');
content = content.replace(/bg-white animate-pulse/g, 'bg-indigo-600 animate-pulse');

// Fix button text on solid black buttons
content = content.replace(/text-slate-900 font-black hover:bg-slate-800/g, 'text-white font-black hover:bg-slate-800');

// Fix text-emerald-400 to text-emerald-600 for contrast
content = content.replace(/text-emerald-400/g, 'text-emerald-600');
content = content.replace(/text-amber-400/g, 'text-amber-600');
content = content.replace(/bg-emerald-400/g, 'bg-emerald-600');

// Fix Progress bars
content = content.replace(/bg-slate-800/g, 'bg-slate-200');

// Fix header in MobileAppView
content = content.replace(/<Activity className="w-4 h-4 text-slate-900" \/> iQOO Monochromatic Mobile/g, '<Activity className="w-4 h-4 text-indigo-600" /> iQOO Light Luxury Mobile');

fs.writeFileSync(filePath, content, 'utf8');
console.log('MobileAppView converted to Light Luxury theme successfully.');
