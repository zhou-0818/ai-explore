'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function InputPage() {
  const [currentState, setCurrentState] = useState('');
  const [targetGoal, setTargetGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 拖延症友好的常见场景预设 (包含现状和目标)
  const commonScenarios = [
    {
      emoji: '🛏️',
      label: '起床',
      current: '现在早上8点，我躺在卧室的床上刷手机',
      target: '我想起床去卫生间洗漱，然后到厨房吃早餐'
    },
    {
      emoji: '🏃‍♂️',
      label: '开始运动',
      current: '现在晚上7点，我坐在客厅沙发上看电视',
      target: '我想在客厅空地做20分钟简单运动'
    },
    {
      emoji: '✍️',
      label: '开始写作',
      current: '现在下午2点，我坐在书桌前，电脑是开着的但在看别的网页',
      target: '我想打开文档开始写那篇文章的第一段'
    },
    {
      emoji: '📚',
      label: '开始学习',
      current: '现在晚上8点，我在书房里，学习资料放在桌上但没有打开',
      target: '我想打开书本开始学习第三章的内容'
    },
    {
      emoji: '🧹',
      label: '收拾整理',
      current: '现在下午3点，我站在凌乱的卧室里，衣服散落在床上和地上',
      target: '我想把这些衣服收拾整理到衣柜里'
    },
    {
      emoji: '👨‍💻',
      label: '开始工作',
      current: '现在上午10点，我坐在办公桌前，电脑开着但在浏览无关网页',
      target: '我想开始处理那个重要的工作项目'
    },
    {
      emoji: '🍳',
      label: '开始做饭',
      current: '现在下午6点，我站在厨房里，台面上有些脏碗没洗',
      target: '我想做一顿简单的晚餐'
    },
    {
      emoji: '📱',
      label: '停止刷手机',
      current: '现在晚上10点，我躺在床上已经刷手机1小时了',
      target: '我想放下手机准备睡觉'
    },
    {
      emoji: '🚿',
      label: '去洗澡',
      current: '现在晚上10点，我坐在房间里，知道该洗澡但一直在拖延',
      target: '我想去浴室洗个澡准备睡觉'
    }
  ];

  const handleScenarioClick = (scenario: { current: string; target: string }) => {
    setCurrentState(scenario.current);
    setTargetGoal(scenario.target);
  };

  const handleSubmit = async () => {
    if (!currentState.trim() || !targetGoal.trim()) return;
    
    setLoading(true);

    try {
      const combinedInput = `当前状态：${currentState}\n目标状态：${targetGoal}`;
      
      const res = await fetch('/api/decompose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: combinedInput }),
      });

      const data = await res.json();
      
      // 检查是否有错误
      if (!res.ok) {
        console.error('API Error:', data.error);
        alert(`错误: ${data.error || '请求失败'}`);
        return;
      }
      
      // 确保steps是数组
      if (Array.isArray(data.steps) && data.steps.length > 0) {
        // 将任务和步骤保存到 localStorage
        localStorage.setItem('currentTask', combinedInput);
        localStorage.setItem('taskSteps', JSON.stringify(data.steps));
        
        // 根据是否有手机依赖警告跳转到不同页面
        if (data.hasPhoneWarning) {
          localStorage.setItem('hasPhoneWarning', 'true');
          // 跳转到手机依赖脱离页面
          router.push('/phone-detox');
        } else {
          localStorage.removeItem('hasPhoneWarning');
          // 跳转到普通执行页面
          router.push('/execute');
        }
      } else {
        console.error('Invalid steps data:', data.steps);
        alert('收到的数据格式不正确');
      }
    } catch (error) {
      console.error('Request failed:', error);
      alert('网络请求失败');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-800 text-center flex items-center justify-center gap-2">
            <span className="text-2xl">🚀</span>
            拖延症启动器
          </h1>
          <p className="text-sm text-gray-500 text-center mt-1">
            专治想做事但开始不了的毛病
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        {/* Quick Scenarios */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-600 mb-3 flex items-center gap-2">
            <span>⚡</span>
            快速场景
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {commonScenarios.map((scenario, index) => (
              <button
                key={index}
                onClick={() => handleScenarioClick(scenario)}
                className="p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 active:scale-95 shadow-sm"
              >
                <div className="text-lg mb-1">{scenario.emoji}</div>
                <div className="text-xs font-medium text-gray-700">{scenario.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          {/* 当前状态 */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                � 当前状态 (Where + When + What)
              </label>
              {currentState && (
                <button
                  onClick={() => setCurrentState('')}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  清空
                </button>
              )}
            </div>
            <textarea
              className="w-full border-2 border-gray-200 rounded-lg p-3 text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 resize-none"
              rows={3}
              maxLength={150}
              placeholder="比如：现在下午2点，我坐在客厅沙发上刷手机"
              value={currentState}
              onChange={(e) => setCurrentState(e.target.value)}
            />
            <div className="flex justify-between items-center mt-2">
              <span className={`text-xs transition-colors ${
                currentState.length > 135 ? 'text-red-500' : 'text-gray-400'
              }`}>
                {currentState.length}/150
              </span>
              <span className="text-xs text-gray-500">
                包含：时间、地点、在做什么
              </span>
            </div>
          </div>

          {/* 目标状态 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                🎯 目标状态 (Where + When + What)
              </label>
              {targetGoal && (
                <button
                  onClick={() => setTargetGoal('')}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  清空
                </button>
              )}
            </div>
            <textarea
              className="w-full border-2 border-gray-200 rounded-lg p-3 text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 resize-none"
              rows={3}
              maxLength={150}
              placeholder="比如：我想去书房的书桌前开始学习数学"
              value={targetGoal}
              onChange={(e) => setTargetGoal(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <div className="flex justify-between items-center mt-2">
              <span className={`text-xs transition-colors ${
                targetGoal.length > 135 ? 'text-red-500' : 'text-gray-400'
              }`}>
                {targetGoal.length}/150
              </span>
              <span className="text-xs text-gray-500">
                Ctrl+Enter 快速提交
              </span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          className={`w-full py-4 px-6 rounded-xl font-medium text-white transition-all duration-200 mb-6 ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : (currentState.trim() && targetGoal.trim())
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl active:scale-95'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
          onClick={handleSubmit}
          disabled={loading || !currentState.trim() || !targetGoal.trim()}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              AI正在思考中...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span>🚀</span>
              帮我开始行动
            </span>
          )}
        </button>

        {/* 拖延症友好使用提示 */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-6 border border-purple-100">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="text-sm font-medium text-purple-800 mb-2">状态驱动启动法</h3>
              <ul className="text-xs text-purple-700 space-y-1">
                <li>• 清楚描述你现在的状态（时间+地点+在做什么）</li>
                <li>• 明确说出你想要的状态（去哪里+做什么）</li>
                <li>• AI会生成从现状到目标的具体启动步骤</li>
                <li>• 每个步骤都考虑你的实际环境和情况</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎯</div>
          <p className="text-gray-500">描述你现在的状态和想要的目标</p>
          <p className="text-sm text-gray-400 mt-2">
            选择上方的快速场景，或者填写你的具体情况
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-gray-400">
        <p>Made with ❤️ by 拖延症启动器</p>
      </footer>
    </div>
  );
}
