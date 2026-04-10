/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Wizard } from './components/Wizard';
import { Dashboard } from './components/Dashboard';
import { AppState } from './types';
import { generateStrategy } from './services/gemini';
import { Loader2, Globe, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { translations } from './translations';

export default function App() {
  const [appState, setAppState] = useState<AppState | null>(null);
  const [strategy, setStrategy] = useState<any>(null);
  const [isGeneratingStrategy, setIsGeneratingStrategy] = useState(false);
  const [interfaceLang, setInterfaceLang] = useState<'English' | 'Arabic'>('English');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [colorMood, setColorMood] = useState<'default' | 'soft' | 'aggressive' | 'girly'>('default');

  const t = translations[interfaceLang === 'Arabic' ? 'ar' : 'en'];

  useEffect(() => {
    document.documentElement.dir = interfaceLang === 'Arabic' ? 'rtl' : 'ltr';
    document.documentElement.lang = interfaceLang === 'Arabic' ? 'ar' : 'en';
  }, [interfaceLang]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    // Remove all theme classes first
    document.documentElement.classList.remove('theme-soft', 'theme-aggressive', 'theme-girly');
    if (colorMood !== 'default') {
      document.documentElement.classList.add(`theme-${colorMood}`);
    }
  }, [colorMood]);

  const handleWizardComplete = async (state: AppState) => {
    setAppState({ ...state, interfaceLanguage: interfaceLang });
    setIsGeneratingStrategy(true);
    try {
      const generatedStrategy = await generateStrategy({ ...state, interfaceLanguage: interfaceLang });
      setStrategy(generatedStrategy);
    } catch (error) {
      console.error("Failed to generate strategy:", error);
    } finally {
      setIsGeneratingStrategy(false);
    }
  };

  const handleReset = () => {
    setAppState(null);
    setStrategy(null);
  };

  const toggleLanguage = () => {
    setInterfaceLang(prev => prev === 'English' ? 'Arabic' : 'English');
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-primary/20 transition-colors duration-300">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10" dir="ltr">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
              S
            </div>
            <span className="font-bold text-xl tracking-tight">{t.appName}</span>
          </div>
          <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-full border">
            {[
              { id: 'default', color: 'bg-black', label: t.colorMoods['Default'] },
              { id: 'soft', color: 'bg-[#1E90FF]', label: t.colorMoods['Soft'] },
              { id: 'aggressive', color: 'bg-[#FF2800]', label: t.colorMoods['Aggressive'] },
              { id: 'girly', color: 'bg-[#FF6EC7]', label: t.colorMoods['Girly'] },
            ].map((mood) => (
              <button
                key={mood.id}
                onClick={() => setColorMood(mood.id as any)}
                title={mood.label}
                className={`w-6 h-6 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center ${
                  colorMood === mood.id ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <div className={`w-4 h-4 rounded-full ${mood.color}`} />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleLanguage} className="gap-2 rounded-full px-3">
              <Globe className="w-4 h-4" />
              {interfaceLang === 'English' ? 'عربي' : 'English'}
            </Button>
          </div>
        </div>
      </header>

      <main className="py-8">
        <AnimatePresence mode="wait">
          {!appState ? (
            <motion.div
              key="wizard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Wizard onComplete={handleWizardComplete} interfaceLang={interfaceLang} />
            </motion.div>
          ) : isGeneratingStrategy ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-[60vh] flex flex-col items-center justify-center space-y-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <Loader2 className="w-16 h-16 animate-spin text-primary relative z-10" />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">{t.analyzingBrand}</h2>
                <p className="text-muted-foreground">{t.craftingStrategy} {appState.brandName}</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Dashboard state={appState} strategy={strategy} onReset={handleReset} interfaceLang={interfaceLang} />
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="mt-4 text-center space-y-1">
          <a 
            href="https://wa.me/201144240400" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary/60 hover:text-primary hover:underline transition-all"
          >
            Powered by A³ Solutions
          </a>
          <p className="text-[10px] text-primary/40 tracking-wider uppercase font-bold">
            Smart Solutions - Real Impact
          </p>
        </footer>
      </main>
    </div>
  );
}
