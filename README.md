# Control de Quemas en Tiempo Real - Ingenio La Unión

Plataforma operativa para el registro, trazabilidad de tiempos, coordinación en tiempo real entre cuadrillas de campo y despacho, y análisis de indicadores (KPIs) exportables a Excel.

## Roles del Sistema
- **Supervisor de Frente**: Crea solicitudes con hora de quema planificada.
- **Supervisor de Quemas**: Despacha y asigna patrullas midiendo efectividad de respuesta.
- **Patrulla de Quema**: Marca llegada, registra esperas y motivos, ejecuta revisión técnica, enciende y finaliza.
- **Digitador**: Administra usuarios, asigna roles y mantiene catálogos maestros.
- **Jefatura / Gerencia**: Supervisión de indicadores en tiempo real y descarga de reportes en Excel.

## Stack Tecnológico
- **Next.js 14** (App Router, React 18, TypeScript)
- **Tailwind CSS** & Lucide Icons
- **Supabase** (PostgreSQL + Supabase Auth + Realtime WebSockets + Row Level Security)
- **SheetJS** (Exportación avanzada a Excel)
