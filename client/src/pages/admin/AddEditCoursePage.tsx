import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchCourseById, createCourse, updateCourse, type Course } from '@/api/courseApi';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  DollarSign, 
  Tag, 
  Calendar, 
  User, 
  Image as ImageIcon,
  Link as LinkIcon,
  FolderOpen,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { courseFormSchema, categoriesData } from '@/lib/schemas/courseFormSchema';
import type { CourseFormValues } from '@/lib/schemas/courseFormSchema';
import { toast } from 'sonner';

const AddEditCoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [activeTab, setActiveTab] = useState('basic-info');

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: '',
      description: '',
      instructor: '',
      software: '',
      originalPrice: 0,
      discountedPrice: 0,
      claimedCount: 0,
      image: '',
      udemyUrl: '',
      couponCode: '',
      expiresAt: '',
      category: '',
      subcategory: '',
      isActive: true,
    },
  });

  const { data: courseData, isLoading, error } = useQuery<Course, Error>({
    queryKey: ['course', id],
    queryFn: () => fetchCourseById(id!),
    enabled: isEditMode && !!id,
  });

  useEffect(() => {
    if (courseData) {
      let formattedDate = '';
      if (courseData.expiresAt) {
        const date = new Date(courseData.expiresAt);
        formattedDate = date.toISOString().split('T')[0];
      }

      form.reset({
        title: courseData.title,
        description: courseData.description,
        instructor: courseData.instructor,
        software: courseData.software.join(', '),
        originalPrice: courseData.originalPrice,
        discountedPrice: courseData.discountedPrice,
        claimedCount: courseData.claimedCount,
        image: courseData.image,
        udemyUrl: courseData.udemyUrl,
        couponCode: courseData.couponCode,
        expiresAt: courseData.expiresAt,
        category: courseData.category,
        subcategory: courseData.subcategory,
        isActive: courseData.isActive,
      });
    }
  }, [courseData, form]);

  const submitMutation = useMutation<Course, Error, CourseFormValues>({
    mutationFn: async (values) =>{
      const softwareArray = values.software.split(',').map(s => s.trim()).filter(Boolean);
      const courseData = {
        title: values.title,
        description: values.description,
        image: values.image,
        instructor: values.instructor,
        software: softwareArray,
        claimedCount: values.claimedCount,
        originalPrice: values.originalPrice,
        discountedPrice: values.discountedPrice,
        category: values.category,
        subcategory: values.subcategory,
        udemyUrl: values.udemyUrl,
        couponCode: values.couponCode || '',
        expiresAt: values.expiresAt || undefined,
        isActive: values.isActive,
        isArchived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        archivedAt: undefined,
      };
      if (isEditMode && id) {
        return updateCourse(id, courseData);
      } else {
        return createCourse(courseData);
      }
    },
    onSuccess: () => {
      toast.success('Course saved successfully!');
      setTimeout(() => {
        navigate('/admin/courses');
      }, 1500);
    },
    onError: (error) => {
      toast.error('Failed to save course: ' + error.message);
    },
  })

  async function onSubmit(values: CourseFormValues) {
    submitMutation.mutate(values);
  }

  const [softwarePreview, setSoftwarePreview] = useState<string[]>([]);
  const selectedCategory = form.watch('category');
  const softwareInput = form.watch('software');
  const originalPrice = form.watch('originalPrice');
  const discountedPrice = form.watch('discountedPrice');

  useEffect(() => {
    if (softwareInput) {
      const techs = softwareInput.split(',').map((t: string) => t.trim()).filter(Boolean);
      setSoftwarePreview(techs);
    } else {
      setSoftwarePreview([]);
    }
  }, [softwareInput]);

  const availableSubcategories = categoriesData
  .find((c) => c.name === selectedCategory)?.subcategories || [];

  const savings = originalPrice > 0 && discountedPrice > 0 ? 
    Math.round(((originalPrice - discountedPrice) / originalPrice) * 100) : 0;

  const nextTab = () => {
    const tabs = ['basic-info', 'pricing', 'media', 'deal-details', 'category'];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const prevTab = () => {
    const tabs = ['basic-info', 'pricing', 'media', 'deal-details', 'category'];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  if (isEditMode && isLoading) {
    return (
      <main className="flex-1 overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading course data...</p>
        </div>
      </main>
    );
  }

  if (isEditMode && error) {
    return (
      <main className="flex-1 overflow-hidden flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Error Loading Course</h2>
          <p className="text-muted-foreground mb-4">{error.message}</p>
          <Button onClick={() => navigate('/admin/courses')}>
            Back to Courses
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-8xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Add New Course</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Share amazing course deals with the community
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate('/admin/courses')}>
              <ArrowLeft className="h-4 w-4" />
              Back to Courses
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
                        <TabsTrigger value="pricing">Pricing</TabsTrigger>
                        <TabsTrigger value="media">Media</TabsTrigger>
                        <TabsTrigger value="deal-details">Deal Details</TabsTrigger>
                        <TabsTrigger value="category">Category</TabsTrigger>
                      </TabsList>
                      
                      {/* Basic Info Tab */}
                      <TabsContent value="basic-info" className="space-y-4 mt-4">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-lg font-semibold">
                            <BookOpen className="h-5 w-5 text-primary" />
                            Course Information
                          </div>
                          <Separator />
                          
                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Course Title *</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="e.g. React - The Complete Guide (incl. Hooks, Redux, Next.js)" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormDescription>
                                  Make it clear and descriptive
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description *</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Describe what students will learn in this course..." 
                                    rows={4}
                                    {...field} 
                                  />
                                </FormControl>
                                <FormDescription>
                                  Minimum 20 characters
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="instructor"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Instructor *
                                  </FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. Maximilian Schwarzmüller" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="claimedCount"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Students Claimed</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      placeholder="0" 
                                      {...field}
                                      onChange={e => field.onChange(Number(e.target.value))}
                                    />
                                  </FormControl>
                                  <FormDescription className="text-xs">
                                    How many students have claimed this deal
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="software"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Technologies/Tools *</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="React, Redux, Next.js, TypeScript" 
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      const techs = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
                                      setSoftwarePreview(techs);
                                    }}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Separate multiple technologies with commas
                                </FormDescription>
                                {softwarePreview.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {softwarePreview.map((tech, idx) => (
                                      <Badge key={idx} variant="secondary">
                                        {tech}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </TabsContent>
                      
                      {/* Pricing Tab */}
                      <TabsContent value="pricing" className="space-y-4 mt-4">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-lg font-semibold">
                            <DollarSign className="h-5 w-5 text-primary" />
                            Pricing
                          </div>
                          <Separator />
                          
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="originalPrice"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Original Price ($) *</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      step="0.01" 
                                      placeholder="89.99" 
                                      {...field}
                                      onChange={e => field.onChange(Number(e.target.value))}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="discountedPrice"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Discounted Price ($) *</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      step="0.01" 
                                      placeholder="14.99" 
                                      {...field}
                                      onChange={e => field.onChange(Number(e.target.value))}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {(savings >= 0 && originalPrice > 0) && (
                            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3">
                              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                                {savings > 0 ? (
                                  `💰 Students save ${savings}% ($${(Number(originalPrice) - Number(discountedPrice)).toFixed(2)})`
                                ) : (
                                  '🎉 This course is already at its best price!' 
                                )}
                              </p>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                      
                      {/* Media Tab */}
                      <TabsContent value="media" className="space-y-4 mt-4">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-lg font-semibold">
                            <LinkIcon className="h-5 w-5 text-primary" />
                            Media & Links
                          </div>
                          <Separator />
                          
                          <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <ImageIcon className="h-4 w-4" />
                                  Course Image URL *
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="https://img-c.udemycdn.com/course/..." {...field} />
                                </FormControl>
                                <FormDescription>
                                  Direct link to course thumbnail (480x270 recommended)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="udemyUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Udemy Course URL *</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://www.udemy.com/course/..." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </TabsContent>
                      
                      {/* Deal Details Tab */}
                      <TabsContent value="deal-details" className="space-y-4 mt-4">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-lg font-semibold">
                            <Tag className="h-5 w-5 text-primary" />
                            Deal Details
                          </div>
                          <Separator />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="couponCode"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Coupon Code</FormLabel>
                                  <FormControl>
                                    <Input placeholder="REACT2024" {...field} />
                                  </FormControl>
                                  <FormDescription className="text-xs">
                                    Optional
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="expiresAt"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Expiration Date
                                  </FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                  <FormDescription className="text-xs">
                                    Optional
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </TabsContent>
                      
                      {/* Category Tab */}
                      <TabsContent value="category" className="space-y-4 mt-4">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-lg font-semibold">
                            <FolderOpen className="h-5 w-5 text-primary" />
                            Category
                          </div>
                          <Separator />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="category"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Category *</FormLabel>
                                  <Select 
                                    onValueChange={(value) => {
                                      field.onChange(value);
                                      form.setValue('subcategory', '');
                                    }} 
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {categoriesData.map((cat) => (
                                        <SelectItem key={cat.name} value={cat.name}>
                                          {cat.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="subcategory"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Subcategory *</FormLabel>
                                  <Select 
                                    onValueChange={field.onChange} 
                                    value={field.value} 
                                    disabled={!selectedCategory}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a subcategory" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {availableSubcategories.map((sub) => (
                                        <SelectItem key={sub} value={sub}>
                                          {sub}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    Active Deal
                                  </FormLabel>
                                  <FormDescription>
                                    Is this deal currently active and available?
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </TabsContent>
                    </Tabs>
                    
                    {/* Navigation Buttons */}
                    <div className="flex justify-between">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={prevTab}
                        disabled={activeTab === 'basic-info'}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>
                      
                      {activeTab === 'category' ? (
                        <Button 
                          type="submit" 
                          disabled={submitMutation.isPending}
                        >
                          {submitMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              {isEditMode ? 'Updating Course...' : 'Adding Course...'}
                            </>
                          ) : (
                            isEditMode ? 'Update Course' : 'Add Course'
                          )}
                        </Button>
                      ) : (
                        <Button 
                          type="button" 
                          onClick={nextTab}
                        >
                          Next
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Preview Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Preview</h3>
                  <p className="text-sm text-muted-foreground">How your course will appear</p>
                </div>
                
                <Separator />
                
                {form.watch('image') && (
                  <img 
                    src={form.watch('image')} 
                    alt="Course preview" 
                    className="w-full rounded-lg border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/480x270?text=Invalid+URL';
                    }}
                  />
                )}
                
                <div>
                  <h4 className="font-semibold line-clamp-2">
                    {form.watch('title') || 'Course title will appear here'}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {form.watch('instructor') || 'Instructor name'}
                  </p>
                </div>

                {softwarePreview.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {softwarePreview.slice(0, 3).map((tech, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}

                {(originalPrice > 0 || discountedPrice > 0) && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-primary">
                      ${form.watch('discountedPrice') || '0.00'}
                    </span>
                    {originalPrice > 0 && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${form.watch('originalPrice')}
                      </span>
                    )}
                  </div>
                )}

                {form.watch('isActive') !== undefined && (
                  <Badge variant={form.watch('isActive') ? "default" : "secondary"}>
                    {form.watch('isActive') ? "Active" : "Inactive"}
                  </Badge>
                )}

                <Separator />

                <div className="text-sm space-y-2 text-muted-foreground">
                  <p className="font-semibold text-foreground">💡 Tips</p>
                  <p>• Use clear, descriptive titles</p>
                  <p>• Add high-quality course images</p>
                  <p>• Include relevant technologies</p>
                  <p>• Verify coupon codes before submitting</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AddEditCoursePage;