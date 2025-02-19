import { useState, useEffect } from 'react';
import { clienteService } from '../services/clientes';
import { ClienteForm } from '../components/ClienteForm';
import type { Cliente } from '../types/cliente';
import Swal from 'sweetalert2';

export function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    carregarClientes();
  }, []);

  async function carregarClientes() {
    try {
      setIsLoading(true);
      const { data, error } = await clienteService.listar();
      if (error) throw error;
      setClientes(data || []);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Não foi possível carregar os clientes'
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleNovoCliente = () => {
    setSelectedCliente(null);
    setShowForm(true);
  };

  const handleEditarCliente = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedCliente(null);
  };

  const handleSaveForm = () => {
    handleCloseForm();
    carregarClientes();
  };

  return (
    <div className="w-full">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        {/* Cabeçalho */}
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Clientes</h1>
            <button
              onClick={handleNovoCliente}
              className="w-full sm:w-auto px-4 py-2 bg-[#4A90E2] text-white rounded-md hover:bg-[#357ABD] transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Novo Cliente
            </button>
          </div>
        </div>

        {/* Lista de Clientes */}
        <div className="p-4 sm:p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A90E2]"></div>
            </div>
          ) : clientes.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Nenhum cliente cadastrado
            </div>
          ) : (
            <div className="grid gap-4">
              {clientes.map((cliente) => (
                <div
                  key={cliente.id}
                  className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    {cliente.avatar_url ? (
                      <img
                        src={cliente.avatar_url}
                        alt={cliente.nome}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#4A90E2] flex items-center justify-center text-white font-medium">
                        {cliente.nome.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-white">{cliente.nome}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{cliente.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEditarCliente(cliente)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal do Formulário */}
      {showForm && (
        <ClienteForm
          cliente={selectedCliente}
          onClose={handleCloseForm}
          onSave={handleSaveForm}
        />
      )}
    </div>
  );
} 