"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { formatFees, formatPackage, cn } from "@/lib/utils";

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useCompareStore();

  if (compareList.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <GitCompare className="h-10 w-10 text-slate-400" />
          </div>
          <h1 className="text-2xl font-bold mb-4">No Colleges to Compare</h1>
          <p className="text-slate-600 mb-8">
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Compare Colleges</h1>
          <p className="text-slate-600">
            Comparing {compareList.length} of 3 colleges
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/colleges">
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Add College
            </Button>
          </Link>
          {compareList.length > 0 && (
            <Button variant="outline" onClick={clearCompare} className="gap-2">
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Compare Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid" style={{ gridTemplateColumns: `200px repeat(${compareList.length}, 1fr)` }}>
            {/* Header Row - College Names */}
            <div className="bg-slate-50 p-4 font-semibold border-r border-b flex items-center">
              College
            </div>
            {compareList.map((college) => (
              <div key={college.id} className="p-4 border-r border-b relative">
                <button
                  onClick={() => removeFromCompare(college.id)}
                  className="absolute top-2 right-2 p-1 hover:bg-slate-200 rounded"
                >
                  <Trash2 className="h-4 w-4 text-slate-400 hover:text-red-500" />
                </button>
                <Link href={`/colleges/${college.slug}`} className="block">
                  <div className="relative h-32 rounded-lg overflow-hidden mb-3">
                    <Image
                      src={college.image || "/placeholder.jpg"}
                      alt={college.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-lg line-clamp-2 hover:text-blue-600">
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
                  <p className="font-semibold text-lg text-blue-600">
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
                          className="h-full bg-green-500 rounded-full"
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
                    <p className="font-semibold text-green-600">
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
            <div className="bg-slate-50 p-4 border-r font-semibold">Actions</div>
            {compareList.map((college) => (
              <div key={college.id} className="p-4 border-r border-b">
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
      <div className="bg-slate-50 p-4 border-r border-b font-medium flex items-center gap-2">
        {icon}
        {label}
      </div>
      {children}
    </>
  );
}