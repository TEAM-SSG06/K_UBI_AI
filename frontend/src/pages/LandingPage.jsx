import React from 'react';
import { Shield, Zap, Database, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage({ onEnter }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-12 text-center">
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-primary mb-4 bg-primary/10">
            GovTech Production Release
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">
            Karnataka Unified Business Intelligence
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The high-integrity "Shadow Truth" layer connecting 40+ disparate State systems. 
            Resolve identities, monitor vitality, and enable actionable intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
          <div className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-all">
            <Shield className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Privacy-First Processing</h3>
            <p className="text-muted-foreground">
              Deterministically hashed PII and Bloom Filters ensure raw data never leaves the vault.
            </p>
          </div>
          <div className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-all">
            <Database className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Splink Resolution</h3>
            <p className="text-muted-foreground">
              Fellegi-Sunter probabilistic linkage powered by DuckDB resolves schema-less records instantly.
            </p>
          </div>
          <div className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-all">
            <Zap className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Activity Intelligence</h3>
            <p className="text-muted-foreground">
              Temporal pulse tracking assigns Life Points (LP) to infer Active, Dormant, or Closed statuses.
            </p>
          </div>
        </div>

        <div className="pt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <Button size="lg" onClick={onEnter} className="text-lg px-8 py-6 rounded-full group">
            Access Dashboard
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
