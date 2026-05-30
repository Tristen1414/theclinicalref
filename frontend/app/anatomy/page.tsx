'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { supabase } from '@/lib/supabase'

interface AnatomyEntry {
  id: string
  system: string
  structure: string
  description: string
  function: string
  clinical_relevance: string
  ems_relevance: string
  landmarks: string
  category: string
  tags: string[]
}

const systems = [
  'All', 'Cardiovascular', 'Respiratory', 'Neurological',
  'Musculoskeletal', 'Abdominal', 'Head and Neck', 'Extremities'
]

const systemColors: Record<string, string> = {
  Cardiovascular: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
  Respiratory: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  Neurological: "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
  Musculoskeletal: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
  Abdominal: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400",
  'Head and Neck': "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400",
  Extremities: "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400",
}

const systemIcons: Record<string, string> = {
  Cardiovascular: '🫀',
  Respiratory: '🫁',
  Neurological: '🧠',
  Musculoskeletal: '🦴',
  Abdominal: '🫃',
  'Head and Neck': '👤',
  Extremities: '🦵',
}

const regionMap: Record<string, string[]> = {
  brain: ['Brain', 'Cerebrum', 'Cerebellum', 'Brainstem', 'Pupils'],
  skull: ['Skull', 'Mastoid Process'],
  spine: ['Spinal Cord', 'Cervical Spine'],
  thyroid: ['Thyroid Gland'],
  trachea: ['Trachea', 'Larynx', 'Cricothyroid Membrane'],
  heart: ['Heart', 'Left Ventricle', 'Right Ventricle'],
  lungs: ['Lungs', 'Pleura', 'Diaphragm'],
  aorta: ['Aorta', 'Coronary Arteries'],
  carotid: ['Carotid Artery', 'Jugular Veins'],
  liver: ['Liver'],
  gallbladder: ['Gallbladder'],
  stomach: ['Stomach'],
  spleen: ['Spleen'],
  pancreas: ['Pancreas'],
  smallintestine: ['Small Intestine'],
  largeintestine: ['Large Intestine'],
  kidneys: ['Kidneys'],
  appendix: ['Appendix'],
  bladder: ['Bladder'],
  pelvis: ['Pelvis'],
  sternum: ['Sternum'],
  ribs: ['Ribs'],
  humerus: ['Humerus'],
  radius: ['Radius'],
  ulna: ['Ulna'],
  phalanges: ['Hand Phalanges'],
  femur: ['Femur'],
  tibia: ['Tibia'],
  fibula: ['Fibula'],
  foot: ['Foot Bones'],
  brachial: ['Brachial Artery'],
  radial: ['Radial Artery'],
  femoral: ['Femoral Artery'],
  biceps: ['Biceps Brachii'],
  triceps: ['Triceps Brachii'],
  deltoid: ['Deltoid Muscle'],
  pectoralis: ['Pectoralis Major'],
  trapezius: ['Trapezius'],
  quadriceps: ['Quadriceps'],
  hamstrings: ['Hamstrings'],
  gastrocnemius: ['Gastrocnemius'],
  tibialis: ['Tibialis Anterior'],
  gluteus: ['Gluteus Maximus'],
}

function InteractiveBody({ allEntries, onSelect }: {
  allEntries: AnatomyEntry[]
  onSelect: (entry: AnatomyEntry) => void
}) {
  const [layer, setLayer] = useState('organs')
  const [gender, setGender] = useState('male')
  const [hovered, setHovered] = useState<string | null>(null)
  const [popup, setPopup] = useState<string | null>(null)

  function findEntry(regionKey: string): AnatomyEntry | null {
    const names = regionMap[regionKey]
    if (!names) return null
    for (const name of names) {
      const match = allEntries.find(e =>
        e.structure.toLowerCase().includes(name.toLowerCase()) ||
        name.toLowerCase().includes(e.structure.toLowerCase())
      )
      if (match) return match
    }
    return null
  }

  function handleClick(regionKey: string) {
    const entry = findEntry(regionKey)
    if (entry) {
      onSelect(entry)
      setPopup(regionKey)
    }
  }

  const isFemale = gender === 'female'

  return (
    <div className="flex flex-col">
      <div className="flex gap-2 flex-wrap mb-3">
        {['organs', 'skeletal', 'circulatory', 'muscular'].map((l) => (
          <button
            key={l}
            onClick={() => setLayer(l)}
            className={`px-3 py-1.5 text-xs rounded-full border font-medium transition-colors capitalize ${
              layer === l
                ? 'bg-red-700 text-white border-red-700'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-600'
            }`}
          >
            {l}
          </button>
        ))}
      </div>
      <div className="flex gap-2 mb-3">
        {['male', 'female'].map((g) => (
          <button
            key={g}
            onClick={() => setGender(g)}
            className={`px-3 py-1.5 text-xs rounded-full border font-medium transition-colors capitalize ${
              gender === g
                ? 'bg-blue-700 text-white border-blue-700'
                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
            }`}
          >
            {g}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-400 mb-2 text-center">Tap any highlighted region to view details</p>
      <svg viewBox="0 0 220 520" className="w-full max-w-xs mx-auto" xmlns="http://www.w3.org/2000/svg">

        {/* Silhouette */}
        {isFemale ? (
          <g fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1">
            <ellipse cx="110" cy="42" rx="26" ry="30" />
            <rect x="98" y="68" width="24" height="18" rx="4" />
            <path d="M78 84 Q62 92 60 125 L60 230 Q60 248 80 252 L140 252 Q160 248 160 230 L160 125 Q158 92 142 84 Z" />
            <path d="M60 98 Q44 104 40 135 L36 200 Q35 210 42 212 L52 212 Q58 210 59 200 L63 138 Z" />
            <path d="M160 98 Q176 104 180 135 L184 200 Q185 210 178 212 L168 212 Q162 210 161 200 L157 138 Z" />
            <path d="M80 252 L74 340 Q73 358 80 375 L86 415 Q87 424 94 424 L102 424 Q108 424 109 415 L107 375 Q108 358 108 340 L108 252 Z" />
            <path d="M140 252 L146 340 Q147 358 140 375 L134 415 Q133 424 126 424 L118 424 Q112 424 111 415 L113 375 Q112 358 112 340 L112 252 Z" />
          </g>
        ) : (
          <g fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1">
            <ellipse cx="110" cy="42" rx="28" ry="30" />
            <rect x="97" y="68" width="26" height="18" rx="4" />
            <path d="M72 84 Q54 92 52 125 L52 228 Q52 244 72 248 L148 248 Q168 244 168 228 L168 125 Q166 92 148 84 Z" />
            <path d="M52 96 Q34 104 30 138 L26 205 Q25 215 33 217 L44 217 Q51 215 52 205 L56 140 Z" />
            <path d="M168 96 Q186 104 190 138 L194 205 Q195 215 187 217 L176 217 Q169 215 168 205 L164 140 Z" />
            <path d="M72 248 L65 338 Q64 356 72 374 L78 415 Q79 424 87 424 L97 424 Q104 424 105 415 L102 374 Q104 356 104 338 L104 248 Z" />
            <path d="M148 248 L155 338 Q156 356 148 374 L142 415 Q141 424 133 424 L123 424 Q116 424 115 415 L118 374 Q116 356 116 338 L116 248 Z" />
          </g>
        )}

        {/* ORGANS LAYER */}
        {layer === 'organs' && (
          <g>
            {/* Brain */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('brain')} onMouseEnter={() => setHovered('brain')} onMouseLeave={() => setHovered(null)}>
              <ellipse cx="110" cy="42" rx="20" ry="22" fill={hovered==='brain'?'#a78bfa':'#c4b5fd'} stroke="#7F77DD" strokeWidth="1"/>
              <text x="110" y="46" textAnchor="middle" fontSize="7" fill="#3C3489" fontWeight="500">Brain</text>
            </g>
            {/* Thyroid */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('thyroid')} onMouseEnter={() => setHovered('thyroid')} onMouseLeave={() => setHovered(null)}>
              <path d="M102 80 Q110 76 118 80 L116 88 Q110 84 104 88 Z" fill={hovered==='thyroid'?'#f97316':'#f0997b'} stroke="#D85A30" strokeWidth="0.8"/>
              <text x="110" y="96" textAnchor="middle" fontSize="6" fill="#993C1D">Thyroid</text>
            </g>
            {/* Trachea */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('trachea')} onMouseEnter={() => setHovered('trachea')} onMouseLeave={() => setHovered(null)}>
              <rect x="106" y="68" width="8" height="16" rx="3" fill={hovered==='trachea'?'#60a5fa':'#bfdbfe'} stroke="#93c5fd" strokeWidth="0.8"/>
            </g>
            {/* Heart */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('heart')} onMouseEnter={() => setHovered('heart')} onMouseLeave={() => setHovered(null)}>
              <path d="M90 128 Q90 118 100 118 Q108 118 110 126 Q112 118 120 118 Q130 118 130 128 Q130 140 110 152 Q90 140 90 128Z" fill={hovered==='heart'?'#f87171':'#fca5a5'} stroke="#E24B4A" strokeWidth="1"/>
              <text x="110" y="158" textAnchor="middle" fontSize="7" fill="#791F1F" fontWeight="500">Heart</text>
            </g>
            {/* Lungs */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('lungs')} onMouseEnter={() => setHovered('lungs')} onMouseLeave={() => setHovered(null)}>
              <path d="M66 118 Q60 128 60 155 Q60 170 72 174 Q82 176 86 165 L88 132 Q83 115 76 115 Z" fill={hovered==='lungs'?'#60a5fa':'#93c5fd'} stroke="#378ADD" strokeWidth="1"/>
              <path d="M154 118 Q160 128 160 155 Q160 170 148 174 Q138 176 134 165 L132 132 Q137 115 144 115 Z" fill={hovered==='lungs'?'#60a5fa':'#93c5fd'} stroke="#378ADD" strokeWidth="1"/>
              <text x="68" y="148" textAnchor="middle" fontSize="6" fill="#042C53">L</text>
              <text x="152" y="148" textAnchor="middle" fontSize="6" fill="#042C53">R</text>
            </g>
            {/* Diaphragm */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('lungs')} onMouseEnter={() => setHovered('diaphragm')} onMouseLeave={() => setHovered(null)}>
              <path d="M62 178 Q110 194 158 178" fill="none" stroke={hovered==='diaphragm'?'#2563eb':'#60a5fa'} strokeWidth="3" strokeLinecap="round"/>
              <text x="110" y="192" textAnchor="middle" fontSize="6" fill="#185FA5">Diaphragm</text>
            </g>
            {/* Liver */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('liver')} onMouseEnter={() => setHovered('liver')} onMouseLeave={() => setHovered(null)}>
              <path d="M112 200 Q140 197 150 212 Q150 225 137 228 Q124 230 112 222 Z" fill={hovered==='liver'?'#4ade80':'#86efac'} stroke="#3B6D11" strokeWidth="1"/>
              <text x="133" y="217" textAnchor="middle" fontSize="6" fill="#173404">Liver</text>
            </g>
            {/* Gallbladder */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('gallbladder')} onMouseEnter={() => setHovered('gallbladder')} onMouseLeave={() => setHovered(null)}>
              <ellipse cx="145" cy="232" rx="7" ry="5" fill={hovered==='gallbladder'?'#fcd34d':'#fde68a'} stroke="#EF9F27" strokeWidth="0.8"/>
              <text x="145" y="243" textAnchor="middle" fontSize="5.5" fill="#412402">GB</text>
            </g>
            {/* Stomach */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('stomach')} onMouseEnter={() => setHovered('stomach')} onMouseLeave={() => setHovered(null)}>
              <path d="M86 198 Q86 190 96 190 Q110 190 112 202 Q114 215 103 218 Q88 218 86 206 Z" fill={hovered==='stomach'?'#4ade80':'#a7f3d0'} stroke="#3B6D11" strokeWidth="1"/>
              <text x="97" y="208" textAnchor="middle" fontSize="6" fill="#173404">Stomach</text>
            </g>
            {/* Spleen */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('spleen')} onMouseEnter={() => setHovered('spleen')} onMouseLeave={() => setHovered(null)}>
              <ellipse cx="70" cy="210" rx="10" ry="13" fill={hovered==='spleen'?'#4ade80':'#86efac'} stroke="#3B6D11" strokeWidth="1"/>
              <text x="70" y="214" textAnchor="middle" fontSize="6" fill="#173404">Spleen</text>
            </g>
            {/* Pancreas */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('pancreas')} onMouseEnter={() => setHovered('pancreas')} onMouseLeave={() => setHovered(null)}>
              <path d="M88 225 Q110 220 130 225 Q130 232 110 234 Q88 234 88 225 Z" fill={hovered==='pancreas'?'#4ade80':'#86efac'} stroke="#3B6D11" strokeWidth="0.8"/>
              <text x="110" y="231" textAnchor="middle" fontSize="5.5" fill="#173404">Pancreas</text>
            </g>
            {/* Large intestine */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('largeintestine')} onMouseEnter={() => setHovered('largeintestine')} onMouseLeave={() => setHovered(null)}>
              <path d="M70 237 Q65 265 68 295 Q72 312 92 315 Q110 317 128 315 Q148 312 152 295 Q155 265 150 237 Q138 232 110 232 Q82 232 70 237 Z" fill="none" stroke={hovered==='largeintestine'?'#22c55e':'#86efac'} strokeWidth="6" strokeLinejoin="round"/>
              <text x="110" y="280" textAnchor="middle" fontSize="5.5" fill="#173404">Large int.</text>
            </g>
            {/* Small intestine */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('smallintestine')} onMouseEnter={() => setHovered('smallintestine')} onMouseLeave={() => setHovered(null)}>
              <ellipse cx="110" cy="272" rx="22" ry="26" fill={hovered==='smallintestine'?'#4ade80':'#a7f3d0'} stroke="#3B6D11" strokeWidth="0.8" fillOpacity="0.8"/>
              <text x="110" y="276" textAnchor="middle" fontSize="5.5" fill="#173404">Small int.</text>
            </g>
            {/* Left kidney */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('kidneys')} onMouseEnter={() => setHovered('kidneys')} onMouseLeave={() => setHovered(null)}>
              <path d="M74 218 Q70 212 70 223 Q70 233 77 235 Q84 235 86 226 Q86 216 81 214 Z" fill={hovered==='kidneys'?'#fcd34d':'#fde68a'} stroke="#EF9F27" strokeWidth="1"/>
              <text x="74" y="246" textAnchor="middle" fontSize="5" fill="#412402">L-K</text>
            </g>
            {/* Right kidney */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('kidneys')} onMouseEnter={() => setHovered('kidneys')} onMouseLeave={() => setHovered(null)}>
              <path d="M136 218 Q132 212 132 223 Q132 233 139 235 Q146 235 148 226 Q148 216 143 214 Z" fill={hovered==='kidneys'?'#fcd34d':'#fde68a'} stroke="#EF9F27" strokeWidth="1"/>
              <text x="140" y="246" textAnchor="middle" fontSize="5" fill="#412402">R-K</text>
            </g>
            {/* Appendix */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('appendix')} onMouseEnter={() => setHovered('appendix')} onMouseLeave={() => setHovered(null)}>
              <path d="M150 303 Q154 311 152 318 Q150 322 146 320 Q144 313 146 305 Z" fill={hovered==='appendix'?'#4ade80':'#86efac'} stroke="#3B6D11" strokeWidth="0.8"/>
            </g>
            {/* Bladder */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('bladder')} onMouseEnter={() => setHovered('bladder')} onMouseLeave={() => setHovered(null)}>
              <ellipse cx="110" cy="318" rx="15" ry="12" fill={hovered==='bladder'?'#fcd34d':'#fde68a'} stroke="#EF9F27" strokeWidth="1"/>
              <text x="110" y="322" textAnchor="middle" fontSize="6" fill="#412402">Bladder</text>
            </g>
            {/* Female specific */}
            {isFemale && (
              <g>
                <ellipse cx="94" cy="305" rx="8" ry="6" fill="#f4c0d1" stroke="#D4537E" strokeWidth="1" style={{cursor:'pointer'}}
                  onClick={() => { const m = allEntries.find(e => e.structure.toLowerCase().includes('ovari')); if(m) onSelect(m) }}/>
                <ellipse cx="126" cy="305" rx="8" ry="6" fill="#f4c0d1" stroke="#D4537E" strokeWidth="1" style={{cursor:'pointer'}}
                  onClick={() => { const m = allEntries.find(e => e.structure.toLowerCase().includes('ovari')); if(m) onSelect(m) }}/>
                <path d="M100 294 Q110 288 120 294 L122 307 Q116 314 110 316 Q104 314 98 307 Z" fill="#f4c0d1" stroke="#D4537E" strokeWidth="1" style={{cursor:'pointer'}}
                  onClick={() => { const m = allEntries.find(e => e.structure.toLowerCase().includes('uterus')); if(m) onSelect(m) }}/>
                <text x="110" y="310" textAnchor="middle" fontSize="6" fill="#4B1528">Uterus</text>
              </g>
            )}
          </g>
        )}

        {/* SKELETAL LAYER */}
        {layer === 'skeletal' && (
          <g>
            {/* Skull */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('skull')} onMouseEnter={() => setHovered('skull')} onMouseLeave={() => setHovered(null)}>
              <ellipse cx="110" cy="40" rx="25" ry="28" fill={hovered==='skull'?'#d1d5db':'#f3f4f6'} stroke="#6b7280" strokeWidth="1.5"/>
              <ellipse cx="110" cy="55" rx="17" ry="11" fill="#e5e7eb" stroke="#6b7280" strokeWidth="1"/>
              <text x="110" y="38" textAnchor="middle" fontSize="7" fill="#374151" fontWeight="500">Skull</text>
            </g>
            {/* Cervical spine */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('spine')} onMouseEnter={() => setHovered('cspine')} onMouseLeave={() => setHovered(null)}>
              {[0,1,2,3,4,5,6].map(i => (
                <rect key={i} x="105" y={70 + i*8} width="10" height="6" rx="1" fill={hovered==='cspine'?'#d1d5db':'#e5e7eb'} stroke="#9ca3af" strokeWidth="0.8"/>
              ))}
              <text x="120" y="96" fontSize="6" fill="#374151">C-spine</text>
            </g>
            {/* Thoracic spine */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('spine')} onMouseEnter={() => setHovered('tspine')} onMouseLeave={() => setHovered(null)}>
              {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => (
                <rect key={i} x="105" y={130 + i*9} width="10" height="7" rx="1" fill={hovered==='tspine'?'#d1d5db':'#e5e7eb'} stroke="#9ca3af" strokeWidth="0.8"/>
              ))}
            </g>
            {/* Lumbar spine */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('spine')} onMouseEnter={() => setHovered('lspine')} onMouseLeave={() => setHovered(null)}>
              {[0,1,2,3,4].map(i => (
                <rect key={i} x="104" y={240 + i*10} width="12" height="8" rx="1.5" fill={hovered==='lspine'?'#d1d5db':'#e5e7eb'} stroke="#9ca3af" strokeWidth="0.8"/>
              ))}
              <text x="120" y="266" fontSize="6" fill="#374151">L-spine</text>
            </g>
            {/* Sternum */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('sternum')} onMouseEnter={() => setHovered('sternum')} onMouseLeave={() => setHovered(null)}>
              <rect x="104" y="102" width="12" height="72" rx="3" fill={hovered==='sternum'?'#d1d5db':'#f3f4f6'} stroke="#6b7280" strokeWidth="1.5"/>
              <text x="110" y="142" textAnchor="middle" fontSize="6" fill="#374151">Sternum</text>
            </g>
            {/* Ribs left */}
            {[0,1,2,3,4,5,6].map(i => (
              <g key={i} style={{cursor:'pointer'}} onClick={() => handleClick('ribs')} onMouseEnter={() => setHovered('ribs')} onMouseLeave={() => setHovered(null)}>
                <path d={`M104 ${110+i*10} Q78 ${107+i*10} 62 ${120+i*10}`} fill="none" stroke={hovered==='ribs'?'#6b7280':'#9ca3af'} strokeWidth="1.5" strokeLinecap="round"/>
              </g>
            ))}
            {/* Ribs right */}
            {[0,1,2,3,4,5,6].map(i => (
              <g key={i} style={{cursor:'pointer'}} onClick={() => handleClick('ribs')} onMouseEnter={() => setHovered('ribs')} onMouseLeave={() => setHovered(null)}>
                <path d={`M116 ${110+i*10} Q142 ${107+i*10} 158 ${120+i*10}`} fill="none" stroke={hovered==='ribs'?'#6b7280':'#9ca3af'} strokeWidth="1.5" strokeLinecap="round"/>
              </g>
            ))}
            {/* Clavicles */}
            <path d="M97 86 Q78 82 63 92" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
            <path d="M123 86 Q142 82 157 92" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
            {/* Pelvis */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('pelvis')} onMouseEnter={() => setHovered('pelvis')} onMouseLeave={() => setHovered(null)}>
              <path d={`M${isFemale?'76':'70'} 252 Q110 243 ${isFemale?'144':'150'} 252 Q${isFemale?'158':'164'} 272 ${isFemale?'144':'150'} 290 Q110 298 ${isFemale?'76':'70'} 290 Q${isFemale?'62':'56'} 272 ${isFemale?'76':'70'} 252 Z`} fill={hovered==='pelvis'?'#d1d5db':'#f3f4f6'} stroke="#6b7280" strokeWidth="1.5"/>
              <text x="110" y="274" textAnchor="middle" fontSize="7" fill="#374151">Pelvis</text>
            </g>
            {/* Humerus left */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('humerus')} onMouseEnter={() => setHovered('humerus')} onMouseLeave={() => setHovered(null)}>
              <rect x={isFemale?'32':'28'} y="102" width="14" height="100" rx="5" fill={hovered==='humerus'?'#d1d5db':'#f3f4f6'} stroke="#6b7280" strokeWidth="1.5"/>
              <text x={isFemale?'39':'35'} y="165" textAnchor="middle" fontSize="6" fill="#374151">Humerus</text>
            </g>
            {/* Humerus right */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('humerus')} onMouseEnter={() => setHovered('humerus')} onMouseLeave={() => setHovered(null)}>
              <rect x={isFemale?'174':'178'} y="102" width="14" height="100" rx="5" fill={hovered==='humerus'?'#d1d5db':'#f3f4f6'} stroke="#6b7280" strokeWidth="1.5"/>
            </g>
            {/* Radius left */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('radius')} onMouseEnter={() => setHovered('radius')} onMouseLeave={() => setHovered(null)}>
              <rect x={isFemale?'38':'34'} y="204" width="7" height="80" rx="3" fill={hovered==='radius'?'#d1d5db':'#f3f4f6'} stroke="#6b7280" strokeWidth="1.2"/>
              <text x={isFemale?'30':'26'} y="250" fontSize="5.5" fill="#374151">Radius</text>
            </g>
            {/* Ulna left */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('ulna')} onMouseEnter={() => setHovered('ulna')} onMouseLeave={() => setHovered(null)}>
              <rect x={isFemale?'28':'24'} y="204" width="7" height="78" rx="3" fill={hovered==='ulna'?'#d1d5db':'#f3f4f6'} stroke="#9ca3af" strokeWidth="1"/>
              <text x={isFemale?'18':'14'} y="265" fontSize="5.5" fill="#374151">Ulna</text>
            </g>
            {/* Radius right */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('radius')} onMouseEnter={() => setHovered('radius')} onMouseLeave={() => setHovered(null)}>
              <rect x={isFemale?'175':'179'} y="204" width="7" height="80" rx="3" fill={hovered==='radius'?'#d1d5db':'#f3f4f6'} stroke="#6b7280" strokeWidth="1.2"/>
            </g>
            {/* Ulna right */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('ulna')} onMouseEnter={() => setHovered('ulna')} onMouseLeave={() => setHovered(null)}>
              <rect x={isFemale?'185':'189'} y="204" width="7" height="78" rx="3" fill={hovered==='ulna'?'#d1d5db':'#f3f4f6'} stroke="#9ca3af" strokeWidth="1"/>
            </g>
            {/* Hand phalanges left */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('phalanges')} onMouseEnter={() => setHovered('phalanges')} onMouseLeave={() => setHovered(null)}>
              {[0,1,2,3,4].map(i => (
                <rect key={i} x={(isFemale?22:18) + i*4} y="284" width="3" height="16" rx="1" fill={hovered==='phalanges'?'#d1d5db':'#f3f4f6'} stroke="#9ca3af" strokeWidth="0.8"/>
              ))}
              <text x={isFemale?'32':'28'} y="308" textAnchor="middle" fontSize="5" fill="#374151">Fingers</text>
            </g>
            {/* Hand phalanges right */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('phalanges')} onMouseEnter={() => setHovered('phalanges')} onMouseLeave={() => setHovered(null)}>
              {[0,1,2,3,4].map(i => (
                <rect key={i} x={(isFemale?178:182) + i*4} y="284" width="3" height="16" rx="1" fill={hovered==='phalanges'?'#d1d5db':'#f3f4f6'} stroke="#9ca3af" strokeWidth="0.8"/>
              ))}
            </g>
            {/* Femur left */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('femur')} onMouseEnter={() => setHovered('femur')} onMouseLeave={() => setHovered(null)}>
              <rect x={isFemale?'76':'68'} y="294" width="18" height="110" rx="7" fill={hovered==='femur'?'#d1d5db':'#f3f4f6'} stroke="#6b7280" strokeWidth="1.5"/>
              <text x={isFemale?'85':'77'} y="358" textAnchor="middle" fontSize="6" fill="#374151">Femur</text>
            </g>
            {/* Femur right */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('femur')} onMouseEnter={() => setHovered('femur')} onMouseLeave={() => setHovered(null)}>
              <rect x={isFemale?'126':'134'} y="294" width="18" height="110" rx="7" fill={hovered==='femur'?'#d1d5db':'#f3f4f6'} stroke="#6b7280" strokeWidth="1.5"/>
            </g>
            {/* Tibia left */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('tibia')} onMouseEnter={() => setHovered('tibia')} onMouseLeave={() => setHovered(null)}>
              <rect x={isFemale?'79':'71'} y="408" width="11" height="85" rx="3" fill={hovered==='tibia'?'#d1d5db':'#f3f4f6'} stroke="#6b7280" strokeWidth="1.5"/>
              <text x={isFemale?'74':'66'} y="460" textAnchor="middle" fontSize="5.5" fill="#374151">Tibia</text>
            </g>
            {/* Tibia right */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('tibia')} onMouseEnter={() => setHovered('tibia')} onMouseLeave={() => setHovered(null)}>
              <rect x={isFemale?'130':'138'} y="408" width="11" height="85" rx="3" fill={hovered==='tibia'?'#d1d5db':'#f3f4f6'} stroke="#6b7280" strokeWidth="1.5"/>
            </g>
            {/* Fibula left */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('fibula')} onMouseEnter={() => setHovered('fibula')} onMouseLeave={() => setHovered(null)}>
              <rect x={isFemale?'92':'84'} y="410" width="6" height="82" rx="2" fill={hovered==='fibula'?'#d1d5db':'#f3f4f6'} stroke="#9ca3af" strokeWidth="1"/>
              <text x={isFemale?'98':'90'} y="460" fontSize="5.5" fill="#374151">Fibula</text>
            </g>
            {/* Fibula right */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('fibula')} onMouseEnter={() => setHovered('fibula')} onMouseLeave={() => setHovered(null)}>
              <rect x={isFemale?'122':'130'} y="410" width="6" height="82" rx="2" fill={hovered==='fibula'?'#d1d5db':'#f3f4f6'} stroke="#9ca3af" strokeWidth="1"/>
            </g>
            {/* Foot bones left */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('foot')} onMouseEnter={() => setHovered('foot')} onMouseLeave={() => setHovered(null)}>
              <rect x={isFemale?'72':'64'} y="493" width="36" height="12" rx="3" fill={hovered==='foot'?'#d1d5db':'#f3f4f6'} stroke="#6b7280" strokeWidth="1.2"/>
              {[0,1,2,3,4].map(i => (
                <rect key={i} x={(isFemale?73:65)+i*7} y="505" width="5" height="10" rx="1.5" fill={hovered==='foot'?'#d1d5db':'#f3f4f6'} stroke="#9ca3af" strokeWidth="0.8"/>
              ))}
              <text x={isFemale?'90':'82'} y="492" textAnchor="middle" fontSize="5.5" fill="#374151">Foot</text>
            </g>
            {/* Foot bones right */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('foot')} onMouseEnter={() => setHovered('foot')} onMouseLeave={() => setHovered(null)}>
              <rect x={isFemale?'112':'120'} y="493" width="36" height="12" rx="3" fill={hovered==='foot'?'#d1d5db':'#f3f4f6'} stroke="#6b7280" strokeWidth="1.2"/>
              {[0,1,2,3,4].map(i => (
                <rect key={i} x={(isFemale?113:121)+i*7} y="505" width="5" height="10" rx="1.5" fill={hovered==='foot'?'#d1d5db':'#f3f4f6'} stroke="#9ca3af" strokeWidth="0.8"/>
              ))}
            </g>
          </g>
        )}

        {/* CIRCULATORY LAYER */}
        {layer === 'circulatory' && (
          <g>
            {/* Aorta */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('aorta')} onMouseEnter={() => setHovered('aorta')} onMouseLeave={() => setHovered(null)}>
              <path d="M110 110 L110 290" fill="none" stroke={hovered==='aorta'?'#ef4444':'#fca5a5'} strokeWidth="5" strokeLinecap="round"/>
              <path d="M110 110 Q112 100 122 96 Q138 90 148 102" fill="none" stroke={hovered==='aorta'?'#ef4444':'#fca5a5'} strokeWidth="4"/>
              <text x="118" y="200" fontSize="6" fill="#791F1F">Aorta</text>
            </g>
            {/* Carotids */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('carotid')} onMouseEnter={() => setHovered('carotid')} onMouseLeave={() => setHovered(null)}>
              <path d="M116 100 L114 72" fill="none" stroke={hovered==='carotid'?'#ef4444':'#fca5a5'} strokeWidth="3"/>
              <path d="M122 98 L120 72" fill="none" stroke={hovered==='carotid'?'#ef4444':'#f87171'} strokeWidth="2"/>
              <text x="126" y="82" fontSize="6" fill="#791F1F">Carotid</text>
            </g>
            {/* Pulmonary vessels */}
            <path d="M108 128 Q88 128 78 145" fill="none" stroke="#93c5fd" strokeWidth="2.5"/>
            <path d="M112 128 Q132 128 142 145" fill="none" stroke="#93c5fd" strokeWidth="2.5"/>
            {/* Heart */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('heart')} onMouseEnter={() => setHovered('heart')} onMouseLeave={() => setHovered(null)}>
              <ellipse cx="108" cy="130" rx="15" ry="15" fill={hovered==='heart'?'#f87171':'#fca5a5'} stroke="#E24B4A" strokeWidth="1.5"/>
              <text x="108" y="134" textAnchor="middle" fontSize="7" fill="#501313" fontWeight="500">Heart</text>
            </g>
            {/* Brachial arteries */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('brachial')} onMouseEnter={() => setHovered('brachial')} onMouseLeave={() => setHovered(null)}>
              <path d={`M${isFemale?'70':'62'} 102 Q${isFemale?'48':'40'} 122 ${isFemale?'42':'34'} 185`} fill="none" stroke={hovered==='brachial'?'#ef4444':'#fca5a5'} strokeWidth="2.5"/>
              <path d={`M${isFemale?'150':'158'} 102 Q${isFemale?'172':'180'} 122 ${isFemale?'178':'186'} 185`} fill="none" stroke={hovered==='brachial'?'#ef4444':'#fca5a5'} strokeWidth="2.5"/>
              <text x={isFemale?'36':'28'} y="155" fontSize="5.5" fill="#791F1F">Brachial</text>
            </g>
            {/* Radial arteries */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('radial')} onMouseEnter={() => setHovered('radial')} onMouseLeave={() => setHovered(null)}>
              <path d={`M${isFemale?'42':'34'} 185 Q${isFemale?'36':'28'} 205 ${isFemale?'34':'26'} 225`} fill="none" stroke={hovered==='radial'?'#ef4444':'#fca5a5'} strokeWidth="1.5"/>
              <path d={`M${isFemale?'178':'186'} 185 Q${isFemale?'184':'192'} 205 ${isFemale?'186':'194'} 225`} fill="none" stroke={hovered==='radial'?'#ef4444':'#fca5a5'} strokeWidth="1.5"/>
              <text x={isFemale?'28':'20'} y="215" fontSize="5.5" fill="#791F1F">Radial</text>
            </g>
            {/* Iliac arteries */}
            <path d="M110 280 Q88 286 78 305" fill="none" stroke="#fca5a5" strokeWidth="2.5"/>
            <path d="M110 280 Q132 286 142 305" fill="none" stroke="#fca5a5" strokeWidth="2.5"/>
            {/* Femoral arteries */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('femoral')} onMouseEnter={() => setHovered('femoral')} onMouseLeave={() => setHovered(null)}>
              <path d={`M${isFemale?'80':'72'} 305 L${isFemale?'82':'74'} 410`} fill="none" stroke={hovered==='femoral'?'#ef4444':'#fca5a5'} strokeWidth="2.5"/>
              <path d={`M${isFemale?'140':'148'} 305 L${isFemale?'138':'146'} 410`} fill="none" stroke={hovered==='femoral'?'#ef4444':'#fca5a5'} strokeWidth="2.5"/>
              <text x={isFemale?'66':'58'} y="365" fontSize="5.5" fill="#791F1F">Femoral</text>
            </g>
            {/* Tibial arteries */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('tibia')} onMouseEnter={() => setHovered('tibial')} onMouseLeave={() => setHovered(null)}>
              <path d={`M${isFemale?'82':'74'} 410 L${isFemale?'84':'76'} 490`} fill="none" stroke={hovered==='tibial'?'#ef4444':'#fca5a5'} strokeWidth="1.5"/>
              <path d={`M${isFemale?'138':'146'} 410 L${isFemale?'136':'144'} 490`} fill="none" stroke={hovered==='tibial'?'#ef4444':'#fca5a5'} strokeWidth="1.5"/>
              <text x={isFemale?'66':'58'} y="458" fontSize="5.5" fill="#791F1F">Tibial</text>
            </g>
            {/* Veins overlay */}
            <path d="M107 110 L107 290" fill="none" stroke="#93c5fd" strokeWidth="3" strokeDasharray="4,3" opacity="0.7"/>
            <path d={`M${isFemale?'68':'60'} 102 Q${isFemale?'46':'38'} 122 ${isFemale?'40':'32'} 185`} fill="none" stroke="#93c5fd" strokeWidth="2" strokeDasharray="3,3" opacity="0.7"/>
            <path d={`M${isFemale?'152':'160'} 102 Q${isFemale?'174':'182'} 122 ${isFemale?'180':'188'} 185`} fill="none" stroke="#93c5fd" strokeWidth="2" strokeDasharray="3,3" opacity="0.7"/>
            {/* Legend */}
            <line x1="55" y1="510" x2="72" y2="510" stroke="#fca5a5" strokeWidth="3"/>
            <text x="75" y="514" fontSize="7" fill="#791F1F">Arteries</text>
            <line x1="120" y1="510" x2="137" y2="510" stroke="#93c5fd" strokeWidth="3" strokeDasharray="3,2"/>
            <text x="140" y="514" fontSize="7" fill="#042C53">Veins</text>
          </g>
        )}

        {/* MUSCULAR LAYER */}
        {layer === 'muscular' && (
          <g>
            {/* Trapezius */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('trapezius')} onMouseEnter={() => setHovered('trapezius')} onMouseLeave={() => setHovered(null)}>
              <path d="M84 86 Q110 92 136 86 Q130 102 110 106 Q90 102 84 86 Z" fill={hovered==='trapezius'?'#4ade80':'#a7f3d0'} stroke="#3B6D11" strokeWidth="0.8"/>
              <text x="110" y="98" textAnchor="middle" fontSize="6" fill="#173404">Trapezius</text>
            </g>
            {/* Deltoids */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('deltoid')} onMouseEnter={() => setHovered('deltoid')} onMouseLeave={() => setHovered(null)}>
              <path d={`M${isFemale?'72':'64'} 92 Q${isFemale?'56':'48'} 102 ${isFemale?'54':'46'} 118 Q${isFemale?'66':'58'} 114 ${isFemale?'76':'68'} 110 Z`} fill={hovered==='deltoid'?'#4ade80':'#86efac'} stroke="#3B6D11" strokeWidth="1"/>
              <path d={`M${isFemale?'148':'156'} 92 Q${isFemale?'164':'172'} 102 ${isFemale?'166':'174'} 118 Q${isFemale?'154':'162'} 114 ${isFemale?'144':'152'} 110 Z`} fill={hovered==='deltoid'?'#4ade80':'#86efac'} stroke="#3B6D11" strokeWidth="1"/>
              <text x={isFemale?'48':'40'} y="110" fontSize="6" fill="#173404">Deltoid</text>
            </g>
            {/* Pectoralis */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('pectoralis')} onMouseEnter={() => setHovered('pectoralis')} onMouseLeave={() => setHovered(null)}>
              <path d={`M${isFemale?'72':'64'} 92 Q95 100 108 112 Q90 120 ${isFemale?'72':'64'} 112 Z`} fill={hovered==='pectoralis'?'#4ade80':'#bbf7d0'} stroke="#3B6D11" strokeWidth="1"/>
              <path d={`M${isFemale?'148':'156'} 92 Q125 100 112 112 Q130 120 ${isFemale?'148':'156'} 112 Z`} fill={hovered==='pectoralis'?'#4ade80':'#bbf7d0'} stroke="#3B6D11" strokeWidth="1"/>
              <text x="110" y="124" textAnchor="middle" fontSize="6" fill="#173404">Pectoralis</text>
            </g>
            {/* Biceps */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('biceps')} onMouseEnter={() => setHovered('biceps')} onMouseLeave={() => setHovered(null)}>
              <path d={`M${isFemale?'54':'46'} 118 Q${isFemale?'48':'40'} 145 ${isFemale?'50':'42'} 172`} fill="none" stroke={hovered==='biceps'?'#22c55e':'#86efac'} strokeWidth="12" strokeLinecap="round"/>
              <path d={`M${isFemale?'166':'174'} 118 Q${isFemale?'172':'180'} 145 ${isFemale?'170':'178'} 172`} fill="none" stroke={hovered==='biceps'?'#22c55e':'#86efac'} strokeWidth="12" strokeLinecap="round"/>
              <text x={isFemale?'36':'28'} y="152" fontSize="6" fill="#173404">Biceps</text>
            </g>
            {/* Triceps */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('triceps')} onMouseEnter={() => setHovered('triceps')} onMouseLeave={() => setHovered(null)}>
              <path d={`M${isFemale?'60':'52'} 118 Q${isFemale?'54':'46'} 148 ${isFemale?'56':'48'} 175`} fill="none" stroke={hovered==='triceps'?'#16a34a':'#4ade80'} strokeWidth="8" strokeLinecap="round" strokeDasharray="none" opacity="0.7"/>
              <path d={`M${isFemale?'160':'168'} 118 Q${isFemale?'166':'174'} 148 ${isFemale?'164':'172'} 175`} fill="none" stroke={hovered==='triceps'?'#16a34a':'#4ade80'} strokeWidth="8" strokeLinecap="round" opacity="0.7"/>
              <text x={isFemale?'36':'28'} y="168" fontSize="6" fill="#173404">Triceps</text>
            </g>
            {/* Forearm flexors/extensors */}
            <g style={{cursor:'pointer'}} onClick={() => { const m = allEntries.find(e => e.structure.toLowerCase().includes('forearm flex')); if(m) onSelect(m) }} onMouseEnter={() => setHovered('forearm')} onMouseLeave={() => setHovered(null)}>
              <path d={`M${isFemale?'50':'42'} 172 Q${isFemale?'42':'34'} 195 ${isFemale?'40':'32'} 218`} fill="none" stroke={hovered==='forearm'?'#22c55e':'#86efac'} strokeWidth="8" strokeLinecap="round"/>
              <path d={`M${isFemale?'170':'178'} 172 Q${isFemale?'178':'186'} 195 ${isFemale?'180':'188'} 218`} fill="none" stroke={hovered==='forearm'?'#22c55e':'#86efac'} strokeWidth="8" strokeLinecap="round"/>
              <text x={isFemale?'30':'22'} y="200" fontSize="5.5" fill="#173404">Forearm</text>
            </g>
            {/* Abdominals */}
            <g style={{cursor:'pointer'}} onClick={() => { onSelect({id:'abs', system:'Extremities', structure:'Abdominal Muscles', description:'Rectus abdominis, obliques, and transverse abdominis forming anterior and lateral abdominal wall', function:'Trunk flexion, rotation, and lateral bending. Support and protect abdominal organs. Assist in forced expiration, defecation, and parturition.', clinical_relevance:'Diastasis recti — separation of rectus muscles. Hernia — weakness in abdominal wall. Seat belt injury causing internal injuries with intact skin.', ems_relevance:'Assess abdominal muscle guarding — indicates peritoneal irritation. Rigid abdomen — peritonitis. Seat belt sign across abdomen — high suspicion for internal injury.', landmarks:'Linea alba — midline white line. Rectus abdominis — vertical columns flanking midline. Umbilicus at L3-L4 level.', category:'Thoracic', tags:['muscular','abdominals','core']} as AnatomyEntry) }} onMouseEnter={() => setHovered('abs')} onMouseLeave={() => setHovered(null)}>
              {[0,1,2].map(i => (
                <g key={i}>
                  <rect x="96" y={185+i*14} width="9" height="11" rx="2" fill={hovered==='abs'?'#4ade80':'#86efac'} stroke="#3B6D11" strokeWidth="0.8"/>
                  <rect x="115" y={185+i*14} width="9" height="11" rx="2" fill={hovered==='abs'?'#4ade80':'#86efac'} stroke="#3B6D11" strokeWidth="0.8"/>
                </g>
              ))}
              <text x="110" y="240" textAnchor="middle" fontSize="6" fill="#173404">Abdominals</text>
            </g>
            {/* Gluteus */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('gluteus')} onMouseEnter={() => setHovered('gluteus')} onMouseLeave={() => setHovered(null)}>
              <path d={`M${isFemale?'76':'68'} 252 Q${isFemale?'76':'68'} 275 ${isFemale?'90':'82'} 285 Q110 290 ${isFemale?'130':'138'} 285 Q${isFemale?'144':'152'} 275 ${isFemale?'144':'152'} 252 Q110 245 ${isFemale?'76':'68'} 252 Z`} fill={hovered==='gluteus'?'#4ade80':'#bbf7d0'} stroke="#3B6D11" strokeWidth="1"/>
              <text x="110" y="270" textAnchor="middle" fontSize="6" fill="#173404">Gluteus</text>
            </g>
            {/* Quadriceps */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('quadriceps')} onMouseEnter={() => setHovered('quadriceps')} onMouseLeave={() => setHovered(null)}>
              <path d={`M${isFemale?'76':'68'} 290 Q${isFemale?'72':'64'} 340 ${isFemale?'74':'66'} 400 Q${isFemale?'82':'74'} 406 ${isFemale?'94':'86'} 400 Q${isFemale?'98':'90'} 340 ${isFemale?'96':'88'} 290 Z`} fill={hovered==='quadriceps'?'#4ade80':'#86efac'} stroke="#3B6D11" strokeWidth="1"/>
              <path d={`M${isFemale?'144':'152'} 290 Q${isFemale?'148':'156'} 340 ${isFemale?'146':'154'} 400 Q${isFemale?'138':'146'} 406 ${isFemale?'126':'134'} 400 Q${isFemale?'122':'130'} 340 ${isFemale?'124':'132'} 290 Z`} fill={hovered==='quadriceps'?'#4ade80':'#86efac'} stroke="#3B6D11" strokeWidth="1"/>
              <text x={isFemale?'85':'77'} y="350" textAnchor="middle" fontSize="6" fill="#173404">Quads</text>
            </g>
            {/* Hamstrings */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('hamstrings')} onMouseEnter={() => setHovered('hamstrings')} onMouseLeave={() => setHovered(null)}>
              <path d={`M${isFemale?'96':'88'} 290 Q${isFemale?'100':'92'} 340 ${isFemale?'98':'90'} 400 Q${isFemale?'106':'98'} 404 ${isFemale?'108':'100'} 400 Q${isFemale?'108':'100'} 340 ${isFemale?'104':'96'} 290 Z`} fill={hovered==='hamstrings'?'#16a34a':'#4ade80'} stroke="#3B6D11" strokeWidth="0.8" opacity="0.8"/>
              <path d={`M${isFemale?'124':'132'} 290 Q${isFemale?'120':'128'} 340 ${isFemale?'122':'130'} 400 Q${isFemale?'114':'122'} 404 ${isFemale?'112':'120'} 400 Q${isFemale?'112':'120'} 340 ${isFemale?'116':'124'} 290 Z`} fill={hovered==='hamstrings'?'#16a34a':'#4ade80'} stroke="#3B6D11" strokeWidth="0.8" opacity="0.8"/>
              <text x={isFemale?'110':'102'} y="350" textAnchor="middle" fontSize="5.5" fill="#173404">Hamstrings</text>
            </g>
            {/* Gastrocnemius */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('gastrocnemius')} onMouseEnter={() => setHovered('gastrocnemius')} onMouseLeave={() => setHovered(null)}>
              <path d={`M${isFemale?'74':'66'} 404 Q${isFemale?'70':'62'} 428 ${isFemale?'74':'66'} 458`} fill="none" stroke={hovered==='gastrocnemius'?'#22c55e':'#86efac'} strokeWidth="12" strokeLinecap="round"/>
              <path d={`M${isFemale?'94':'86'} 404 Q${isFemale?'98':'90'} 428 ${isFemale?'94':'86'} 458`} fill="none" stroke={hovered==='gastrocnemius'?'#22c55e':'#86efac'} strokeWidth="10" strokeLinecap="round"/>
              <path d={`M${isFemale?'146':'154'} 404 Q${isFemale?'150':'158'} 428 ${isFemale?'146':'154'} 458`} fill="none" stroke={hovered==='gastrocnemius'?'#22c55e':'#86efac'} strokeWidth="12" strokeLinecap="round"/>
              <path d={`M${isFemale?'126':'134'} 404 Q${isFemale?'122':'130'} 428 ${isFemale?'126':'134'} 458`} fill="none" stroke={hovered==='gastrocnemius'?'#22c55e':'#86efac'} strokeWidth="10" strokeLinecap="round"/>
              <text x={isFemale?'82':'74'} y="438" textAnchor="middle" fontSize="5.5" fill="#173404">Gastroc</text>
            </g>
            {/* Tibialis anterior */}
            <g style={{cursor:'pointer'}} onClick={() => handleClick('tibialis')} onMouseEnter={() => setHovered('tibialis')} onMouseLeave={() => setHovered(null)}>
              <path d={`M${isFemale?'94':'86'} 408 Q${isFemale?'98':'90'} 440 ${isFemale?'96':'88'} 470`} fill="none" stroke={hovered==='tibialis'?'#22c55e':'#a7f3d0'} strokeWidth="7" strokeLinecap="round"/>
              <path d={`M${isFemale?'126':'134'} 408 Q${isFemale?'122':'130'} 440 ${isFemale?'124':'132'} 470`} fill="none" stroke={hovered==='tibialis'?'#22c55e':'#a7f3d0'} strokeWidth="7" strokeLinecap="round"/>
              <text x={isFemale?'102':'94'} y="448" fontSize="5.5" fill="#173404">Tibialis</text>
            </g>
          </g>
        )}
      </svg>
    </div>
  )
}

export default function AnatomyPage() {
  const [allEntries, setAllEntries] = useState<AnatomyEntry[]>([])
  const [entries, setEntries] = useState<AnatomyEntry[]>([])
  const [search, setSearch] = useState('')
  const [system, setSystem] = useState('All')
  const [selected, setSelected] = useState<AnatomyEntry | null>(null)
  const [view, setView] = useState<'interactive' | 'list'>('interactive')
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchAll() }, [])
  useEffect(() => { filterEntries() }, [search, system, allEntries])

  async function fetchAll() {
    setLoading(true)
    const { data, error } = await supabase
      .from('anatomy')
      .select('*')
      .order('structure', { ascending: true })
    if (!error && data) {
      setAllEntries(data)
      setEntries(data)
    }
    setLoading(false)
  }

  function filterEntries() {
    let filtered = allEntries
    if (search) {
      const s = search.toLowerCase()
      filtered = filtered.filter(e =>
        e.structure?.toLowerCase().includes(s) ||
        e.description?.toLowerCase().includes(s) ||
        e.clinical_relevance?.toLowerCase().includes(s) ||
        e.ems_relevance?.toLowerCase().includes(s) ||
        e.landmarks?.toLowerCase().includes(s)
      )
    }
    if (system !== 'All') {
      filtered = filtered.filter(e => e.system === system)
    }
    setEntries(filtered)
  }

  function DetailPanel({ entry }: { entry: AnatomyEntry }) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{systemIcons[entry.system] || '🫀'}</span>
              <h2 className="text-xl font-medium text-gray-900 dark:text-white">{entry.structure}</h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{entry.description}</p>
          </div>
          <div className="flex flex-col gap-1.5 shrink-0">
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${systemColors[entry.system] || 'bg-gray-100 text-gray-600'}`}>
              {entry.system}
            </span>
            <button onClick={() => setSelected(null)} className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-center">Clear</button>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <div className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Function</div>
            <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{entry.function}</p>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Clinical relevance</div>
            <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{entry.clinical_relevance}</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="text-xs font-medium text-blue-700 dark:text-blue-400 uppercase tracking-widest mb-1">EMS relevance</div>
            <p className="text-sm text-blue-900 dark:text-blue-300 leading-relaxed font-medium">{entry.ems_relevance}</p>
          </div>
          {entry.landmarks && (
            <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="text-xs font-medium text-yellow-700 dark:text-yellow-400 uppercase tracking-widest mb-1">Landmarks</div>
              <p className="text-sm text-yellow-900 dark:text-yellow-300 leading-relaxed font-medium">{entry.landmarks}</p>
            </div>
          )}
          {entry.tags && entry.tags.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              {entry.tags.map((tag) => (
                <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">{tag}</span>
              ))}
            </div>
          )}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">Always follow local protocols and medical direction. Anatomical landmarks may vary between patients.</p>
        </div>
      </div>
    )
  }

  return (
    <Layout>
      <section className="px-8 pt-10 pb-6 max-w-3xl">
        <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 text-xs px-3 py-1 rounded-md mb-4">
          Cardiovascular · Respiratory · Neurological · and more
        </div>
        <h1 className="text-3xl font-medium text-gray-900 dark:text-white mb-2">Anatomy & body systems</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          Interactive body map and reference covering structure, function, clinical relevance, and EMS landmarks. Switch between organ, skeletal, circulatory, and muscular layers.
        </p>
      </section>

      <div className="px-8 mb-4 flex gap-2">
        <button onClick={() => setView('interactive')} className={`px-4 py-2 text-xs rounded-lg border font-medium transition-colors ${view === 'interactive' ? 'bg-red-700 text-white border-red-700' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-600'}`}>
          Interactive body
        </button>
        <button onClick={() => setView('list')} className={`px-4 py-2 text-xs rounded-lg border font-medium transition-colors ${view === 'list' ? 'bg-red-700 text-white border-red-700' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-600'}`}>
          Reference list
        </button>
      </div>

      <div className="mx-8 mb-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-6 py-4 text-center text-xs text-gray-500 dark:text-gray-400">
        Advertisement
      </div>

      {view === 'interactive' && (
        <div className="px-4 sm:px-8 pb-12">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-full sm:w-64 shrink-0">
              {!loading && <InteractiveBody allEntries={allEntries} onSelect={setSelected} />}
            </div>
            <div className="flex-1">
              {selected ? (
                <DetailPanel entry={selected} />
              ) : (
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-12 text-center"
                    >
                  <div className="text-4xl mb-3">👆</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tap any highlighted region on the body diagram</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Switch layers to explore organs, skeleton, circulatory system, and muscles</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {view === 'list' && (
        <>
          <div className="px-8 mb-4">
            <input
              type="text"
              placeholder="Search structures, functions, landmarks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-lg px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-red-300 dark:focus:border-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
          <div className="px-8 mb-6 flex gap-2 flex-wrap">
            {systems.map((s) => (
              <button key={s} onClick={() => setSystem(s)} className={`px-4 py-1.5 text-xs rounded-full border transition-colors ${system === s ? 'bg-red-700 text-white border-red-700' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-600'}`}>
                {s}
              </button>
            ))}
          </div>
          <div className="px-4 sm:px-8 pb-12">
            {loading ? (
              <div className="text-sm text-gray-500">Loading...</div>
            ) : entries.length === 0 ? (
              <div className="text-sm text-gray-500">No structures found for "{search}"</div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-72 shrink-0">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">{entries.length} structures</div>
                  <div className="flex flex-col gap-1">
                    {entries.map((e) => (
                      <button key={e.id} onClick={() => setSelected(e)} className={`text-left px-4 py-3 rounded-lg border text-sm transition-colors ${selected?.id === e.id ? 'bg-red-700 text-white border-red-700' : 'bg-white border-gray-200 text-gray-800 hover:border-red-300'}`}>
                        <div className="font-medium text-xs leading-snug">{e.structure}</div>
                        <div className={`text-xs mt-0.5 ${selected?.id === e.id ? 'text-red-200' : 'text-gray-500'}`}>{e.system}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  {selected ? <DetailPanel entry={selected} /> : (
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-12 text-center"
                    >
                      <div className="text-gray-300 dark:text-gray-600 text-4xl mb-3">🫀</div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Select a structure from the list to view details</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <div className="mx-8 mb-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-6 py-4 text-center text-xs text-gray-500 dark:text-gray-400">
        Advertisement
      </div>
    </Layout>
  )
}
