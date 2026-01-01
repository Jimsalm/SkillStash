import { useState } from 'react';
import { Loader2, Plus, Upload, AlertCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { useBatchScrapeCourses, useBatchCreateCourses } from '@/hooks/useCourses';
import type { Course } from '@/api/courseApi';

interface ScrapedCoursePreview extends Partial<Course> {
  id: string;
  software: string[];
}

const cleanPrice = (priceStr: string | undefined | null): number => {
  if (!priceStr) return 0;
  return parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
};

export default function BatchCourseImport() {
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
    
    // Convert courses for API - remove temporary id and ensure software is array
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
    } catch (error) {
      console.error('Batch import error:', error);
    }
  };

  const isProcessing = batchScrapeMutation.isPending || batchCreateMutation.isPending;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Batch Import Courses
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              DiscUdemy URLs (one per line)
            </label>
            <Textarea
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              placeholder="https://www.discudemy.com/course/...&#10;https://www.discudemy.com/course/...&#10;https://www.discudemy.com/course/..."
              rows={8}
              className="font-mono text-sm"
              disabled={isProcessing}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Maximum 20 URLs per batch
            </p>
          </div>

          <Button
            onClick={handleBatchScrape}
            disabled={isProcessing || !urls.trim()}
            className="w-full"
          >
            {batchScrapeMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scraping {urls.split('\n').filter(u => u.trim()).length} courses...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Scrape All Courses
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {showResults && scrapedCourses.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Scraped Courses ({scrapedCourses.length})</CardTitle>
            <Button 
              onClick={handleImportAll} 
              size="sm"
              disabled={batchCreateMutation.isPending}
            >
              {batchCreateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Import All
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scrapedCourses.map((course) => (
                <Card key={course.id} className="relative">
                  <CardContent className="pt-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={() => removeCourse(course.id)}
                      disabled={batchCreateMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>

                    <div className="flex gap-4">
                      {course.image && (
                        <img
                          src={course.image}
                          alt={course.title || 'Course'}
                          className="w-32 h-18 object-cover rounded border flex-shrink-0"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://placehold.co/160x90?text=No+Image';
                          }}
                        />
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm line-clamp-2 mb-1">
                          {course.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          by {course.instructor}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 mb-2">
                          {course.category && (
                            <Badge variant="secondary" className="text-xs">
                              {course.category}
                            </Badge>
                          )}
                          {course.subcategory && (
                            <Badge variant="outline" className="text-xs">
                              {course.subcategory}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                          <span className="font-bold text-primary">
                            ${(course.discountedPrice || 0).toFixed(2)}
                          </span>
                          {(course.originalPrice || 0) > 0 && (
                            <span className="text-muted-foreground line-through text-xs">
                              ${course.originalPrice!.toFixed(2)}
                            </span>
                          )}
                          {(course.originalPrice || 0) > 0 && (course.discountedPrice || 0) > 0 && (
                            <Badge variant="default" className="text-xs">
                              {Math.round(((course.originalPrice! - course.discountedPrice!) / course.originalPrice!) * 100)}% OFF
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {showResults && scrapedCourses.length === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No courses were successfully scraped. Please check your URLs and try again.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}