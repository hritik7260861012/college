"use client";

import { useState, useEffect, useCallback } from "react";
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
  IndianRupee,
  Star,
  TrendingUp,
  GitCompare,
  Bookmark,
  Heart,
  HeartOff,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import { useCompareStore } from "@/store/compareStore";
import { formatFees, formatPackage, cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { toast } = useToast();
  const compareStore = useCompareStore();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [filters, setFilters] = useState({
    state: searchParams.get("state") || "",
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
  const { data, isLoading, refetch } = useQuery<ApiResponse>({
    queryKey: ["colleges", debouncedSearch, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (filters.state) params.set("state", filters.state);
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
      if (newFilters.state) params.set("state", newFilters.state);
      if (newFilters.minFees > 0) params.set("minFees", newFilters.minFees.toString());
      if (newFilters.maxFees < 500000) params.set("maxFees", newFilters.maxFees.toString());
      if (newFilters.minRating > 0) params.set("minRating", newFilters.minRating.toString());
      if (newFilters.page > 1) params.set("page", newFilters.page.toString());

      router.push(`/colleges?${params.toString()}`, { scroll: false });
    },
    [debouncedSearch, router]
  );

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
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
        .then((d) => d.savedColleges.find((c: any) => c.id === collegeId)?.savedId);
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explore Colleges</h1>
        <p className="text-slate-600">
          Find the perfect engineering college for your future
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-72 space-y-6">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5" />
                <h2 className="font-semibold">Filters</h2>
              </div>

              {/* State Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">State</label>
                <Select
                  value={filters.state}
                  onValueChange={(v) => handleFilterChange("state", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All States" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All States</SelectItem>
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
                <label className="text-sm font-medium mb-2 block">
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
                <label className="text-sm font-medium mb-2 block">Min Rating</label>
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
                    state: "",
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
        <div className="flex-1">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Search colleges by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-slate-600">
              {isLoading
                ? "Loading..."
                : `${data?.pagination?.total || 0} colleges found`}
            </p>
          </div>

          {/* Colleges Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-slate-200 rounded-t-lg" />
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
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {data?.colleges?.map((college) => (
                  <Link key={college.id} href={`/colleges/${college.slug}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow group">
                      <div className="relative h-48 overflow-hidden rounded-t-lg">
                        <Image
                          src={college.image || "/placeholder.jpg"}
                          alt={college.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                        {college.ranking && college.ranking <= 10 && (
                          <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
                            Top {college.ranking}
                          </span>
                        )}
                        <button
                          onClick={(e) => handleSaveCollege(college.id, e)}
                          className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white shadow-sm"
                        >
                          {savedColleges.has(college.id) ? (
                            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                          ) : (
                            <Heart className="h-4 w-4 text-slate-400" />
                          )}
                        </button>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                          {college.name}
                        </h3>
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
                          <Button
                            variant="outline"
                            size="sm"
                            className={cn(
                              "flex-1",
                              isComparing(college.id) && "bg-blue-100 border-blue-500 text-blue-600"
                            )}
                            onClick={(e) => handleCompare(college, e)}
                          >
                            <GitCompare className="h-4 w-4 mr-1" />
                            {isComparing(college.id) ? "Added" : "Compare"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {data && data.pagination.pages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
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