import type { Supplier } from '../types';

export type Polo = 'TODOS' | 'SP' | 'RJ';

export function matchesPolo(supplier: Supplier, polo: Polo): boolean {
  if (polo === 'TODOS') return true;
  if (polo === 'SP') {
    return (
      supplier.state === 'SP' ||
      supplier.city.includes('São Paulo') ||
      supplier.city.includes('Diadema')
    );
  }
  return supplier.state === 'RJ' || supplier.city.includes('Rio de Janeiro');
}

export function filterSuppliers(
  suppliers: Supplier[],
  opts: { polo: Polo; search?: string; category?: string }
): Supplier[] {
  const search = (opts.search ?? '').trim().toLowerCase();
  const category = opts.category ?? 'TODAS';

  return suppliers.filter(s => {
    if (!matchesPolo(s, opts.polo)) return false;
    if (category !== 'TODAS' && s.category !== category) return false;
    if (search) {
      const hay = `${s.name} ${s.category} ${s.city}`.toLowerCase();
      if (!hay.includes(search)) return false;
    }
    return true;
  });
}

export function uniqueCategories(suppliers: Supplier[]): string[] {
  return Array.from(new Set(suppliers.map(s => s.category))).filter(Boolean);
}
