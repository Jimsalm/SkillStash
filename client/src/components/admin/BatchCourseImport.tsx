import { useState } from 'react';
import { Loader2, Plus, Upload, Trash2, Layers, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useBatchScrapeCourses, useBatchCreateCourses } from '@/hooks/useCourses';
import type { Course } from '@/api/courseApi';

interface BatchCourseImportProps {
  onSuccess?: () => void;
}

interface ScrapedCoursePreview extends Partial<Course> {
  id: string;
  software: string[];
}

const cleanPrice = (priceStr: string | undefined | null): number => {
  if (!priceStr) return 0;
  return parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
};

export default function BatchCourseImport({ onSuccess }: BatchCourseImportProps) {
  const [urls, setUrls] = useState<string>('');
  const [scrapedCourses, setScrapedCourses] = useState<ScrapedCoursePreview[]>([] as ScrapedCoursePreview[]);
  const [showResults, setShowResults] = useState<boolean>(false);

  const batchScrapeMutation = useBatchScrapeCourses();
  const batchCreateMutation = useBatchCreateCourses();

  const handleBatchScrape = async () => {
    const urlList = urls
      .split('\n')
      .map(u => u.trim())
      .filter(u => u.length > 0);

    if (urlList.length === 0) {
      toast.error('Please enter at least one URL');
      return;
    }

    if (urlList.length > 20) {
      toast.error('Maximum 20 URLs allowed per batch');
      return;
    }

    setShowResults(false);

    try {
      const data = await batchScrapeMutation.mutateAsync(urlList);

      const processed: ScrapedCoursePreview[] = data.results
        .filter(r => r.success && r.data)
        .map((result, idx) => ({
          id: `temp-${Date.now()}-${idx}`,
          title: result.data!.title,
          description: result.data!.description,
          instructor: result.data!.instructor,
          software: result.data!.technologies ? result.data!.technologies.split(',').map(t => t.trim()) : [],
          originalPrice: cleanPrice(result.data!.originalPrice),
          discountedPrice: cleanPrice(result.data!.discountedPrice),
          image: result.data!.imageUrl || '',
          udemyUrl: result.data!.udemyUrl || result.url,
          category: result.data!.category || '',
          subcategory: result.data!.subcategory || '',
          claimedCount: 0,
          couponCode: '',
          expiresAt: '',
          isActive: true
        }));

      setScrapedCourses(processed);
      setShowResults(true);
      
      toast.success(`Successfully scraped ${data.successful} out of ${data.total} courses`);
      
      if (data.failed > 0) {
        toast.warning(`${data.failed} URL(s) failed to scrape`);
      }

    } catch (error) {
      console.error('Batch scrape error:', error);
    }
  };

  const removeCourse = (id: string) => {
    setScrapedCourses(prev => prev.filter(c => c.id !== id));
  };

  const handleImportAll = async () => {
    if (scrapedCourses.length === 0) {
      toast.error('No courses to import');
      return;
    }
    
    const coursesToCreate = scrapedCourses.map(({ id, ...course }) => ({
      ...course,
      software: Array.isArray(course.software) 
        ? course.software 
        : (course.software as string).split(',').map(s => s.trim()).filter(Boolean)
    }));

    try {
      await batchCreateMutation.mutateAsync(coursesToCreate);
      
      // Clear form on success
      setScrapedCourses([]);
      setUrls('');
      setShowResults(false);
      
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error('Batch import error:', error);
    }
  };

  const isProcessing = batchScrapeMutation.isPending || batchCreateMutation.isPending;

  return (
    <div className="space-y-6">
      <Card className="bg-muted/50 border-dashed">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            1. Paste DiscUdemy URLs
          </CardTitle>
          <CardDescription>
            Enter up to 20 URLs (one per line) to scrape and create courses automatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            placeholder="https://www.discudemy.com/course/python-masterclass&#10;https://www.discudemy.com/course/web-dev-bootcamp"
            rows={6}
            className="font-mono text-sm"
            disabled={isProcessing}
          />
          <div className="flex justify-end">
            <Button
              onClick={handleBatchScrape}
              disabled={isProcessing || !urls.trim()}
            >
              {batchScrapeMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scraping...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Start Scraping
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {showResults && (
        <>
          <Separator />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                2. Review Scraped Results ({scrapedCourses.length})
              </h3>
              <Button 
                onClick={handleImportAll} 
                disabled={batchCreateMutation.isPending || scrapedCourses.length === 0}
                size="sm"
              >
                {batchCreateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Import All to Database
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scrapedCourses.map((course) => (
                <Card key={course.id} className="flex flex-col relative group overflow-hidden">
                  <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8 shadow-md"
                      onClick={() => removeCourse(course.id)}
                      disabled={batchCreateMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex gap-3 p-4">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-24 h-16 object-cover rounded border flex-shrink-0 bg-muted"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://placehold.co/160x90?text=No+Image';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm line-clamp-2 mb-1">
                        {course.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        {course.instructor}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px] h-5 px-1">
                          {course.category}
                        </Badge>
                        <span className="text-xs font-bold text-primary">
                          ${(course.discountedPrice || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {scrapedCourses.length === 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No courses were successfully scraped. Please check your URLs.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </>
      )}
    </div>
  );
}