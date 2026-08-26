import type { Supplier } from '../types';

export interface FilterPayload {
  suppliers: Supplier[];
  polo: 'TODOS' | 'SP' | 'RJ';
  category: string;
  searchTerm: string;
}

self.onmessage = (event: MessageEvent<FilterPayload>) => {
  const { suppliers, polo, category, searchTerm } = event.data;

  const filtered = suppliers.filter(s => {
    const matchesPolo =
      polo === 'TODOS' ||
      (polo === 'SP' && (s.state === 'SP' || s.city.includes('São Paulo') || s.city.includes('Diadema'))) ||
      (polo === 'RJ' && (s.state === 'RJ' || s.city.includes('Rio de Janeiro')));

    const matchesCategory = category === 'TODOS' || s.category === category;

    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.city.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesPolo && matchesCategory && matchesSearch;
  });

  self.postMessage(filtered);
};
