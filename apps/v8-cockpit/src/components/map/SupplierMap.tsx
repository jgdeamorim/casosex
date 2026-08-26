import React, { useEffect, useRef } from 'react';
import { useRenderContext } from '../../context/RenderContext';
import type { Supplier } from '../../types';

export function SupplierMap(): React.ReactElement {
  const { suppliers, selectedPolo, selectedSupplier, selectSupplier } = useRenderContext();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  const filteredSuppliers = suppliers.filter(s => {
    if (selectedPolo === 'SP') return s.state === 'SP' || s.city.includes('São Paulo') || s.city.includes('Diadema');
    if (selectedPolo === 'RJ') return s.state === 'RJ' || s.city.includes('Rio de Janeiro');
    return true;
  });

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    async function initMap(): Promise<void> {
      try {
        const L = await import('leaflet');
        if (!mapRef.current) return;

        const map = L.map(mapRef.current, {
          center: [-23.5505, -46.6333],
          zoom: 7,
          zoomControl: false
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; CartoDB &copy; OpenStreetMap',
          maxZoom: 18
        }).addTo(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        markersRef.current = L.layerGroup().addTo(map);
        leafletMapRef.current = map;
      } catch (e: unknown) {
        void e;
      }
    }

    void initMap();

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!leafletMapRef.current || !markersRef.current) return;

    async function updateMarkers(): Promise<void> {
      const L = await import('leaflet');
      if (!markersRef.current || !leafletMapRef.current) return;

      markersRef.current.clearLayers();

      filteredSuppliers.forEach(supplier => {
        const lat = supplier.latitude || supplier.lat;
        const lng = supplier.longitude || supplier.lng;

        if (!lat || !lng) return;

        const isSelected = selectedSupplier?.id === supplier.id;
        const color = supplier.status === 'HOMOLOGADO' ? '#30d158' : supplier.status === 'VISITA_PENDENTE' ? '#eab308' : '#e11d48';

        const customIcon = L.divIcon({
          className: 'custom-leaflet-pin',
          html: `<div style="
            width: ${isSelected ? '22px' : '14px'};
            height: ${isSelected ? '22px' : '14px'};
            background: ${color};
            border: 2px solid #ffffff;
            border-radius: 50%;
            box-shadow: 0 0 12px ${color};
            transition: all 0.3s ease;
          "></div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker([lat, lng], { icon: customIcon });

        const popupContent = `
          <div style="font-family: sans-serif; padding: 4px;">
            <p style="font-size: 10px; font-weight: 700; color: #a39b94; text-transform: uppercase;">${supplier.category}</p>
            <h4 style="font-size: 13px; font-weight: 800; color: #faf7f5; margin: 2px 0;">${supplier.name}</h4>
            <p style="font-size: 11px; color: #a39b94; margin-bottom: 6px;">📍 ${supplier.city} - ${supplier.state}</p>
            <span class="badge-status ${supplier.status}">${supplier.status.replace('_', ' ')}</span>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('click', () => selectSupplier(supplier));
        markersRef.current?.addLayer(marker);
      });
    }

    void updateMarkers();
  }, [filteredSuppliers, selectedSupplier, selectSupplier]);

  // Pan map when selectedSupplier changes
  useEffect(() => {
    if (!leafletMapRef.current || !selectedSupplier) return;
    const lat = selectedSupplier.latitude || selectedSupplier.lat;
    const lng = selectedSupplier.longitude || selectedSupplier.lng;
    if (lat && lng) {
      leafletMapRef.current.flyTo([lat, lng], 13, { duration: 1.2 });
    }
  }, [selectedSupplier]);

  return (
    <div id="supplier-map-container" className="relative rounded-2xl overflow-hidden glass-panel border border-white/10 h-[450px] shadow-2xl">
      <div className="absolute top-4 left-4 z-10 bg-[#0c0a0b]/90 backdrop-blur-md p-3 rounded-xl border border-white/10 text-xs flex items-center gap-3">
        <span className="font-bold text-[#faf7f5]">Polo Ativo:</span>
        <span className="px-2 py-0.5 rounded bg-[#e11d48]/20 text-[#e11d48] font-bold border border-[#e11d48]/30">
          {selectedPolo} ({filteredSuppliers.length} Unidades)
        </span>
      </div>

      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
