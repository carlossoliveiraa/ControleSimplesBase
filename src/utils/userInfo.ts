interface SignoInfo {
  nome: string;
  icone: string;
  periodo: string;
}

export const calcularIdade = (dataNascimento: string | null): number | null => {
  if (!dataNascimento) return null;
  
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();
  
  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  
  return idade;
};

export const getSigno = (dataNascimento: string | null): SignoInfo | null => {
  if (!dataNascimento) return null;
  
  const data = new Date(dataNascimento);
  const dia = data.getDate();
  const mes = data.getMonth() + 1;

  const signos: SignoInfo[] = [
    { nome: 'Áries', icone: '♈', periodo: '21/03 - 19/04' },
    { nome: 'Touro', icone: '♉', periodo: '20/04 - 20/05' },
    { nome: 'Gêmeos', icone: '♊', periodo: '21/05 - 20/06' },
    { nome: 'Câncer', icone: '♋', periodo: '21/06 - 22/07' },
    { nome: 'Leão', icone: '♌', periodo: '23/07 - 22/08' },
    { nome: 'Virgem', icone: '♍', periodo: '23/08 - 22/09' },
    { nome: 'Libra', icone: '♎', periodo: '23/09 - 22/10' },
    { nome: 'Escorpião', icone: '♏', periodo: '23/10 - 21/11' },
    { nome: 'Sagitário', icone: '♐', periodo: '22/11 - 21/12' },
    { nome: 'Capricórnio', icone: '♑', periodo: '22/12 - 19/01' },
    { nome: 'Aquário', icone: '♒', periodo: '20/01 - 18/02' },
    { nome: 'Peixes', icone: '♓', periodo: '19/02 - 20/03' }
  ];

  if ((mes === 3 && dia >= 21) || (mes === 4 && dia <= 19)) return signos[0];
  if ((mes === 4 && dia >= 20) || (mes === 5 && dia <= 20)) return signos[1];
  if ((mes === 5 && dia >= 21) || (mes === 6 && dia <= 20)) return signos[2];
  if ((mes === 6 && dia >= 21) || (mes === 7 && dia <= 22)) return signos[3];
  if ((mes === 7 && dia >= 23) || (mes === 8 && dia <= 22)) return signos[4];
  if ((mes === 8 && dia >= 23) || (mes === 9 && dia <= 22)) return signos[5];
  if ((mes === 9 && dia >= 23) || (mes === 10 && dia <= 22)) return signos[6];
  if ((mes === 10 && dia >= 23) || (mes === 11 && dia <= 21)) return signos[7];
  if ((mes === 11 && dia >= 22) || (mes === 12 && dia <= 21)) return signos[8];
  if ((mes === 12 && dia >= 22) || (mes === 1 && dia <= 19)) return signos[9];
  if ((mes === 1 && dia >= 20) || (mes === 2 && dia <= 18)) return signos[10];
  if ((mes === 2 && dia >= 19) || (mes === 3 && dia <= 20)) return signos[11];

  return null;
}; 