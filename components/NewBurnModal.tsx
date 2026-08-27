'use client';

import React, { useState, useEffect } from 'react';
import { BurnRequest, Farm, Front, UserProfile } from '@/lib/types';
import { FincaInfo, LoteInfo } from '@/lib/fincasLotesData';
import { storageService } from '@/lib/storageService';
import {
  X,
  Flame,
  Calendar,
  Clock,
  Layers,
  MapPin,
  Weight,
  User,
  AlertCircle,
  Sparkles,
  Info,
  CheckCircle2,
  Calculator,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

interface NewBurnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<BurnRequest, 'id' | 'burn_number' | 'created_at' | 'updated_at'>) => Promise<void>;
  farms: Farm[];
  fronts: Front[];
  currentUser: UserProfile;
}

export const NewBurnModal: React.FC<NewBurnModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentUser,
}) => {
  // Session automatic data (Locked to login session)
  const autoFront = currentUser.assigned_front || 'Frente 15';
  const autoSupervisor = currentUser.full_name;
  const autoShift = currentUser.current_shift || 'Turno Día (06:00 - 18:00)';

  // Form State
  const [fincasLotes, setFincasLotes] = useState<FincaInfo[]>([]);
  const [farmName, setFarmName] = useState('');
  const [loteUm, setLoteUm] = useState('');
  const [currentTch, setCurrentTch] = useState<number>(100);
  const [areaHectares, setAreaHectares] = useState<number | ''>('');
  const [estimatedTonnage, setEstimatedTonnage] = useState<number | ''>('');
  const [plannedTime, setPlannedTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Selected Finca Object
  const selectedFincaObj = fincasLotes.find(
    (f) => f.name.toUpperCase() === farmName.trim().toUpperCase()
  );

  // Available lotes sorted ascending
  const availableLotes = selectedFincaObj
    ? [...selectedFincaObj.lotes].sort((a, b) => {
        const numA = parseFloat(a.lote);
        const numB = parseFloat(b.lote);
        if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
        return a.lote.localeCompare(b.lote, undefined, { numeric: true });
      })
    : [];

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setIsSubmitting(false);

      // Load fresh fincas & lotes catalog
      storageService.getFincasLotes().then((list) => {
        setFincasLotes(list);
        if (list.length > 0) {
          const defaultFinca = list[0];
          setFarmName(defaultFinca.name);

          const sorted = [...defaultFinca.lotes].sort((a, b) => {
            const numA = parseFloat(a.lote);
            const numB = parseFloat(b.lote);
            if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
            return a.lote.localeCompare(b.lote, undefined, { numeric: true });
          });

          if (sorted.length > 0) {
            setLoteUm(sorted[0].lote);
            setCurrentTch(sorted[0].tch || 100);
          } else {
            setLoteUm('1.01');
            setCurrentTch(100);
          }
        }
      });

      // Keep area & tons blank
      setAreaHectares('');
      setEstimatedTonnage('');

      // Default planned time in 2 hours
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const inTwoHours = new Date(now.getTime() + 2 * 60 * 60 * 1000);
      const plannedStr = `${inTwoHours.getFullYear()}-${pad(inTwoHours.getMonth() + 1)}-${pad(inTwoHours.getDate())}T${pad(inTwoHours.getHours())}:${pad(inTwoHours.getMinutes())}`;
      setPlannedTime(plannedStr);
    }
  }, [isOpen]);

  // When Finca changes, update Lotes and TCH
  const handleFincaChange = (fName: string) => {
    setFarmName(fName);
    const finca = fincasLotes.find((f) => f.name.toUpperCase() === fName.trim().toUpperCase());
    if (finca && finca.lotes.length > 0) {
      const sorted = [...finca.lotes].sort((a, b) => {
        const numA = parseFloat(a.lote);
        const numB = parseFloat(b.lote);
        if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
        return a.lote.localeCompare(b.lote, undefined, { numeric: true });
      });

      const l = sorted[0];
      setLoteUm(l.lote);
      const tch = l.tch || 100;
      setCurrentTch(tch);
      if (areaHectares !== '' && Number(areaHectares) > 0) {
        setEstimatedTonnage(Math.round(Number(areaHectares) * tch));
      }
    } else {
      setLoteUm('');
      setCurrentTch(100);
      setEstimatedTonnage('');
    }
  };

  // When Lote changes, update TCH and recalculate tons
  const handleLoteChange = (loteStr: string) => {
    setLoteUm(loteStr);
    const loteObj = availableLotes.find((l) => l.lote === loteStr);
    if (loteObj) {
      const tch = loteObj.tch || 100;
      setCurrentTch(tch);
      if (areaHectares !== '' && Number(areaHectares) > 0) {
        setEstimatedTonnage(Math.round(Number(areaHectares) * tch));
      }
    }
  };

  // When Area changes, INSTANTLY calculate Toneladas
  const handleAreaChange = (val: string) => {
    if (val === '') {
      setAreaHectares('');
      setEstimatedTonnage('');
      return;
    }
    const numArea = Number(val);
    setAreaHectares(numArea);
    if (!isNaN(numArea) && numArea > 0) {
      const calculatedTons = Math.round(numArea * currentTch);
      setEstimatedTonnage(calculatedTons);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!farmName.trim()) {
      setErrorMsg('Debe seleccionar o ingresar una Finca.');
      return;
    }

    if (!loteUm.trim()) {
      setErrorMsg('Debe seleccionar o ingresar el Lote / UM.');
      return;
    }

    const numArea = Number(areaHectares);
    if (!numArea || isNaN(numArea) || numArea <= 0) {
      setErrorMsg('Por favor ingrese el Área a quemar en Hectáreas (debe ser mayor a 0).');
      return;
    }

    const numTons = Number(estimatedTonnage) || Math.round(numArea * currentTch);
    if (!numTons || isNaN(numTons) || numTons <= 0) {
      setErrorMsg('Las Toneladas estimadas deben ser mayor a 0.');
      return;
    }

    // Safe planned burn date parse
    let safePlannedDate: string;
    try {
      if (plannedTime && !isNaN(new Date(plannedTime).getTime())) {
        safePlannedDate = new Date(plannedTime).toISOString();
      } else {
        safePlannedDate = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
      }
    } catch (e) {
      safePlannedDate = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');

      const autoRequestedAt = new Date().toISOString();

      await onSubmit({
        front_number: autoFront,
        shift_name: autoShift,
        shift_supervisor_name: autoSupervisor,
        farm_name: farmName.trim(),
        lote_um: loteUm.trim(),
        area_hectares: numArea,
        estimated_tonnage: numTons,
        planned_burn_time: safePlannedDate,
        requested_at: autoRequestedAt,
        created_by_user_id: currentUser.id,
        created_by_name: currentUser.full_name,
        status: 'SOLICITADA',
      });

      onClose();
    } catch (err: any) {
      console.error('Error in onSubmit:', err);
      setErrorMsg(err.message || 'Error al registrar solicitud. Intente de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        backgroundColor: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          width: '100%',
          maxWidth: '560px',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          border: '1.5px solid #e2e8f0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            backgroundColor: '#14532d',
            color: '#ffffff',
            padding: '18px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Flame style={{ width: '22px', height: '22px', color: '#fb923c' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 900, margin: 0 }}>
                Nueva Solicitud de Quema Programada
              </h2>
              <p style={{ fontSize: '11px', color: '#bbf7d0', margin: '2px 0 0 0' }}>
                Ingenio La Unión • Control Operativo de Quemas
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isSubmitting}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Error Message Box */}
          {errorMsg && (
            <div
              style={{
                padding: '12px 14px',
                backgroundColor: '#fef2f2',
                border: '1.5px solid #f87171',
                color: '#991b1b',
                fontSize: '13px',
                fontWeight: 700,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AlertCircle style={{ width: '18px', height: '18px', flexShrink: 0, color: '#dc2626' }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* AUTOMATIC SESSION INFO BANNER (FRENTE + SUPERVISOR + TURNO) */}
          <div
            style={{
              backgroundColor: '#eff6ff',
              border: '1.5px solid #bfdbfe',
              borderRadius: '16px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#dbeafe',
                  color: '#1e40af',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '14px',
                }}
              >
                <Layers style={{ width: '18px', height: '18px' }} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 900, color: '#1e3a8a' }}>
                    {autoFront}
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                      padding: '2px 6px',
                      borderRadius: '10px',
                    }}
                  >
                    {autoShift}
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: '#3b82f6', margin: '2px 0 0 0', fontWeight: 600 }}>
                  Supervisor: <strong style={{ color: '#1e3a8a' }}>{autoSupervisor}</strong>
                </p>
              </div>
            </div>

            <span style={{ fontSize: '10px', color: '#2563eb', fontWeight: 700, backgroundColor: '#ffffff', padding: '4px 8px', borderRadius: '8px', border: '1px solid #dbeafe' }}>
              ✓ Sesión Activa
            </span>
          </div>

          {/* FINCA & LOTE (UM) SELECTION */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: '4px' }}>
                Finca <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                value={farmName}
                onChange={(e) => handleFincaChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '13px',
                  fontWeight: 700,
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                }}
                required
              >
                {fincasLotes.map((f) => (
                  <option key={f.name} value={f.name}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: '4px' }}>
                Lote / UM <span style={{ color: '#ef4444' }}>*</span>
              </label>
              {availableLotes.length > 0 ? (
                <select
                  value={loteUm}
                  onChange={(e) => handleLoteChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    fontWeight: 700,
                    backgroundColor: '#ffffff',
                    color: '#0f172a',
                  }}
                  required
                >
                  {availableLotes.map((l) => (
                    <option key={l.lote} value={l.lote}>
                      Lote {l.lote}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={loteUm}
                  onChange={(e) => setLoteUm(e.target.value)}
                  placeholder="ej: 1.01"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    fontWeight: 700,
                    boxSizing: 'border-box',
                  }}
                  required
                />
              )}
            </div>
          </div>

          {/* TCH INDICATOR BADGE */}
          <div
            style={{
              padding: '8px 12px',
              backgroundColor: '#f0fdf4',
              borderRadius: '12px',
              border: '1px solid #bbf7d0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: '#166534',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calculator style={{ width: '15px', height: '15px', color: '#16a34a' }} />
              <span>
                <strong>TCH del Lote:</strong> {currentTch} TM/ha
              </span>
            </div>
            <span style={{ color: '#15803d', fontWeight: 700 }}>
              (Toneladas = Área × TCH)
            </span>
          </div>

          {/* AREA & INSTANTLY CALCULATED TONNAGE */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: '4px' }}>
                Área a Quemar (ha) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={areaHectares}
                  onChange={(e) => handleAreaChange(e.target.value)}
                  placeholder="ej: 12.5"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '2px solid #93c5fd',
                    backgroundColor: '#ffffff',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#0f172a',
                    boxSizing: 'border-box',
                  }}
                  autoFocus
                  required
                />
                <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: '#64748b', fontWeight: 700 }}>
                  ha {areaHectares ? `(${(Number(areaHectares) * 1.4308).toFixed(1)} Mz)` : ''}
                </span>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: 800, color: '#334155', textTransform: 'uppercase' }}>
                  Toneladas (Tm) <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <span style={{ fontSize: '10px', color: '#16a34a', fontWeight: 700 }}>
                  Calculado con TCH
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={estimatedTonnage}
                  onChange={(e) => setEstimatedTonnage(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Automático..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #86efac',
                    backgroundColor: '#fafffa',
                    fontSize: '14px',
                    fontWeight: 800,
                    color: '#14532d',
                    boxSizing: 'border-box',
                  }}
                  required
                />
                <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: '#15803d', fontWeight: 800 }}>
                  TM
                </span>
              </div>
            </div>
          </div>

          {/* PLANNED BURN TIME */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: '4px' }}>
              Hora Planificada para la Quema <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="datetime-local"
              value={plannedTime}
              onChange={(e) => setPlannedTime(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1.5px solid #cbd5e1',
                fontSize: '13px',
                fontWeight: 600,
                boxSizing: 'border-box',
              }}
              required
            />
          </div>

          {/* Modal Footer Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '10px',
              paddingTop: '16px',
              borderTop: '1px solid #f1f5f9',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: '10px 18px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#475569',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '10px',
              }}
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '12px 24px',
                backgroundColor: isSubmitting ? '#166534' : '#15803d',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '13px',
                borderRadius: '12px',
                border: 'none',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 6px rgba(21,128,61,0.25)',
              }}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw style={{ width: '16px', height: '16px' }} className="animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Flame style={{ width: '16px', height: '16px' }} />
                  <span>Crear Solicitud</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
