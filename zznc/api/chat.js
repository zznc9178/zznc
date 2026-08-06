// api/chat.js — Cloudflare Pages Functions 版本
export async function onRequestPost({ request, env }) {
    try {
        const { messages } = await request.json();

        const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${env.DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-v4-flash",
                messages: messages
            })
        });

        const data = await response.json();

        if (data.error) {
            return new Response(JSON.stringify({ error: data.error.message }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        return new Response(JSON.stringify({ reply: data.choices[0].message.content }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: "服务器错误：" + error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
