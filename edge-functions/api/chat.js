// edge-functions/api/chat.js
// EdgeOne Edge Functions 格式

export default async function onRequest(context) {
    if (context.request.method !== "POST") {
        return new Response(JSON.stringify({ error: "只支持 POST 请求" }), {
            status: 405,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        const { messages } = await context.request.json();

        const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${context.env.DEEPSEEK_API_KEY}`
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
