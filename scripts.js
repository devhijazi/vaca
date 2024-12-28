const cortes = [
  { nome: 'Filé Mignon', porcentagem: 0.0177 },
  { nome: 'Picanha', porcentagem: 0.0205 },
  { nome: 'Alcatra', porcentagem: 0.0359 },
  { nome: 'Contra Filé', porcentagem: 0.065 },
  { nome: 'Coxão Mole', porcentagem: 0.0756 },
  { nome: 'Lagarto', porcentagem: 0.0168 },
  { nome: 'Patinho', porcentagem: 0.035 },
  { nome: 'Coxão Duro', porcentagem: 0.0355 },
  { nome: 'Paleta', porcentagem: 0.0782 },
  { nome: 'Agulha', porcentagem: 0.1177 },
  { nome: 'Músculo', porcentagem: 0.0589 },
  { nome: 'Peito', porcentagem: 0.0693 },
  { nome: 'Ponta de Costela', porcentagem: 0.0157 },
  { nome: 'Aba', porcentagem: 0.0152 },
  { nome: 'Pacu', porcentagem: 0.0056 },
  { nome: 'Capa de Filé', porcentagem: 0.0119 },
  { nome: 'Costela', porcentagem: 0.0914 },
  { nome: 'Carne Industrial (Retalho)', porcentagem: 0.0154 },
  { nome: 'Sebo', porcentagem: 0.1102 },
  { nome: 'Osso', porcentagem: 0.1517 },
  { nome: 'Quebra', porcentagem: 0.0119 },
];

document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('tabela-cortes');
  cortes.forEach((corte, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${corte.nome}</td>
      <td id="peso-corte-${index}">0.000</td>
      <td><input type="number" id="preco-corte-${index}" value="0" step="0.01" onchange="atualizar()"></td>
      <td id="compra-corte-${index}">0.00</td>
      <td id="venda-corte-${index}">0.00</td>
      <td id="lucro-corte-${index}">0.00</td>
      <td id="lucro-porcentagem-corte-${index}">0.00%</td>
    `;
    tbody.appendChild(row);
  });
  atualizar();
});

function atualizar() {
  const pesoNF = parseFloat(document.getElementById('peso-nf').value);
  const precoCompra = parseFloat(document.getElementById('preco-compra').value);
  const pesoAproveitavel = pesoNF * 0.72;
  const custoTotal = pesoNF * precoCompra;

  let vendaTotal = 0;
  let compraTotal = 0;

  cortes.forEach((corte, index) => {
    const pesoCorte = pesoAproveitavel * corte.porcentagem;
    const precoVenda =
      parseFloat(document.getElementById(`preco-corte-${index}`).value) || 0;
    const compraCorte = pesoCorte * precoCompra;
    const vendaCorte = pesoCorte * precoVenda;
    const lucro = vendaCorte - compraCorte;
    const margemLucro = (lucro / compraCorte) * 100;

    compraTotal += compraCorte;
    vendaTotal += vendaCorte;

    document.getElementById(`peso-corte-${index}`).innerText =
      pesoCorte.toFixed(3);
    document.getElementById(`compra-corte-${index}`).innerText =
      compraCorte.toFixed(2);
    document.getElementById(`venda-corte-${index}`).innerText =
      vendaCorte.toFixed(2);
    document.getElementById(`lucro-corte-${index}`).innerText =
      lucro.toFixed(2);
    document.getElementById(`lucro-porcentagem-corte-${index}`).innerText =
      margemLucro.toFixed(2) + '%';
  });

  const lucroTotal = vendaTotal - compraTotal;
  const porcentagemLucro = (lucroTotal / compraTotal) * 100;

  document.getElementById('compra-total').innerText = compraTotal.toFixed(2);
  document.getElementById('venda-total').innerText = vendaTotal.toFixed(2);
  document.getElementById('lucro-total').innerText = lucroTotal.toFixed(2);
  document.getElementById('porcentagem-lucro').innerText =
    porcentagemLucro.toFixed(2) + '%';
}

function exportarCSV() {
  const linhas = [
    [
      'Corte',
      'Peso (kg)',
      'Preço por kg (R$)',
      'Compra (R$)',
      'Venda (R$)',
      'Lucro (R$)',
      'Lucro (%)',
    ],
  ];
  cortes.forEach((corte, index) => {
    const pesoCorte =
      parseFloat(document.getElementById('peso-nf').value) *
      0.72 *
      corte.porcentagem;
    const precoVenda =
      parseFloat(document.getElementById(`preco-corte-${index}`).value) || 0;
    const compraCorte =
      pesoCorte * parseFloat(document.getElementById('preco-compra').value);
    const vendaCorte = pesoCorte * precoVenda;
    const lucro = vendaCorte - compraCorte;
    const margemLucro = (lucro / compraCorte) * 100;
    linhas.push([
      corte.nome,
      pesoCorte.toFixed(3),
      precoVenda.toFixed(2),
      compraCorte.toFixed(2),
      vendaCorte.toFixed(2),
      lucro.toFixed(2),
      margemLucro.toFixed(2),
    ]);
  });

  const csvContent = linhas.map(linha => linha.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'resultado_res_casada.csv';
  link.click();
}
