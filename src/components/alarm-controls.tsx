"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AlarmClock, Music } from 'lucide-react';
import { defaultSounds } from '@/lib/sounds';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';

export type Sound = {
  name: string;
  file: string;
  note?: 'C4' | 'D4' | 'E4' | 'F4' | 'G4';
};

interface AlarmControlsProps {
  onSetAlarm: (time: { hour: number; minute: number }, sound: Sound) => void;
}

export function AlarmControls({ onSetAlarm }: AlarmControlsProps) {
  const [time, setTime] = useState('07:00');
  const [sound, setSound] = useState<Sound>(defaultSounds[0]);
  const { toast } = useToast();

  const handleSetAlarm = () => {
    const [hour, minute] = time.split(':').map(Number);
    if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
        toast({
            title: "Hora inválida",
            description: "Por favor, insira a hora no formato HH:MM (e.g., 07:30).",
            variant: "destructive",
        })
        return;
    }
    onSetAlarm({ hour, minute }, sound);
  };

  const handleSoundChange = (soundName: string) => {
    const selected = defaultSounds.find(s => s.name === soundName) || defaultSounds[0];
    setSound(selected);
  }

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-muted-foreground font-headline">
          <AlarmClock className="h-4 w-4" />
          Definir Hora do Alarme
        </Label>
        <Input
            type="text"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="text-center text-lg tracking-widest text-2xl font-mono h-14"
            placeholder="HH:MM"
          />
      </div>
      
      <div className="space-y-2">
         <Label className="flex items-center gap-2 text-muted-foreground font-headline">
          <Music className="h-4 w-4" />
          Selecionar Som
        </Label>
        <Select value={sound.name} onValueChange={handleSoundChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecionar Som" />
          </SelectTrigger>
          <SelectContent>
            {defaultSounds.map((s) => (
              <SelectItem key={s.name} value={s.name}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleSetAlarm} className="w-full rounded-full font-bold text-lg py-6">
        Ativar Alarme
      </Button>
    </div>
  );
}
