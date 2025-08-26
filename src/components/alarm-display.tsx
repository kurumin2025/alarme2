"use client";

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { AlarmClockOff, Timer } from "lucide-react";

interface AlarmDisplayProps {
  alarmTime: Date;
  countdown: number | null;
  onCancel: () => void;
}

function formatCountdown(milliseconds: number | null): string {
    if (milliseconds === null || milliseconds < 0) {
        return "00:00:00";
    }
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}


export function AlarmDisplay({ alarmTime, countdown, onCancel }: AlarmDisplayProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center space-y-4 text-center p-4 bg-primary/10 rounded-xl border border-primary/20">
      <div className="font-headline text-lg text-primary-foreground/80">
        Alarme definido para {format(alarmTime, "HH:mm")}
      </div>
      <div className="flex items-center text-4xl sm:text-5xl font-mono text-primary-foreground font-semibold tracking-widest" style={{textShadow: '0 0 8px hsl(var(--primary))'}}>
          <Timer className="mr-2 h-8 w-8" />
          <span>{formatCountdown(countdown)}</span>
      </div>
      <Button onClick={onCancel} variant="ghost" size="sm" className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-full">
        <AlarmClockOff className="mr-2 h-4 w-4" />
        Cancelar Alarme
      </Button>
    </div>
  );
}
