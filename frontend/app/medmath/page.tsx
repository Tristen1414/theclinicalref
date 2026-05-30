'use client'

import { useState } from 'react'
import Layout from '@/components/Layout'

function CalcCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-red-200 transition-colors">
      <h2 className="text-base font-medium text-gray-900 mb-4 pb-3 border-b border-gray-100">{title}</h2>
      {children}
    </div>
  )
}

function InputField({ label, value, onChange, placeholder, unit }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; unit?: string
}) {
  return (
    <div className="mb-3">
      <label className="text-xs font-medium text-gray-600 block mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || '0'}
          className="flex-1 px-3 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-red-300 bg-gray-50 text-gray-900"
        />
        {unit && <span className="text-xs text-gray-500 w-20 shrink-0">{unit}</span>}
      </div>
    </div>
  )
}

function SelectField({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]
}) {
  return (
    <div className="mb-3">
      <label className="text-xs font-medium text-gray-600 block mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-red-300 bg-gray-50 text-gray-900"
      >
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  )
}

function Result({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`mt-4 p-4 rounded-lg ${highlight ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-200'}`}>
      <div className="text-xs text-gray-500 mb-0.5">{label}</div>
      <div className={`text-xl font-medium ${highlight ? 'text-red-700' : 'text-gray-900'}`}>{value || '—'}</div>
    </div>
  )
}

function DripRateCalc() {
  const [volume, setVolume] = useState('')
  const [time, setTime] = useState('')
  const [drip, setDrip] = useState('60')

  const rate = volume && time
    ? ((parseFloat(volume) * parseFloat(drip)) / (parseFloat(time) * 60)).toFixed(1)
    : ''
  const mlPerHour = volume && time
    ? (parseFloat(volume) / parseFloat(time) * 60).toFixed(1)
    : ''

  return (
    <CalcCard title="IV Drip Rate Calculator">
      <InputField label="Volume to infuse" value={volume} onChange={setVolume} unit="mL" />
      <InputField label="Time to infuse" value={time} onChange={setTime} unit="minutes" />
      <SelectField label="Drip set (gtts/mL)" value={drip} onChange={setDrip} options={['10', '15', '20', '60']} />
      <Result label="Drip rate" value={rate ? `${rate} gtts/min` : ''} highlight />
      <Result label="mL per hour" value={mlPerHour ? `${mlPerHour} mL/hr` : ''} />
    </CalcCard>
  )
}

function WeightBasedCalc() {
  const [weight, setWeight] = useState('')
  const [weightUnit, setWeightUnit] = useState('kg')
  const [dose, setDose] = useState('')
  const [concentration, setConcentration] = useState('')

  const weightKg = weight
    ? weightUnit === 'lbs'
      ? (parseFloat(weight) / 2.2046).toFixed(1)
      : parseFloat(weight).toFixed(1)
    : ''

  const totalDose = weightKg && dose
    ? (parseFloat(weightKg) * parseFloat(dose)).toFixed(2)
    : ''

  const volume = totalDose && concentration
    ? (parseFloat(totalDose) / parseFloat(concentration)).toFixed(2)
    : ''

  return (
    <CalcCard title="Weight-Based Dosing">
      <div className="flex gap-2">
        <div className="flex-1">
          <InputField label="Patient weight" value={weight} onChange={setWeight} />
        </div>
        <div className="w-24">
          <SelectField label="Unit" value={weightUnit} onChange={setWeightUnit} options={['kg', 'lbs']} />
        </div>
      </div>
      <InputField label="Dose" value={dose} onChange={setDose} unit="mcg/kg or mg/kg" />
      <InputField label="Concentration (optional)" value={concentration} onChange={setConcentration} unit="mcg/mL or mg/mL" />
      {weightUnit === 'lbs' && weightKg && (
        <div className="text-xs text-gray-500 mb-2">Weight in kg: {weightKg} kg</div>
      )}
      <Result label="Total dose" value={totalDose ? `${totalDose} mcg or mg` : ''} highlight />
      {concentration && <Result label="Volume to administer" value={volume ? `${volume} mL` : ''} />}
    </CalcCard>
  )
}

function PediatricDoseCalc() {
  const [weight, setWeight] = useState('')
  const [weightUnit, setWeightUnit] = useState('kg')

  const weightKg = weight
    ? weightUnit === 'lbs'
      ? (parseFloat(weight) / 2.2046).toFixed(1)
      : parseFloat(weight).toFixed(1)
    : ''

  const etSize = weightKg ? (parseFloat(weightKg) / 4 + 4).toFixed(1) : ''
  const etDepth = weightKg ? ((parseFloat(weightKg) / 4 + 4) * 3).toFixed(1) : ''
  const epiDose = weightKg ? (parseFloat(weightKg) * 0.01).toFixed(2) : ''
  const epiVol = epiDose ? (parseFloat(epiDose) / 0.1).toFixed(1) : ''
  const defibDose = weightKg ? (parseFloat(weightKg) * 2).toFixed(0) : ''

  const broselow = () => {
    const w = parseFloat(weightKg || '0')
    if (!w) return null
    if (w < 5) return 'Grey'
    if (w < 7) return 'Pink'
    if (w < 9) return 'Red'
    if (w < 11) return 'Purple'
    if (w < 14) return 'Yellow'
    if (w < 19) return 'White'
    if (w < 26) return 'Blue'
    return 'Orange'
  }

  const browselowColors: Record<string, string> = {
    Grey: 'bg-gray-200 text-gray-800',
    Pink: 'bg-pink-100 text-pink-800',
    Red: 'bg-red-100 text-red-800',
    Purple: 'bg-purple-100 text-purple-800',
    Yellow: 'bg-yellow-100 text-yellow-800',
    White: 'bg-gray-50 text-gray-800 border border-gray-300',
    Blue: 'bg-blue-100 text-blue-800',
    Orange: 'bg-orange-100 text-orange-800',
  }

  const zone = broselow()

  return (
    <CalcCard title="Pediatric Dose Calculator">
      <div className="flex gap-2">
        <div className="flex-1">
          <InputField label="Patient weight" value={weight} onChange={setWeight} />
        </div>
        <div className="w-24">
          <SelectField label="Unit" value={weightUnit} onChange={setWeightUnit} options={['kg', 'lbs']} />
        </div>
      </div>

      {weightUnit === 'lbs' && weightKg && (
        <div className="text-xs text-gray-500 -mt-1 mb-3">
          Converted weight: <span className="font-medium text-gray-700">{weightKg} kg</span>
        </div>
      )}

      {zone && (
        <div className={`inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full mb-3 ${browselowColors[zone]}`}>
          Broselow zone: {zone}
        </div>
      )}

      <Result label="ETT size (uncuffed)" value={etSize ? `${etSize} mm` : ''} highlight />
      <Result label="ETT insertion depth" value={etDepth ? `${etDepth} cm at the lip` : ''} />
      <Result label="Epinephrine 1:10,000 (0.1 mg/mL)" value={epiDose ? `${epiDose} mg — ${epiVol} mL` : ''} />
      <Result label="Defibrillation (2 J/kg)" value={defibDose ? `${defibDose} J` : ''} />
    </CalcCard>
  )
}

function GlasgowComaScale() {
  const [eye, setEye] = useState('4')
  const [verbal, setVerbal] = useState('5')
  const [motor, setMotor] = useState('6')

  const total = parseInt(eye) + parseInt(verbal) + parseInt(motor)
  const severity = total >= 13 ? 'Mild TBI' : total >= 9 ? 'Moderate TBI' : 'Severe TBI'
  const color = total >= 13 ? 'text-green-700' : total >= 9 ? 'text-yellow-700' : 'text-red-700'

  return (
    <CalcCard title="Glasgow Coma Scale (GCS)">
      <SelectField label="Eye opening (E)" value={eye} onChange={setEye} options={['4 — Spontaneous', '3 — To voice', '2 — To pain', '1 — None']} />
      <SelectField label="Verbal response (V)" value={verbal} onChange={setVerbal} options={['5 — Oriented', '4 — Confused', '3 — Inappropriate words', '2 — Incomprehensible sounds', '1 — None']} />
      <SelectField label="Motor response (M)" value={motor} onChange={setMotor} options={['6 — Obeys commands', '5 — Localizes pain', '4 — Withdraws', '3 — Abnormal flexion', '2 — Extension', '1 — None']} />
      <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200">
        <div className="text-xs text-gray-500 mb-0.5">GCS Score</div>
        <div className="text-2xl font-medium text-red-700">{total} / 15</div>
        <div className={`text-sm font-medium mt-1 ${color}`}>{severity}</div>
      </div>
    </CalcCard>
  )
}

function MAPCalc() {
  const [sbp, setSbp] = useState('')
  const [dbp, setDbp] = useState('')

  const map = sbp && dbp
    ? ((parseFloat(dbp) * 2 + parseFloat(sbp)) / 3).toFixed(0)
    : ''

  const interpretation = map
    ? parseInt(map) >= 70
      ? 'Adequate perfusion'
      : parseInt(map) >= 60
      ? 'Borderline — monitor closely'
      : 'Inadequate perfusion — intervene'
    : ''

  return (
    <CalcCard title="Mean Arterial Pressure (MAP)">
      <InputField label="Systolic BP" value={sbp} onChange={setSbp} unit="mmHg" />
      <InputField label="Diastolic BP" value={dbp} onChange={setDbp} unit="mmHg" />
      <Result label="MAP" value={map ? `${map} mmHg` : ''} highlight />
      {map && <Result label="Interpretation" value={interpretation} />}
      <p className="text-xs text-gray-400 mt-3">Formula: (DBP × 2 + SBP) ÷ 3</p>
    </CalcCard>
  )
}

function APGARScore() {
  const [appearance, setAppearance] = useState('2')
  const [pulse, setPulse] = useState('2')
  const [grimace, setGrimace] = useState('2')
  const [activity, setActivity] = useState('2')
  const [respiration, setRespiration] = useState('2')

  const total = parseInt(appearance) + parseInt(pulse) + parseInt(grimace) + parseInt(activity) + parseInt(respiration)
  const interpretation = total >= 7 ? 'Normal — routine care' : total >= 4 ? 'Moderate concern — stimulate, oxygen' : 'Immediate resuscitation needed'
  const color = total >= 7 ? 'text-green-700' : total >= 4 ? 'text-yellow-700' : 'text-red-700'

  return (
    <CalcCard title="APGAR Score">
      <SelectField label="Appearance (skin color)" value={appearance} onChange={setAppearance} options={['2 — Pink all over', '1 — Blue extremities', '0 — Blue/pale all over']} />
      <SelectField label="Pulse (heart rate)" value={pulse} onChange={setPulse} options={['2 — >100 bpm', '1 — <100 bpm', '0 — Absent']} />
      <SelectField label="Grimace (reflex)" value={grimace} onChange={setGrimace} options={['2 — Cry/cough/sneeze', '1 — Grimace', '0 — No response']} />
      <SelectField label="Activity (muscle tone)" value={activity} onChange={setActivity} options={['2 — Active motion', '1 — Some flexion', '0 — Limp']} />
      <SelectField label="Respiration" value={respiration} onChange={setRespiration} options={['2 — Strong cry', '1 — Weak/irregular', '0 — Absent']} />
      <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200">
        <div className="text-xs text-gray-500 mb-0.5">APGAR Score</div>
        <div className="text-2xl font-medium text-red-700">{total} / 10</div>
        <div className={`text-sm font-medium mt-1 ${color}`}>{interpretation}</div>
      </div>
    </CalcCard>
  )
}

function UnitConverter() {
  const [value, setValueState] = useState('')
  const [from, setFrom] = useState('mg')
  const [to, setTo] = useState('mcg')

  const conversions: Record<string, number> = {
    kg: 1000000, g: 1000, mg: 1, mcg: 0.001,
    L: 1000, mL: 1, dL: 100,
  }

  const convert = () => {
    if (!value || !conversions[from] || !conversions[to]) return ''
    const result = (parseFloat(value) * conversions[from]) / conversions[to]
    return result % 1 === 0 ? result.toString() : result.toFixed(4)
  }

  const units = ['kg', 'g', 'mg', 'mcg', 'L', 'mL', 'dL']

  return (
    <CalcCard title="Unit Converter">
      <InputField label="Value" value={value} onChange={setValueState} />
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <SelectField label="From" value={from} onChange={setFrom} options={units} />
        </div>
        <div className="mb-3 text-gray-400 font-medium pb-1">→</div>
        <div className="flex-1">
          <SelectField label="To" value={to} onChange={setTo} options={units} />
        </div>
      </div>
      <Result label={`${value || '0'} ${from} =`} value={convert() ? `${convert()} ${to}` : ''} highlight />
    </CalcCard>
  )
}

function InfusionRateCalc() {
  const [dose, setDose] = useState('')
  const [weight, setWeight] = useState('')
  const [concentration, setConcentration] = useState('')
  const [unit, setUnit] = useState('mcg/kg/min')

  const rate = dose && concentration
    ? unit.includes('kg') && weight
      ? ((parseFloat(dose) * parseFloat(weight) * 60) / parseFloat(concentration)).toFixed(2)
      : !unit.includes('kg')
      ? ((parseFloat(dose) * 60) / parseFloat(concentration)).toFixed(2)
      : ''
    : ''

  return (
    <CalcCard title="Continuous Infusion Rate">
      <InputField label="Desired dose" value={dose} onChange={setDose} unit={unit} />
      <SelectField label="Dose unit" value={unit} onChange={setUnit} options={['mcg/kg/min', 'mcg/min', 'mg/kg/min', 'mg/min', 'units/min']} />
      {unit.includes('kg') && (
        <InputField label="Patient weight" value={weight} onChange={setWeight} unit="kg" />
      )}
      <InputField label="Concentration" value={concentration} onChange={setConcentration} unit="mcg/mL or mg/mL" />
      <Result label="Infusion rate" value={rate ? `${rate} mL/hr` : ''} highlight />
    </CalcCard>
  )
}

export default function MedMathPage() {
  return (
    <Layout>
      <section className="px-8 pt-10 pb-6 max-w-3xl">
        <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 text-xs px-3 py-1 rounded-md mb-4">
          Calculators · Scoring tools · Converters
        </div>
        <h1 className="text-3xl font-medium text-gray-900 mb-2">Med math</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          Clinical calculators for prehospital and hospital use. All calculations are performed locally — no data is sent or stored.
        </p>
      </section>

      <div className="mx-8 mb-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-6 py-4 text-center text-xs text-gray-500">
        Advertisement
      </div>

      <div className="px-4 sm:px-8 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <DripRateCalc />
          <WeightBasedCalc />
          <PediatricDoseCalc />
          <GlasgowComaScale />
          <MAPCalc />
          <APGARScore />
          <UnitConverter />
          <InfusionRateCalc />
        </div>
      </div>

      <div className="mx-8 mb-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-6 py-4 text-center text-xs text-gray-500">
        Advertisement
      </div>
    </Layout>
  )
}
