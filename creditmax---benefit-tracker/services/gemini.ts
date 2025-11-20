import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Frequency, CreditCard, Subscription, AiUsageItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchCardBenefits = async (cardName: string) => {
  // Schema definition for the expected JSON output
  const benefitSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      issuer: { type: Type.STRING, description: "The bank or issuer (e.g. Chase, Amex)" },
      network: { type: Type.STRING, description: "The card network (Visa, Mastercard, Amex, Discover)" },
      annualFee: { type: Type.NUMBER, description: "The annual fee in USD" },
      benefits: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Title of the benefit" },
            description: { type: Type.STRING, description: "Detailed description of the benefit" },
            value: { type: Type.NUMBER, description: "Estimated annual monetary value in USD. 0 if purely insurance/protection." },
            frequency: { type: Type.STRING, enum: ["Monthly", "Annual", "One-time", "Quarterly", "Semi-Annual"], description: "Reset frequency" },
            isCredit: { type: Type.BOOLEAN, description: "True if it is a statement credit or cash equivalent" },
            category: { type: Type.STRING, description: "Category like Travel, Dining, Shopping, Entertainment" }
          },
          required: ["title", "description", "value", "frequency", "isCredit"]
        }
      }
    },
    required: ["issuer", "network", "annualFee", "benefits"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a credit card rewards expert. Analyze the credit card "${cardName}" and provide an EXHAUSTIVE list of all current benefits.
      
      CRITICAL: Do not miss "hidden" or partner benefits. 
      
      Look specifically for:
      1. Streaming Credits: Disney bundle, Peacock, Apple TV+, Apple Music, Netflix.
      2. Dining/Delivery: DoorDash (DashPass + Credits), Uber/Uber Eats, Grubhub, Resy tables.
      3. Shopping/Lifestyle: Saks, Equinox, SoulCycle, Peloton, Walmart+, Amazon Prime.
      4. Travel Credits: Airline Incidentals, Hotel Credits (FHR/The Edit), Clear Plus, TSA PreCheck/Global Entry, Lyft Pink.
      5. Protections: Cell phone protection, Return protection, Extended warranty, Primary rental car insurance.
      6. Status: Hotel status levels, Rental car status.
      
      Examples to check for:
      - If Chase Sapphire Reserve: Look for "The Edit", "Lyft Pink", "DoorDash", "Peloton".
      - If Amex Platinum: Look for "Saks", "Walmart+", "Digital Entertainment", "Equinox", "SoulCycle", "Global Dining Access".
      - If Bilt: Look for "Rent Day", "Lyft", "Rent Reporting".
      
      For "value", estimate the annual dollar value for an average user. 
      For "frequency", determine if it resets Monthly, Quarterly, Semi-Annually, or Annually.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: benefitSchema
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Error fetching card benefits:", error);
    throw error;
  }
};

export const analyzeWalletOptimization = async (cards: CreditCard[], subscriptions: Subscription[], aiItems: AiUsageItem[]) => {
  const analysisSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      score: { type: Type.NUMBER, description: "Optimization score from 0 to 100" },
      summary: { type: Type.STRING, description: "Executive summary of the user's financial optimization" },
      actionItems: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            impact: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
            type: { type: Type.STRING, enum: ['Credit', 'Subscription', 'Optimization'] }
          }
        }
      },
      strengths: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    },
    required: ["score", "summary", "actionItems", "strengths"]
  };

  try {
    // Prepare data for context (simplified to save tokens if needed, but 2.5 Flash has large context)
    const walletContext = {
      cards: cards.map(c => ({
        name: c.name,
        issuer: c.issuer,
        benefits: c.benefits.map(b => ({ title: b.title, value: b.value, used: b.usedAmount })),
        annualFee: c.annualFee
      })),
      subscriptions: subscriptions.map(s => ({
        name: s.name,
        cost: s.cost,
        linkedCard: cards.find(c => c.id === s.linkedCardId)?.name || 'Unlinked/Unknown'
      })),
      aiUsage: aiItems.map(a => ({
        service: a.serviceName,
        quota: a.quotaName,
        used: a.usedAmount,
        limit: a.quotaAmount
      }))
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a financial optimization assistant. Analyze this user's wallet profile:
      ${JSON.stringify(walletContext)}

      Your goal is to find missed opportunities to save money or get more value.
      
      Consider:
      1. Are they paying for subscriptions (like Disney+, Walmart+, Uber One) that are already covered by their card benefits?
      2. Do they have unused high-value credits (Travel, Dining, Saks)?
      3. Are they using their AI quotas efficiently?
      4. Are there likely synergy gaps (e.g. owning an Amex Platinum but paying for Walmart+ separately)?

      Provide a score (0-100), a concise summary, a list of specific actionable recommendations (actionItems) with impact levels, and a list of what they are doing well (strengths).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text);
  } catch (error) {
    console.error("Error analyzing wallet:", error);
    throw error;
  }
};
