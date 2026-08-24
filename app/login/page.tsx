'use client';

import React, { useState, useEffect } from 'react';
import { storageService } from '@/lib/storageService';
import { INITIAL_USERS } from '@/lib/mockData';
import { UserProfile, ROLE_DETAILS, Front, ShiftType } from '@/lib/types';
import {
  Flame,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  KeyRound,
  Layers,
  Clock,
  Check,
  RotateCcw,
  Users,
  Shield,
} from 'lucide-react';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'quick' | 'form'>('quick');
  const [fronts, setFronts] = useState<Front[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'FRENTES' | 'DESCANSOS' | 'OTROS'>('ALL');

  // Form state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Shift & Front Configuration Modal for Supervisors
  const [configuringSupervisor, setConfiguringSupervisor] = useState<UserProfile | null>(null);
  const [selectedFront, setSelectedFront] = useState('Frente 15');
  const [selectedShift, setSelectedShift] = useState<ShiftType>('Turno Día (06:00 - 18:00)');
  const [showForgotModal, setShowForgotModal] = useState(false);

  useEffect(() => {
    storageService.getFronts().then((fList) => {
      setFronts(fList);
      if (fList.length > 0) setSelectedFront(fList[0].name);
    });
  }, []);

  // Form Submit Login
  const handleFormLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setErrorMsg('Por favor ingrese su usuario y contraseña.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMsg('');
      const user = await storageService.login(identifier, password);
      if (user) {
        if (user.role === 'supervisor_frente') {
          setConfiguringSupervisor(user);
          setSelectedFront(user.assigned_front || 'Frente 15');
          setSelectedShift(user.current_shift || 'Turno Día (06:00 - 18:00)');
        } else {
          window.location.href = '/';
        }
      } else {
        setErrorMsg('Credenciales incorrectas. Verifique sus datos o use el Ingreso Rápido por Perfil.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  // Instant 1-Click Login
  const handleQuickClick = (user: UserProfile) => {
    if (user.role === 'supervisor_frente') {
      setConfiguringSupervisor(user);
      setSelectedFront(user.assigned_front || 'Frente 15');
      setSelectedShift(
        user.current_shift ||
          (user.is_relief_supervisor
            ? 'Relevo / Cobertura de Descanso'
            : 'Turno Día (06:00 - 18:00)')
      );
    } else {
      setIsLoading(true);
      storageService.setActiveUser(user);
      window.location.href = '/';
    }
  };

  // Confirm Front and Shift for Supervisor
  const handleConfirmShiftAndEnter = () => {
    if (!configuringSupervisor) return;
    setIsLoading(true);

    const updatedUser: UserProfile = {
      ...configuringSupervisor,
      assigned_front: selectedFront,
      current_shift: selectedShift,
    };

    storageService.setActiveUser(updatedUser);
    window.location.href = '/';
  };

  // Filtered list of users
  const displayedUsers = INITIAL_USERS.filter((u) => {
    if (categoryFilter === 'FRENTES') return u.role === 'supervisor_frente' && !u.is_relief_supervisor;
    if (categoryFilter === 'DESCANSOS') return u.is_relief_supervisor;
    if (categoryFilter === 'OTROS') return u.role !== 'supervisor_frente';
    return true;
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f1f5f9',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Top Header / Banner */}
      <header
        style={{
          backgroundColor: '#14532d',
          color: '#ffffff',
          padding: '16px 24px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
          borderBottom: '2px solid #166534',
        }}
      >
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 6px rgba(234,88,12,0.3)',
              }}
            >
              <Flame style={{ width: '26px', height: '26px', color: '#ffffff' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '-0.5px' }}>
                  INGENIO LA UNIÓN
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    backgroundColor: 'rgba(249,115,22,0.3)',
                    color: '#fed7aa',
                    border: '1px solid rgba(249,115,22,0.4)',
                    padding: '2px 8px',
                    borderRadius: '20px',
                  }}
                >
                  Zafra 2026
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#bbf7d0', margin: 0 }}>
                Control Operativo y Auditoría de Quemas Programadas
              </p>
            </div>
          </div>

          <span
            style={{
              fontSize: '12px',
              color: '#86efac',
              fontWeight: 600,
            }}
          >
            Frentes: 15, 16, 17, 19, 23, 25 & Relevos
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main
        style={{
          maxWidth: '1100px',
          width: '100%',
          margin: '0 auto',
          padding: '28px 16px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1
            style={{
              fontSize: '26px',
              fontWeight: 900,
              color: '#0f172a',
              letterSpacing: '-0.5px',
              marginBottom: '6px',
            }}
          >
            Portal de Inicio de Sesión
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '650px', margin: '0 auto' }}>
            Selecciona tu perfil para ingresar. En cada frente rotan 2 supervisores de turno y 2 supervisores de descanso (Desc1 / Desc2).
          </p>

          {/* Tab Selector */}
          <div
            style={{
              display: 'inline-flex',
              padding: '4px',
              backgroundColor: '#e2e8f0',
              borderRadius: '16px',
              marginTop: '16px',
              border: '1px solid #cbd5e1',
            }}
          >
            <button
              onClick={() => setActiveTab('quick')}
              style={{
                padding: '8px 18px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: activeTab === 'quick' ? '#14532d' : 'transparent',
                color: activeTab === 'quick' ? '#ffffff' : '#334155',
                boxShadow: activeTab === 'quick' ? '0 2px 4px rgba(0,0,0,0.15)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <Sparkles style={{ width: '16px', height: '16px', color: '#fb923c' }} />
              <span>Ingreso Rápido por Perfil (1 Clic)</span>
            </button>
            <button
              onClick={() => setActiveTab('form')}
              style={{
                padding: '8px 18px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: activeTab === 'form' ? '#14532d' : 'transparent',
                color: activeTab === 'form' ? '#ffffff' : '#334155',
                boxShadow: activeTab === 'form' ? '0 2px 4px rgba(0,0,0,0.15)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <Lock style={{ width: '16px', height: '16px', color: '#86efac' }} />
              <span>Ingresar con Usuario / Clave</span>
            </button>
          </div>
        </div>

        {/* TAB 1: INGRESO RÁPIDO CON TARJETAS */}
        {activeTab === 'quick' && (
          <div style={{ maxWidth: '1050px', width: '100%', margin: '0 auto' }}>
            
            {/* Category Filter Pills */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '16px',
                flexWrap: 'wrap',
              }}
            >
              {[
                { id: 'ALL', label: 'Todos los Colaboradores' },
                { id: 'FRENTES', label: '🌾 Frentes (15, 16, 17, 19, 23, 25)' },
                { id: 'DESCANSOS', label: '🔄 Relevos / Descansos (Desc1, Desc2)' },
                { id: 'OTROS', label: '🛡️ Quemas, Patrullas, Digitador, Jefatura' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setCategoryFilter(pill.id as any)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 700,
                    border: '1px solid',
                    cursor: 'pointer',
                    backgroundColor: categoryFilter === pill.id ? '#1e3a8a' : '#ffffff',
                    color: categoryFilter === pill.id ? '#ffffff' : '#475569',
                    borderColor: categoryFilter === pill.id ? '#1e3a8a' : '#cbd5e1',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '14px',
              }}
            >
              {displayedUsers.map((user) => {
                const roleMeta = ROLE_DETAILS[user.role];
                const isFrente = user.role === 'supervisor_frente';
                const isRelief = user.is_relief_supervisor;

                return (
                  <button
                    key={user.id}
                    onClick={() => handleQuickClick(user)}
                    disabled={isLoading}
                    style={{
                      padding: '14px',
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      border: '2px solid',
                      borderColor: isRelief ? '#93c5fd' : isFrente ? '#bfdbfe' : user.role === 'patrulla' ? '#fed7aa' : user.role === 'digitador' ? '#e9d5ff' : '#bbf7d0',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: '135px',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#16a34a';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = isRelief ? '#93c5fd' : isFrente ? '#bfdbfe' : user.role === 'patrulla' ? '#fed7aa' : user.role === 'digitador' ? '#e9d5ff' : '#bbf7d0';
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.04)';
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '6px',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: '12px',
                            border: '1px solid',
                            backgroundColor: isRelief ? '#eff6ff' : isFrente ? '#dbeafe' : user.role === 'patrulla' ? '#ffedd5' : user.role === 'digitador' ? '#f3e8ff' : '#dcfce7',
                            color: isRelief ? '#1d4ed8' : isFrente ? '#1e40af' : user.role === 'patrulla' ? '#9a3412' : user.role === 'digitador' ? '#6b21a8' : '#166534',
                            borderColor: isRelief ? '#bfdbfe' : isFrente ? '#bfdbfe' : user.role === 'patrulla' ? '#fed7aa' : user.role === 'digitador' ? '#e9d5ff' : '#bbf7d0',
                          }}
                        >
                          {isRelief ? '🔄 Cobertura Descansos' : roleMeta.label}
                        </span>
                        <ArrowRight style={{ width: '14px', height: '14px', color: '#94a3b8' }} />
                      </div>

                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                        {user.full_name}
                      </div>

                      <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace', marginTop: '2px' }}>
                        @{user.username}
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: '10px',
                        paddingTop: '8px',
                        borderTop: '1px solid #f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '11px',
                      }}
                    >
                      {isFrente ? (
                        <span
                          style={{
                            fontWeight: 800,
                            color: '#1e40af',
                            backgroundColor: '#eff6ff',
                            padding: '2px 6px',
                            borderRadius: '6px',
                            border: '1px solid #dbeafe',
                          }}
                        >
                          {user.assigned_front || 'Configurar Frente'}
                        </span>
                      ) : user.assigned_patrol_name ? (
                        <span
                          style={{
                            fontWeight: 800,
                            color: '#9a3412',
                            backgroundColor: '#fff7ed',
                            padding: '2px 6px',
                            borderRadius: '6px',
                            border: '1px solid #ffedd5',
                          }}
                        >
                          {user.assigned_patrol_name}
                        </span>
                      ) : (
                        <span style={{ color: '#64748b', fontWeight: 600 }}>
                          General Ingenio
                        </span>
                      )}

                      <span style={{ fontWeight: 800, color: '#16a34a' }}>
                        {isFrente ? 'Elegir Turno ➔' : 'Entrar ➔'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: FORMULARIO TRADICIONAL */}
        {activeTab === 'form' && (
          <div
            style={{
              maxWidth: '440px',
              width: '100%',
              margin: '0 auto',
              backgroundColor: '#ffffff',
              padding: '28px',
              borderRadius: '24px',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
              border: '1.5px solid #e2e8f0',
            }}
          >
            <form onSubmit={handleFormLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {errorMsg && (
                <div
                  style={{
                    padding: '12px',
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#991b1b',
                    fontSize: '12px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <AlertCircle style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    color: '#334155',
                    marginBottom: '6px',
                  }}
                >
                  Usuario o Correo Institucional
                </label>
                <div style={{ position: 'relative' }}>
                  <User
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '16px',
                      height: '16px',
                      color: '#94a3b8',
                    }}
                  />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="ej: christian.perez o ana.castillo"
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      borderRadius: '12px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    required
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: '#334155',
                    }}
                  >
                    Contraseña o PIN
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '11px',
                      color: '#15803d',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    ¿Olvidó su clave?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '16px',
                      height: '16px',
                      color: '#94a3b8',
                    }}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: '10px 38px 10px 38px',
                      borderRadius: '12px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '13px',
                      fontFamily: 'monospace',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#94a3b8',
                    }}
                  >
                    {showPassword ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#15803d',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 6px rgba(21,128,61,0.25)',
                  marginTop: '6px',
                }}
              >
                <span>{isLoading ? 'Verificando...' : 'Iniciar Sesión'}</span>
                <ArrowRight style={{ width: '16px', height: '16px' }} />
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          padding: '16px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#64748b',
        }}
      >
        <p style={{ fontWeight: 700, color: '#334155', margin: 0 }}>Ingenio La Unión - División Agrícola</p>
        <p style={{ fontSize: '11px', color: '#94a3b8', margin: '4px 0 0 0' }}>
          Control de Quemas Programadas • Zafra 2026
        </p>
      </footer>

      {/* ================================================================ */}
      {/* MODAL CONFIGURACIÓN DE FRENTE Y TURNO PARA SUPERVISORES          */}
      {/* ================================================================ */}
      {configuringSupervisor && (
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
              maxWidth: '460px',
              borderRadius: '24px',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
              border: '1.5px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                paddingBottom: '12px',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '14px',
                  backgroundColor: '#dbeafe',
                  color: '#1e40af',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Layers style={{ width: '22px', height: '22px' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Configurar Turno de Trabajo
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>
                  Supervisor: <strong style={{ color: '#1e40af' }}>{configuringSupervisor.full_name}</strong>
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '12px' }}>
              {/* Seleccionar Frente */}
              <div>
                <label style={{ display: 'block', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: '6px' }}>
                  1. Seleccionar Frente a Operar Hoy <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  value={selectedFront}
                  onChange={(e) => setSelectedFront(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    border: '2px solid #93c5fd',
                    backgroundColor: '#ffffff',
                    fontWeight: 700,
                    fontSize: '13px',
                    color: '#1e3a8a',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                >
                  {fronts.map((f) => (
                    <option key={f.id} value={f.name}>
                      {f.name} — Cosecha {f.harvest_type}
                    </option>
                  ))}
                </select>
                <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', margin: 0 }}>
                  {configuringSupervisor.is_relief_supervisor
                    ? 'Como supervisor de relevo, selecciona el frente que estás cubriendo en este turno.'
                    : 'Frente asignado por defecto para tu cuadrilla.'}
                </p>
              </div>

              {/* Seleccionar Turno */}
              <div>
                <label style={{ display: 'block', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: '6px' }}>
                  2. Seleccionar Turno de Hoy <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { id: 'Turno Día (06:00 - 18:00)', label: 'Turno Día (06:00 - 18:00)', icon: '☀️' },
                    { id: 'Turno Noche (18:00 - 06:00)', label: 'Turno Noche (18:00 - 06:00)', icon: '🌙' },
                    { id: 'Relevo / Cobertura de Descanso', label: 'Cobertura de Descanso (Relevo)', icon: '🔄' },
                  ].map((shift) => (
                    <div
                      key={shift.id}
                      onClick={() => setSelectedShift(shift.id as ShiftType)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        borderRadius: '12px',
                        border: '2px solid',
                        borderColor: selectedShift === shift.id ? '#2563eb' : '#e2e8f0',
                        backgroundColor: selectedShift === shift.id ? '#eff6ff' : '#ffffff',
                        fontWeight: selectedShift === shift.id ? 800 : 600,
                        color: selectedShift === shift.id ? '#1e3a8a' : '#334155',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14px' }}>{shift.icon}</span>
                        <span>{shift.label}</span>
                      </div>
                      {selectedShift === shift.id && <Check style={{ width: '16px', height: '16px', color: '#2563eb' }} />}
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  padding: '10px 12px',
                  backgroundColor: '#eff6ff',
                  borderRadius: '12px',
                  color: '#1e40af',
                  fontSize: '11px',
                  border: '1px solid #bfdbfe',
                }}
              >
                💡 Al ingresar, el sistema te asignará al <strong style={{ color: '#172554' }}>{selectedFront}</strong> en el <strong style={{ color: '#172554' }}>{selectedShift}</strong>.
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
              <button
                type="button"
                onClick={() => setConfiguringSupervisor(null)}
                style={{
                  padding: '8px 14px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#475569',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '8px',
                }}
              >
                Volver
              </button>

              <button
                type="button"
                onClick={handleConfirmShiftAndEnter}
                disabled={isLoading}
                style={{
                  padding: '10px 18px',
                  backgroundColor: '#1d4ed8',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '13px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 6px rgba(29,78,216,0.25)',
                }}
              >
                <span>{isLoading ? 'Ingresando...' : `Entrar al ${selectedFront}`}</span>
                <ArrowRight style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotModal && (
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
              maxWidth: '420px',
              borderRadius: '24px',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
              border: '1.5px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#15803d' }}>
              <KeyRound style={{ width: '22px', height: '22px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Recuperación de Contraseñas
              </h3>
            </div>
            <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
              El <strong>Digitador de Turno</strong> tiene acceso directo para ver tu contraseña o restablecer tu PIN en tiempo real desde el módulo de administración.
            </p>
            <div
              style={{
                padding: '12px',
                backgroundColor: '#f0fdf4',
                borderRadius: '12px',
                border: '1px solid #bbf7d0',
                fontSize: '11px',
                color: '#166534',
              }}
            >
              <strong>Instrucciones:</strong>
              <div style={{ marginTop: '4px' }}>1. Contacta al Digitador de Quemas o Supervisor de Turno.</div>
              <div>2. El digitador abrirá la pestaña <strong>"Gestión de Usuarios"</strong> y te proporcionará tu clave de inmediato.</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '8px' }}>
              <button
                onClick={() => setShowForgotModal(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#15803d',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '12px',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
