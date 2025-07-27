'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ExecutePage() {
  const [task, setTask] = useState('');
  const [steps, setSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 从 localStorage 获取任务和步骤
    const savedTask = localStorage.getItem('currentTask');
    const savedSteps = localStorage.getItem('taskSteps');
    
    if (savedTask && savedSteps) {
      setTask(savedTask);
      try {
        const parsedSteps = JSON.parse(savedSteps);
        if (Array.isArray(parsedSteps)) {
          setSteps(parsedSteps);
        } else {
          // 如果数据格式不正确，返回输入页面
          router.push('/input');
        }
      } catch (error) {
        console.error('Error parsing steps:', error);
        router.push('/input');
      }
    } else {
      // 如果没有数据，返回输入页面
      router.push('/input');
    }
  }, [router]);

  const handleStepComplete = () => {
    const newCompletedSteps = [...completedSteps, currentStep];
    setCompletedSteps(newCompletedSteps);
    setShowCelebration(true);
    
    // 显示庆祝动画
    setTimeout(() => {
      setShowCelebration(false);
      // 检查是否还有未完成的步骤
      if (newCompletedSteps.length < steps.length) {
        setCurrentStep(prev => prev + 1);
      }
    }, 1000);
  };

  const handleRestart = () => {
    // 清除 localStorage 并返回输入页面
    localStorage.removeItem('currentTask');
    localStorage.removeItem('taskSteps');
    router.push('/input');
  };

  const handleBack = () => {
    router.push('/input');
  };

  // 如果没有步骤数据，显示加载状态
  if (steps.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  const progress = (completedSteps.length / steps.length) * 100;
  const allCompleted = completedSteps.length === steps.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={handleBack}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← 返回
            </button>
            <h1 className="text-lg font-bold text-gray-800 flex-1">
              启动进行中
            </h1>
          </div>
          
          {/* Task Description */}
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <p className="text-sm text-gray-700 font-medium">📋 {task}</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>进度</span>
              <span>{completedSteps.length} / {steps.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        {/* Current Step */}
        {currentStep < steps.length && !allCompleted && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-500 text-white text-sm font-bold rounded-full flex items-center justify-center">
                  {currentStep + 1}
                </span>
                启动步骤
              </h2>
              <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                只需2分钟 ⏱️
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                {steps[currentStep]}
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs text-yellow-800 flex items-center gap-2">
                  <span>💡</span>
                  记住：这一步非常简单，你绝对可以完成！只要开始行动就是胜利。
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleStepComplete}
                className="flex-1 py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-medium transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl"
              >
                ✅ 完成这一步 ({completedSteps.length + 1}/{steps.length})
              </button>
            </div>
            
            <div className="mt-3 text-center">
              <button
                onClick={handleBack}
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                🛑 我需要休息一下
              </button>
            </div>
          </div>
        )}

        {/* Completed Steps */}
        {completedSteps.length > 0 && !allCompleted && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span>🎉</span>
              已完成 ({completedSteps.length})
            </h3>
            <div className="space-y-2">
              {completedSteps.map((stepIndex) => (
                <div
                  key={stepIndex}
                  className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200"
                >
                  <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    ✓
                  </span>
                  <span className="text-gray-700 text-sm">
                    {steps[stepIndex]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Completed State */}
        {allCompleted && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {/* All completed steps */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span>✅</span>
                所有步骤已完成
              </h2>
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200"
                  >
                    <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      ✓
                    </span>
                    <span className="text-gray-700 font-medium">
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Completion celebration */}
            <div className="text-center py-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">完美启动！你已经开始了！</h3>
              <p className="text-gray-600 mb-2">你刚刚完成了 {steps.length} 个启动步骤</p>
              <p className="text-sm text-purple-600 mb-2 font-medium">
                🎯 最难的"开始"已经解决了！
              </p>
              <p className="text-sm text-blue-600 mb-4 font-medium">
                💪 现在保持这个势头，继续完成接下来的事情吧！
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={handleRestart}
                  className="py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl"
                >
                  🚀 启动新任务
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Celebration Animation */}
        {showCelebration && (
          <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
            <div className="animate-celebration text-6xl">🎉</div>
          </div>
        )}
      </main>
    </div>
  );
}
