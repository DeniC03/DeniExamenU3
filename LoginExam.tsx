//DENI S
"use client";

import { useMemo, useState } from "react";
import {
  autenticarUsuario,
  cerrarSesionUsuario,
  configurarPersistencia,
} from "@/firebase/auth";

type AuthUser = {
  email: string;
};

// Función de validación de correo 
function esCorreoValido(correo: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

export default function LoginExam() {
  // Estados para capturar los datos del formulario y manejar la sesión
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [recordarme, setRecordarme] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [usuario, setUsuario] = useState<AuthUser | null>(null);

  // Texto dinámico para el botón principal
  const tituloBoton = useMemo(() => {
    return cargando ? "Procesando..." : "Entrar al Sistema";
  }, [cargando]);

  // Función que procesa el inicio de sesión
  async function procesarAcceso(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(""); 

    // Validación: Campos vacíos
    if (!correo.trim() || !contrasena.trim()) {
      setError("Por favor, completa todos los campos requeridos.");
      return;
    }

    // Validación: Formato de correo
    if (!esCorreoValido(correo)) {
      setError("Escribe un correo electrónico válido.");
      return;
    }

    setCargando(true); 

    try {
      // Aplicar persistencia de Firebase
      await configurarPersistencia(recordarme);
      // Autenticar con el servicio de Firebase
      const res = await autenticarUsuario(correo, contrasena);
      if (res.user && res.user.email) {
        setUsuario({ email: res.user.email });
      }
    } catch (err: any) {
      setError("Los datos de acceso son incorrectos.");
    } finally {
      setCargando(false); 
    }
  }

  // Función para cerrar la sesión activa
  async function salir() {
    await cerrarSesionUsuario();
    setUsuario(null);
    setCorreo("");
    setContrasena("");
  }

  return (
    // Fonddo degrado azul
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-700 via-indigo-800 to-purple-900 p-4">
      
      {}
      <section className="w-full max-w-md bg-white/95 backdrop-blur-md p-10 rounded-[2.5rem] shadow-2xl border border-white/30">
        
        <div className="text-center mb-10">
          {}
          <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl -rotate-3 hover:rotate-0 transition-transform duration-300">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
             </svg>
          </div>
          <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700 tracking-tight">
            Bienvenido
          </h1>
          <p className="text-slate-400 text-xs font-bold uppercase mt-2 tracking-widest">Examen U3 • Deni Samanta</p>
        </div>

        {!usuario ? (
          <form onSubmit={procesarAcceso} className="space-y-6">
            {/* Input de Correo con foco Azul */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase ml-2 mb-2">Correo Institucional</label>
              <input
                type="email"
                className="w-full border-2 border-slate-100 p-4 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-300 text-slate-700"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="ejemplo@correo.com"
              />
            </div>

            {}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase ml-2 mb-2">Contraseña</label>
              <input
                type="password"
                className="w-full border-2 border-slate-100 p-4 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all placeholder:text-slate-300 text-slate-700"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {}
            <div className="flex items-center gap-3 ml-2">
              <input
                type="checkbox"
                id="persist_check"
                className="w-5 h-5 text-blue-600 rounded-lg cursor-pointer accent-blue-600"
                checked={recordarme}
                onChange={(e) => setRecordarme(e.target.checked)}
              />
              <label htmlFor="persist_check" className="text-sm text-slate-600 font-medium cursor-pointer select-none">Mantener sesión</label>
            </div>

            {/}
            {error && (
              <div className="bg-red-50 text-red-600 text-xs p-4 rounded-xl border border-red-100 font-bold text-center animate-bounce">
                {error}
              </div>
            )}

            {/* Botón con degradado y sombra de color */}
            <button 
              type="submit" 
              disabled={cargando} 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-purple-300/50 active:scale-95 disabled:opacity-50 transition-all"
            >
              {tituloBoton}
            </button>
          </form>
        ) : (
          /* Pantalla de éxito con círculo de verificación */
          <div className="text-center py-6 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h2 className="text-2xl font-black text-slate-800">¡Acceso Correcto!</h2>
            <div className="mt-4 px-4 py-2 bg-slate-50 rounded-full inline-block border border-slate-200">
               <p className="text-slate-500 font-medium text-sm">{usuario.email}</p>
            </div>
            
            <button 
              onClick={salir} 
              className="mt-10 block w-full text-slate-400 hover:text-purple-600 font-bold text-sm uppercase tracking-widest transition-colors"
            >
              Cerrar sesión actual
            </button>
          </div>
        )}
      </section>
    </main>
  );
}