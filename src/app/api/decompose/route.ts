
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 检查环境变量
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const { input } = await req.json();

    // 验证输入
    if (!input || typeof input !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input provided' },
        { status: 400 }
      );
    }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: '你是一个任务拆解助手。请严格按照以下要求：1) 只输出步骤列表，不要任何解释、标题或额外文字；2) 每行一个步骤，以数字开头；3) 步骤要非常简单具体，容易执行；4) 不要输出"首先"、"然后"、"最后"等连接词；5) 直接从"1."开始输出。',
        },
        {
          role: 'user',
          content: `拆解以下目标成简单步骤：${input}`,
        },
      ],
    }),
    });

    const data = await response.json();
    
    // 检查API响应
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return NextResponse.json(
        { error: 'Invalid response from OpenAI API' },
        { status: 500 }
      );
    }

    const text = data.choices[0].message.content;
    
    // 更精确地处理步骤，只保留以数字开头的行
    const rawLines = text.split(/\n|\r\n|\r/).map((line: string) => line.trim());
    const steps = rawLines
      .filter((line: string) => line.length > 0)  // 过滤空行
      .filter((line: string) => /^\d+\./.test(line))  // 只保留以数字开头的行
      .map((line: string) => line.replace(/^\d+\.\s*/, '').trim())  // 移除数字前缀，保留纯步骤内容
      .filter((step: string) => step.length > 0);  // 确保步骤不为空

    return NextResponse.json({ steps });
  } catch (error) {
    console.error('Error in decompose API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}