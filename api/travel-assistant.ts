import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, origin, destination, date } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(200).json({
        reply: "مرحباً بك في سفر موريتانيا! يسعدنا مساعدتك في اختيار رحلتك بين المدن الموريتانية مثل نواكشوط، نواذيبو، كيفه، وأطار. يرجى اختيار مدينتك وتاريخ سفرك لاستعراض الحافلات والسيارات المتاحة.",
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
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
      contents: prompt || `أريد نصيحة بخصوص السفر من ${origin || "نواكشوط"} إلى ${destination || "نواذيبو"} بتاريخ ${date || "اليوم"}.`,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.status(200).json({ reply: response.text });
  } catch (error: any) {
    console.error("Vercel Gemini Assistant error:", error);
    return res.status(200).json({
      reply: "أهلاً بك! يمكنك البحث بسهولة عن رحلتك من القائمة أعلاه واختيار الشركة ووسيلة الراحة والمقعد المفضل لديك.",
    });
  }
}
