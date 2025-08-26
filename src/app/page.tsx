"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import * as Tone from "tone";
import { addMinutes, set } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlarmControls, type Sound } from "@/components/alarm-controls";
import { AlarmDisplay } from "@/components/alarm-display";
import { AlarmDialog } from "@/components/alarm-dialog";
import { defaultSounds } from "@/lib/sounds";

export default function Home() {
  const [alarmTime, setAlarmTime] = useState<Date | null>(null);
  const [isAlarmSet, setIsAlarmSet] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const [selectedSound, setSelectedSound] = useState<Sound>(defaultSounds[0]);
  const [countdown, setCountdown] = useState<number | null>(null);

  const synth = useRef<Tone.Synth | null>(null);
  const loop = useRef<Tone.Loop | null>(null);

  useEffect(() => {
    synth.current = new Tone.Synth().toDestination();
  }, []);

  const playSound = useCallback(() => {
    if (synth.current) {
      Tone.start();
      const note = selectedSound.note || "C4";

      loop.current = new Tone.Loop(time => {
        synth.current?.triggerAttackRelease(note, '1s', time);
      }, '2s');
      
      loop.current.iterations = 3;
      loop.current.start(0);
      Tone.Transport.start();
    }
  }, [selectedSound]);

  const stopSound = useCallback(() => {
    if (loop.current) {
      loop.current.stop(0);
      loop.current.dispose();
      loop.current = null;
    }
    if (synth.current) {
      synth.current.triggerRelease();
    }
    Tone.Transport.stop();
  }, []);

  const handleSetAlarm = useCallback(
    (time: { hour: number; minute: number }, sound: Sound) => {
      const now = new Date();
      let alarmDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        time.hour,
        time.minute,
        0,
        0
      );

      if (alarmDate <= now) {
        alarmDate.setDate(alarmDate.getDate() + 1);
      }

      setAlarmTime(alarmDate);
      setSelectedSound(sound);
      setIsAlarmSet(true);
      setIsRinging(false);
    },
    []
  );

  const handleStop = useCallback(() => {
    setIsRinging(false);
    setIsAlarmSet(false);
    setAlarmTime(null);
    setCountdown(null);
    stopSound();
  }, [stopSound]);
  
  const handleSnooze = useCallback(() => {
    setIsRinging(false);
    stopSound();
    const snoozedTime = addMinutes(new Date(), 9);
    setAlarmTime(snoozedTime);
  }, [stopSound]);

  const handleCancel = useCallback(() => {
    setIsAlarmSet(false);
    setAlarmTime(null);
    setCountdown(null);
    if(isRinging) {
      handleStop();
    }
  }, [isRinging, handleStop]);


  useEffect(() => {
    if (!isAlarmSet || !alarmTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diff = alarmTime.getTime() - now.getTime();
      
      setCountdown(Math.max(0, diff));

      if (diff <= 0) {
        setIsRinging(true);
        playSound();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isAlarmSet, alarmTime, playSound]);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-background p-4 sm:p-8 font-body text-foreground">
      <div className="w-full max-w-sm sm:max-w-md mx-auto">
        <Card className="shadow-2xl rounded-3xl bg-card/80 backdrop-blur-md border-primary/20">
          <CardHeader>
            <CardTitle className="text-center font-headline text-3xl tracking-wider text-primary-foreground/90">
              Alarme
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-8 px-4 sm:px-6 pb-6">
            
            {isAlarmSet && alarmTime ? (
              <AlarmDisplay alarmTime={alarmTime} countdown={countdown} onCancel={handleCancel} />
            ) : (
              <AlarmControls onSetAlarm={handleSetAlarm} />
            )}
          </CardContent>
        </Card>
      </div>

      <AlarmDialog
        open={isRinging}
        onStop={handleStop}
        onSnooze={handleSnooze}
        soundName={selectedSound.name}
      />
    </main>
  );
}
