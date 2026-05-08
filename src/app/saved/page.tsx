"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bookmark,
  MapPin,
  Star,
  TrendingUp,
  Trash2,
  GitCompare,
  Heart,
} from "lucide-react";
import { useCompareStore } from "@/store/compareStore";
import { formatFees, formatPackage, cn } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";

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
}

export default function SavedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const compareStore = useCompareStore();
  const [savedColleges, setSavedColleges] = useState<College[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchSavedColleges();
    }
  }, [status]);

  const fetchSavedColleges = async () => {
    try {
      const res = await fetch("/api/saved");
      const data = await res.json();
      setSavedColleges(data.savedColleges || []);
    } catch (error) {
      console.error("Error fetching saved colleges:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeCollege = async (savedId: string, collegeId: string) => {
    try {
      await fetch(`/api/saved/${savedId}`, { method: "DELETE" });
      setSavedColleges((prev) => prev.filter((c) => c.id !== collegeId));
      toast({ title: "Removed from saved", variant: "default" });
    } catch (error) {
      toast({ title: "Error removing college", variant: "destructive" });
    }
  };

  const handleCompare = (college: College) => {
    if (compareStore.isInCompare(college.id)) {
      compareStore.removeFromCompare(college.id);
      toast({ title: "Removed from comparison" });
    } else if (compareStore.canAddToCompare()) {
      compareStore.addToCompare(college);
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

  if (status === "loading" || isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-48 mb-8" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <div className="h-48 bg-slate-200 rounded-t-lg" />
                <CardContent className="p-4 space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Saved Colleges</h1>
        <p className="text-slate-600">
          Your bookmarked colleges for easy access
        </p>
      </div>

      {savedColleges.length === 0 ? (
        <div className="max-w-md mx-auto text-center py-16">
          <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bookmark className="h-10 w-10 text-slate-400" />
          </div>
          <h2 className="text-xl font-semibold mb-4">No saved colleges yet</h2>
          <p className="text-slate-600 mb-8">
            Start exploring and save colleges you're interested in.
          </p>
          <Link href="/colleges">
            <Button className="gap-2">
              <Bookmark className="h-4 w-4" />
              Browse Colleges
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedColleges.map((college) => (
            <Card key={college.id} className="group">
              <Link href={`/colleges/${college.slug}`}>
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <Image
                    src={college.image || "/placeholder.jpg"}
                    alt={college.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              </Link>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <Link href={`/colleges/${college.slug}`}>
                    <h3 className="font-semibold text-lg line-clamp-1 hover:text-blue-600">
                      {college.name}
                    </h3>
                  </Link>
                  <button
                    onClick={() => removeCollege(college.id, college.id)}
                    className="p-1 hover:bg-slate-100 rounded"
                  >
                    <Trash2 className="h-4 w-4 text-slate-400 hover:text-red-500" />
                  </button>
                </div>
                <div className="flex items-center text-sm text-slate-500 mb-3">
                  <MapPin className="h-3 w-3 mr-1" />
                  {college.location}, {college.state}
                </div>
                <div className="flex items-center gap-1 mb-3">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{college.rating}</span>
                  {college.placementPercentage && (
                    <>
                      <span className="text-slate-300 mx-2">|</span>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-slate-600">
                        {college.placementPercentage}% placed
                      </span>
                    </>
                  )}
                </div>
                <div className="flex items-center justify-between pt-3 border-t">
                  <div>
                    <p className="text-xs text-slate-500">Annual Fees</p>
                    <p className="font-semibold text-blue-600">
                      {formatFees(college.fees)}
                    </p>
                  </div>
                  {college.avgPackage && (
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Avg Package</p>
                      <p className="font-semibold text-green-600 text-sm">
                        {formatPackage(college.avgPackage)}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <Link href={`/colleges/${college.slug}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </Link>
                  <Button
                    variant={compareStore.isInCompare(college.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCompare(college)}
                  >
                    <GitCompare className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}