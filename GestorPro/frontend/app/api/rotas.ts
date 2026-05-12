import { Route } from '../../types';
import { apiFetch } from './config';

// --- FUNÇÕES DE ROTAS ---
export const getRoutes = () => apiFetch<Route[]>('/rotas/');

export const getRouteById = (id: number) => apiFetch<Route>(`/rotas/${id}`);

export const getRouteByName = (nome: string) => apiFetch<Route>(`/rotas/nome/${nome}`);

export const addRoute = (routeData: Route) => {
  console.log('Dados da rota sendo enviados:', routeData);
  return apiFetch<Route>('/rotas/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(routeData),
  });
};

export const updateRouteById = (id: number, routeData: Partial<Route>) => apiFetch<Route>(`/rotas/${id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(routeData),
});

export const updateRouteByName = (nome: string, routeData: Partial<Route>) => apiFetch<Route>(`/rotas/nome/${nome}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(routeData),
});

// Função para deletar uma rota por ID
export const deleteRouteById = (id: number) => apiFetch<any>(`/rotas/${id}`, {
  method: 'DELETE',
});

// Função para deletar uma rota por nome
export const deleteRouteByName = (nome: string) => apiFetch<any>(`/rotas/nome/${nome}`, {
  method: 'DELETE',
});

// Função para deletar múltiplas rotas - deleta uma por uma
export const deleteRoutes = async (ids: (string | number)[]) => {
  const results = await Promise.allSettled(
    ids.map(id => deleteRouteById(typeof id === 'string' ? parseInt(id) : id))
  );
  
  // Verifica se houve algum erro
  const errors = results
    .map((result, index) => result.status === 'rejected' ? ids[index] : null)
    .filter(Boolean);
  
  if (errors.length > 0) {
    throw new Error(`Erro ao deletar rotas: ${errors.join(', ')}`);
  }
  
  return results;
}; 