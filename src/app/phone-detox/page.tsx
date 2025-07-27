'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PhoneDetoxPage() {
  const [task, setTask] = useState('');
  const [steps, setSteps] = useState<string[]>([]);
  const [showSteps, setShowSteps] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const [isReady, setIsReady] = useState(false);
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
          router.push('/input');
        }
      } catch (error) {
        console.error('Error parsing steps:', error);
        router.push('/input');
      }
    } else {
      router.push('/input');
    }
  }, [router]);

  useEffect(() => {
    if (showSteps && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setIsReady(true);
    }
  }, [showSteps, countdown]);

  const handleViewSteps = () => {
    setShowSteps(true);
  };

  const handleRestart = () => {
    localStorage.removeItem('currentTask');
    localStorage.removeItem('taskSteps');
    localStorage.removeItem('hasPhoneWarning');
    router.push('/input');
  };

  const handleBack = () => {
    router.push('/input');
  };

  if (steps.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
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
              🚫📱 手机依赖脱离模式
            </h1>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-3 mb-3 border border-orange-200">
            <p className="text-sm text-orange-800 font-medium">📋 {task}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        {!showSteps ? (
          /* 第一阶段：准备阶段 */
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">手机依赖场景检测</h2>
              <p className="text-gray-600 text-sm">
                你的目标需要放下手机，这需要特殊的执行策略
              </p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-orange-800 mb-3">📋 执行策略</h3>
              <div className="text-xs text-orange-700 space-y-2">
                <p>• <strong>记忆模式</strong>：你需要记住关键步骤，而不是边看边做</p>
                <p>• <strong>快速浏览</strong>：用15秒时间快速记住所有步骤</p>
                <p>• <strong>立即执行</strong>：浏览完成后立即开始，不要犹豫</p>
                <p>• <strong>简化步骤</strong>：只有 {steps.length} 个关键动作</p>
              </div>
            </div>

            <button
              onClick={handleViewSteps}
              className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-medium transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl"
            >
              🔍 查看步骤（记忆模式）
            </button>
          </div>
        ) : (
          /* 第二阶段：记忆阶段 */
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {!isReady ? (
              <>
                {/* 倒计时显示 */}
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-orange-500 mb-2">
                    {countdown}
                  </div>
                  <p className="text-sm text-gray-600">
                    秒后自动提醒你开始执行
                  </p>
                </div>

                {/* 步骤列表 - 记忆模式 */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                    📝 快速记忆这些步骤
                  </h3>
                  <div className="space-y-3">
                    {steps.map((step, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200"
                      >
                        <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="text-gray-800 font-medium text-sm">
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs text-yellow-800 text-center">
                    💡 专心记住这 {steps.length} 个步骤，倒计时结束后立即开始执行
                  </p>
                </div>
              </>
            ) : (
              /* 第三阶段：执行提醒 */
              <div className="text-center">
                <div className="text-6xl mb-4 animate-bounce">🚀</div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  现在开始执行！
                </h2>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <h3 className="text-sm font-semibold text-green-800 mb-2">✅ 执行提醒</h3>
                  <div className="text-xs text-green-700 space-y-1">
                    <p>• 按照刚才记住的步骤顺序执行</p>
                    <p>• 从第一步开始，一步一步完成</p>
                    <p>• 不要回来看手机，相信你的记忆</p>
                    <p>• 完成后可以回来启动新任务</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleRestart}
                    className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl"
                  >
                    🎯 完成后启动新任务
                  </button>
                  
                  <button
                    onClick={handleBack}
                    className="w-full py-2 px-4 text-gray-500 hover:text-gray-700 transition-colors text-sm"
                  >
                    🔙 返回重新开始
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
