"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MapPin,
  Calendar,
  IndianRupee,
  Star,
  TrendingUp,
  Award,
  GitCompare,
  Heart,
  ArrowLeft,
  Clock,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useCompareStore } from "@/store/compareStore";
import { formatFees, formatPackage, cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/useToast";
import { useSearchParams, useRouter } from "next/navigation";

interface Course {
  id: string;
  name: string;
  duration: string;
  degree: string;
  fees: number;
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface College {
  id: string;
  name: string;
  slug: string;
  location: string;
  state: string;
  fees: number;
  rating: number;
  ranking: number | null;
  image: string | null;
  description: string | null;
  placementPercentage: number | null;
  avgPackage: number | null;
  establishedYear: number | null;
  courses: Course[];
  reviews: Review[];
}

export default function CollegeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { data: session } = useSession();
  const { toast } = useToast();
  const compareStore = useCompareStore();
  const [saved, setSaved] = useState(false);

  const { data: college, isLoading } = useQuery<College>({
    queryKey: ["college", slug],
    queryFn: async () => {
      const res = await fetch(`/api/colleges/${slug}`);
      if (!res.ok) throw new Error("College not found");
      return res.json();
    },
  });

  useEffect(() => {
    if (college && session) {
      checkIfSaved();
    }
  }, [college, session]);

  const checkIfSaved = async () => {
    if (!session || !college) return;
    const res = await fetch("/api/saved");
    const data = await res.json();
    setSaved(data.savedColleges?.some((c: any) => c.id === college.id) || false);
  };

  const handleSave = async () => {
    if (!session) {
      toast({ title: "Please login to save colleges" });
      return;
    }

    if (saved) {
      // Find and delete
      const res = await fetch("/api/saved");
      const data = await res.json();
      const savedRecord = data.savedColleges?.find((c: any) => c.id === college?.id);
      if (savedRecord?.id) {
        await fetch(`/api/saved/${savedRecord.id}`, { method: "DELETE" });
        setSaved(false);
        toast({ title: "Removed from saved" });
      }
    } else {
      await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeId: college?.id }),
      });
      setSaved(true);
      toast({ title: "College saved!", variant: "success" });
    }
  };

  const handleCompare = () => {
    if (!college) return;

    if (compareStore.isInCompare(college.id)) {
      compareStore.removeFromCompare(college.id);
      toast({ title: "Removed from comparison" });
    } else if (compareStore.canAddToCompare()) {
      compareStore.addToCompare({
        id: college.id,
        name: college.name,
        slug: college.slug,
        location: college.location,
        state: college.state,
        fees: college.fees,
        rating: college.rating,
        ranking: college.ranking,
        image: college.image,
        description: college.description,
        placementPercentage: college.placementPercentage,
        avgPackage: college.avgPackage,
        establishedYear: college.establishedYear,
      });
      toast({
        title: "Added to compare",
        description: `${college.name} added for comparison`,
      });
    } else {
      toast({
        title: "Compare limit reached",
        description: "You can compare up to 3 colleges at a time",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-64 bg-slate-200 rounded-lg mb-8" />
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <div className="h-8 bg-slate-200 rounded w-3/4" />
              <div className="h-4 bg-slate-200 rounded w-1/2" />
              <div className="h-32 bg-slate-200 rounded" />
            </div>
            <div className="space-y-4">
              <div className="h-48 bg-slate-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">College not found</h1>
        <Link href="/colleges">
          <Button>Back to Colleges</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href="/colleges"
        className="inline-flex items-center text-slate-600 hover:text-blue-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Colleges
      </Link>

      {/* Hero Section */}
      <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
        <Image
          src={college.image || "/placeholder.jpg"}
          alt={college.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            {college.ranking && (
              <span className="bg-blue-600 text-xs font-semibold px-2 py-1 rounded">
                Rank #{college.ranking}
              </span>
            )}
            <span className="flex items-center text-yellow-400">
              <Star className="h-4 w-4 fill-yellow-400 mr-1" />
              {college.rating}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{college.name}</h1>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {college.location}, {college.state}
            </span>
            {college.establishedYear && (
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Est. {college.establishedYear}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-8">
        <Button
          variant={compareStore.isInCompare(college.id) ? "default" : "outline"}
          onClick={handleCompare}
          className="flex-1 md:flex-none"
        >
          <GitCompare className="h-4 w-4 mr-2" />
          {compareStore.isInCompare(college.id) ? "In Compare" : "Add to Compare"}
        </Button>
        <Button
          variant={saved ? "default" : "outline"}
          onClick={handleSave}
          className="flex-1 md:flex-none"
        >
          <Heart className={cn("h-4 w-4 mr-2", saved && "fill-current")} />
          {saved ? "Saved" : "Save College"}
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 leading-relaxed">
                {college.description}
              </p>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <IndianRupee className="h-5 w-5 mx-auto mb-2 text-blue-600" />
                <p className="text-xs text-slate-500">Annual Fees</p>
                <p className="font-semibold">{formatFees(college.fees)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Star className="h-5 w-5 mx-auto mb-2 text-yellow-500" />
                <p className="text-xs text-slate-500">Rating</p>
                <p className="font-semibold">{college.rating}/5</p>
              </CardContent>
            </Card>
            {college.placementPercentage && (
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-5 w-5 mx-auto mb-2 text-green-500" />
                  <p className="text-xs text-slate-500">Placed</p>
                  <p className="font-semibold">{college.placementPercentage}%</p>
                </CardContent>
              </Card>
            )}
            {college.avgPackage && (
              <Card>
                <CardContent className="p-4 text-center">
                  <Award className="h-5 w-5 mx-auto mb-2 text-purple-500" />
                  <p className="text-xs text-slate-500">Avg Package</p>
                  <p className="font-semibold text-sm">{formatPackage(college.avgPackage)}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Courses */}
          {college.courses && college.courses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Courses Offered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-sm text-slate-500">
                        <th className="text-left py-3 px-4">Course</th>
                        <th className="text-left py-3 px-4">Degree</th>
                        <th className="text-left py-3 px-4">Duration</th>
                        <th className="text-right py-3 px-4">Fees</th>
                      </tr>
                    </thead>
                    <tbody>
                      {college.courses.map((course) => (
                        <tr key={course.id} className="border-b hover:bg-slate-50">
                          <td className="py-3 px-4">{course.name}</td>
                          <td className="py-3 px-4">
                            <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded">
                              {course.degree}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600">{course.duration}</td>
                          <td className="py-3 px-4 text-right font-semibold">
                            {formatFees(course.fees)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reviews */}
          {college.reviews && college.reviews.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Student Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {college.reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">{review.userName}</div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-4 w-4",
                              i < Math.floor(review.rating)
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-slate-300"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm">{review.comment}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>College Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-500">Location</p>
                <p className="font-medium">
                  {college.location}, {college.state}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Annual Fees</p>
                <p className="font-medium text-blue-600">{formatFees(college.fees)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Rating</p>
                <p className="font-medium flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                  {college.rating} / 5
                </p>
              </div>
              {college.ranking && (
                <div>
                  <p className="text-sm text-slate-500">National Ranking</p>
                  <p className="font-medium">#{college.ranking}</p>
                </div>
              )}
              {college.placementPercentage && (
                <div>
                  <p className="text-sm text-slate-500">Placement Rate</p>
                  <p className="font-medium text-green-600">
                    {college.placementPercentage}%
                  </p>
                </div>
              )}
              {college.avgPackage && (
                <div>
                  <p className="text-sm text-slate-500">Average Package</p>
                  <p className="font-medium text-green-600">
                    {formatPackage(college.avgPackage)}
                  </p>
                </div>
              )}
              {college.establishedYear && (
                <div>
                  <p className="text-sm text-slate-500">Established</p>
                  <p className="font-medium">{college.establishedYear}</p>
                </div>
              )}
              <div className="pt-4 border-t">
                <p className="text-sm text-slate-500">Total Courses</p>
                <p className="font-medium">{college.courses?.length || 0}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}