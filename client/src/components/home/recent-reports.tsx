import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Phone, MapPin, AlertCircle } from "lucide-react";
import { Report } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface RecentReportsProps {
  reports: Report[];
}

const RecentReports: React.FC<RecentReportsProps> = ({ reports }) => {
  // Function to format the status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case "assigned":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Assigned</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">In Progress</Badge>;
      case "rescued":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Rescued</Badge>;
      case "closed":
        return <Badge variant="outline" className="bg-neutral-100 text-neutral-800 hover:bg-neutral-100">Closed</Badge>;
      default:
        return <Badge variant="outline" className="bg-neutral-100 text-neutral-800 hover:bg-neutral-100">{status}</Badge>;
    }
  };

  return (
    <section className="py-12 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-heading font-bold text-2xl md:text-3xl">Recent Reports</h2>
          <Link href="/report-animal" className="text-primary font-medium hover:underline flex items-center">
            View All <span className="ml-1">→</span>
          </Link>
        </div>
        
        {reports.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-neutral-500">No animal reports yet. Be the first to report an animal in need!</p>
            <Link href="/report-animal">
              <Button className="mt-4 bg-primary hover:bg-primary-dark">Report an Animal</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <Card key={report.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-neutral-200">
                <div className="relative">
                  <img
                    src={report.imageUrl || "https://images.unsplash.com/photo-1518288774672-b94e808873ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"}
                    alt={`${report.animalType} - ${report.description}`}
                    className="w-full h-48 object-cover"
                  />
                  {report.urgency === "urgent" && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-accent text-white hover:bg-accent">Urgent</Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-5">
                  <div className="flex items-center mb-3">
                    <MapPin className="h-4 w-4 text-neutral-500 mr-1" />
                    <span className="text-sm text-neutral-500">{report.location}</span>
                    <span className="text-xs text-neutral-400 ml-auto">
                      {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">
                    {report.animalType.charAt(0).toUpperCase() + report.animalType.slice(1)} Needs Help
                  </h3>
                  <p className="text-neutral-600 text-sm mb-3 line-clamp-2">{report.description}</p>
                  <div className="flex items-center justify-between">
                    {getStatusBadge(report.status)}
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary-dark">
                      <Eye className="h-4 w-4 mr-1" /> View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentReports;
