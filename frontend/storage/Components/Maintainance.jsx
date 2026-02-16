import { useState, useEffect } from 'react';
import { Server, Clock } from 'lucide-react';
import React from 'react'
function Maintainance() {
  const [timeRemaining, setTimeRemaining] = useState(3600);
  const [isRunning, setIsRunning] = useState(true);
  const probableFix = 'Database optimization, security patches, and performance improvements';

  useEffect(() => {
    let interval;

    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeRemaining]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-white border-b border-slate-200 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                <Server className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">Server Update</h1>
                <p className="text-sm text-slate-500 mt-0.5">Maintenance in progress</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
                    <Server className="w-8 h-8 text-amber-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-slate-900 mb-3">
                    Scheduled Maintenance
                  </h2>
                  <p className="text-base text-slate-700 leading-relaxed">
                    We are performing scheduled maintenance to improve performance and security.
                    The service will be temporarily unavailable during this time. We apologize for any inconvenience.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-slate-600" />
                <h3 className="font-medium text-slate-900">Estimated Time Remaining</h3>
              </div>
              <div className="text-center">
                <div className="text-6xl font-bold text-slate-900 tracking-tight">
                  {formatTime(timeRemaining)}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border-t border-slate-200 px-6 py-6">
            <div className="mb-4">
              <p className="text-sm font-medium text-slate-600 mb-2">Probable fix:</p>
              <p className="text-sm text-slate-700 bg-white border border-slate-200 rounded-lg px-4 py-3">
                {probableFix}
              </p>
            </div>
            <p className="text-xs text-slate-500 text-center">
              For urgent support, contact your system administrator
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Maintainance;
