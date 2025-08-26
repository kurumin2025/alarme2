"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { BellRing, History, BellOff } from 'lucide-react';

interface AlarmDialogProps {
  open: boolean;
  onStop: () => void;
  onSnooze: () => void;
  soundName: string;
}

export function AlarmDialog({ open, onStop, onSnooze, soundName }: AlarmDialogProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center text-2xl font-headline">
            <BellRing className="h-8 w-8 mr-4 text-primary animate-pulse" />
            Hora de Acordar!
          </AlertDialogTitle>
          <AlertDialogDescription>
            Seu alarme está tocando com o som: {soundName}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Button onClick={onSnooze} variant="outline" className="rounded-full">
            <History className="mr-2 h-4 w-4" />
            Soneca (9 min)
          </Button>
          <Button onClick={onStop} className="rounded-full">
            <BellOff className="mr-2 h-4 w-4" />
            Parar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
