import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { courseService } from '@/services/courseService';
import type { Course } from '@/services/courseService';
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
  Loader2
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { courseFormSchema, categoriesData } from '@/lib/schemas/courseFormSchema';
import type { CourseFormValues } from '@/lib/schemas/courseFormSchema';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const AddEditCoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [courses, setCourses] = useState<Course[]>([]);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [softwarePreview, setSoftwarePreview] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

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

  useEffect(() => {
    if (isEditMode && id) {
      fetchCourseData(id);
    }
  }, [id, isEditMode]);

  const fetchCourseData = async (courseId: string) => {
    setLoading(true);
    setFetchError(null);
    try {
      const course = await courseService.getCourseById(courseId);
      let formattedDate = '';
      if (course.expiresAt){
        const date = new Date(course.expiresAt);
        formattedDate = date.toISOString().split('T')[0];
      }

      form.reset({
        title: course.title,
        description: course.description,
        instructor: course.instructor,
        software: course.software.join(', '),
        originalPrice: course.originalPrice,
        discountedPrice: course.discountedPrice,
        claimedCount: course.claimedCount,
        image: course.image,
        udemyUrl: course.udemyUrl,
        couponCode: course.couponCode,
        expiresAt: formattedDate,
        category: course.category,
        subcategory: course.subcategory,
        isActive: course.isActive,
      });

      setSoftwarePreview(course.software);
    } catch (error: any) {
      console.error('Error fetching course data:', error);
      setFetchError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = form.watch('category');
  const softwareInput = form.watch('software');
  const originalPrice = form.watch('originalPrice');
  const discountedPrice = form.watch('discountedPrice');

  // Update software preview when input changes
  useState(() => {
    if (softwareInput) {
      const techs = softwareInput.split(',').map(t => t.trim()).filter(Boolean);
      setSoftwarePreview(techs);
    } else {
      setSoftwarePreview([]);
    }
  });

  const availableSubcategories = categoriesData
    .find((cat) => cat.name === selectedCategory)?.subcategories || [];

  // Calculate savings
  const savings = originalPrice > 0 && discountedPrice > 0 
    ? ((originalPrice - discountedPrice) / originalPrice * 100).toFixed(0)
    : 0;

  async function onSubmit(values: CourseFormValues) {
    try {
      setSubmitStatus('idle')
      const softwareArray = values.software.split(',').map(s => s.trim()).filter(Boolean);
      
      // Create the course object matching your Course interface
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
      };

      console.log('New Course Data:', courseData);

      let result;

      if (isEditMode && id) {
        // Edit existing course
        result = await courseService.updateCourse(id, courseData);
        console.log('Update result:', result);
      } else {
        // Create new course
        result = await courseService.createCourse(courseData);
        console.log('Create result:', result);
      }

      setSubmitStatus('success');
      
      // Navigate after 3 seconds
      setTimeout(() => {
        navigate('/admin/courses');
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting course:', error);
      setSubmitStatus('error');
    }
  }

  if (isEditMode && loading) {
    return (
      <main className="flex-1 overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading course data...</p>
        </div>
      </main>
    );
  }

  if (isEditMode && fetchError) {
    return (
      <main className="flex-1 overflow-hidden flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Error Loading Course</h2>
          <p className="text-muted-foreground mb-4">{fetchError}</p>
          <Button onClick={() => navigate('/admin/courses')}>
            Back to Courses
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto flex flex-col">
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

          {/* Success/Error Alerts */}
          {submitStatus === 'success' && (
            <Alert className="mb-6 border-green-500 bg-green-50 dark:bg-green-950">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                Course {isEditMode ? 'updated' : 'added'} successfully! Redirecting...
              </AlertDescription>
            </Alert>
          )}
          
          {submitStatus === 'error' && (
            <Alert className="mb-6 border-red-500 bg-red-50 dark:bg-red-950">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                Something went wrong. Please try again.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="pt-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Course Information Section */}
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

                      {/* Pricing Section */}
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

                        {savings > 0 && (
                          <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3">
                            <p className="text-sm font-medium text-green-800 dark:text-green-200">
                              💰 Students save {savings}% (${(originalPrice - discountedPrice).toFixed(2)})
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Media & Links Section */}
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

                      {/* Deal Details Section */}
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

                      {/* Category Section */}
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
                      </div>

                      {/* Active Status */}
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

                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={submitStatus === 'success'}
                      >
                        {submitStatus === 'success' ? (
                          <>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            {id ? 'Course Updated Successfully!' : 'Course Added Successfully!'}
                          </>
                        ) : (
                          id ? 'Update Course' : 'Add Course'
                        )}
                      </Button>
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