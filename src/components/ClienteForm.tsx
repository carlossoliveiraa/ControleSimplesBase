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

  useEffect(() => {
    if (cliente) {
      setFormData({
        nome: cliente.nome,
        email: cliente.email,
        telefone: cliente.telefone,
        cpf: cliente.cpf,
        data_nascimento: cliente.data_nascimento,
        sexo: cliente.sexo,
        cep: cliente.cep,
        endereco: cliente.endereco,
        numero: cliente.numero,
        bairro: cliente.bairro,
        observacoes: cliente.observacoes || '',
        ativo: cliente.ativo,
        avatar_url: cliente.avatar_url
      });
    }
  }, [cliente]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (cliente) {
        await clienteService.atualizar(cliente.id, formData);
      } else {
        await clienteService.criar(formData);
      }

      Swal.fire({
        icon: 'success',
        title: cliente ? 'Cliente atualizado!' : 'Cliente cadastrado!',
        showConfirmButton: false,
        timer: 1500
      });

      onSave();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao salvar cliente',
        text: 'Tente novamente mais tarde'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
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
                name="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2]"
                required
              />
            </div>

            {/* Adicione os outros campos aqui... */}
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 