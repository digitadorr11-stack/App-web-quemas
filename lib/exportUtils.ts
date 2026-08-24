import { BurnRequest, AuditLog } from './types';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const exportToExcel = (burns: BurnRequest[], filename = 'Quemas_Ingenio_La_Union') => {
  const data = burns.map((b) => ({
    'No. Quema': b.burn_number,
    'Frente': b.front_number,
    'Finca': b.farm_name,
    'Supervisor Turno': b.shift_supervisor_name,
    'Área (ha)': b.area_hectares,
    'Área (mz)': b.area_manzanas ?? (b.area_hectares * 1.4308).toFixed(2),
    'Toneladas Estimadas': b.estimated_tonnage,
    'Estado': b.status,
    'Hora Planificada': b.planned_burn_time ? format(new Date(b.planned_burn_time), 'dd/MM/yyyy HH:mm') : '-',
    'Hora Solicitud': b.requested_at ? format(new Date(b.requested_at), 'dd/MM/yyyy HH:mm') : '-',
    'Patrulla Asignada': b.assigned_patrol_name || 'Sin Asignar',
    'Llegada Patrulla': b.patrol_arrived_at ? format(new Date(b.patrol_arrived_at), 'HH:mm') : '-',
    'Duración Revisión (min)': b.review_duration_minutes || '-',
    'Validado Por': b.validated_by_name || '-',
    'Inicio Quema': b.burn_started_at ? format(new Date(b.burn_started_at), 'HH:mm') : '-',
    'Fin Quema': b.burn_ended_at ? format(new Date(b.burn_ended_at), 'HH:mm') : '-',
    'Duración Quema (min)': b.burn_duration_minutes || '-',
    'Motivo Cancelación': b.cancellation_reason || '-',
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Control de Quemas');

  // Auto-width columns
  const colWidths = Object.keys(data[0] || {}).map((key) => ({
    wch: Math.max(key.length, 14),
  }));
  worksheet['!cols'] = colWidths;

  XLSX.writeFile(workbook, `${filename}_${format(new Date(), 'yyyyMMdd_HHmm')}.xlsx`);
};

export const exportAuditLogsToExcel = (logs: AuditLog[], filename = 'Bitacora_Auditoria_Quemas') => {
  const data = logs.map((l) => ({
    'Fecha / Hora': format(new Date(l.created_at), 'dd/MM/yyyy HH:mm:ss'),
    'No. Quema': l.burn_number || '-',
    'Usuario': l.user_name,
    'Rol': l.user_role,
    'Acción': l.action_type,
    'Campo Modificado': l.field_name || '-',
    'Valor Anterior': l.old_value || '-',
    'Valor Nuevo': l.new_value || '-',
    'Motivo / Justificación': l.change_reason || '-',
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Bitácora de Auditoría');
  XLSX.writeFile(workbook, `${filename}_${format(new Date(), 'yyyyMMdd_HHmm')}.xlsx`);
};

export const exportToPDF = (burns: BurnRequest[]) => {
  const doc = new jsPDF('landscape');

  // Header
  doc.setFontSize(16);
  doc.setTextColor(20, 83, 45); // Dark Green
  doc.text('INGENIO LA UNIÓN - SISTEMA DE CONTROL DE QUEMAS', 14, 15);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Reporte Oficial de Operaciones de Quema Programada | Generado: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: es })}`, 14, 22);

  // Summary Metrics
  const totalHa = burns.reduce((acc, b) => acc + (Number(b.area_hectares) || 0), 0).toFixed(1);
  const totalTons = burns.reduce((acc, b) => acc + (Number(b.estimated_tonnage) || 0), 0);
  const totalFinalizadas = burns.filter((b) => b.status === 'FINALIZADA').length;
  const totalCanceladas = burns.filter((b) => b.status === 'CANCELADA').length;

  doc.setFillColor(240, 253, 244);
  doc.rect(14, 26, 270, 14, 'F');
  doc.setTextColor(22, 101, 52);
  doc.setFontSize(9);
  doc.text(`Total Solicitudes: ${burns.length} | Finalizadas: ${totalFinalizadas} | Canceladas: ${totalCanceladas} | Área Total: ${totalHa} ha | Toneladas: ${totalTons.toLocaleString()} TM`, 18, 35);

  // Table Data
  const tableData = burns.map((b) => [
    b.burn_number,
    b.front_number,
    b.farm_name,
    b.shift_supervisor_name,
    `${b.area_hectares} ha`,
    `${b.estimated_tonnage} TM`,
    b.status.replace('_', ' '),
    b.assigned_patrol_name || 'Sin Asignar',
    b.burn_started_at ? format(new Date(b.burn_started_at), 'HH:mm') : '-',
    b.burn_ended_at ? format(new Date(b.burn_ended_at), 'HH:mm') : '-',
  ]);

  (doc as any).autoTable({
    startY: 44,
    head: [['No.', 'Frente', 'Finca', 'Sup. Turno', 'Área', 'Toneladas', 'Estado', 'Patrulla', 'Inicio', 'Fin']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [22, 101, 52], textColor: 255, fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });

  doc.save(`Reporte_Quemas_LaUnion_${format(new Date(), 'yyyyMMdd_HHmm')}.pdf`);
};
