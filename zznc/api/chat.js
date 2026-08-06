// api/chat.js
// 部署到 Vercel 后，这个文件会自动变成一个后端 API
// 你的 API Key 必须通过 Vercel 环境变量注入，不要写在这里！

export default async function handler(req, res) {
    // 只允许 POST 请求
    if (req.method !== "POST") {
        return res.status(405).json({ error: "只支持 POST 请求" });
    }

    try {
        const { messages } = req.body;

        // 调用 DeepSeek API
        const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-v4-flash",
                messages: messages
            })
        });

        const data = await response.json();

        // 如果 DeepSeek 返回了错误
        if (data.error) {
            return res.status(400).json({ error: data.error.message });
        }

        // 成功：把 AI 的回复返回给前端
        return res.status(200).json({
            reply: data.choices[0].message.content
        });

    } catch (error) {
        return res.status(500).json({ error: "服务器错误：" + error.message });
    }
}