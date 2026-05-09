"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCompareStore } from "@/store/compareStore";
import {
  GitCompare,
  Trash2,
  MapPin,
  IndianRupee,
  Star,
  TrendingUp,
  Award,
  Calendar,
  ArrowRight,
  Plus,
} from "lucide-react";
import Image from "next/image";
import { formatFees, formatPackage } from "@/lib/utils";

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useCompareStore();

  if (compareList.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="surface-card mx-auto max-w-md rounded-lg px-6 py-14 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-lg bg-teal-50">
            <GitCompare className="h-10 w-10 text-teal-700" />
          </div>
          <h1 className="mb-4 text-2xl font-black text-slate-950">No Colleges to Compare</h1>
          <p className="mb-8 text-slate-600">
            Add colleges to compare them side by side. You can compare up to 3
            colleges at a time.
          </p>
          <Link href="/colleges">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Browse Colleges
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-10">
      <div className="mb-7 flex flex-col justify-between gap-4 rounded-lg bg-teal-900 p-6 text-white shadow-xl shadow-teal-950/15 sm:flex-row sm:items-end sm:p-8">
        <div>
          <p className="mb-2 text-sm font-bold uppercase tracking-wide text-amber-200">
            Decision table
          </p>
          <h1 className="text-3xl font-black tracking-normal sm:text-4xl">Compare Colleges</h1>
          <p className="mt-3 text-teal-50">
            Comparing {compareList.length} of 3 colleges
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/colleges">
            <Button variant="outline" className="w-full gap-2 bg-white/10 text-white hover:bg-white hover:text-teal-950 sm:w-auto">
              <Plus className="h-4 w-4" />
              Add College
            </Button>
          </Link>
          {compareList.length > 0 && (
            <Button variant="outline" onClick={clearCompare} className="w-full gap-2 bg-white/10 text-white hover:bg-white hover:text-teal-950 sm:w-auto">
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Compare Grid */}
      <div className="grid gap-5 lg:hidden">
        {compareList.map((college) => (
          <div key={college.id} className="rounded-3xl border border-white/70 bg-white/85 p-4 shadow-xl shadow-slate-900/10 dark:border-white/10 dark:bg-white/10">
            <div className="relative mb-4 h-44 overflow-hidden rounded-2xl">
              <Image
                src={college.image || "/placeholder.jpg"}
                alt={college.name}
                fill
                className="object-cover"
              />
              <button
                onClick={() => removeFromCompare(college.id)}
                className="absolute right-3 top-3 rounded-2xl bg-white/90 p-2 shadow-sm"
                aria-label="Remove college"
              >
                <Trash2 className="h-4 w-4 text-rose-500" />
              </button>
            </div>
            <h2 className="safe-wrap text-2xl font-black text-slate-950 dark:text-white">
              {college.name}
            </h2>
            <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-300">
              <MapPin className="h-4 w-4 text-pink-500" />
              {college.location}, {college.state}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <CompareMetric label="Rank" value={college.ranking ? `#${college.ranking}` : "N/A"} />
              <CompareMetric label="Rating" value={`${college.rating}/5`} />
              <CompareMetric label="Fees" value={formatFees(college.fees)} />
              <CompareMetric label="Package" value={college.avgPackage ? formatPackage(college.avgPackage) : "N/A"} />
              <CompareMetric label="Placed" value={college.placementPercentage ? `${college.placementPercentage}%` : "N/A"} />
              <CompareMetric label="Established" value={college.establishedYear?.toString() || "N/A"} />
            </div>
            <Link href={`/colleges/${college.slug}`} className="mt-4 block">
              <Button variant="outline" className="w-full gap-2">
                View Details
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        ))}
      </div>

      <div className="hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 dark:border-white/10 dark:bg-white/10 lg:block">
        <div>
          <div className="grid" style={{ gridTemplateColumns: `220px repeat(${compareList.length}, minmax(0, 1fr))` }}>
            {/* Header Row - College Names */}
            <div className="flex items-center border-b border-r border-slate-200 bg-slate-50 p-4 font-black text-slate-950">
              College
            </div>
            {compareList.map((college) => (
              <div key={college.id} className="relative border-b border-r border-slate-200 p-4">
                <button
                  onClick={() => removeFromCompare(college.id)}
                  className="absolute right-2 top-2 rounded-md bg-white/90 p-2 shadow-sm hover:bg-rose-50"
                  aria-label="Remove college"
                >
                  <Trash2 className="h-4 w-4 text-slate-400 hover:text-red-500" />
                </button>
                <Link href={`/colleges/${college.slug}`} className="block">
                  <div className="relative mb-3 h-32 overflow-hidden rounded-lg">
                    <Image
                      src={college.image || "/placeholder.jpg"}
                      alt={college.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="line-clamp-2 text-lg font-black text-slate-950 hover:text-teal-800">
                    {college.name}
                  </h3>
                </Link>
              </div>
            ))}

            {/* Location */}
            <CompareRow label="Location" icon={<MapPin className="h-4 w-4" />}>
              {compareList.map((college) => (
                <div key={college.id} className="p-4 border-r border-b">
                  <p className="text-sm">
                    {college.location}, {college.state}
                  </p>
                </div>
              ))}
            </CompareRow>

            {/* Ranking */}
            <CompareRow label="National Ranking" icon={<Award className="h-4 w-4" />}>
              {compareList.map((college) => (
                <div key={college.id} className="p-4 border-r border-b">
                  {college.ranking ? (
                    <span className="font-semibold text-lg">
                      #{college.ranking}
                    </span>
                  ) : (
                    <span className="text-slate-400">N/A</span>
                  )}
                </div>
              ))}
            </CompareRow>

            {/* Rating */}
            <CompareRow label="Rating" icon={<Star className="h-4 w-4" />}>
              {compareList.map((college) => (
                <div key={college.id} className="p-4 border-r border-b">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-lg">{college.rating}</span>
                    <span className="text-slate-400">/5</span>
                  </div>
                </div>
              ))}
            </CompareRow>

            {/* Annual Fees */}
            <CompareRow label="Annual Fees" icon={<IndianRupee className="h-4 w-4" />}>
              {compareList.map((college) => (
                <div key={college.id} className="p-4 border-r border-b">
                  <p className="text-lg font-black text-teal-800">
                    {formatFees(college.fees)}
                  </p>
                </div>
              ))}
            </CompareRow>

            {/* Placement Percentage */}
            <CompareRow label="Placement Rate" icon={<TrendingUp className="h-4 w-4" />}>
              {compareList.map((college) => (
                <div key={college.id} className="p-4 border-r border-b">
                  {college.placementPercentage ? (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${college.placementPercentage}%` }}
                        />
                      </div>
                      <span className="font-semibold text-sm">
                        {college.placementPercentage}%
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-400">N/A</span>
                  )}
                </div>
              ))}
            </CompareRow>

            {/* Average Package */}
            <CompareRow label="Avg Package" icon={<Award className="h-4 w-4" />}>
              {compareList.map((college) => (
                <div key={college.id} className="p-4 border-r border-b">
                  {college.avgPackage ? (
                    <p className="font-black text-emerald-700">
                      {formatPackage(college.avgPackage)}
                    </p>
                  ) : (
                    <span className="text-slate-400">N/A</span>
                  )}
                </div>
              ))}
            </CompareRow>

            {/* Established Year */}
            <CompareRow label="Established" icon={<Calendar className="h-4 w-4" />}>
              {compareList.map((college) => (
                <div key={college.id} className="p-4 border-r border-b">
                  {college.establishedYear ? (
                    <p className="text-sm">{college.establishedYear}</p>
                  ) : (
                    <span className="text-slate-400">N/A</span>
                  )}
                </div>
              ))}
            </CompareRow>

            {/* Actions */}
            <div className="border-r border-slate-200 bg-slate-50 p-4 font-black">Actions</div>
            {compareList.map((college) => (
              <div key={college.id} className="border-b border-r border-slate-200 p-4">
                <Link href={`/colleges/${college.slug}`}>
                  <Button className="w-full gap-2" variant="outline">
                    View Details
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add More Section */}
      {compareList.length < 3 && (
        <div className="mt-8 text-center">
          <Link href="/colleges">
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Another College ({3 - compareList.length} slot{3 - compareList.length > 1 ? "s" : ""} remaining)
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

function CompareRow({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex items-center gap-2 border-b border-r border-slate-200 bg-slate-50 p-4 font-bold text-slate-700">
        {icon}
        {label}
      </div>
      {children}
    </>
  );
}

function CompareMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3 dark:bg-white/10">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="safe-wrap mt-1 font-black text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}
