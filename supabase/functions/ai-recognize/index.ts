import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { imageUrl, text, mode } = body as {
      imageUrl?: string;
      text?: string;
      mode: "screenshot" | "voice";
    };

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY not set");
    }

    let systemPrompt: string;
    let userContent: any;

    if (mode === "screenshot" && imageUrl) {
      systemPrompt = `你是一个记账助手。分析这张支付截图，提取以下信息。
返回纯JSON（不要markdown代码块），字段：
{ "amount": 数字, "currency": "CNY"|"EUR"|null, "merchant": 商家名|null, "category": 分类名|null, "date": "YYYY-MM-DD"|null, "description": 简短备注|null }

可选分类：餐饮、交通、购物、娱乐、学习、医疗、住房、其他支出、工资、兼职、红包、其他收入。
如果某个字段无法确定，设为null。`;

      userContent = [
        { type: "image", source: { type: "url", url: imageUrl, media_type: "image/jpeg" } },
        { type: "text", text: "请识别这张支付截图的金额、币种、商家、分类和日期。" },
      ];
    } else if (mode === "voice" && text) {
      systemPrompt = `你是一个记账助手。用户用自然语言描述了一笔消费或收入，请解析并返回纯JSON：
{ "amount": 数字, "currency": "CNY"|"EUR"|null, "merchant": 商家名|null, "category": 分类名|null, "date": "YYYY-MM-DD"|null, "description": 简短备注|null, "type": "expense"|"income"|null }

分类：餐饮、交通、购物、娱乐、学习、医疗、住房、其他支出、工资、兼职、红包、其他收入。
时间表达如"昨天"、"今天"、"上周五"需要转换为实际日期。当前日期参考：${new Date().toISOString().slice(0, 10)}。
如果信息不全，设为null。`;

      userContent = [{ type: "text", text: text }];
    } else {
      throw new Error("Invalid mode or missing input");
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 256,
        system: systemPrompt,
        messages: [{ role: "user", content: userContent }],
      }),
    });

    const data = await response.json();
    const rawText = data.content?.[0]?.text || "";

    // 提取JSON（处理可能的markdown包裹）
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return new Response(JSON.stringify({ error: "AI返回格式异常", raw: rawText }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
