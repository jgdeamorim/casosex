import React, { useState, useEffect } from "react";
import ForwardedIconComponent from "@/components/common/genericIconComponent";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export interface CharacterItem {
  id: string;
  name: string;
  description: string;
  faceReferenceUrls: string;
  fixedSeed: number;
  createdAt: string;
}

const DEFAULT_CHARACTERS: CharacterItem[] = [
  {
    id: "char-valentina-01",
    name: "Valentina Volúpia (Aura Élite)",
    description: "Modelo de referência soberana para conteúdos de luxo sensual e alta perfumaria.",
    faceReferenceUrls: "[]",
    fixedSeed: 884719203,
    createdAt: new Date().toISOString(),
  },
  {
    id: "char-sophia-02",
    name: "Sophia Lingerie (Especialista em Fit)",
    description: "Personagem voltada para vídeos educativos de caimento de lingerie e consultoria corporal.",
    faceReferenceUrls: "[]",
    fixedSeed: 412093847,
    createdAt: new Date().toISOString(),
  },
  {
    id: "char-hector-03",
    name: "Hector Noir (Linha Masculina / Par)",
    description: "Personagem masculino de apoio para campanhas de casais e fragrâncias intensas.",
    faceReferenceUrls: "[]",
    fixedSeed: 902318471,
    createdAt: new Date().toISOString(),
  },
  {
    id: "char-clara-04",
    name: "Clara Empatia (Dúvidas & Tabus)",
    description: "Ambiente acolhedor, iluminação suave, foco em empatia e conexão humana.",
    faceReferenceUrls: "[]",
    fixedSeed: 449281048,
    createdAt: new Date().toISOString(),
  },
];

export const BrandDnaPage: React.FC = () => {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<CharacterItem[]>(DEFAULT_CHARACTERS);
  const [copiedSeed, setCopiedSeed] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newSeed, setNewSeed] = useState<string>("");

  useEffect(() => {
    let isMounted = true;
    const fetchCharacters = async () => {
      try {
        const response = await fetch("/api/v1/characters");
        if (response.ok) {
          const json = await response.json();
          if (isMounted && json.success && Array.isArray(json.data) && json.data.length > 0) {
            setCharacters(json.data);
          }
        }
      } catch (e: unknown) {
        void e;
      }
    };
    void fetchCharacters();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCopySeed = (seed: number) => {
    void navigator.clipboard.writeText(seed.toString());
    setCopiedSeed(seed);
    setTimeout(() => setCopiedSeed(null), 2000);
  };

  const handleCreateCharacter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setIsLoading(true);
    const parsedSeed = newSeed ? parseInt(newSeed, 10) : Math.floor(Math.random() * 1000000000);

    const payload = {
      name: newName.trim(),
      description: newDesc.trim() || "Personagem autônomo do elenco CASOSEX.",
      fixedSeed: isNaN(parsedSeed) ? Math.floor(Math.random() * 1000000000) : parsedSeed,
      faceReferenceUrls: "[]",
    };

    try {
      const response = await fetch("/api/v1/characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          setCharacters((prev) => [json.data, ...prev]);
        }
      } else {
        // Fallback local update
        const localChar: CharacterItem = {
          id: `char-local-${Date.now()}`,
          name: payload.name,
          description: payload.description,
          faceReferenceUrls: payload.faceReferenceUrls,
          fixedSeed: payload.fixedSeed,
          createdAt: new Date().toISOString(),
        };
        setCharacters((prev) => [localChar, ...prev]);
      }
    } catch (e: unknown) {
      void e;
      const localChar: CharacterItem = {
        id: `char-local-${Date.now()}`,
        name: payload.name,
        description: payload.description,
        faceReferenceUrls: payload.faceReferenceUrls,
        fixedSeed: payload.fixedSeed,
        createdAt: new Date().toISOString(),
      };
      setCharacters((prev) => [localChar, ...prev]);
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
      setNewName("");
      setNewDesc("");
      setNewSeed("");
    }
  };

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-background/50 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span>Brand DNA & Elenco Digital (M2)</span>
            <span className="rounded-md bg-pink-500/10 px-2 py-0.5 text-xs font-semibold text-pink-400 border border-pink-500/20">
              Creative Studio OS
            </span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Gestão da identidade de marca, tom de voz e sementes visuais determinísticas do CASOSEX.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="outline"
            className="border-pink-500/30 text-pink-400 hover:bg-pink-500/10"
          >
            <ForwardedIconComponent name="Plus" className="mr-2 h-4 w-4" />
            Novo Personagem
          </Button>

          <Button
            onClick={() => navigate("/flows")}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md"
          >
            <ForwardedIconComponent name="Sparkles" className="mr-2 h-4 w-4" />
            Abrir Canvas Visual
          </Button>
        </div>
      </div>

      {/* Brand Identity Tokens Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border/60 bg-card p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <ForwardedIconComponent name="Sparkles" className="h-4 w-4 text-purple-400" />
            <span>Tom de Voz</span>
          </div>
          <p className="text-sm text-foreground font-medium">Sensual Esofisticado & Acolhedor</p>
          <p className="text-xs text-muted-foreground">
            Comunicação empática, livre de tabus, focada na elegância e na experiência do cliente.
          </p>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <ForwardedIconComponent name="Palette" className="h-4 w-4 text-pink-400" />
            <span>Paleta Visual</span>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className="h-5 w-5 rounded-full bg-purple-900 border border-purple-400/30" title="Purple Velvet" />
            <span className="h-5 w-5 rounded-full bg-pink-500 border border-pink-400/30" title="Volúpia Pink" />
            <span className="h-5 w-5 rounded-full bg-slate-900 border border-slate-700" title="Obsidian Black" />
            <span className="h-5 w-5 rounded-full bg-amber-200 border border-amber-300/40" title="Champagne Gold" />
          </div>
          <p className="text-xs text-muted-foreground pt-1">
            High-contrast dark theme com iluminação difusa cinematográfica.
          </p>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <ForwardedIconComponent name="ShieldCheck" className="h-4 w-4 text-emerald-400" />
            <span>Governança GPU (D1)</span>
          </div>
          <p className="text-sm text-foreground font-medium">Sementes Determinísticas Ativas</p>
          <p className="text-xs text-muted-foreground">
            Garantia de consistência facial entre sessões de renderização no Vast.ai.
          </p>
        </div>
      </div>

      {/* Digital Cast Seeds Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <ForwardedIconComponent name="Users" className="h-4 w-4 text-pink-400" />
            <span>Elenco Digital CASOSEX ({characters.length} Personagens Registrados)</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {characters.map((cast) => (
            <div
              key={cast.id}
              className="rounded-xl border border-border/60 bg-card p-4 space-y-3 shadow-xs hover:border-pink-500/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="relative flex h-32 w-full items-center justify-center rounded-lg bg-gradient-to-br from-purple-900/30 via-secondary/40 to-pink-900/20 border border-border/30 overflow-hidden">
                  <ForwardedIconComponent name="UserCheck" className="h-10 w-10 text-pink-400/80" />
                  <span className="absolute top-2 right-2 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/30">
                    GPU Ready
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground line-clamp-1">{cast.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{cast.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border/30 pt-3 font-mono text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span>D1 Seed:</span>
                  <span className="text-pink-400 font-semibold">{cast.fixedSeed}</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleCopySeed(cast.fixedSeed)}
                  className="rounded p-1 hover:bg-secondary text-xs text-muted-foreground hover:text-foreground transition-colors"
                  title="Copiar Semente"
                >
                  <ForwardedIconComponent
                    name={copiedSeed === cast.fixedSeed ? "Check" : "Copy"}
                    className={copiedSeed === cast.fixedSeed ? "h-3.5 w-3.5 text-emerald-400" : "h-3.5 w-3.5"}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal para Novo Personagem */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <ForwardedIconComponent name="UserPlus" className="h-5 w-5 text-pink-400" />
                <span>Adicionar Novo Personagem</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <ForwardedIconComponent name="X" className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCharacter} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Nome do Personagem / Papel</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Maya (Linha Wellness)"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full rounded-md border border-border/80 bg-background px-3 py-2 text-xs text-foreground focus:border-pink-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Descrição Estética & Estilo</label>
                <textarea
                  rows={3}
                  placeholder="Ex: Estética calorosa, tons terra, consultoria amorosa e bem-estar..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full rounded-md border border-border/80 bg-background px-3 py-2 text-xs text-foreground focus:border-pink-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Semente GPU Fixa (Opcional - Gerada se omitida)
                </label>
                <input
                  type="number"
                  placeholder="Ex: 884719203"
                  value={newSeed}
                  onChange={(e) => setNewSeed(e.target.value)}
                  className="w-full rounded-md border border-border/80 bg-background px-3 py-2 text-xs font-mono text-foreground focus:border-pink-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-pink-600 hover:bg-pink-500 text-white"
                >
                  {isLoading ? "Salvando..." : "Salvar no D1"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandDnaPage;

