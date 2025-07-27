
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
          content: `你是一个专门帮助克服拖延症的任务启动专家。你的目标是帮助用户克服"开始做事"这个最大的障碍，专注于启动而不是完成整个任务。

核心理念：
- 专注于"启动"，而不是完成整个任务
- 每个步骤都是为了让用户更容易开始行动
- 步骤要小到"不可能拒绝"的程度（1-3分钟）
- 重点是克服心理阻力，建立行动惯性

启动原则：
- 将复杂任务的"第一步"细化为多个微小动作
- 每个动作都是具体的物理行为，不需要思考
- 避免模糊词汇，使用明确的动作指令
- 重点放在前5-10个启动步骤，不需要覆盖整个任务

输出要求：
1. 直接输出数字编号的步骤列表
2. 专注于任务的启动阶段，不需要详细规划整个过程
3. 每个步骤格式：具体动作 + 明确对象
4. 步骤应该帮助用户从"想做但没开始"转变为"已经在做了"

请严格按照以上原则工作，专注于启动：`,
        },
        {
          role: 'user',
          content: `请根据用户的当前状态和目标状态，生成启动步骤：

${input}

启动重点：
- 基于用户的当前状态（时间、地点、当前行为）制定启动步骤
- 每个步骤都是具体的物理行为，帮助用户从当前状态过渡到目标状态
- 专注于克服启动阻力，而不是完成整个任务
- 考虑时间、地点、环境等实际因素

特殊场景处理：
如果目标明确要求"放下手机"、"停止刷手机"、"戒手机"等脱离手机使用的行为，请在开头只输出"⚠️ 手机依赖场景"这个标记，然后给出恰好5个简短有效的步骤。

注意：以下情况不属于手机依赖场景，应按正常任务处理：
- 打电话、发短信、发微信等需要使用手机功能的任务
- 使用手机应用（如导航、音乐、拍照等）
- 查看手机信息、回复消息等正常手机使用

只有当目标是要求用户"停止使用手机"或"远离手机"时才使用手机依赖场景。

手机依赖场景要求：
- 每个步骤5-15秒完成
- 动作简单直接，不需要思考
- 重点是快速转移注意力和改变身体状态
- 避免复杂的心理活动或长篇描述

示例拆解：

当前状态：现在下午2点，我躺在卧室床上刷手机
目标状态：我想去书房开始学习
→
1. 停止滑动手机屏幕
2. 将手机放在床头柜上
3. 坐起身来
4. 双脚着地
5. 站起来
6. 走出卧室
7. 走到书房门口
8. 推开书房门
9. 走到书桌前
10. 拉开椅子坐下

当前状态：现在晚上10点，我躺在床上刷手机
目标状态：我想放下手机准备睡觉
→
⚠️ 手机依赖场景

1. 深呼吸3次
2. 将手机放到床头柜上
3. 闭上眼睛
4. 调整枕头到舒适位置
5. 拉好被子盖住身体

当前状态：现在下午3点，我坐在沙发上刷手机
目标状态：我想放下手机去厨房做饭
→
⚠️ 手机依赖场景

1. 伸个懒腰
2. 将手机放在沙发上
3. 起身走向厨房
4. 打开冰箱门
5. 拿出要用的食材

当前状态：现在上午10点，我需要给客户打电话
目标状态：我想完成这个重要的商务电话
→
1. 找到客户的电话号码
2. 拿起手机解锁
3. 打开拨号界面
4. 输入客户电话号码
5. 按下拨号键开始通话

当前状态：现在晚上9点，我想发微信给朋友
目标状态：我想约朋友明天一起吃饭
→
1. 拿起手机解锁
2. 打开微信应用
3. 找到朋友的聊天窗口
4. 输入约饭的消息
5. 点击发送按钮

请为用户的情况生成类似的启动步骤：`,
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
    
    // 检查是否包含手机依赖场景的特殊标记
    const hasPhoneWarning = text.includes('⚠️ 手机依赖场景');
    
    // 更精确地处理步骤，只保留以数字开头的行
    const rawLines = text.split(/\n|\r\n|\r/).map((line: string) => line.trim());
    const steps = rawLines
      .filter((line: string) => line.length > 0)  // 过滤空行
      .filter((line: string) => /^\d+\./.test(line))  // 只保留以数字开头的行
      .map((line: string) => line.replace(/^\d+\.\s*/, '').trim())  // 移除数字前缀，保留纯步骤内容
      .filter((step: string) => step.length > 0);  // 确保步骤不为空

    return NextResponse.json({ 
      steps, 
      hasPhoneWarning: hasPhoneWarning 
    });
  } catch (error) {
    console.error('Error in decompose API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}