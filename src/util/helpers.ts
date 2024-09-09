export function formatCurrencyBRL(amount: number) {
  return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function validaCpfCnpj(elemento: string) {
  if (!elemento) return false
  const el = elemento.replace(/[^\d]+/g, '')
  if (el.length === 11) {
    return testaCPF(el)
  } else if (el.length === 14) {
    return testaCNPJ(el)
  }
}

export function formatCPF(cpf: string | number): string {
  if(!cpf) return ''
  let cpfStr = cpf.toString()
  cpfStr = cpfStr.replace(/\D/g, '')

  return cpfStr.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

export function normalizeFilename(str: string) {
  let normalized = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  normalized = normalized.replace(/ /g, '_')
  return normalized
}

export function customFilter(arr: any[], search: string, options: any) {
  const itemSearch = normalizeFilename(search.toUpperCase())
  const fieldLabel = options.label
  const list = arr.filter((x) =>
    normalizeFilename(x[fieldLabel].toUpperCase()).includes(itemSearch)
  )
  return list
}

function testaCPF(elemento: string) {
  const cpf = elemento

  if (cpf.length === 11) {
    // Elimina CPFs invalidos conhecidos
    if (
      cpf.length !== 11 ||
      cpf === '00000000000' ||
      cpf === '11111111111' ||
      cpf === '22222222222' ||
      cpf === '33333333333' ||
      cpf === '44444444444' ||
      cpf === '55555555555' ||
      cpf === '66666666666' ||
      cpf === '77777777777' ||
      cpf === '88888888888' ||
      cpf === '99999999999'
    ) {
      return false
    }

    // Valida 1o digito
    let add = 0
    let rev
    for (let i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i)
    rev = 11 - (add % 11)
    if (rev === 10 || rev === 11) rev = 0
    if (rev !== parseInt(cpf.charAt(9))) {
      return false
    }

    add = 0
    for (let i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i)
    rev = 11 - (add % 11)
    if (rev === 10 || rev === 11) rev = 0
    if (rev !== parseInt(cpf.charAt(10))) {
      return false
    } else {
      return true
    }
  }
}

function testaCNPJ(elemento: string) {
  const cnpj = elemento

  if (cnpj === '') {
    return false
  }

  if (cnpj.length !== 14) {
    return false
  }
  // Elimina CNPJs invalidos conhecidos
  if (
    cnpj === '00000000000000' ||
    cnpj === '11111111111111' ||
    cnpj === '22222222222222' ||
    cnpj === '33333333333333' ||
    cnpj === '44444444444444' ||
    cnpj === '55555555555555' ||
    cnpj === '66666666666666' ||
    cnpj === '77777777777777' ||
    cnpj === '88888888888888' ||
    cnpj === '99999999999999'
  ) {
    return false
  }
  // Valida DVs
  let tamanho = cnpj.length - 2
  let numeros: any = cnpj.substring(0, tamanho)
  const digitos = cnpj.substring(tamanho)
  let soma = 0
  let pos = tamanho - 7
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--
    if (pos < 2) pos = 9
  }
  let resultado: any = soma % 11 < 2 ? 0 : 11 - (soma % 11)
  if (resultado != digitos.charAt(0)) {
    return false
  }
  tamanho = tamanho + 1
  numeros = cnpj.substring(0, tamanho)
  soma = 0
  pos = tamanho - 7
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--
    if (pos < 2) pos = 9
  }
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
  if (resultado != digitos.charAt(1)) {
    return false
  }
  return true
}

export function blobToFile(blob: any, fileName: string) {
  const file = new File([blob], fileName, {
    type: blob.type,
    lastModified: Date.now()
  })
  return file
}

export function formatCNPJ(cnpj: string): string {
  if (!cnpj) {
    return ''
  } else {
    const cnpjClear = cnpj.replace(/\D/g, '')

    return cnpjClear.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
  }
}

export function removerMascaraCNPJ(cnpjFormatado: string): string {
  return cnpjFormatado.replace(/\D/g, '')
}

export function validarCNPJ(cnpj: string): boolean {
  // Remove todos os caracteres não numéricos (como pontos, barras e hífens)
  cnpj = cnpj.replace(/[^\d]/g, '')

  // Verifica se o CNPJ tem 14 dígitos
  if (cnpj.length !== 14) {
    return false
  }

  // Verifica se o CNPJ não é uma sequência de dígitos iguais (ex: 00000000000000)
  if (/^(\d)\1{13}$/.test(cnpj)) {
    return false
  }

  // Calcula os dois dígitos verificadores
  function calcularDigitoVerificador(cnpj: string, posicoes: number[]): number {
    let soma = 0
    for (let i = 0; i < posicoes.length; i++) {
      soma += parseInt(cnpj[i]) * posicoes[i]
    }
    const resto = soma % 11
    return resto < 2 ? 0 : 11 - resto
  }

  // Posições para cálculo dos dígitos verificadores
  const posicoesPrimeiroDigito = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const posicoesSegundoDigito = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

  // Calcula o primeiro dígito verificador
  const primeiroDigito = calcularDigitoVerificador(cnpj, posicoesPrimeiroDigito)
  if (primeiroDigito !== parseInt(cnpj[12])) {
    return false
  }

  // Calcula o segundo dígito verificador
  const segundoDigito = calcularDigitoVerificador(cnpj, posicoesSegundoDigito)
  if (segundoDigito !== parseInt(cnpj[13])) {
    return false
  }

  // Se os dois dígitos verificadores estão corretos, o CNPJ é válido
  return true
}

export function validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}
export function compareDates(startDateString: any, endDateString: any): boolean {
  const startDate = new Date(startDateString)
  const endDate = new Date(endDateString)

  if (endDate < startDate) {
    return false
  } else {
    return true
  }
}

export function isCPF(input: string): boolean {
  const cpf = input.replace(/\D/g, '')

  if (cpf.length !== 11) {
    return false
  }

  if (/^(\d)\1+$/.test(cpf)) {
    return false
  }

  let sum = 0
  let remainder

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) {
    remainder = 0
  }
  if (remainder !== parseInt(cpf.substring(9, 10))) {
    return false
  }

  sum = 0
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) {
    remainder = 0
  }
  if (remainder !== parseInt(cpf.substring(10, 11))) {
    return false
  }

  return true
}

export function isCNPJ(cnpj: string): boolean {
  const regexCNPJ = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/

  if (!regexCNPJ.test(cnpj)) {
    return false
  }

  return true
}
