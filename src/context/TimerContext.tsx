import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundJob from 'react-native-background-actions';

const TimerContext = createContext<any>({});

const formatTime = (totalSeconds: number) => {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Task de background atualizada para ler o tempo real via closure/ref indireta
const timerBackgroundPath = async (taskData: any) => {
  await new Promise(async (resolve) => {
    while (BackgroundJob.isRunning()) {
      await BackgroundJob.updateNotification({
        taskDesc: `O tempo é dinheiro! 💩`, 
        
      });
      await new Promise((r) => setTimeout(r, 2000));
    }
  });
};

export const TimerProvider = ({ children }) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const appState = useRef(AppState.currentState);
  const startTimeRef = useRef<number | null>(null);

  // Controle do Background Service
  useEffect(() => {
    const toggleBackground = async () => {
      try {
        if (isActive) {
          if (!BackgroundJob.isRunning()) {
            await BackgroundJob.start(timerBackgroundPath, {
              taskName: 'CagacoinsTimer',
              taskTitle: 'Contagem no Trono 💩',
              taskDesc: 'Você está lucrando...',
              taskIcon: { name: 'ic_launcher', type: 'mipmap' }, 
              color: '#3B2416',
              linkingURI: 'cagacoins://home', 
              parameters: { delay: 2000 },
              notificationImportance: 4,
            });
          }
        } else {
          if (BackgroundJob.isRunning()) {
            await BackgroundJob.stop();
          }
        }
      } catch (e) {
        console.log('Erro BackgroundJob:', e);
      }
    };
    toggleBackground();
  }, [isActive]);

  // Cronômetro Principal
  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  // Sincronização Delta Time
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextStatus: AppStateStatus) => {
      if (isActive) {
        if (nextStatus === 'background' || nextStatus === 'inactive') {
          startTimeRef.current = Date.now();
          await AsyncStorage.setItem('@last_tick', Date.now().toString());
        } 
        
        if (appState.current.match(/inactive|background/) && nextStatus === 'active') {
          const lastTick = await AsyncStorage.getItem('@last_tick');
          const exitTime = lastTick ? parseInt(lastTick) : startTimeRef.current;
          
          if (exitTime) {
            const now = Date.now();
            const diff = Math.floor((now - exitTime) / 1000);
            setSeconds((prev) => prev + diff);
          }
          startTimeRef.current = null;
        }
      }
      appState.current = nextStatus;
    });

    return () => subscription.remove();
  }, [isActive]);

  return (
    <TimerContext.Provider value={{ seconds, setSeconds, isActive, setIsActive, formatTime }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => useContext(TimerContext);