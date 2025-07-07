"use client";
import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface CountdownProps {
  targetDate?: Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Countdown: React.FC<CountdownProps> = ({
  targetDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      } else {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [targetDate]);

  const timeUnits = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="flex items-center space-x-2 text-primary/80 dark:text-primary-light">
        <Clock className="w-6 h-6 animate-pulse-slow" />
        <span className="text-lg font-medium">Launching Soon</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {timeUnits.map((unit, index) => (
          <div
            key={unit.label}
            className="flex flex-col items-center p-6 bg-neutral-100 dark:bg-neutral-900/80 backdrop-blur-sm rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-xl animate-scale-in hover:scale-105 transition-transform duration-300"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 animate-glow">
              {unit.value.toString().padStart(2, "0")}
            </div>
            <div className="text-sm md:text-base text-neutral-700 dark:text-neutral-300 font-medium uppercase tracking-wider">
              {unit.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Countdown;
