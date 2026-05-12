// ===================================================================
// ATENÇÃO: Lembre-se de substituir 'SEU_IP_AQUI' pelo endereço IP 
// do computador que está rodando o backend! Ex: 'http://192.168.1.10:8000'
// ===================================================================
export const BASE_URL = 'http://localhost:8000';

/**
 * Função auxiliar para lidar com as respostas e erros da API de forma padronizada.
 */
export async function handleResponse<T>(response: Response): Promise<T> {
  console.log('=== HANDLE RESPONSE ===');
  console.log('Status:', response.status);
  console.log('OK:', response.ok);
  console.log('URL:', response.url);
  
  if (!response.ok) {
    console.log('Resposta não OK, tentando ler erro...');
    const error = await response.json().catch(() => ({ detail: 'Erro de comunicação com o servidor' }));
    console.log('Erro lido:', error);
    // Lança um erro com a mensagem vinda do backend, ou uma mensagem padrão
    throw new Error(error.detail || 'Ocorreu um erro no servidor');
  }
  
  console.log('Resposta OK, tentando ler JSON...');
  const data = await response.json();
  console.log('Dados lidos:', data);
  return data;
}

/**
 * Função genérica para fazer as chamadas fetch para a nossa API.
 */
export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const fullUrl = `${BASE_URL}${endpoint}`;
    console.log(`=== API FETCH ===`);
    console.log(`URL completa: ${fullUrl}`);
    console.log(`Método: ${options?.method || 'GET'}`);
    console.log('Opções da requisição:', options);
    
    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options?.headers,
      },
    });
    
    console.log('Status da resposta:', response.status);
    console.log('Headers da resposta:', response.headers);
    console.log('URL da resposta:', response.url);
    
    return handleResponse<T>(response);
  } catch (error: unknown) {
    // Captura erros de rede (ex: servidor offline)
    console.error('=== API FETCH ERROR ===');
    console.error('Erro completo:', error);
    console.error('URL da requisição:', `${BASE_URL}${endpoint}`);
    console.error('Opções da requisição:', options);
    
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Erro de conexão. Verifique se o servidor está rodando e acessível.');
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    throw new Error(`Erro na requisição: ${errorMessage}`);
  }
} 