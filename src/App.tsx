/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, History, Trash2, Settings2, CheckCircle2 } from 'lucide-react';

interface DrawResult {
  id: string;
  numbers: number[];
  timestamp: Date;
}

export default function App() {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [history, setHistory] = useState<DrawResult[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [count, setCount] = useState(6);
  const [showHistory, setShowHistory] = useState(false);

  const drawNumbers = useCallback(() => {
    setIsDrawing(true);
    
    // Simulate a drawing animation delay
    setTimeout(() => {
      const drawn: number[] = [];
      while (drawn.length < count) {
        const num = Math.floor(Math.random() * 60) + 1;
        if (!drawn.includes(num)) {
          drawn.push(num);
        }
      }
      const sorted = drawn.sort((a, b) => a - b);
      setNumbers(sorted);
      
      const newResult: DrawResult = {
        id: Math.random().toString(36).substr(2, 9),
        numbers: sorted,
        timestamp: new Date(),
      };
      
      setHistory(prev => [newResult, ...prev].slice(0, 10)); // Keep last 10
      setIsDrawing(false);
    }, 800);
  }, [count]);

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#1a1a1a] font-sans selection:bg-emerald-100">
      {/* Header */}
      <header className="max-w-4xl mx-auto pt-12 px-6 flex justify-between items-end border-b border-black/5 pb-6">
        <div>
          <h1 className="text-4xl font-medium tracking-tight font-serif italic">Sorteador</h1>
          <p className="text-sm text-black/40 mt-1 uppercase tracking-widest font-medium">Números de 01 a 60</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 rounded-full hover:bg-black/5 transition-colors relative"
            title="Histórico"
          >
            <History size={20} />
            {history.length > 0 && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full" />
            )}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Controls */}
          <section className="space-y-8">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-black/50">
                <Settings2 size={14} />
                Quantidade de Números
              </label>
              <div className="flex gap-2">
                {[6, 7, 8, 9, 10].map((n) => (
                  <button
                    key={n}
                    onClick={() => setCount(n)}
                    className={`flex-1 py-2 rounded-lg border transition-all ${
                      count === n 
                        ? 'bg-black text-white border-black shadow-lg shadow-black/10' 
                        : 'bg-white border-black/10 hover:border-black/30'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={drawNumbers}
              disabled={isDrawing}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white py-4 rounded-2xl font-medium shadow-xl shadow-emerald-900/10 transition-all flex items-center justify-center gap-3 group"
            >
              <RefreshCw className={`transition-transform duration-700 ${isDrawing ? 'animate-spin' : 'group-hover:rotate-180'}`} size={20} />
              {isDrawing ? 'Sorteando...' : 'Sortear Números'}
            </button>

            {numbers.length > 0 && !isDrawing && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-3 text-emerald-700 text-sm"
              >
                <CheckCircle2 size={18} />
                <span>Sorteio realizado com sucesso!</span>
              </motion.div>
            )}
          </section>

          {/* Result Area */}
          <section className="md:col-span-2 min-h-[300px] flex flex-col items-center justify-center bg-white rounded-[32px] shadow-sm border border-black/5 p-8 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {isDrawing ? (
                <motion.div
                  key="drawing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-wrap justify-center gap-4"
                >
                  {Array.from({ length: count }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 1, 0.3]
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 0.6, 
                        delay: i * 0.1 
                      }}
                      className="w-16 h-16 rounded-full bg-black/5 border border-dashed border-black/20 flex items-center justify-center"
                    />
                  ))}
                </motion.div>
              ) : numbers.length > 0 ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-wrap justify-center gap-4 md:gap-6"
                >
                  {numbers.map((num, i) => (
                    <motion.div
                      key={`${num}-${i}`}
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 260, 
                        damping: 20,
                        delay: i * 0.05 
                      }}
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white border-2 border-black flex items-center justify-center text-2xl md:text-3xl font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    >
                      {num.toString().padStart(2, '0')}
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center space-y-4"
                >
                  <div className="w-24 h-24 rounded-full bg-black/5 mx-auto flex items-center justify-center">
                    <RefreshCw size={40} className="text-black/10" />
                  </div>
                  <p className="text-black/30 font-medium italic serif">Pronto para o próximo sorteio?</p>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>

        {/* History Drawer/Section */}
        <AnimatePresence>
          {showHistory && (
            <motion.section
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-12 overflow-hidden"
            >
              <div className="bg-white rounded-[32px] border border-black/5 p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-serif italic">Últimos Sorteios</h2>
                  {history.length > 0 && (
                    <button 
                      onClick={clearHistory}
                      className="text-xs font-semibold uppercase tracking-wider text-red-500 hover:text-red-600 flex items-center gap-2"
                    >
                      <Trash2 size={14} />
                      Limpar Histórico
                    </button>
                  )}
                </div>

                {history.length > 0 ? (
                  <div className="space-y-4">
                    {history.map((item) => (
                      <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl bg-black/[0.02] border border-black/5 gap-4">
                        <div className="flex flex-wrap gap-2">
                          {item.numbers.map((n) => (
                            <span key={n} className="w-8 h-8 rounded-full bg-white border border-black/10 flex items-center justify-center text-xs font-bold">
                              {n.toString().padStart(2, '0')}
                            </span>
                          ))}
                        </div>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-black/30">
                          {item.timestamp.toLocaleTimeString()} - {item.timestamp.toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-12 text-black/30 italic">Nenhum sorteio registrado ainda.</p>
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <footer className="max-w-4xl mx-auto px-6 py-12 text-center text-[10px] uppercase tracking-[0.2em] font-bold text-black/20">
        Boa sorte em seus jogos!
      </footer>
    </div>
  );
}
