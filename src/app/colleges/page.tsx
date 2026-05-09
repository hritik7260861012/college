"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Star,
  TrendingUp,
  GitCompare,
  Heart,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Search,
} from "lucide-react";
import { useCompareStore } from "@/store/compareStore";
import { formatFees, formatPackage, cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
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

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface ApiResponse {
  colleges: College[];
  pagination: Pagination;
}

export default function CollegesPage() {
  return (
    <Suspense fallback={<CollegesPageFallback />}>
      <CollegesPageContent />
    </Suspense>
  );
}

function CollegesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { toast } = useToast();
  const compareStore = useCompareStore();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [filters, setFilters] = useState({
    state: searchParams.get("state") || "all",
    minFees: searchParams.get("minFees") ? parseFloat(searchParams.get("minFees")!) : 0,
    maxFees: searchParams.get("maxFees") ? parseFloat(searchParams.get("maxFees")!) : 500000,
    minRating: searchParams.get("minRating") ? parseFloat(searchParams.get("minRating")!) : 0,
    page: parseInt(searchParams.get("page") || "1"),
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch states for filter
  const { data: states } = useQuery<{ name: string; count: number }[]>({
    queryKey: ["states"],
    queryFn: async () => {
      const res = await fetch("/api/states");
      return res.json();
    },
  });

  // Fetch colleges
  const { data, isLoading } = useQuery<ApiResponse>({
    queryKey: ["colleges", debouncedSearch, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (filters.state !== "all") params.set("state", filters.state);
      if (filters.minFees > 0) params.set("minFees", filters.minFees.toString());
      if (filters.maxFees < 500000) params.set("maxFees", filters.maxFees.toString());
      if (filters.minRating > 0) params.set("minRating", filters.minRating.toString());
      params.set("page", filters.page.toString());
      params.set("limit", "12");

      const res = await fetch(`/api/colleges?${params.toString()}`);
      return res.json();
    },
  });

  // Update URL when filters change
  const updateURL = useCallback(
    (newFilters: typeof filters) => {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (newFilters.state !== "all") params.set("state", newFilters.state);
      if (newFilters.minFees > 0) params.set("minFees", newFilters.minFees.toString());
      if (newFilters.maxFees < 500000) params.set("maxFees", newFilters.maxFees.toString());
      if (newFilters.minRating > 0) params.set("minRating", newFilters.minRating.toString());
      if (newFilters.page > 1) params.set("page", newFilters.page.toString());

      router.push(`/colleges?${params.toString()}`, { scroll: false });
    },
    [debouncedSearch, router]
  );

  const handleFilterChange = (key: keyof typeof filters, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  useEffect(() => {
    updateURL(filters);
  }, [filters, updateURL]);

  // Save/Unsave college
  const [savedColleges, setSavedColleges] = useState<Set<string>>(new Set());

  const handleSaveCollege = async (collegeId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      toast({
        title: "Please login",
        description: "Login to save your favorite colleges",
      });
      return;
    }

    if (savedColleges.has(collegeId)) {
      // Unsave
      const savedId = await fetch("/api/saved")
        .then((r) => r.json())
        .then((d: { savedColleges?: { id: string; savedId: string }[] }) =>
          d.savedColleges?.find((c) => c.id === collegeId)?.savedId
        );
      if (savedId) {
        await fetch(`/api/saved/${savedId}`, { method: "DELETE" });
        setSavedColleges((prev) => new Set([...prev].filter((id) => id !== collegeId)));
        toast({ title: "Removed from saved", variant: "default" });
      }
    } else {
      // Save
      await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeId }),
      });
      setSavedColleges((prev) => new Set(prev).add(collegeId));
      toast({ title: "College saved!", variant: "success" });
    }
  };

  const isComparing = (id: string) => compareStore.isInCompare(id);
  const canCompare = compareStore.canAddToCompare();

  const handleCompare = (college: College, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isComparing(college.id)) {
      compareStore.removeFromCompare(college.id);
    } else if (canCompare) {
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

  return (
    <div className="container mx-auto px-4 py-6 sm:py-10">
      <Reveal>
      <div className="mb-7 rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-5 py-7 text-white shadow-2xl shadow-purple-500/20 sm:px-8 sm:py-10">
        <div className="max-w-3xl">
          <p className="mb-2 text-sm font-bold uppercase tracking-wide text-amber-200">
            College discovery
          </p>
          <h1 className="safe-wrap text-4xl font-black tracking-tight sm:text-5xl">
            Explore Colleges
          </h1>
          <p className="mt-3 max-w-2xl leading-7 text-teal-50">
            Find a college that matches your budget, location, placement goals,
            and preferred campus experience.
          </p>
        </div>
      </div>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-[290px_1fr]">
        {/* Filters Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Card className="surface-card rounded-3xl">
            <CardContent className="space-y-5 p-4 sm:p-5">
              <div className="flex items-center gap-2 text-slate-950">
                <SlidersHorizontal className="h-5 w-5 text-teal-700" />
                <h2 className="font-semibold">Filters</h2>
              </div>

              {/* State Filter */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">State</label>
                <Select
                  value={filters.state}
                  onValueChange={(v) => handleFilterChange("state", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All States" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    {states?.map((s) => (
                      <SelectItem key={s.name} value={s.name}>
                        {s.name} ({s.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Fees Range */}
              <div>
                <label className="mb-3 block text-sm font-bold text-slate-700">
                  Annual Fees: {formatFees(filters.minFees)} - {formatFees(filters.maxFees)}
                </label>
                <Slider
                  min={0}
                  max={500000}
                  step={10000}
                  value={[filters.minFees, filters.maxFees]}
                  onValueChange={(values) => {
                    setFilters((prev) => ({
                      ...prev,
                      minFees: values[0],
                      maxFees: values[1],
                      page: 1,
                    }));
                  }}
                />
              </div>

              {/* Rating Filter */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Min Rating</label>
                <Select
                  value={filters.minRating.toString()}
                  onValueChange={(v) => handleFilterChange("minRating", parseFloat(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any Rating</SelectItem>
                    <SelectItem value="4">4+ Stars</SelectItem>
                    <SelectItem value="4.5">4.5+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  setFilters({
                    state: "all",
                    minFees: 0,
                    maxFees: 500000,
                    minRating: 0,
                    page: 1,
                  })
                }
              >
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <div className="min-w-0">
          {/* Search Bar */}
          <div className="mb-5">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-teal-700" />
              <Input
                placeholder="Search colleges by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 rounded-lg border-slate-200 bg-white pl-11 text-base shadow-sm shadow-slate-900/5 focus-visible:ring-teal-700"
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <p className="text-sm font-semibold text-slate-600">
              {isLoading
                ? "Loading..."
                : `${data?.pagination?.total || 0} colleges found`}
            </p>
            <p className="text-sm text-slate-500">
              Tap a card to view details, save, or compare.
            </p>
          </div>

          {/* Colleges Grid */}
          {isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse overflow-hidden">
                  <div className="h-48 bg-slate-200" />
                  <CardContent className="p-4 space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                    <div className="h-3 bg-slate-200 rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {data?.colleges?.map((college) => (
                  <Link key={college.id} href={`/colleges/${college.slug}`}>
                    <MotionCard className="h-full">
                    <Card className="group h-full overflow-hidden rounded-3xl transition duration-300 hover:border-indigo-200 hover:shadow-2xl hover:shadow-purple-500/15">
                      <div className="relative h-44 overflow-hidden sm:h-48">
                        <Image
                          src={college.image || "/placeholder.jpg"}
                          alt={college.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                        {college.ranking && college.ranking <= 10 && (
                            <span className="absolute left-3 top-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-1.5 text-xs font-black text-white shadow-sm">
                            Top {college.ranking}
                          </span>
                        )}
                        <button
                          onClick={(e) => handleSaveCollege(college.id, e)}
                          className="absolute right-3 top-3 rounded-2xl bg-white/95 p-2 shadow-sm transition hover:bg-pink-50"
                          aria-label="Save college"
                        >
                          {savedColleges.has(college.id) ? (
                            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                          ) : (
                            <Heart className="h-4 w-4 text-slate-400" />
                          )}
                        </button>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="safe-wrap mb-1 line-clamp-2 min-h-[3.5rem] text-lg font-black text-slate-950 transition group-hover:text-indigo-700 dark:text-white">
                          {college.name}
                        </h3>
                        <div className="mb-3 flex items-center text-sm text-slate-500">
                          <MapPin className="mr-1 h-3.5 w-3.5 text-pink-500" />
                          {college.location}, {college.state}
                        </div>
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-sm font-bold text-amber-800">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <span className="font-semibold">{college.rating}</span>
                          </span>
                          {college.placementPercentage && (
                            <span className="inline-flex items-center gap-1 rounded-2xl bg-emerald-50 px-2.5 py-1 text-sm font-bold text-emerald-700">
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
                              <p className="text-sm font-black text-emerald-600">
                                {formatPackage(college.avgPackage)}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className={cn(
                              "flex-1",
                              isComparing(college.id) && "border-indigo-500 bg-indigo-50 text-indigo-800"
                            )}
                            onClick={(e) => handleCompare(college, e)}
                          >
                            <GitCompare className="h-4 w-4 mr-1" />
                            {isComparing(college.id) ? "Added" : "Compare"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    </MotionCard>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {data && data.pagination.pages > 1 && (
                <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={filters.page === 1}
                    onClick={() => handleFilterChange("page", filters.page - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {[...Array(data.pagination.pages)].map((_, i) => (
                    <Button
                      key={i}
                      variant={filters.page === i + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleFilterChange("page", i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={filters.page === data.pagination.pages}
                    onClick={() => handleFilterChange("page", filters.page + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function CollegesPageFallback() {
  return (
    <div className="container mx-auto px-4 py-6 sm:py-10">
      <div className="mb-7 h-52 animate-pulse rounded-lg bg-slate-200" />
      <div className="grid gap-6 lg:grid-cols-[290px_1fr]">
        <div className="h-80 animate-pulse rounded-lg bg-slate-200" />
        <div className="space-y-5">
          <div className="h-12 animate-pulse rounded-lg bg-slate-200" />
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="h-80 animate-pulse rounded-lg bg-slate-200" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
