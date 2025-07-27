
'use client';

import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [steps, setSteps] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setSteps([]);

    try {
      const res = await fetch('/api/decompose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });

      const data = await res.json();
      
      // 调试：打印API响应
      console.log('API Response:', data);
      
      // 检查是否有错误
      if (!res.ok) {
        console.error('API Error:', data.error);
        setSteps([`错误: ${data.error || '请求失败'}`]);
        return;
      }
      
      // 确保steps是数组
      if (Array.isArray(data.steps)) {
        setSteps(data.steps);
      } else {
        console.error('Invalid steps data:', data.steps);
        setSteps(['错误: 收到的数据格式不正确']);
      }
    } catch (error) {
      console.error('Request failed:', error);
      setSteps(['错误: 网络请求失败']);
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
            <span className="text-2xl">🎯</span>
            任务启动助手
          </h1>
          <p className="text-sm text-gray-500 text-center mt-1">
            把复杂任务拆解成简单步骤
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            📝 描述你想要完成的任务
          </label>
          <textarea
            className="w-full border-2 border-gray-200 rounded-lg p-3 text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 resize-none"
            rows={4}
            placeholder="例如：现在我躺在床上，但我应该去练习吉他"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <div className="flex justify-between items-center mt-3">
            <span className="text-xs text-gray-400">
              {input.length}/200
            </span>
            <span className="text-xs text-gray-400">
              Ctrl+Enter 快速提交
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          className={`w-full py-4 px-6 rounded-xl font-medium text-white transition-all duration-200 mb-6 ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : input.trim()
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl active:scale-95'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
          onClick={handleSubmit}
          disabled={loading || !input.trim()}
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
              开始拆解任务
            </span>
          )}
        </button>

        {/* Results Section */}
        {steps && Array.isArray(steps) && steps.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span>✅</span>
              任务拆解结果
            </h2>
            <div className="space-y-3">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-gray-700 leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500 text-center">
                💡 按照步骤逐一完成，你一定可以的！
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!steps || steps.length === 0) && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤔</div>
            <p className="text-gray-500">输入你的任务，让AI帮你拆解吧！</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-gray-400">
        <p>Made with ❤️ by Task Helper</p>
      </footer>
    </div>
  );
}
