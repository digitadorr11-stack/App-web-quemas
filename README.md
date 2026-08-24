# Sistema de Registro y Control de Quemas Programadas - Ingenio La Unión 🌾🔥

Aplicación web integral para la gestión, seguimiento operativo, auditoría inmutable, control de seguridad y reportes personalizados de quemas agrícolas para el **Ingenio La Unión**.

---

## 🔑 Credenciales de Acceso para Pruebas

| Colaborador | Rol | Usuario (@) | Contraseña | PIN | Asignación |
|---|---|---|---|---|---|
| **Carlos Mendoza** | Supervisor de Frente | `carlos.mendoza` | `frente123` | `1001` | Frente 03 |
| **Roberto Gómez** | Supervisor de Frente | `roberto.gomez` | `frente123` | `1002` | Frente 01 |
| **Ing. Mario Estrada** | Supervisor de Quemas | `mario.estrada` | `quemas123` | `2001` | Despacho General |
| **Patrulla Alfa (Juan Pérez)** | Patrulla de Quema | `patrulla.alfa` | `patrulla123` | `3001` | Patrulla Alfa |
| **Patrulla Beta (Luis Morales)** | Patrulla de Quema | `patrulla.beta` | `patrulla123` | `3002` | Patrulla Beta |
| **Ana Lucía Castillo** | Digitador de Quemas | `ana.castillo` | `digitador123` | `4001` | Control Total / Maestros |
| **Lic. Fernando Alvarado** | Jefatura / Gerencia | `fernando.alvarado` | `jefatura123` | `5001` | Reportes Macro & Auditoría |

*(En la pantalla de Login también tienes botones de acceso rápido con 1 clic para entrar directamente como cualquiera de estos colaboradores).*

---

## 🚀 Inicio Rápido en VS Code

1. Abre tu terminal en VS Code y ejecuta:
   ```bash
   npm run dev
   ```
2. Abre tu navegador en [http://localhost:3000](http://localhost:3000).

---

## 🌟 Novedades y Módulos Clave

1. **🔐 Login y Gestión de Credenciales (`/usuarios`)**:
   - El **Digitador** tiene un módulo exclusivo donde puede ver las contraseñas/PINes de todos los colaboradores si se les olvidan en campo, cambiarlas, restablecerlas o registrar nuevos usuarios.
2. **🛡️ Aislamiento Estricto por Rol**:
   - Cada **Supervisor de Frente** solo ve las quemas de su frente asignado.
   - Cada **Patrulla** solo ve las quemas asignadas a su cuadrilla.
   - El **Digitador** y las **Jefaturas** tienen visión global de todo el ingenio.
3. **🗄️ Base de Datos Maestra (`/maestros`)**:
   - El Digitador puede dar de alta o modificar **Frentes de Cosecha**, **Patrullas de Quema** y **Fincas**.
4. **📊 Reportes y KPIs Personalizados (`/reportes`)**:
   - Supervisores de frente y patrullas ven sus métricas individuales ("Mis Quemas", "Mis Hectáreas", "Mis Tiempos").
   - El Digitador y Jefaturas ven el panel consolidado con exportación a **Excel** y **PDF**.
5. **📜 Bitácora de Auditoría (`/bitacora`)**:
   - Registro inmutable de cada cambio de estado, edición o corrección con fecha, hora, usuario, valor anterior y nuevo.
