import { GoogleGenAI, Type } from "@google/genai";
import { AppState } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function getBehaviorRules(state: AppState): string {
  let rules = `\n    CRITICAL BEHAVIOR RULES FOR THIS CATEGORY:\n`;
  
  if (state.businessCategory === 'E-commerce') {
    rules += `    - Content DNA: Focus on product showcase, benefits, and offers.
    - Style: Visual, direct, conversion-driven.
`;
  } else if (state.businessCategory === 'Personal Brand') {
    rules += `    - Content DNA: Focus on personality, storytelling, and authority.
    - Style: Relatable, authentic.
`;
  } else if (state.businessCategory === 'Service-Based Business') {
    rules += `    - Content DNA: Focus on trust, results, and solving client problems.
    - Style: Educational + proof-driven.
    - Service Type: ${state.subCategory.join(', ')}
    - Industry: ${state.serviceIndustry}
    - Ensure the content combines both the service type and industry to generate accurate, tailored content.
`;
  } else if (state.businessCategory === 'Restaurant & Food') {
    rules += `    - Content DNA: Focus on appetite appeal, visuals, and cravings.
    - Style: Sensory, descriptive, emotional.
`;
  } else if (state.businessCategory === 'Education') {
    rules += `    - Content DNA: Focus on value, learning, and clarity.
    - Style: Structured, informative.
`;
  } else if (state.businessCategory === 'Tech & Digital') {
    rules += `    - Content DNA: Focus on innovation, solutions, and efficiency.
    - Style: Modern, smart, simplified.
`;
  } else if (state.businessCategory === 'Entertainment & Activities') {
    rules += `    - Content DNA: Focus on fun, energy, and social experiences.
    - Style: Dynamic, engaging, community-driven.
`;
  } else if (state.businessCategory === 'Handmade Business') {
    rules += `    - Content DNA: Focus on craftsmanship, uniqueness, and emotional value.
    - Style: Storytelling, behind-the-scenes, personal touch.
    - Logic: Focus on emotional selling. Highlight uniqueness and handmade effort. Use storytelling and process-based content. Avoid aggressive sales tone. Emphasize authenticity and human touch.
`;
  }

  rules += `\n    NICHE-SPECIFIC BEHAVIOR RULES:\n`;
  state.subCategory.forEach(niche => {
    if (niche === 'Digital Products') {
      rules += `    - ${niche}: Focus on value, benefits, and transformation. Emphasize ease of use and instant access. Suggest content like tutorials, before/after results, use cases.\n`;
    } else if (niche === 'SaaS') {
      rules += `    - ${niche}: Focus on efficiency, productivity, and problem-solving.\n`;
    } else if (niche === 'Mobile Apps') {
      rules += `    - ${niche}: Focus on usability, features, and user experience.\n`;
    } else if (niche === 'AI Tools') {
      rules += `    - ${niche}: Focus on innovation, automation, and results.\n`;
    } else if (niche === 'Web3 / Blockchain') {
      rules += `    - ${niche}: Focus on future, decentralization, and opportunity.\n`;
    } else if (niche === 'Hardware') {
      rules += `    - ${niche}: Focus on features, performance, and real-world usage.\n`;
    } else if (['Padel Courts', 'Football Field', 'Basketball Court'].includes(niche)) {
      rules += `    - ${niche}: Sub-category DNA: Competitive, energetic, social. Suggested content: Match highlights, challenges, group experiences.\n`;
    } else if (['PlayStation Café', 'Gaming Lounge'].includes(niche)) {
      rules += `    - ${niche}: Sub-category DNA: Fun, reactions, excitement. Suggested content: Gameplay moments, funny reactions, tournaments.\n`;
    } else if (niche === 'Kids Area') {
      rules += `    - ${niche}: Sub-category DNA: Joyful, safe, family-friendly. Suggested content: Kids activities, parent-focused messaging.\n`;
    }
  });

  rules += `\n    - Always use Business Type + Niche + Content DNA together.
    - Avoid generic content.
    - Adapt tone, structure, and ideas based on category intelligence.
    - Ensure outputs feel tailored to the business, not templated.\n`;

  return rules;
}

export async function generateStrategy(state: AppState) {
  const prompt = `
    You are Social Geni, a world-class AI social media strategist.
    Create a content strategy for a brand with the following details:
    - Brand Name: ${state.brandName}
    - Tone of Voice: ${state.toneOfVoice}
    - Business Type: ${state.businessCategory} (${state.subCategory.join(', ')})
    - Goal: ${state.goal}
    - Duration: ${state.duration}
    - Platforms: ${state.platforms.join(', ')}
    - Content Language: ${state.contentLanguage} 
    ${state.contentLanguage === 'Arabic' ? `- Dialect: ${state.arabicDialect}` : `- Tone: ${state.englishTone}`}
    ${getBehaviorRules(state)}

    Important: The user's interface language is ${state.interfaceLanguage || 'English'}. 
    ALL values in the output JSON (summary, platform names, content types, category names, posting frequency) MUST be written in ${state.interfaceLanguage || 'English'}.
    If the language is Arabic, ensure the strategy feels natural and culturally relevant for an Arabic-speaking audience.

    Provide a clear and simple content strategy including:
    1. Best content types per platform (translated to ${state.interfaceLanguage || 'English'})
    2. Posting frequency (translated to ${state.interfaceLanguage || 'English'})
    3. Content mix percentages (e.g., 40% Educational, 40% Entertaining, 20% Promotional) (category names translated to ${state.interfaceLanguage || 'English'})
    4. A summary of the overall strategy (written in ${state.interfaceLanguage || 'English'})
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          platforms: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                platform: { type: Type.STRING },
                contentTypes: { type: Type.ARRAY, items: { type: Type.STRING } },
                postingFrequency: { type: Type.STRING },
              }
            }
          },
          contentMix: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                percentage: { type: Type.NUMBER },
              }
            }
          },
          summary: { type: Type.STRING }
        }
      }
    }
  });

  return JSON.parse(response.text || '{}');
}

export async function generateContent(state: AppState, contentType: string, options: any) {
  let specificOptions = '';
  if (contentType === 'Captions') {
    specificOptions = `- Style: ${options.style}\n- Length: ${options.length}`;
  } else if (contentType === 'Image Prompts') {
    specificOptions = `- Style: ${options.style}
- Aspect Ratio: ${options.ratio}
${options.isCarousel ? '- Format: Carousel (Generate a series of related prompts that tell a story or show a sequence)' : ''}
${options.includeLogo ? '- IMPORTANT: Explicitly mention in the prompt that a logo image is attached as an input and describe how the logo should be seamlessly integrated into the scene.' : ''}
${options.includeProduct ? '- IMPORTANT: Explicitly mention in the prompt that a product image is attached as an input and describe how the product should be featured prominently and realistically in the scene.' : ''}

CRITICAL INSTRUCTIONS FOR IMAGE PROMPTS:
Format the prompts specifically for the "Nano Banana" AI image generator. Make them highly professional, structured, detailed, and separated by commas or sections (e.g., Subject, Lighting, Environment, Camera, Mood). The prompts themselves MUST be in English as AI image generators understand English best, even if the content language is Arabic. Provide the title and notes in the requested interface language.`;
  } else if (contentType === 'Video Scripts') {
    specificOptions = `- Duration: ${options.duration}\n- Style: ${options.style}\n- Aspect Ratio: ${options.ratio}`;
  }

  const prompt = `
    You are Social Geni, a world-class AI social media content creator.
    Generate ${contentType} for a brand with the following details:
    - Brand Name: ${state.brandName}
    - Tone of Voice: ${state.toneOfVoice}
    - Business Type: ${state.businessCategory} (${state.subCategory.join(', ')})
    - Goal: ${state.goal}
    - Platforms: ${state.platforms.join(', ')}
    - Content Language: ${state.contentLanguage} 
    ${state.contentLanguage === 'Arabic' ? `- Dialect: ${state.arabicDialect}` : `- Tone: ${state.englishTone}`}
    ${getBehaviorRules(state)}
    
    Specific Options for ${contentType}:
    ${specificOptions}

    Generate 3 to 5 variations.
    Make sure the content is highly engaging, platform-optimized, and ready to use.
    If the language is Arabic, ensure cultural relevance and natural phrasing for the selected dialect.

    Important: The user's interface language is ${state.interfaceLanguage || 'English'}. 
    Please provide the output JSON with titles and notes translated to ${state.interfaceLanguage || 'English'} where appropriate. The actual content should be in ${state.contentLanguage}.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          variations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "A short title or label for this variation" },
                content: { type: Type.STRING, description: "The actual generated content" },
                platform: { type: Type.STRING, description: "The specific platform this is optimized for, if applicable" }
              }
            }
          }
        }
      }
    }
  });

  return JSON.parse(response.text || '{}');
}
