import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReports, useUpdateReportStatus, useDeleteReport } from '@/hooks/useReports';
import type { CourseReport } from '@/api/reportApi';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Filter,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AdminReportsPage = () => {
  const navigate = useNavigate();

  // Hooks
  const { data: reports, isLoading, error } = useReports();
  const updateStatusMutation = useUpdateReportStatus();
  const deleteReportMutation = useDeleteReport();

  // Local State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [reasonFilter, setReasonFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);

  // Filtered reports
  const filteredReports = useMemo(() => {
    if (!reports) return [];
    return reports.filter((report) => {
      const matchesSearch =
        report.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.reportedBy?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
      const matchesReason = reasonFilter === 'all' || report.reason === reasonFilter;
      return matchesSearch && matchesStatus && matchesReason;
    });
  }, [reports, searchQuery, statusFilter, reasonFilter]);

  // Pagination
  const totalPages = Math.ceil((filteredReports?.length || 0) / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedReports = filteredReports.slice(startIndex, endIndex) || [];

  // Handlers
  const handleFilterChange = () => setCurrentPage(1);
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    handleFilterChange();
  };
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setReasonFilter('all');
    setCurrentPage(1);
  };

  const handleUpdateStatus = async (
    reportId: string,
    newStatus: 'pending' | 'reviewed' | 'resolved'
  ) => {
    await updateStatusMutation.mutateAsync({ id: reportId, status: newStatus });
  };

  const handleViewCourse = (courseId: string) => {
    navigate(`/admin/courses/edit/${courseId}`);
  };

  const handleDeleteReport = async () => {
    if (!reportToDelete) return;
    await deleteReportMutation.mutateAsync(reportToDelete);
    setDeleteDialogOpen(false);
    setReportToDelete(null);
  };

  const hasActiveFilters =
    searchQuery || statusFilter !== 'all' || reasonFilter !== 'all';

  // Status badge variants
  const getStatusBadge = (status: CourseReport['status']) => {
    const variants: Record<CourseReport['status'], { variant: any; icon: any }> = {
      pending: { variant: 'default', icon: Clock },
      reviewed: { variant: 'secondary', icon: Eye },
      resolved: { variant: 'outline', icon: CheckCircle },
    };
    const config = variants[status];
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Reason labels
  const reasonLabels: Record<CourseReport['reason'], string> = {
    expired: 'Discount Expired',
    invalid_link: 'Invalid Link',
    fake_course: 'Fake Course',
    other: 'Other Issue',
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-semibold mb-2">Failed to load reports</p>
            <p className="text-sm">{error.message}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Course Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage user-reported course issues • {filteredReports.length || 0} total
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4" /> Filters
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Reports',
            value: reports?.length || 0,
            variant: 'default',
          },
          {
            label: 'Pending',
            value: reports?.filter((r) => r.status === 'pending').length || 0,
            variant: 'warning',
          },
          {
            label: 'Reviewed',
            value: reports?.filter((r) => r.status === 'reviewed').length || 0,
            variant: 'info',
          },
          {
            label: 'Resolved',
            value: reports?.filter((r) => r.status === 'resolved').length || 0,
            variant: 'success',
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters Card */}
      {showFilters && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Filters</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reports..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                </div>
              </div>
              {/* Status Select */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={statusFilter}
                  onValueChange={(value) => {
                    setStatusFilter(value);
                    handleFilterChange();
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Reason Select */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Issue Type</label>
                <Select
                  value={reasonFilter}
                  onValueChange={(value) => {
                    setReasonFilter(value);
                    handleFilterChange();
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="expired">Discount Expired</SelectItem>
                    <SelectItem value="invalid_link">Invalid Link</SelectItem>
                    <SelectItem value="wrong_price">Wrong Price</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {hasActiveFilters && (
              <div className="mt-4">
                <Button variant="outline" onClick={handleResetFilters}>
                  <X className="h-4 w-4 mr-2" /> Reset Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Issue Type</TableHead>
              <TableHead>Reported By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedReports.length > 0 ? (
              paginatedReports.map((report, index) => (
                <TableRow key={report._id}>
                  <TableCell className="text-muted-foreground">
                    {startIndex + index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[300px]">
                      <p className="font-medium truncate">{report.courseTitle}</p>
                      <p className="text-xs text-muted-foreground">
                        ID: {String(report.courseId).slice(0, 8)}...
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{reasonLabels[report.reason]}</Badge>
                  </TableCell>
                  <TableCell>
                    {report.reportedBy ? (
                      <span className="text-sm">{report.reportedBy}</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Anonymous</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {new Date(report.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleViewCourse(report.courseId)}
                        >
                          <Eye className="h-4 w-4 mr-2" /> View Course
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleUpdateStatus(report._id, 'reviewed')}
                          disabled={
                            report.status === 'reviewed' ||
                            updateStatusMutation.isPending
                          }
                        >
                          <Eye className="h-4 w-4 mr-2" /> Mark as Reviewed
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleUpdateStatus(report._id, 'resolved')}
                          disabled={
                            report.status === 'resolved' ||
                            updateStatusMutation.isPending
                          }
                        >
                          <CheckCircle className="h-4 w-4 mr-2" /> Mark as Resolved
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleUpdateStatus(report._id, 'pending')}
                          disabled={
                            report.status === 'pending' ||
                            updateStatusMutation.isPending
                          }
                        >
                          <Clock className="h-4 w-4 mr-2" /> Mark as Pending
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setReportToDelete(report._id);
                            setDeleteDialogOpen(true);
                          }}
                          className="text-destructive focus:text-destructive"
                          disabled={deleteReportMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete Report
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-muted-foreground">No reports found</p>
                    {hasActiveFilters && (
                      <Button variant="link" size="sm" onClick={handleResetFilters}>
                        Clear filters
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredReports && filteredReports.length > 0 && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(endIndex, filteredReports.length)}
            </span>{' '}
            of <span className="font-medium">{filteredReports.length}</span> reports
          </p>
          <div className="flex items-center gap-2">
            <Select
              value={`${pageSize}`}
              onValueChange={(v) => {
                setPageSize(Number(v));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Report</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this report? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteReport}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminReportsPage;