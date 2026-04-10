import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppState, initialAppState, BUSINESS_SUBCATEGORIES, SERVICE_INDUSTRIES, Platform } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ChevronRight, ChevronLeft, Sparkles, Lightbulb, X } from 'lucide-react';
import { translations } from '../translations';

interface WizardProps {
  onComplete: (state: AppState) => void;
  interfaceLang: 'English' | 'Arabic';
}

export function Wizard({ onComplete, interfaceLang }: WizardProps) {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<AppState>(initialAppState);

  const t = translations[interfaceLang === 'Arabic' ? 'ar' : 'en'];

  const updateState = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const isStepValid = () => {
    switch (step) {
      case 1: return state.brandName.trim() !== '' && state.toneOfVoice !== '';
      case 2: 
        if (state.businessCategory === 'Service-Based Business') {
          return state.businessCategory !== '' && state.subCategory.length > 0 && state.serviceIndustry !== '';
        }
        return state.businessCategory !== '' && state.subCategory.length > 0;
      case 3: return state.goal !== '' && state.duration !== '';
      case 4: return state.platforms.length > 0 && 
                     (state.contentLanguage === 'Arabic' ? state.arabicDialect !== '' : state.englishTone !== '');
      default: return true;
    }
  };

  const getCategoryFeedback = (category: string) => {
    const feedbacks: Record<string, {en: string, ar: string}> = {
      'Handmade Business': {en: "Nice choice 👌 Handmade brands perform best with emotional and storytelling content", ar: "اختيار رائع 👌 العلامات اليدوية تنجح أكثر مع المحتوى العاطفي والقصصي"},
      'Tech & Digital': {en: "Great choice 🚀 Tech content works best when it's clear, smart, and solution-driven", ar: "اختيار ممتاز 🚀 المحتوى التقني ينجح عندما يكون واضحاً وذكياً وموجهاً للحلول"},
      'Restaurant & Food': {en: "Delicious choice 😄 Food content thrives on visuals and cravings", ar: "اختيار لذيذ 😄 محتوى الطعام يزدهر بالمرئيات وإثارة الشهية"},
      'E-commerce': {en: "Awesome 🛒 E-commerce content is all about visual appeal and clear offers", ar: "رائع 🛒 محتوى التجارة الإلكترونية يعتمد على الجاذبية البصرية والعروض الواضحة"},
      'Personal Brand': {en: "Love it 🌟 Personal brands grow through authenticity and connection", ar: "رائع 🌟 العلامات الشخصية تنمو من خلال الأصالة والتواصل"},
      'Service-Based Business': {en: "Excellent 🤝 Service businesses thrive on trust and proven results", ar: "ممتاز 🤝 الأعمال الخدمية تزدهر بالثقة والنتائج المثبتة"},
      'Education': {en: "Smart choice 📚 Educational content builds strong authority", ar: "اختيار ذكي 📚 المحتوى التعليمي يبني مرجعية قوية"},
      'Entertainment & Activities': {en: "Fun choice 🎉 Entertainment content is all about energy and community", ar: "اختيار ممتع 🎉 المحتوى الترفيهي يعتمد على الطاقة والمجتمع"}
    };
    return feedbacks[category] ? feedbacks[category][interfaceLang === 'Arabic' ? 'ar' : 'en'] : null;
  };

  const getSuggestedNiches = (category: string) => {
    const suggestions: Record<string, string[]> = {
      'Handmade Business': ['Handmade Accessories', 'Personalized Gifts', 'Custom Products'],
      'Tech & Digital': ['SaaS', 'AI Tools', 'Mobile Apps'],
      'Restaurant & Food': ['Cafe', 'Fast Food', 'Fine Dining'],
      'E-commerce': ['Fashion', 'Beauty', 'Digital Products'],
      'Personal Brand': ['Creator', 'Coach', 'Influencer'],
      'Service-Based Business': ['Agency', 'Freelancer'],
      'Education': ['Online Course', 'Tutor'],
      'Entertainment & Activities': ['Padel Courts', 'Gaming Lounge']
    };
    return suggestions[category] || [];
  };

  const getSmartFeedback = (niche: string) => {
    const feedbacks: Record<string, {en: string, ar: string}> = {
      // E-commerce
      'Fashion': {en: "Highly visual and trend-driven content works best here", ar: "المحتوى البصري والمواكب للتريند يعمل بشكل أفضل هنا"},
      'Electronics': {en: "Focus on features, unboxing, and tech lifestyle integration", ar: "ركز على الميزات، فتح الصندوق، ودمج التكنولوجيا في أسلوب الحياة"},
      'Beauty': {en: "Highly visual, focusing on transformations and aesthetic appeal", ar: "محتوى بصري للغاية، يركز على التحولات والجاذبية الجمالية"},
      'Home Goods': {en: "Ideal for cozy, aesthetic, and lifestyle-oriented content", ar: "مثالي للمحتوى الدافئ، الجمالي، والموجه لأسلوب الحياة"},
      'Food & Beverage': {en: "Appetite-appealing content with strong sensory descriptions", ar: "محتوى مشهي مع أوصاف حسية قوية"},
      'Digital Products': {en: "Focus on value, benefits, and instant transformation", ar: "ركز على القيمة، الفوائد، والتحول الفوري"},
      
      // Personal Brand
      'Creator': {en: "Authenticity and trend-setting are your biggest assets", ar: "الأصالة ومواكبة التريند هي أكبر أصولك"},
      'Coach': {en: "Focus on transformation, motivation, and actionable advice", ar: "ركز على التحول، التحفيز، والنصائح العملية"},
      'Consultant': {en: "Authority-building content driven by industry insights", ar: "محتوى يبني المرجعية مدفوع برؤى الصناعة"},
      'Artist': {en: "Showcase your process, inspiration, and the emotion behind your work", ar: "اعرض عمليتك، إلهامك، والعاطفة وراء عملك"},
      'Influencer': {en: "Community-driven content focusing on lifestyle and recommendations", ar: "محتوى مدفوع بالمجتمع يركز على أسلوب الحياة والتوصيات"},
      
      // Service-Based Business
      'Agency': {en: "Highlight your team's expertise, culture, and client results", ar: "أبرز خبرة فريقك، ثقافتك، ونتائج العملاء"},
      'Freelancer': {en: "Build trust through your unique process and personal expertise", ar: "ابنِ الثقة من خلال عمليتك الفريدة وخبرتك الشخصية"},
      'Local Business': {en: "Community-focused content emphasizing convenience and local pride", ar: "محتوى يركز على المجتمع ويبرز الراحة والفخر المحلي"},
      
      // Restaurant & Food
      'Fine Dining': {en: "Focus on elegance, culinary art, and exclusive experiences", ar: "ركز على الأناقة، فن الطهي، والتجارب الحصرية"},
      'Fast Food': {en: "High-energy, crave-worthy content with strong calls to action", ar: "محتوى عالي الطاقة ومشهي مع دعوات قوية لاتخاذ إجراء"},
      'Cafe': {en: "Cozy, aesthetic content focusing on coffee culture and relaxation", ar: "محتوى دافئ وجمالي يركز على ثقافة القهوة والاسترخاء"},
      'Food Truck': {en: "Street-style, dynamic content showing the hustle and fresh food", ar: "محتوى ديناميكي بأسلوب الشارع يظهر النشاط والطعام الطازج"},
      'Bakery': {en: "Warm, comforting visuals focusing on freshness and baking processes", ar: "مرئيات دافئة ومريحة تركز على النضارة وعمليات الخبز"},
      
      // Education
      'Online Course': {en: "Best for authority-building and value-driven content", ar: "الأفضل لبناء المرجعية والمحتوى المليء بالقيمة"},
      'School': {en: "Community and growth-focused content for parents and students", ar: "محتوى يركز على المجتمع والنمو للآباء والطلاب"},
      'University': {en: "Highlight academic excellence, campus culture, and future opportunities", ar: "أبرز التميز الأكاديمي، ثقافة الحرم الجامعي، وفرص المستقبل"},
      'Tutor': {en: "Focus on clarity, patience, and student breakthroughs", ar: "ركز على الوضوح، الصبر، ونجاحات الطلاب"},
      'EdTech': {en: "Showcase innovation, ease of learning, and technological advantages", ar: "اعرض الابتكار، سهولة التعلم، والمزايا التكنولوجية"},
      
      // Tech & Digital
      'SaaS': {en: "Focus on solving pain points, efficiency, and ROI", ar: "ركز على حل المشاكل، الكفاءة، وعائد الاستثمار"},
      'Mobile Apps': {en: "Highlight user experience, convenience, and daily integration", ar: "أبرز تجربة المستخدم، الراحة، والدمج اليومي"},
      'AI Tools': {en: "Showcase magic-like results, time-saving, and future tech", ar: "اعرض نتائج سحرية، توفير الوقت، وتكنولوجيا المستقبل"},
      'Web3 / Blockchain': {en: "Focus on community, decentralization, and future opportunities", ar: "ركز على المجتمع، اللامركزية، وفرص المستقبل"},
      'Hardware': {en: "Emphasize build quality, performance specs, and real-world usage", ar: "أكد على جودة البناء، مواصفات الأداء، والاستخدام في العالم الحقيقي"},
      
      // Entertainment & Activities
      'Kids Area': {en: "Joyful, safe, and family-friendly content targeting parents", ar: "محتوى مبهج، آمن، وعائلي يستهدف الآباء"},
      'Padel Courts': {en: "Great for high-energy, competitive, and social content", ar: "رائع للمحتوى عالي الطاقة، التنافسي، والاجتماعي"},
      'Football Field': {en: "High-energy content focusing on teamwork, goals, and passion", ar: "محتوى عالي الطاقة يركز على العمل الجماعي، الأهداف، والشغف"},
      'Basketball Court': {en: "Dynamic content highlighting skill, competition, and street culture", ar: "محتوى ديناميكي يبرز المهارة، المنافسة، وثقافة الشارع"},
      'PlayStation Café': {en: "Ideal for fun, reaction-based, and viral content", ar: "مثالي للمحتوى الفيروسي والمرح وردود الأفعال"},
      'Gaming Lounge': {en: "Ideal for fun, reaction-based, and viral content", ar: "مثالي للمحتوى الفيروسي والمرح وردود الأفعال"},
      
      // Handmade Business
      'Handmade Accessories': {en: "Perfect for emotional storytelling and showcasing craftsmanship", ar: "مثالي للسرد القصصي العاطفي وعرض الحرفية"},
      'Home Decor': {en: "Aesthetic content showing how pieces transform a living space", ar: "محتوى جمالي يوضح كيف تحول القطع مساحة المعيشة"},
      'Gifts': {en: "Focus on the joy of giving and emotional connections", ar: "ركز على متعة العطاء والروابط العاطفية"},
      'Personalized Gifts': {en: "Highlight the unique, custom nature of each item", ar: "أبرز الطبيعة الفريدة والمخصصة لكل عنصر"},
      'Custom Products': {en: "Showcase the collaboration process and tailored solutions", ar: "اعرض عملية التعاون والحلول المصممة خصيصاً"},
      'Art & Crafts': {en: "Highly visual content focusing on techniques and creativity", ar: "محتوى بصري للغاية يركز على التقنيات والإبداع"},
      'Small Handmade Business': {en: "Authentic, behind-the-scenes content of running a small shop", ar: "محتوى أصيل وخلف الكواليس لإدارة متجر صغير"},
    };
    
    const fallback = {en: "Great choice! This niche has strong potential for engaging content.", ar: "اختيار رائع! هذا التخصص لديه إمكانات قوية لمحتوى جذاب."};
    return feedbacks[niche] ? feedbacks[niche][interfaceLang === 'Arabic' ? 'ar' : 'en'] : fallback[interfaceLang === 'Arabic' ? 'ar' : 'en'];
  };

  const getMicroInsight = (niche: string) => {
    const insights: Record<string, {en: string, ar: string}> = {
      // E-commerce
      'Fashion': {en: "Best content: product showcase, styling ideas, offers", ar: "أفضل محتوى: عرض المنتجات، أفكار التنسيق، العروض"},
      'Electronics': {en: "Best content: unboxing, feature highlights, tech setups", ar: "أفضل محتوى: فتح الصندوق، إبراز الميزات، إعدادات الأجهزة"},
      'Beauty': {en: "Best content: tutorials, before/after, product textures", ar: "أفضل محتوى: شروحات، قبل/بعد، قوام المنتجات"},
      'Home Goods': {en: "Best content: room makeovers, styling tips, cozy vibes", ar: "أفضل محتوى: تجديد الغرف، نصائح التنسيق، أجواء دافئة"},
      'Food & Beverage': {en: "Best content: pouring shots, recipe ideas, taste reactions", ar: "أفضل محتوى: لقطات السكب، أفكار وصفات، ردود أفعال التذوق"},
      'Digital Products': {en: "Best content: tutorials, before/after results, use cases", ar: "أفضل محتوى: شروحات، نتائج قبل/بعد، حالات الاستخدام"},
      
      // Personal Brand
      'Creator': {en: "Best content: day in the life, behind the scenes, trending formats", ar: "أفضل محتوى: يوم في حياتي، كواليس، قوالب التريند"},
      'Coach': {en: "Best content: mindset shifts, client wins, step-by-step guides", ar: "أفضل محتوى: تغيير العقلية، نجاحات العملاء، أدلة خطوة بخطوة"},
      'Consultant': {en: "Best content: industry analysis, framework breakdowns, common mistakes", ar: "أفضل محتوى: تحليل الصناعة، تفصيل الأطر، أخطاء شائعة"},
      'Artist': {en: "Best content: timelapses, studio tours, meaning behind the art", ar: "أفضل محتوى: تصوير سريع للعمل، جولات الاستوديو، المعنى وراء الفن"},
      'Influencer': {en: "Best content: GRWM, favorites of the month, honest reviews", ar: "أفضل محتوى: استعد معي، مفضلات الشهر، مراجعات صادقة"},
      
      // Service-Based Business
      'Agency': {en: "Best content: portfolio showcases, team culture, industry tips", ar: "أفضل محتوى: عرض سابقة الأعمال، ثقافة الفريق، نصائح الصناعة"},
      'Freelancer': {en: "Best content: client transformations, tools I use, day in the life", ar: "أفضل محتوى: تحولات العملاء، أدوات أستخدمها، يوم في حياتي"},
      'Local Business': {en: "Best content: behind the counter, local events, customer spotlights", ar: "أفضل محتوى: خلف الكواليس، فعاليات محلية، تسليط الضوء على العملاء"},
      
      // Restaurant & Food
      'Fine Dining': {en: "Best content: chef in action, dish plating, ambiance tours", ar: "أفضل محتوى: الشيف أثناء العمل، تزيين الأطباق، جولات الأجواء"},
      'Fast Food': {en: "Best content: cheese pulls, limited offers, quick bites", ar: "أفضل محتوى: مط الجبنة، عروض محدودة، وجبات سريعة"},
      'Cafe': {en: "Best content: latte art, morning vibes, pastry showcases", ar: "أفضل محتوى: فن اللاتيه، أجواء الصباح، عرض المخبوزات"},
      'Food Truck': {en: "Best content: location updates, sizzling food, customer lines", ar: "أفضل محتوى: تحديثات الموقع، طعام ساخن، طوابير العملاء"},
      'Bakery': {en: "Best content: fresh out the oven, dough kneading, sweet treats", ar: "أفضل محتوى: طازج من الفرن، عجن العجين، حلويات"},
      
      // Education
      'Online Course': {en: "Best content: tips, mini-lessons, common mistakes", ar: "أفضل محتوى: نصائح، دروس مصغرة، أخطاء شائعة"},
      'School': {en: "Best content: student achievements, campus life, educational tips", ar: "أفضل محتوى: إنجازات الطلاب، الحياة الجامعية، نصائح تعليمية"},
      'University': {en: "Best content: alumni success, research highlights, student events", ar: "أفضل محتوى: نجاح الخريجين، أبرز الأبحاث، فعاليات الطلاب"},
      'Tutor': {en: "Best content: quick study hacks, complex topics simplified, success stories", ar: "أفضل محتوى: حيل دراسية سريعة، تبسيط المواضيع المعقدة، قصص نجاح"},
      'EdTech': {en: "Best content: platform demos, learning stats, feature updates", ar: "أفضل محتوى: عروض توضيحية للمنصة، إحصائيات التعلم، تحديثات الميزات"},
      
      // Tech & Digital
      'SaaS': {en: "Best content: feature highlights, use cases, customer testimonials", ar: "أفضل محتوى: إبراز الميزات، حالات الاستخدام، شهادات العملاء"},
      'Mobile Apps': {en: "Best content: app walkthroughs, hidden features, user generated content", ar: "أفضل محتوى: جولات في التطبيق، ميزات مخفية، محتوى من إنشاء المستخدمين"},
      'AI Tools': {en: "Best content: before/after AI, prompt tutorials, workflow automation", ar: "أفضل محتوى: قبل/بعد الذكاء الاصطناعي، شروحات الأوامر، أتمتة سير العمل"},
      'Web3 / Blockchain': {en: "Best content: project updates, educational threads, community AMAs", ar: "أفضل محتوى: تحديثات المشروع، سلاسل تعليمية، أسئلة وأجوبة للمجتمع"},
      'Hardware': {en: "Best content: product teardowns, performance tests, setup tours", ar: "أفضل محتوى: تفكيك المنتج، اختبارات الأداء، جولات الإعداد"},
      
      // Entertainment & Activities
      'Kids Area': {en: "Best content: kids playing, safety measures, birthday packages", ar: "أفضل محتوى: لعب الأطفال، إجراءات السلامة، باقات أعياد الميلاد"},
      'Padel Courts': {en: "Best content: match highlights, challenges, group moments", ar: "أفضل محتوى: لقطات المباريات، التحديات، اللحظات الجماعية"},
      'Football Field': {en: "Best content: best goals, team celebrations, tournament updates", ar: "أفضل محتوى: أفضل الأهداف، احتفالات الفرق، تحديثات البطولات"},
      'Basketball Court': {en: "Best content: trick shots, game highlights, player interviews", ar: "أفضل محتوى: رميات استعراضية، لقطات المباريات، مقابلات اللاعبين"},
      'PlayStation Café': {en: "Best content: gameplay reactions, funny moments, tournaments", ar: "أفضل محتوى: ردود أفعال اللعب، لحظات مضحكة، بطولات"},
      'Gaming Lounge': {en: "Best content: gameplay reactions, funny moments, tournaments", ar: "أفضل محتوى: ردود أفعال اللعب، لحظات مضحكة، بطولات"},
      
      // Handmade Business
      'Handmade Accessories': {en: "Best content: behind-the-scenes, product creation, customer stories", ar: "أفضل محتوى: كواليس، صناعة المنتج، قصص العملاء"},
      'Home Decor': {en: "Best content: room styling, detail shots, creation process", ar: "أفضل محتوى: تنسيق الغرف، لقطات تفصيلية، عملية الصنع"},
      'Gifts': {en: "Best content: unboxing reactions, gift guides, packaging ASMR", ar: "أفضل محتوى: ردود أفعال فتح الهدايا، أدلة الهدايا، أصوات التغليف"},
      'Personalized Gifts': {en: "Best content: making-of specific orders, customer reactions, detail close-ups", ar: "أفضل محتوى: صنع طلبات محددة، ردود أفعال العملاء، لقطات مقربة للتفاصيل"},
      'Custom Products': {en: "Best content: from sketch to reality, client briefs, final product", ar: "أفضل محتوى: من الرسم إلى الواقع، ملخصات العملاء، المنتج النهائي"},
      'Art & Crafts': {en: "Best content: satisfying process videos, material hauls, final reveals", ar: "أفضل محتوى: فيديوهات عملية مرضية، مشتريات المواد، الكشف النهائي"},
      'Small Handmade Business': {en: "Best content: pack an order with me, studio vlogs, small biz struggles", ar: "أفضل محتوى: جهز طلباً معي، فلوجات الاستوديو، تحديات المشاريع الصغيرة"},
    };
    
    const fallback = {en: "Best content: educational tips, behind the scenes, engaging questions", ar: "أفضل محتوى: نصائح تعليمية، خلف الكواليس، أسئلة تفاعلية"};
    return insights[niche] ? insights[niche][interfaceLang === 'Arabic' ? 'ar' : 'en'] : fallback[interfaceLang === 'Arabic' ? 'ar' : 'en'];
  };

  const getToneFeedback = (tone: string) => {
    const feedbacks: Record<string, {en: string, ar: string}> = {
      'Bold': {en: "Bold choice! Stand out from the crowd 🔥", ar: "اختيار جريء! تميز عن الجميع 🔥"},
      'Fun': {en: "Fun and engaging! People love that 😄", ar: "ممتع وجذاب! الجمهور يحب ذلك 😄"},
      'Professional': {en: "Professional and trustworthy 💼", ar: "احترافي وموثوق 💼"},
      'Luxury': {en: "Elegant and premium ✨", ar: "أنيق وفاخر ✨"},
      'Friendly': {en: "Warm and welcoming 🤝", ar: "ودود ومرحب 🤝"}
    };
    return feedbacks[tone] ? feedbacks[tone][interfaceLang === 'Arabic' ? 'ar' : 'en'] : null;
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="brandName">{t.brandName}</Label>
              <Input 
                id="brandName" 
                placeholder={t.brandNamePlaceholder} 
                value={state.brandName}
                onChange={(e) => updateState({ brandName: e.target.value })}
                className="text-lg py-6"
              />
              {state.brandName.length > 2 && !state.toneOfVoice && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-primary/80 font-medium flex items-center gap-2 pt-2">
                  <span className="text-lg leading-none">👋</span> {interfaceLang === 'Arabic' ? `أهلاً بك يا ${state.brandName}! كيف تحب أن تبدو نبرة صوتك؟` : `Nice to meet you, ${state.brandName}! How should you sound?`}
                </motion.div>
              )}
            </div>
            
            <div className="space-y-3">
              <Label>{t.toneOfVoice}</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Bold', 'Fun', 'Professional', 'Luxury', 'Friendly'].map((tone) => (
                  <div
                    key={tone}
                    onClick={() => updateState({ toneOfVoice: tone as any })}
                    className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all ${
                      state.toneOfVoice === tone 
                        ? 'border-primary bg-primary/10 text-primary font-medium shadow-sm' 
                        : 'border-muted hover:border-primary/50'
                    }`}
                  >
                    {t.tones[tone as keyof typeof t.tones]}
                  </div>
                ))}
              </div>
              {state.toneOfVoice && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-primary/80 font-medium flex items-center gap-2 pt-2">
                  <span className="text-lg leading-none">✨</span> {getToneFeedback(state.toneOfVoice)}
                </motion.div>
              )}
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-3">
              <Label>{t.businessCategory}</Label>
              <div className={state.subCategory.length > 0 ? "flex items-center gap-3" : "grid grid-cols-2 md:grid-cols-3 gap-3"}>
                {Object.keys(BUSINESS_SUBCATEGORIES)
                  .filter(category => state.subCategory.length === 0 || state.businessCategory === category)
                  .map((category) => {
                    const isSelected = state.businessCategory === category;
                    const isIsolated = isSelected && state.subCategory.length > 0;
                    
                    if (isIsolated) {
                      return (
                        <div key={category} className="flex items-center gap-3 w-full md:w-auto">
                          <div className="rounded-xl border-2 border-primary bg-primary/10 text-primary font-medium shadow-sm p-4 text-center flex-1 md:flex-none md:min-w-[250px] relative">
                            <div className="absolute top-2 right-2">
                              <CheckCircle2 className="w-4 h-4 text-primary" />
                            </div>
                            {t.categories[category as keyof typeof t.categories]}
                          </div>
                          <div 
                            className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-muted hover:border-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer transition-all shrink-0"
                            onClick={() => updateState({ subCategory: [] })}
                          >
                            <X className="w-5 h-5" />
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={category}
                        onClick={() => updateState({ businessCategory: category as any, subCategory: [] })}
                        className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all relative overflow-hidden ${
                          isSelected 
                            ? 'border-primary bg-primary/10 text-primary font-medium shadow-sm' 
                            : 'border-muted hover:border-primary/50'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                          </div>
                        )}
                        {t.categories[category as keyof typeof t.categories]}
                      </div>
                    );
                  })}
              </div>
            </div>

            {state.businessCategory && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4 pt-4"
              >
                {getCategoryFeedback(state.businessCategory) && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-muted/50 rounded-lg text-sm text-foreground/80 flex items-start gap-2"
                  >
                    <span className="text-lg leading-none mt-0.5">💬</span>
                    <p>{getCategoryFeedback(state.businessCategory)}</p>
                  </motion.div>
                )}

                <div className="space-y-3">
                  <Label>{t.specificNiche}</Label>
                  <div className="flex flex-wrap gap-2">
                    {BUSINESS_SUBCATEGORIES[state.businessCategory].map((sub) => {
                      const isSelected = state.subCategory.includes(sub);
                      const isSuggested = getSuggestedNiches(state.businessCategory).includes(sub);
                      
                      return (
                        <Badge
                          key={sub}
                          variant={isSelected ? 'default' : 'outline'}
                          className={`cursor-pointer text-sm py-1.5 px-3 transition-all ${
                            isSelected ? 'shadow-sm' : isSuggested ? 'border-primary/40 hover:border-primary/60' : ''
                          }`}
                          onClick={() => {
                            updateState({
                              subCategory: isSelected
                                ? state.subCategory.filter(s => s !== sub)
                                : [...state.subCategory, sub]
                            });
                          }}
                        >
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 ltr:mr-1.5 rtl:ml-1.5 inline-block" />}
                          {isSuggested && !isSelected && <Sparkles className="w-3 h-3 ltr:mr-1.5 rtl:ml-1.5 inline-block text-primary/70" />}
                          {t.subCategories[sub as keyof typeof t.subCategories] || sub}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                {state.subCategory.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="pt-2"
                  >
                    <div className="text-xs text-muted-foreground mb-2">{t.selected}</div>
                    <div className="flex flex-wrap gap-2">
                      {state.subCategory.map(sub => (
                        <Badge key={`selected-${sub}`} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                          {t.subCategories[sub as keyof typeof t.subCategories] || sub}
                          <div 
                            className="cursor-pointer hover:bg-muted-foreground/20 rounded-full p-0.5"
                            onClick={() => updateState({ subCategory: state.subCategory.filter(s => s !== sub) })}
                          >
                            <X className="w-3 h-3" />
                          </div>
                        </Badge>
                      ))}
                    </div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 text-sm text-primary/80 font-medium flex items-center gap-2"
                    >
                      <span className="text-lg leading-none">👍</span>
                      {interfaceLang === 'Arabic' ? 'ممتاز، لقد اقتربنا!' : 'Perfect, we\'re getting closer!'}
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {state.businessCategory === 'Service-Based Business' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-3 pt-4"
              >
                <Label>{interfaceLang === 'Arabic' ? 'مجال الخدمة' : 'Service Industry'}</Label>
                <div className="flex flex-wrap gap-2">
                  {SERVICE_INDUSTRIES.map((industry) => (
                    <Badge
                      key={industry}
                      variant={state.serviceIndustry === industry ? 'default' : 'outline'}
                      className="cursor-pointer text-sm py-1.5 px-3"
                      onClick={() => updateState({ serviceIndustry: industry })}
                    >
                      {/* @ts-ignore */}
                      {t.serviceIndustries?.[industry] || industry}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            )}

            {state.subCategory.length > 0 && (
              <div className="space-y-3 mt-4">
                {state.subCategory.map(niche => {
                  const feedback = getSmartFeedback(niche);
                  const insight = getMicroInsight(niche);
                  if (!feedback && !insight) return null;
                  return (
                    <motion.div
                      key={`feedback-${niche}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-primary/5 border border-primary/20 rounded-lg flex flex-col gap-1"
                    >
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-sm">{t.subCategories[niche as keyof typeof t.subCategories] || niche}</span>
                      </div>
                      {feedback && <p className="text-sm text-primary/80 font-medium mt-1">{feedback}</p>}
                      {insight && <p className="text-xs text-muted-foreground mt-1">{insight}</p>}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="space-y-3">
              <Label>{t.primaryGoal}</Label>
              <div className="grid grid-cols-2 gap-3">
                {['Awareness', 'Sales', 'Engagement', 'Lead Generation'].map((goal) => (
                  <div
                    key={goal}
                    onClick={() => updateState({ goal: goal as any })}
                    className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all ${
                      state.goal === goal 
                        ? 'border-primary bg-primary/10 text-primary font-medium shadow-sm' 
                        : 'border-muted hover:border-primary/50'
                    }`}
                  >
                    {t.goals[goal as keyof typeof t.goals]}
                  </div>
                ))}
              </div>
              {state.goal && !state.duration && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-primary/80 font-medium flex items-center gap-2 pt-2">
                  <span className="text-lg leading-none">🎯</span> {interfaceLang === 'Arabic' ? 'هدف ممتاز! لنحدد الإطار الزمني.' : 'Great goal! Let\'s set a timeline.'}
                </motion.div>
              )}
            </div>

            <div className="space-y-3">
              <Label>{t.contentPlanDuration}</Label>
              <div className="grid grid-cols-3 gap-3">
                {['7 Days', '14 Days', '30 Days'].map((duration) => (
                  <div
                    key={duration}
                    onClick={() => updateState({ duration: duration as any })}
                    className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all ${
                      state.duration === duration 
                        ? 'border-primary bg-primary/10 text-primary font-medium shadow-sm' 
                        : 'border-muted hover:border-primary/50'
                    }`}
                  >
                    {t.durations[duration as keyof typeof t.durations]}
                  </div>
                ))}
              </div>
              {state.goal && state.duration && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-primary/80 font-medium flex items-center gap-2 pt-2">
                  <span className="text-lg leading-none">✅</span> {interfaceLang === 'Arabic' ? 'رائع، لدينا خطة قوية.' : 'Awesome, we have a solid plan.'}
                </motion.div>
              )}
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="space-y-3">
              <Label>{t.targetPlatforms}</Label>
              <div className="flex flex-wrap gap-3">
                {['Instagram', 'Facebook', 'TikTok', 'LinkedIn', 'YouTube'].map((platform) => {
                  const isSelected = state.platforms.includes(platform as Platform);
                  return (
                    <div
                      key={platform}
                      onClick={() => {
                        if (isSelected) {
                          updateState({ platforms: state.platforms.filter(p => p !== platform) });
                        } else {
                          updateState({ platforms: [...state.platforms, platform as Platform] });
                        }
                      }}
                      className={`cursor-pointer rounded-xl border-2 px-5 py-3 flex items-center gap-2 transition-all ${
                        isSelected 
                          ? 'border-primary bg-primary/10 text-primary font-medium shadow-sm' 
                          : 'border-muted hover:border-primary/50'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-4 h-4" />}
                      {platform}
                    </div>
                  );
                })}
              </div>
              {state.platforms.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-primary/80 font-medium flex items-center gap-2 pt-2">
                  <span className="text-lg leading-none">📱</span> {state.platforms.length === 1 ? t.excellentPlatform : t.excellentPlatformMix}
                </motion.div>
              )}
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>{t.contentLanguage}</Label>
                  <Select 
                    value={state.contentLanguage} 
                    onValueChange={(val: any) => updateState({ contentLanguage: val, arabicDialect: '', englishTone: '' })}
                  >
                    <SelectTrigger>
                      <SelectValue>
                        {state.contentLanguage === 'Arabic' ? 'عربي' : 'English'}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Arabic">عربي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {state.contentLanguage === 'Arabic' ? (
                  <div className="space-y-2">
                    <Label>{t.dialect}</Label>
                    <Select value={state.arabicDialect} onValueChange={(val: any) => updateState({ arabicDialect: val })}>
                      <SelectTrigger>
                        <SelectValue placeholder={t.selectDialect}>
                          {state.arabicDialect ? translations.ar.dialects[state.arabicDialect as keyof typeof translations.ar.dialects] : t.selectDialect}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Egyptian Colloquial">{translations.ar.dialects['Egyptian Colloquial']}</SelectItem>
                        <SelectItem value="Gulf Arabic">{translations.ar.dialects['Gulf Arabic']}</SelectItem>
                        <SelectItem value="Modern Standard Arabic">{translations.ar.dialects['Modern Standard Arabic']}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>{t.writingTone}</Label>
                    <Select value={state.englishTone} onValueChange={(val: any) => updateState({ englishTone: val })}>
                      <SelectTrigger>
                        <SelectValue placeholder={t.selectTone}>
                          {state.englishTone ? t.englishTones[state.englishTone as keyof typeof t.englishTones] : t.selectTone}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Casual">{t.englishTones['Casual']}</SelectItem>
                        <SelectItem value="Professional">{t.englishTones['Professional']}</SelectItem>
                        <SelectItem value="Marketing Tone">{t.englishTones['Marketing Tone']}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              {((state.contentLanguage === 'Arabic' && state.arabicDialect) || (state.contentLanguage === 'English' && state.englishTone)) && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-primary/80 font-medium flex items-center gap-2 pt-2">
                  <span className="text-lg leading-none">✨</span> {interfaceLang === 'Arabic' ? 'كل شيء جاهز! مستعدون للبدء.' : 'All set! Ready to generate magic.'}
                </motion.div>
              )}
            </div>
          </motion.div>
        );
    }
  };

  const stepTitles = [
    t.brandIdentity,
    t.businessProfile,
    t.goalsTimeline,
    t.platformsVoice
  ];

  const stepDescriptions = [
    t.brandIdentityDesc,
    t.businessProfileDesc,
    t.goalsTimelineDesc,
    t.platformsVoiceDesc
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-[0_8px_20px_-6px_var(--tw-shadow-color)] shadow-primary/25 border-muted/50 overflow-hidden">
        <div className="flex h-2 bg-muted">
          <motion.div 
            className="bg-primary h-full" 
            initial={{ width: 0 }}
            animate={{ width: `${(step / 4) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <CardHeader className="pb-8">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="text-muted-foreground">
              {t.step} {step} {t.of} 4 
              {step === 1 && t.niceToMeetYou}
              {step === 2 && t.doingGreat}
              {step === 3 && t.almostThere}
              {step === 4 && t.finalTouches}
            </Badge>
            {step === 4 && <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none"><Sparkles className="w-3 h-3 ltr:mr-1 rtl:ml-1" /> {t.aiReady}</Badge>}
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">{stepTitles[step - 1]}</CardTitle>
          <CardDescription className="text-base">
            {stepDescriptions[step - 1]}
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[320px]">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </CardContent>
        <CardFooter className="flex justify-between pt-6 border-t bg-muted/20">
          <Button 
            variant="ghost" 
            onClick={prevStep} 
            disabled={step === 1}
            className="text-muted-foreground"
          >
            <ChevronLeft className="w-4 h-4 ltr:mr-2 rtl:ml-2 rtl:rotate-180" /> {t.back}
          </Button>
          
          {step < 4 ? (
            <motion.div
              animate={isStepValid() ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Button onClick={nextStep} disabled={!isStepValid()} className={`px-8 transition-all ${isStepValid() ? 'shadow-md shadow-primary/20' : ''}`}>
                {t.next} <ChevronRight className="w-4 h-4 ltr:ml-2 rtl:mr-2 rtl:rotate-180" />
              </Button>
            </motion.div>
          ) : (
            <Button 
              onClick={() => onComplete(state)} 
              disabled={!isStepValid()} 
              className="px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              <Sparkles className="w-4 h-4 ltr:mr-2 rtl:ml-2" /> {t.generateStrategy}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
