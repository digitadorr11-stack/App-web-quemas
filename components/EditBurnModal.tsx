'use client';

import React, { useState, useEffect } from 'react';
import { BurnRequest, Farm, Patrol, UserProfile } from '@/lib/types';
import { FINCAS_LOTES_DATA } from '@/lib/fincasLotesData';
import {
  X,
  Edit3,
  AlertTriangle,
  FileCheck,
  Save,
  User,
  Shield,
  Layers,
  MapPin,
  Flame,
} from 'lucide-react';

interface EditBurnModalProps {
  isOpen: boolean;
  onClose: () => void;
  burn: BurnRequest;
  farms: Farm[];
  patrols: Patrol[];
  currentUser: UserProfile;
  onSave: (
    burnId: string,
    updates: Partial<BurnRequest>,
    reason: string,
    fieldChanges: { field: string; oldVal: any; newVal: any }[]
  ) => Promise<void>;
}

export const EditBurnModal: React.FC<EditBurnModalProps> = ({
  isOpen,
  onClose,
  burn,
  currentUser,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    front_number: burn.front_number,
    shift_supervisor_name: burn.shift_supervisor_name,
    farm_name: burn.farm_name,
    lote_um: burn.lote_um || '',
    area_hectares: burn.area_hectares,
    estimated_tonnage: burn.estimated_tonnage,
    planned_burn_time: burn.planned_burn_time ? burn.planned_burn_time.slice(0, 16) : '',
  });

  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isDigitador = currentUser.role === 'digitador' || currentUser.role === 'admin';

  useEffect(() => {
    if (isOpen) {
      setFormData({
        front_number: burn.front_number,
        shift_supervisor_name: burn.shift_supervisor_name,
        farm_name: burn.farm_name,
        lote_um: burn.lote_um || '',
        area_hectares: burn.area_hectares,
        estimated_tonnage: burn.estimated_tonnage,
        planned_burn_time: burn.planned_burn_time ? burn.planned_burn_time.slice(0, 16) : '',
      });
      setReason('');
      setErrorMsg('');
    }
  }, [isOpen, burn]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setErrorMsg('Debe ingresar el motivo de la corrección para la bitácora de auditoría.');
      return;
    }

    const fieldChanges: { field: string; oldVal: any; newVal: any }[] = [];
    const updates: Partial<BurnRequest> = {};

    if (formData.front_number !== burn.front_number) {
      fieldChanges.push({ field: 'Frente', oldVal: burn.front_number, newVal: formData.front_number });
      updates.front_number = formData.front_number;
    }
    if (formData.shift_supervisor_name !== burn.shift_supervisor_name) {
      fieldChanges.push({ field: 'Supervisor de Turno', oldVal: burn.shift_supervisor_name, newVal: formData.shift_supervisor_name });
      updates.shift_supervisor_name = formData.shift_supervisor_name;
    }
    if (formData.farm_name !== burn.farm_name) {
      fieldChanges.push({ field: 'Finca', oldVal: burn.farm_name, newVal: formData.farm_name });
      updates.farm_name = formData.farm_name;
    }
    if (formData.lote_um !== (burn.lote_um || '')) {
      fieldChanges.push({ field: 'Lote / UM', oldVal: burn.lote_um || '', newVal: formData.lote_um });
      updates.lote_um = formData.lote_um;
    }
    if (Number(formData.area_hectares) !== Number(burn.area_hectares)) {
      fieldChanges.push({ field: 'Área (ha)', oldVal: burn.area_hectares, newVal: Number(formData.area_hectares) });
      updates.area_hectares = Number(formData.area_hectares);
    }
    if (Number(formData.estimated_tonnage) !== Number(burn.estimated_tonnage)) {
      fieldChanges.push({ field: 'Toneladas Estimadas', oldVal: burn.estimated_tonnage, newVal: Number(formData.estimated_tonnage) });
      updates.estimated_tonnage = Number(formData.estimated_tonnage);
    }
    if (formData.planned_burn_time && new Date(formData.planned_burn_time).toISOString() !== burn.planned_burn_time) {
      fieldChanges.push({ field: 'Hora Planificada', oldVal: burn.planned_burn_time, newVal: formData.planned_burn_time });
      updates.planned_burn_time = new Date(formData.planned_burn_time).toISOString();
    }

    if (fieldChanges.length === 0) {
      setErrorMsg('No ha modificado ningún campo.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave(burn.id, updates, reason, fieldChanges);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al guardar');
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
        <div
          style={{
            backgroundColor: '#1e293b',
            color: '#ffffff',
            padding: '18px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Edit3 style={{ width: '22px', height: '22px', color: '#60a5fa' }} />
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>
                Corregir Solicitud {burn.burn_number}
              </h3>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0 0' }}>
                Registro de Auditoría • {isDigitador ? 'Modo Digitador (Control Total)' : 'Modo Supervisor'}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {errorMsg && (
            <div style={{ padding: '10px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontSize: '12px', borderRadius: '10px' }}>
              {errorMsg}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: '4px' }}>
                Frente
              </label>
              <input
                type="text"
                value={formData.front_number}
                onChange={(e) => setFormData({ ...formData, front_number: e.target.value })}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13px', fontWeight: 700, boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: '4px' }}>
                Supervisor
              </label>
              <input
                type="text"
                value={formData.shift_supervisor_name}
                onChange={(e) => setFormData({ ...formData, shift_supervisor_name: e.target.value })}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13px', fontWeight: 700, boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: '4px' }}>
                Finca
              </label>
              <input
                type="text"
                value={formData.farm_name}
                onChange={(e) => setFormData({ ...formData, farm_name: e.target.value })}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13px', fontWeight: 700, boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: '4px' }}>
                Lote / UM
              </label>
              <input
                type="text"
                value={formData.lote_um}
                onChange={(e) => setFormData({ ...formData, lote_um: e.target.value })}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13px', fontWeight: 700, boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: '4px' }}>
                Área (ha)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.area_hectares}
                onChange={(e) => setFormData({ ...formData, area_hectares: Number(e.target.value) })}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13px', fontWeight: 700, boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: '4px' }}>
                Toneladas (TM)
              </label>
              <input
                type="number"
                step="1"
                value={formData.estimated_tonnage}
                onChange={(e) => setFormData({ ...formData, estimated_tonnage: Number(e.target.value) })}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13px', fontWeight: 700, boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#b91c1c', textTransform: 'uppercase', marginBottom: '4px' }}>
              Motivo o Justificación del Cambio (Obligatorio para Bitácora) *
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describa el motivo por el cual se corrigen estos datos..."
              style={{ width: '100%', padding: '8px 10px', borderRadius: '10px', border: '1.5px solid #f87171', fontSize: '12px', boxSizing: 'border-box', outline: 'none' }}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
            <button type="button" onClick={onClose} style={{ padding: '8px 14px', fontSize: '12px', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}>
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{ padding: '10px 18px', backgroundColor: '#1e40af', color: '#ffffff', fontWeight: 800, fontSize: '13px', borderRadius: '10px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Save style={{ width: '16px', height: '16px' }} />
              <span>{isSubmitting ? 'Guardando...' : 'Guardar Corrección'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
