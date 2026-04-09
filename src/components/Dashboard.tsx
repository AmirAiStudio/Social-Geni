import React, { useState } from 'react';
import { AppState } from '../types';
import { generateContent } from '../services/gemini';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, Copy, CheckCircle2, Sparkles, RefreshCw, LayoutTemplate, Image as ImageIcon, Video, MessageSquare, Megaphone, Lightbulb } from 'lucide-react';
import { translations } from '../translations';

interface DashboardProps {
  state: AppState;
  strategy: any;
  onReset: () => void;
  interfaceLang: 'English' | 'Arabic';
}

export function Dashboard({ state, strategy, onReset, interfaceLang }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('strategy');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Content Generator Options
  const [captionStyle, setCaptionStyle] = useState('Storytelling');
  const [captionLength, setCaptionLength] = useState('Medium');
  const [imageStyle, setImageStyle] = useState('Cinematic');
  const [includeLogo, setIncludeLogo] = useState(false);
  const [includeProduct, setIncludeProduct] = useState(false);
  const [videoDuration, setVideoDuration] = useState('15s');
  const [videoStyle, setVideoStyle] = useState('Hook');
  const [imageRatio, setImageRatio] = useState('1:1');
  const [isCarousel, setIsCarousel] = useState(false);
  const [videoRatio, setVideoRatio] = useState('9:16');

  const t = translations[interfaceLang === 'Arabic' ? 'ar' : 'en'];

  const handleGenerate = async (type: string) => {
    setIsGenerating(true);
    setGeneratedContent(null);
    try {
      let options = {};
      if (type === 'Captions') options = { style: captionStyle, length: captionLength };
      if (type === 'Image Prompts') options = { style: imageStyle, includeLogo, includeProduct, ratio: imageRatio, isCarousel };
      if (type === 'Video Scripts') options = { duration: videoDuration, style: videoStyle, ratio: videoRatio };
      
      const result = await generateContent({ ...state, interfaceLanguage: interfaceLang }, type, options);
      setGeneratedContent({ type, data: result });
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {state.brandName} - {state.subCategory.join(', ')}
          </h1>
          <p className="text-muted-foreground">
            {t.goals[state.goal as keyof typeof t.goals] || state.goal} • {t.durations[state.duration as keyof typeof t.durations] || state.duration}
          </p>
        </div>
        <Button variant="outline" onClick={onReset}>{t.startOver}</Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 h-auto p-1 bg-muted/50">
          <TabsTrigger value="strategy" className="py-3"><LayoutTemplate className="w-4 h-4 ltr:mr-2 rtl:ml-2" /> {t.strategy}</TabsTrigger>
          <TabsTrigger value="captions" className="py-3"><MessageSquare className="w-4 h-4 ltr:mr-2 rtl:ml-2" /> {t.captions}</TabsTrigger>
          <TabsTrigger value="images" className="py-3"><ImageIcon className="w-4 h-4 ltr:mr-2 rtl:ml-2" /> {t.images}</TabsTrigger>
          <TabsTrigger value="videos" className="py-3"><Video className="w-4 h-4 ltr:mr-2 rtl:ml-2" /> {t.videos}</TabsTrigger>
          <TabsTrigger value="ads" className="py-3"><Megaphone className="w-4 h-4 ltr:mr-2 rtl:ml-2" /> {t.ads}</TabsTrigger>
          <TabsTrigger value="ideas" className="py-3"><Lightbulb className="w-4 h-4 ltr:mr-2 rtl:ml-2" /> {t.ideas}</TabsTrigger>
        </TabsList>

        <TabsContent value="strategy" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>{t.platformStrategy}</CardTitle>
                <CardDescription>{t.platformStrategyDesc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {strategy?.platforms?.map((p: any, i: number) => (
                  <div key={i} className="space-y-2 pb-4 border-b last:border-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">{p.platform}</h3>
                      <Badge variant="secondary">{p.postingFrequency}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {p.contentTypes?.map((ct: string, j: number) => (
                        <Badge key={j} variant="outline" className="bg-primary/5">{ct}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t.contentMix}</CardTitle>
                <CardDescription>{t.contentMixDesc} {t.durations[state.duration as keyof typeof t.durations] || state.duration}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {strategy?.contentMix?.map((mix: any, i: number) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{mix.category}</span>
                        <span className="font-medium">{mix.percentage}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${mix.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {strategy?.summary && (
                  <div className="mt-6 p-4 bg-muted/30 rounded-lg text-sm leading-relaxed">
                    {strategy.summary}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Captions Generator */}
        <TabsContent value="captions">
          <Card>
            <CardHeader>
              <CardTitle>{t.captionGenerator}</CardTitle>
              <CardDescription>{t.captionGeneratorDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="space-y-6 md:col-span-1 border-r pr-6">
                  <div className="space-y-3">
                    <Label>{t.style}</Label>
                    <Select value={captionStyle} onValueChange={setCaptionStyle}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Storytelling">{t.captionStyles['Storytelling']}</SelectItem>
                        <SelectItem value="Emotional">{t.captionStyles['Emotional']}</SelectItem>
                        <SelectItem value="Funny">{t.captionStyles['Funny']}</SelectItem>
                        <SelectItem value="Salesy">{t.captionStyles['Salesy']}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label>{t.length}</Label>
                    <Select value={captionLength} onValueChange={setCaptionLength}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Short">{t.captionLengths['Short']}</SelectItem>
                        <SelectItem value="Medium">{t.captionLengths['Medium']}</SelectItem>
                        <SelectItem value="Long">{t.captionLengths['Long']}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => handleGenerate('Captions')}
                    disabled={isGenerating}
                  >
                    {isGenerating ? <Loader2 className="w-4 h-4 ltr:mr-2 rtl:ml-2 animate-spin" /> : <Sparkles className="w-4 h-4 ltr:mr-2 rtl:ml-2" />}
                    {t.generate}
                  </Button>
                </div>
                
                <div className="md:col-span-3">
                  <ContentResults 
                    isGenerating={isGenerating} 
                    content={generatedContent?.type === 'Captions' ? generatedContent.data : null} 
                    copiedIndex={copiedIndex}
                    onCopy={copyToClipboard}
                    t={t}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Image Prompts Generator */}
        <TabsContent value="images">
          <Card>
            <CardHeader>
              <CardTitle>{t.imagePromptGenerator}</CardTitle>
              <CardDescription>{t.imagePromptGeneratorDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="space-y-6 md:col-span-1 border-r pr-6">
                  <div className="space-y-3">
                    <Label>{t.visualStyle}</Label>
                    <Select value={imageStyle} onValueChange={setImageStyle}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cinematic">{t.imageStyles['Cinematic']}</SelectItem>
                        <SelectItem value="Minimal">{t.imageStyles['Minimal']}</SelectItem>
                        <SelectItem value="Luxury">{t.imageStyles['Luxury']}</SelectItem>
                        <SelectItem value="Pixar">{t.imageStyles['Pixar']}</SelectItem>
                        <SelectItem value="Modern">{t.imageStyles['Modern']}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label>{t.aspectRatio}</Label>
                    <Select value={imageRatio} onValueChange={setImageRatio}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="16:9">{t.ratios['16:9']}</SelectItem>
                        <SelectItem value="9:16">{t.ratios['9:16']}</SelectItem>
                        <SelectItem value="1:1">{t.ratios['1:1']}</SelectItem>
                        <SelectItem value="4:5">{t.ratios['4:5']}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2 rtl:space-x-reverse">
                      <input 
                        type="checkbox" 
                        id="isCarousel" 
                        checked={isCarousel}
                        onChange={(e) => setIsCarousel(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="isCarousel" className="cursor-pointer">{t.isCarousel}</Label>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2 rtl:space-x-reverse">
                      <input 
                        type="checkbox" 
                        id="includeLogo" 
                        checked={includeLogo}
                        onChange={(e) => setIncludeLogo(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="includeLogo" className="cursor-pointer">{t.includeLogo}</Label>
                        <p className="text-xs text-muted-foreground">{t.includeLogoDesc}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2 rtl:space-x-reverse">
                      <input 
                        type="checkbox" 
                        id="includeProduct" 
                        checked={includeProduct}
                        onChange={(e) => setIncludeProduct(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="includeProduct" className="cursor-pointer">{t.includeProduct}</Label>
                        <p className="text-xs text-muted-foreground">{t.includeProductDesc}</p>
                      </div>
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => handleGenerate('Image Prompts')}
                    disabled={isGenerating}
                  >
                    {isGenerating ? <Loader2 className="w-4 h-4 ltr:mr-2 rtl:ml-2 animate-spin" /> : <Sparkles className="w-4 h-4 ltr:mr-2 rtl:ml-2" />}
                    {t.generate}
                  </Button>
                </div>
                
                <div className="md:col-span-3">
                  <ContentResults 
                    isGenerating={isGenerating} 
                    content={generatedContent?.type === 'Image Prompts' ? generatedContent.data : null} 
                    copiedIndex={copiedIndex}
                    onCopy={copyToClipboard}
                    t={t}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Video Scripts Generator */}
        <TabsContent value="videos">
          <Card>
            <CardHeader>
              <CardTitle>{t.videoScriptGenerator}</CardTitle>
              <CardDescription>{t.videoScriptGeneratorDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="space-y-6 md:col-span-1 border-r pr-6">
                  <div className="space-y-3">
                    <Label>{t.duration}</Label>
                    <Select value={videoDuration} onValueChange={setVideoDuration}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7s">{t.videoDurations['7s']}</SelectItem>
                        <SelectItem value="15s">{t.videoDurations['15s']}</SelectItem>
                        <SelectItem value="30s">{t.videoDurations['30s']}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label>{t.aspectRatio}</Label>
                    <Select value={videoRatio} onValueChange={setVideoRatio}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="16:9">{t.ratios['16:9']}</SelectItem>
                        <SelectItem value="9:16">{t.ratios['9:16']}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label>{t.style}</Label>
                    <Select value={videoStyle} onValueChange={setVideoStyle}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hook">{t.videoStyles['Hook']}</SelectItem>
                        <SelectItem value="Story">{t.videoStyles['Story']}</SelectItem>
                        <SelectItem value="Problem-Solution">{t.videoStyles['Problem-Solution']}</SelectItem>
                        <SelectItem value="Funny">{t.videoStyles['Funny']}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => handleGenerate('Video Scripts')}
                    disabled={isGenerating}
                  >
                    {isGenerating ? <Loader2 className="w-4 h-4 ltr:mr-2 rtl:ml-2 animate-spin" /> : <Sparkles className="w-4 h-4 ltr:mr-2 rtl:ml-2" />}
                    {t.generate}
                  </Button>
                </div>
                
                <div className="md:col-span-3">
                  <ContentResults 
                    isGenerating={isGenerating} 
                    content={generatedContent?.type === 'Video Scripts' ? generatedContent.data : null} 
                    copiedIndex={copiedIndex}
                    onCopy={copyToClipboard}
                    t={t}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ads Generator */}
        <TabsContent value="ads">
          <Card>
            <CardHeader>
              <CardTitle>{t.adCopyGenerator}</CardTitle>
              <CardDescription>{t.adCopyGeneratorDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="space-y-6 md:col-span-1 border-r pr-6">
                  <p className="text-sm text-muted-foreground">
                    {t.adCopyHelp} <strong className="text-foreground">{t.goals[state.goal as keyof typeof t.goals] || state.goal}</strong>
                  </p>
                  <Button 
                    className="w-full" 
                    onClick={() => handleGenerate('Ad Copy')}
                    disabled={isGenerating}
                  >
                    {isGenerating ? <Loader2 className="w-4 h-4 ltr:mr-2 rtl:ml-2 animate-spin" /> : <Sparkles className="w-4 h-4 ltr:mr-2 rtl:ml-2" />}
                    {t.generate}
                  </Button>
                </div>
                
                <div className="md:col-span-3">
                  <ContentResults 
                    isGenerating={isGenerating} 
                    content={generatedContent?.type === 'Ad Copy' ? generatedContent.data : null} 
                    copiedIndex={copiedIndex}
                    onCopy={copyToClipboard}
                    t={t}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ideas Generator */}
        <TabsContent value="ideas">
          <Card>
            <CardHeader>
              <CardTitle>{t.contentIdeasGenerator}</CardTitle>
              <CardDescription>{t.contentIdeasGeneratorDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="space-y-6 md:col-span-1 border-r pr-6">
                  <p className="text-sm text-muted-foreground">
                    {t.contentIdeasHelp}
                  </p>
                  <Button 
                    className="w-full" 
                    onClick={() => handleGenerate('Content Ideas')}
                    disabled={isGenerating}
                  >
                    {isGenerating ? <Loader2 className="w-4 h-4 ltr:mr-2 rtl:ml-2 animate-spin" /> : <Sparkles className="w-4 h-4 ltr:mr-2 rtl:ml-2" />}
                    {t.generate}
                  </Button>
                </div>
                
                <div className="md:col-span-3">
                  <ContentResults 
                    isGenerating={isGenerating} 
                    content={generatedContent?.type === 'Content Ideas' ? generatedContent.data : null} 
                    copiedIndex={copiedIndex}
                    onCopy={copyToClipboard}
                    t={t}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}

function ContentResults({ isGenerating, content, copiedIndex, onCopy, t }: any) {
  if (isGenerating) {
    return (
      <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-muted-foreground space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p>{t.craftingContent}</p>
      </div>
    );
  }

  if (!content || !content.variations) {
    return (
      <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl p-8 text-center">
        <Sparkles className="w-12 h-12 mb-4 opacity-20" />
        <p>{t.selectOptions}</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-6">
        {content.variations.map((v: any, i: number) => (
          <Card key={i} className="bg-muted/30 border-muted">
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-background">{v.title || `${t.option} ${i + 1}`}</Badge>
                {v.platform && <Badge variant="secondary">{v.platform}</Badge>}
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onCopy(v.content, i)}
                className="h-8 w-8"
              >
                {copiedIndex === i ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap text-sm leading-relaxed font-medium">
                {v.content}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
