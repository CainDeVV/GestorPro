/**
 * Utilitário para tratar valores null/undefined de forma segura
 */

/**
 * Retorna um valor padrão se o valor for null ou undefined
 * @param value - O valor a ser verificado
 * @param defaultValue - O valor padrão a ser retornado se o valor for null/undefined
 * @returns O valor original ou o valor padrão
 */
export const safeValue = (value: any, defaultValue: any = 0): any => {
  return value === null || value === undefined ? defaultValue : value;
};

/**
 * Retorna um valor numérico seguro para cálculos
 * @param value - O valor a ser convertido
 * @param defaultValue - O valor padrão (padrão: 0)
 * @returns O valor numérico ou o valor padrão
 */
export const safeNumber = (value: any, defaultValue: number = 0): number => {
  const num = parseFloat(value);
  return isNaN(num) ? defaultValue : num;
};

/**
 * Retorna um valor de string seguro
 * @param value - O valor a ser convertido
 * @param defaultValue - O valor padrão (padrão: '')
 * @returns O valor string ou o valor padrão
 */
export const safeString = (value: any, defaultValue: string = ''): string => {
  return value === null || value === undefined ? defaultValue : String(value);
};

/**
 * Formata um valor monetário de forma segura
 * @param value - O valor a ser formatado
 * @param defaultValue - O valor padrão (padrão: 0)
 * @returns String formatada como moeda brasileira
 */
export const safeCurrency = (value: any, defaultValue: number = 0): string => {
  const num = safeNumber(value, defaultValue);
  return `R$ ${num.toFixed(2).replace('.', ',')}`;
};

/**
 * Verifica se um valor é válido (não null, undefined ou string vazia)
 * @param value - O valor a ser verificado
 * @returns true se o valor for válido, false caso contrário
 */
export const isValidValue = (value: any): boolean => {
  return value !== null && value !== undefined && value !== '';
}; 