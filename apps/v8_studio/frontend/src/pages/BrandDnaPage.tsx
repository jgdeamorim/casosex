import React from "react";
import ForwardedIconComponent from "@/components/common/genericIconComponent";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const BrandDnaPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-background/50 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span>Brand DNA & Elenco Digital (M2)</span>
            <span className="rounded-md bg-pink-500/10 px-2 py-0.5 text-xs font-semibold text-pink-400 border border-pink-500/20">
              Creative Studio
            </span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Gestão da identidade de marca, tom de voz e sementes visuais determinísticas do CASOSEX.
          </p>
        </div>

        <Button
          onClick={() => navigate("/flows")}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md"
        >
          <ForwardedIconComponent name="Sparkles" className="mr-2 h-4 w-4" />
          Abrir Canvas Visual de Nós
        </Button>
      </div>

      {/* Digital Cast Seeds Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <ForwardedIconComponent name="Users" className="h-4 w-4 text-pink-400" />
          <span>Elenco Digital CASOSEX (Sementes GPU Determinísticas)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: "Semente Elena (Elegância & Dicas)", seed: "892019482", style: "Estética Sofisticada, Iluminação Quente, Foco em Rosto/Expressão" },
            { name: "Semente Sofia (Lifestyle & Auto-Cuidado)", seed: "740192841", style: "Ambientes Luminosos, Cores Pastéis, Linguagem Próxima" },
            { name: "Semente Marc (Showcase Masculino)", seed: "109384729", style: "Design Minimalista, Contrastes Elegantes, Tons Sobres" },
            { name: "Semente Clara (Dúvidas & Tabus)", seed: "449281048", style: "Ambiente Acolhedor, Iluminação Suave, Foco em Empatia" },
          ].map((cast) => (
            <div
              key={cast.seed}
              className="rounded-xl border border-border/60 bg-card p-4 space-y-3 shadow-xs hover:border-pink-500/40 transition-all"
            >
              <div className="flex h-32 w-full items-center justify-center rounded-lg bg-gradient-to-br from-purple-900/30 via-secondary/40 to-pink-900/20 border border-border/30">
                <ForwardedIconComponent name="UserCheck" className="h-10 w-10 text-pink-400/80" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{cast.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{cast.style}</p>
              </div>
              <div className="flex items-center justify-between border-t border-border/30 pt-2 font-mono text-[10px] text-muted-foreground">
                <span>D1 Seed:</span>
                <span className="text-pink-400 font-semibold">{cast.seed}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandDnaPage;
