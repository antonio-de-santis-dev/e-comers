export interface ICategoria {
  id: number;
  nome?: string | null;
  descrizione?: string | null;
}

export type NewCategoria = Omit<ICategoria, 'id'> & { id: null };
