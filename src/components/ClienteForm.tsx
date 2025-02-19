import { useState, useEffect, FormEvent } from 'react';
import { clienteService } from '../services/clientes';
import type { Cliente, ClienteFormData } from '../types/cliente';
import Swal from 'sweetalert2';

interface ClienteFormProps {
  cliente?: Cliente | null;
  onClose: () => void;
  onSave: () => void;
}

export function ClienteForm({ cliente, onClose, onSave }: ClienteFormProps) {
  const [formData, setFormData] = useState<ClienteFormData>({
    nome: cliente?.nome || '',
    email: cliente?.email || '',
    telefone: cliente?.telefone || '',
    cpf: cliente?.cpf || '',
    data_nascimento: cliente?.data_nascimento || '',
    sexo: cliente?.sexo || 'M',
    cep: cliente?.cep || '',
    endereco: cliente?.endereco || '',
    numero: cliente?.numero || '',
    bairro: cliente?.bairro || '',
    observacoes: cliente?.observacoes || '',
    ativo: cliente?.ativo || true,
    avatar_url: cliente?.avatar_url || null
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (cliente) {
        const { error } = await clienteService.atualizar(cliente.id, formData);
        if (error) throw error;
      } else {
        const { error } = await clienteService.criar(formData);
        if (error) throw error;
      }

      Swal.fire({
        icon: 'success',
        title: cliente ? 'Cliente atualizado!' : 'Cliente cadastrado!',
        showConfirmButton: false,
        timer: 1500
      });

      onSave();
    } catch (error: any) {
      console.error('Erro ao salvar cliente:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: error.message || 'Não foi possível salvar o cliente'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {cliente ? 'Editar Cliente' : 'Novo Cliente'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            {/* Adicione os outros campos aqui... */}
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 