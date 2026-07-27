import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "Safar MR", time: new Date().toISOString() });
  });

  // AI Assistant for Mauritanian Travel suggestions
  app.post("/api/travel-assistant", async (req, res) => {
    try {
      const { prompt, origin, destination, date } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.json({
          reply: "مرحباً بك في سفر موريتانيا! يسعدنا مساعدتك في اختيار رحلتك بين المدن الموريتانية مثل نواكشوط، نواذيبو، كيفه، وأطار. يرجى اختيار مدينتك وتاريخ سفرك لاستعراض الحافلات والسيارات المتاحة.",
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
      const systemInstruction = `
أنت مساعد سفر ذكي وخبير في منصة "Safar MR" (سفر موريتانيا) لحجز الرحلات البرية بين المدن الموريتانية.
تتميز بالأسلوب الموريتاني اللبق والمهني والعربي الأصيل.
المدن الموريتانية الأساسية: نواكشوط، نواذيبو، كيفه، روصو، أطار، لعيون، كيهيدي، الزويرات، أكجوجت، تجكجة، سيلبابي، نعمة.
شركات النقل الرئيسية: سونيف للنقل، المسافر، المسار، موري ترانس، زمزم للنقل، السلام.
أنواع السيارات: حافلة مكيفة (Bus)، ميني باص (Minibus)، سيارة دفع رباعي V8، سيارة أجرة نقل (Taxi).
وسائل الدفع: بنكيلي (Bankily)، السداد (Sedad)، مصرفي (Masrifi)، والدفع نقداً عند الصعود.
أجب باختصار (2-4 أسطر) ووضح نصائح السفر والمسافة التقديرية بالأنسب للمستخدم.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt || `أريد نصيحة بخصوص السفر من ${origin || 'نواكشوط'} إلى ${destination || 'نواذيبو'} بتاريخ ${date || 'اليوم'}.`,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ reply: response.text });
    } catch (error) {
      console.error("Gemini Assistant error:", error);
      res.json({
        reply: "أهلاً بك! يمكنك البحث بسهولة عن رحلتك من القائمة أعلاه واختيار الشركة ووسيلة الراحة والمقعد المفضل لديك.",
      });
    }
  });

  // Vite middleware for dev or static serving for prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Safar MR Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
