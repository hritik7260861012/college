"use client";

import { useCallback, useState, useEffect } from "react";
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
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useCompareStore } from "@/store/compareStore";
import { formatFees, formatPackage, cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/useToast";

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

  const checkIfSaved = useCallback(async () => {
    if (!session || !college) return;
    const res = await fetch("/api/saved");
    const data: { savedColleges?: { id: string }[] } = await res.json();
    setSaved(data.savedColleges?.some((c) => c.id === college.id) || false);
  }, [college, session]);

  useEffect(() => {
    if (college && session) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      checkIfSaved();
    }
  }, [college, session, checkIfSaved]);

  const handleSave = async () => {
    if (!session) {
      toast({ title: "Please login to save colleges" });
      return;
    }

    if (saved) {
      // Find and delete
      const res = await fetch("/api/saved");
      const data: { savedColleges?: { id: string }[] } = await res.json();
      const savedRecord = data.savedColleges?.find((c) => c.id === college?.id);
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
          <div className="mb-8 h-80 rounded-lg bg-slate-200" />
          <div className="grid gap-8 md:grid-cols-3">
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
    <div className="container mx-auto px-4 py-6 sm:py-10">
      {/* Back Button */}
      <Link
        href="/colleges"
        className="mb-6 inline-flex items-center rounded-md px-2 py-1 font-semibold text-slate-600 hover:bg-teal-50 hover:text-teal-800"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Colleges
      </Link>

      {/* Hero Section */}
      <div className="relative mb-8 h-[28rem] overflow-hidden rounded-lg shadow-2xl shadow-slate-900/20">
        <Image
          src={college.image || "/placeholder.jpg"}
          alt={college.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white sm:p-8">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {college.ranking && (
              <span className="rounded-md bg-teal-700 px-2.5 py-1 text-xs font-black">
                Rank #{college.ranking}
              </span>
            )}
            <span className="flex items-center rounded-md bg-amber-400 px-2.5 py-1 text-xs font-black text-slate-950">
              <Star className="mr-1 h-4 w-4 fill-slate-950" />
              {college.rating}
            </span>
          </div>
          <h1 className="max-w-4xl text-3xl font-black tracking-normal sm:text-5xl">{college.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm font-medium text-slate-100">
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
      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
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

      <div className="grid gap-8 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          {/* Overview */}
          <Card className="surface-card">
            <CardHeader>
              <CardTitle className="text-2xl font-black">About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 leading-relaxed">
                {college.description}
              </p>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card className="transition hover:-translate-y-1 hover:shadow-lg">
              <CardContent className="p-4 text-center">
                <IndianRupee className="mx-auto mb-2 h-5 w-5 text-teal-700" />
                <p className="text-xs text-slate-500">Annual Fees</p>
                <p className="font-black">{formatFees(college.fees)}</p>
              </CardContent>
            </Card>
            <Card className="transition hover:-translate-y-1 hover:shadow-lg">
              <CardContent className="p-4 text-center">
                <Star className="h-5 w-5 mx-auto mb-2 text-yellow-500" />
                <p className="text-xs text-slate-500">Rating</p>
                <p className="font-black">{college.rating}/5</p>
              </CardContent>
            </Card>
            {college.placementPercentage && (
              <Card className="transition hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="mx-auto mb-2 h-5 w-5 text-emerald-600" />
                  <p className="text-xs text-slate-500">Placed</p>
                  <p className="font-black">{college.placementPercentage}%</p>
                </CardContent>
              </Card>
            )}
            {college.avgPackage && (
              <Card className="transition hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="p-4 text-center">
                  <Award className="mx-auto mb-2 h-5 w-5 text-amber-600" />
                  <p className="text-xs text-slate-500">Avg Package</p>
                  <p className="text-sm font-black">{formatPackage(college.avgPackage)}</p>
                </CardContent>
              </Card>
            )}
          </div>

          <Card className="surface-card overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl font-black">Campus Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-3">
                {[college.image || "/placeholder.jpg", college.image || "/placeholder.jpg", college.image || "/placeholder.jpg"].map((image, index) => (
                  <div key={index} className="relative h-40 overflow-hidden rounded-2xl">
                    <Image
                      src={image}
                      alt={`${college.name} campus ${index + 1}`}
                      fill
                      className="object-cover transition duration-500 hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="surface-card">
            <CardHeader>
              <CardTitle className="text-2xl font-black">Admission Process</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                {[
                  ["01", "Check eligibility", "Review course, fee, and ranking fit."],
                  ["02", "Shortlist college", "Save and compare with other options."],
                  ["03", "Prepare documents", "Keep scores, ID proofs, and certificates ready."],
                  ["04", "Apply on time", "Track deadlines and admission updates."],
                ].map(([step, title, text]) => (
                  <div key={step} className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-white/10">
                    <span className="mb-3 inline-grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-pink-500 text-sm font-black text-white">
                      {step}
                    </span>
                    <h3 className="font-black text-slate-950 dark:text-white">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Courses */}
          {college.courses && college.courses.length > 0 && (
            <Card className="surface-card overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl font-black">
                  <GraduationCap className="h-5 w-5 text-teal-700" />
                  Courses Offered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-sm text-slate-500">
                        <th className="px-4 py-3 text-left">Course</th>
                        <th className="px-4 py-3 text-left">Degree</th>
                        <th className="px-4 py-3 text-left">Duration</th>
                        <th className="px-4 py-3 text-right">Fees</th>
                      </tr>
                    </thead>
                    <tbody>
                      {college.courses.map((course) => (
                        <tr key={course.id} className="border-b hover:bg-teal-50/50">
                          <td className="px-4 py-3 font-semibold">{course.name}</td>
                          <td className="px-4 py-3">
                            <span className="rounded-md bg-teal-50 px-2 py-1 text-xs font-bold text-teal-800">
                              {course.degree}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{course.duration}</td>
                          <td className="px-4 py-3 text-right font-black text-teal-800">
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
            <Card className="surface-card">
              <CardHeader>
                <CardTitle className="text-2xl font-black">Student Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {college.reviews.map((review) => (
                  <div key={review.id} className="rounded-lg border border-slate-100 bg-white p-4 shadow-sm last:border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-black">{review.userName}</div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-4 w-4",
                              i < Math.floor(review.rating)
                                ? "fill-amber-500 text-amber-500"
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
          <Card className="surface-card sticky top-24">
            <CardHeader>
              <CardTitle className="text-2xl font-black">College Info</CardTitle>
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
                <p className="font-black text-teal-800">{formatFees(college.fees)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Rating</p>
                <p className="font-medium flex items-center">
                  <Star className="mr-1 h-4 w-4 fill-amber-500 text-amber-500" />
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
                  <p className="font-black text-emerald-700">
                    {college.placementPercentage}%
                  </p>
                </div>
              )}
              {college.avgPackage && (
                <div>
                  <p className="text-sm text-slate-500">Average Package</p>
                  <p className="font-black text-emerald-700">
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
