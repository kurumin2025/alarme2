"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Sparkles, Loader2 } from 'lucide-react';
import { suggestSleepSound, type SuggestSleepSoundOutput } from '@/ai/flows/suggest-sleep-sound';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface AiAdvisorProps {
  selectedSound: string;
}

export function AiAdvisor({ selectedSound }: AiAdvisorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SuggestSleepSoundOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetAdvice = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await suggestSleepSound({ selectedWakeUpSound: selectedSound });
      setResult(response);
    } catch (err) {
      setError('An error occurred while getting advice. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full rounded-full bg-accent/50 hover:bg-accent border-accent/50 text-accent-foreground">
          <Sparkles className="mr-2 h-4 w-4" />
          Obter conselhos sobre o sono
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Conselheiro de Sono AI</DialogTitle>
          <DialogDescription>
            Obtenha conselhos personalizados sobre sua seleção de som de despertar para melhorar a qualidade do seu sono.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <p>Analisando suas preferências...</p>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : result ? (
            <div className="space-y-4 text-sm">
                <p className='font-medium'>Com base na sua seleção de "{selectedSound}", aqui está uma análise:</p>
                <p className="p-4 bg-muted/50 rounded-md border">{result.analysis}</p>
            </div>
          ) : (
             <div className="text-center text-muted-foreground">Clique no botão abaixo para obter seu conselho.</div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleGetAdvice} disabled={isLoading} className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Analisar meu som de despertar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
