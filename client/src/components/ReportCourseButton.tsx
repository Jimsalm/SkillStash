import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger 
} from '@/components/ui/dialog';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Flag } from 'lucide-react';
import { useCreateReport } from '@/hooks/useReports';
import type { Course } from '@/api/courseApi';

interface ReportCourseButtonProps {
    course: Course;
    variant?: 'default' | 'outline' | 'ghost' ;
    size?: 'default' | 'sm' | 'lg';
    className?: string;
}

const ReportCourseButton = ({
    course,
    variant = 'outline',
    size = 'sm',
    className = '',
}: ReportCourseButtonProps) => {
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState<'invalid_link' | 'expired' | 'fake_course' | 'other'>('expired');
    const [reportedBy, setReportedBy] = useState('');
    
    const createReportMutation = useCreateReport();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try{
            await createReportMutation.mutateAsync({
                courseId: course._id,
                courseTitle: course.title,
                reason,
                reportedBy: reportedBy.trim() || undefined,
            });
            
            setOpen(false);
            setReason('expired');
            setReportedBy('');

        } catch (error) {
            console.error('Failed to create report:', error);
        }
    };

    const reasonLabels = {
        expired: 'Discount has expired',
        invalid_link: 'Link is broken or invalid',
        fake_course: 'Course is fake',
        other: 'Other issue'
    }

    return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Flag className="h-4 w-4 mr-2" />
          Report Issue
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Report Course Issue</DialogTitle>
            <DialogDescription>
              Help us keep our course information accurate. Let us know what's wrong with this course.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reason">Issue Type *</Label>
              <Select
                value={reason}
                onValueChange={(value) => setReason(value as typeof reason)}
              >
                <SelectTrigger id="reason">
                  <SelectValue placeholder="Select an issue type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(reasonLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reportedBy">Your Email (Optional)</Label>
              <Input
                id="reportedBy"
                type="email"
                placeholder="email@example.com"
                value={reportedBy}
                onChange={(e) => setReportedBy(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                We'll only use this to follow up if needed.
              </p>
            </div>
            <div className="rounded-md bg-muted p-3 text-sm">
              <p className="font-medium mb-1">Course: {course.title}</p>
              <p className="text-muted-foreground">by {course.instructor}</p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={createReportMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createReportMutation.isPending}>
              {createReportMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Report'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportCourseButton;