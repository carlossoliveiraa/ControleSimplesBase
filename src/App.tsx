import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { ThemeProvider } from './contexts/ThemeContext'
import { Login } from './pages/Login'
import { EditarPerfil } from './pages/EditarPerfil'
import { Principal } from './pages/Principal'
import { RecuperarSenha } from './pages/RecuperarSenha'
import { BaseLayout } from './pages/layouts/BaseLayout'
import { Configuracoes } from './pages/Configuracoes'
import { Ajuda } from './pages/Ajuda'
import { RotaProtegida } from './components/RotaProtegida'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Rotas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/recuperar-senha" element={<RecuperarSenha />} />
            
            {/* Rotas protegidas com layout base */}
            <Route element={<RotaProtegida />}>
              <Route element={<BaseLayout />}>
                <Route path="/" element={<Principal />} />
                <Route path="/perfil" element={<EditarPerfil />} />
                <Route path="/configuracoes" element={<Configuracoes />} />
                <Route path="/ajuda" element={<Ajuda />} />               
              </Route>
            </Route>

            {/* Rota 404 */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App
