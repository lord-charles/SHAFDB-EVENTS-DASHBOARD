"use client";

import React from "react";
import Countdown from "./Countdown";

interface ComingSoonProps {
  moduleName: string;
  description?: string;
  targetDate?: Date;
}

const ComingSoon: React.FC<ComingSoonProps> = ({
  moduleName,
  description,
  targetDate,
}) => {
  return (
    <div className="min-h-screen gradient-shelter flex items-center justify-center p-4 relative overflow-hidden dark:bg-neutral-950 bg-neutral-50">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
        {/* Theme-aware blurred circles */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-neutral-200 dark:bg-neutral-700 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div
          className="absolute top-40 right-20 w-96 h-96 bg-neutral-200 dark:bg-neutral-700 rounded-full mix-blend-multiply filter blur-xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute -bottom-20 left-40 w-80 h-80 bg-neutral-200 dark:bg-neutral-700 rounded-full mix-blend-multiply filter blur-xl animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Logo/Brand area */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 tracking-wide">
            SHELTER AFRIQUE
          </h1>
          <p className="text-neutral-700 dark:text-neutral-300 text-lg mb-4">
            Development Finance Institution
          </p>
          <div className="w-24 h-1 bg-neutral-400 dark:bg-neutral-600 mx-auto"></div>
        </div>

        {/* Main content */}
        <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-5xl md:text-7xl font-bold text-neutral-900 dark:text-neutral-100 mb-6 leading-tight">
            {moduleName}
          </h2>
          <div className="w-32 h-2 gradient-shelter mx-auto mb-8 rounded-full opacity-80"></div>
        </div>

        {/* Description */}
        {description && (
          <div
            className="animate-fade-in mb-12"
            style={{ animationDelay: "0.4s" }}
          >
            <p className="text-xl md:text-2xl text-neutral-800 dark:text-neutral-200 max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
          </div>
        )}

        {/* Countdown */}
        <div className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <Countdown targetDate={targetDate} />
        </div>

        {/* Additional info */}
        <div
          className="mt-16 text-neutral-600 dark:text-neutral-300 animate-fade-in"
          style={{ animationDelay: "0.8s" }}
        >
          <p className="text-lg mb-4">
            Transforming lives through innovative housing finance solutions
            across Africa.
          </p>
          <p className="text-base">
            Building sustainable communities, one home at a time.
          </p>
        </div>

        {/* Contact info */}
        <div
          className="mt-12 p-6 bg-neutral-100 dark:bg-neutral-900/80 backdrop-blur-sm rounded-2xl border border-neutral-200 dark:border-neutral-700 animate-fade-in"
          style={{ animationDelay: "1s" }}
        >
          <p className="text-neutral-700 dark:text-neutral-200 text-sm md:text-base">
            For updates and inquiries, contact us at{" "}
            <a
              href="mailto:info@shelterafrique.org"
              className="text-primary font-semibold hover:underline transition-all duration-300 dark:text-primary-light"
            >
              info@shelterafrique.org
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
