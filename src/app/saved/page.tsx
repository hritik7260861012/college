"use client";

import { useCallback, useState, useEffect } from "react";
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
  CalendarCheck,
  Target,
} from "lucide-react";
import { useCompareStore } from "@/store/compareStore";
import { formatFees, formatPackage, cn } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";
import { MotionCard, Reveal } from "@/components/Motion";

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

  const fetchSavedColleges = useCallback(async () => {
    try {
      const res = await fetch("/api/saved");
      const data = await res.json();
      setSavedColleges(data.savedColleges || []);
    } catch {
      toast({ title: "Could not load saved colleges", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (status === "authenticated") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchSavedColleges();
    }
  }, [status, fetchSavedColleges]);

  const removeCollege = async (savedId: string, collegeId: string) => {
    try {
      await fetch(`/api/saved/${savedId}`, { method: "DELETE" });
      setSavedColleges((prev) => prev.filter((c) => c.id !== collegeId));
      toast({ title: "Removed from saved", variant: "default" });
    } catch {
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
      <div className="container mx-auto px-4 py-10">
        <div className="animate-pulse">
          <div className="mb-8 h-44 rounded-lg bg-slate-200" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-48 bg-slate-200" />
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
    <div className="container mx-auto px-4 py-6 sm:py-10">
      <Reveal>
        <div className="mb-7 rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-900 p-6 text-white shadow-2xl shadow-indigo-950/20 sm:p-8">
          <p className="mb-2 text-sm font-bold uppercase tracking-wide text-cyan-200">
            Student dashboard
          </p>
          <h1 className="safe-wrap text-4xl font-black tracking-tight sm:text-5xl">
            Saved Colleges
          </h1>
          <p className="mt-3 max-w-2xl leading-7 text-slate-200">
            Keep promising colleges together while you compare fees, placements,
            recommendations, and application progress.
          </p>
        </div>
      </Reveal>

      <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          [Bookmark, savedColleges.length.toString(), "Saved colleges", "from your shortlist"],
          [GitCompare, compareStore.compareList.length.toString(), "Compare queue", "active comparisons"],
          [CalendarCheck, "2026", "Admission cycle", "application planning"],
          [Target, "92%", "Profile fit", "recommended focus"],
        ].map(([Icon, value, label, detail]) => (
          <MotionCard key={label as string}>
            <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/8 backdrop-blur dark:border-white/10 dark:bg-white/10">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-400 text-white">
                <Icon className="h-6 w-6" />
              </div>
              <p className="text-3xl font-black text-slate-950 dark:text-white">{value as string}</p>
              <p className="font-bold text-slate-700 dark:text-slate-200">{label as string}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{detail as string}</p>
            </div>
          </MotionCard>
        ))}
      </div>

      {savedColleges.length === 0 ? (
        <div className="surface-card mx-auto max-w-md rounded-lg px-6 py-14 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-lg bg-teal-50">
            <Bookmark className="h-10 w-10 text-teal-700" />
          </div>
          <h2 className="mb-4 text-xl font-black text-slate-950">No saved colleges yet</h2>
          <p className="mb-8 text-slate-600">
            Start exploring and save colleges you are interested in.
          </p>
          <Link href="/colleges">
            <Button className="gap-2">
              <Bookmark className="h-4 w-4" />
              Browse Colleges
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {savedColleges.map((college) => (
            <MotionCard key={college.id}>
            <Card className="group overflow-hidden rounded-3xl transition duration-300 hover:border-indigo-200 hover:shadow-2xl hover:shadow-purple-500/15">
              <Link href={`/colleges/${college.slug}`}>
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={college.image || "/placeholder.jpg"}
                    alt={college.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              </Link>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <Link href={`/colleges/${college.slug}`}>
                    <h3 className="safe-wrap line-clamp-2 min-h-[3.5rem] text-lg font-black text-slate-950 hover:text-indigo-700 dark:text-white">
                      {college.name}
                    </h3>
                  </Link>
                  <button
                    onClick={() => removeCollege(college.id, college.id)}
                    className="rounded-md p-2 hover:bg-rose-50"
                    aria-label="Remove saved college"
                  >
                    <Trash2 className="h-4 w-4 text-slate-400 hover:text-red-500" />
                  </button>
                </div>
                <div className="flex items-center text-sm text-slate-500 mb-3">
                  <MapPin className="mr-1 h-3.5 w-3.5 text-pink-500" />
                  {college.location}, {college.state}
                </div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-sm font-bold text-amber-800">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    {college.rating}
                  </span>
                  {college.placementPercentage && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-sm font-bold text-emerald-700">
                      <TrendingUp className="h-4 w-4" />
                      {college.placementPercentage}% placed
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
                  <div>
                    <p className="text-xs text-slate-500">Annual Fees</p>
                    <p className="font-black text-indigo-700 dark:text-cyan-300">
                      {formatFees(college.fees)}
                    </p>
                  </div>
                  {college.avgPackage && (
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Avg Package</p>
                      <p className="text-sm font-black text-emerald-700">
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
                    className={cn(compareStore.isInCompare(college.id) && "bg-indigo-700")}
                    onClick={() => handleCompare(college)}
                  >
                    <GitCompare className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            </MotionCard>
          ))}
        </div>
      )}
    </div>
  );
}
