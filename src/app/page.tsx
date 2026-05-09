import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MotionCard, Reveal } from "@/components/Motion";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bookmark,
  Building2,
  GitCompare,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";

const stats = [
  ["45+", "Curated colleges"],
  ["15", "States covered"],
  ["100+", "Courses mapped"],
  ["500+", "Student reviews"],
];

const features = [
  {
    icon: Search,
    title: "Smart Discovery",
    text: "Search and filter by state, fees, ratings, placement rate, and ranking without clutter.",
    color: "from-indigo-500 to-cyan-400",
  },
  {
    icon: GitCompare,
    title: "Compare Clearly",
    text: "Stack colleges side by side with clean stats, visual placement bars, and fee signals.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Bookmark,
    title: "Personal Shortlist",
    text: "Save colleges into a student dashboard built for decision making and repeated review.",
    color: "from-emerald-500 to-cyan-400",
  },
];

const topColleges = [
  { name: "IIT Bombay", city: "Mumbai", rank: 1, rating: 4.8, tag: "Top placements" },
  { name: "IIT Delhi", city: "New Delhi", rank: 2, rating: 4.7, tag: "Research led" },
  { name: "IIT Madras", city: "Chennai", rank: 3, rating: 4.7, tag: "Innovation hub" },
];

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <section className="relative">
        <div className="absolute inset-0 -z-10 premium-gradient opacity-10" />
        <div className="container mx-auto grid min-h-[calc(100vh-5rem)] items-center gap-10 px-4 py-12 lg:grid-cols-[1.04fr_0.96fr] lg:py-16">
          <Reveal>
            <div className="max-w-4xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-2xl border border-white/70 bg-white/70 px-4 py-2 text-sm font-black text-indigo-700 shadow-sm shadow-indigo-950/5 backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-cyan-200">
                <Sparkles className="h-4 w-4 text-pink-500" />
                Premium college discovery platform built in 2026
              </div>
              <h1 className="safe-wrap text-5xl font-black leading-[1.02] tracking-tight text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
                Discover your best-fit{" "}
                <span className="text-gradient">engineering college</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300 sm:text-xl">
                Explore colleges, compare outcomes, save favorites, and make
                confident admission decisions with a modern student-first
                workspace.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/colleges">
                  <Button size="lg" className="w-full gap-2 sm:w-auto">
                    <Search className="h-5 w-5" />
                    Explore Colleges
                  </Button>
                </Link>
                <Link href="/compare">
                  <Button variant="outline" size="lg" className="w-full gap-2 sm:w-auto">
                    Compare Now
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-3 text-sm font-bold text-slate-500 dark:text-slate-300">
                {["IIT", "NIT", "IIIT", "Private", "Placements"].map((item) => (
                  <span key={item} className="rounded-full border border-white/70 bg-white/70 px-4 py-2 shadow-sm dark:border-white/10 dark:bg-white/10">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="relative mx-auto w-full max-w-xl">
              <div className="section-shell animate-float-soft overflow-hidden p-4 sm:p-5">
                <div
                  className="campus-hero-image relative h-72 overflow-hidden rounded-2xl sm:h-96"
                  role="img"
                  aria-label="Modern college campus"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/20 bg-white/15 p-4 text-white backdrop-blur-xl">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-cyan-100">Recommended Match</p>
                        <h2 className="safe-wrap text-2xl font-black">IIT Bombay</h2>
                      </div>
                      <span className="rounded-2xl bg-amber-300 px-3 py-2 text-sm font-black text-slate-950">
                        98%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[
                    [Star, "4.8", "Rating"],
                    [TrendingUp, "92%", "Placed"],
                    [BadgeCheck, "#1", "Rank"],
                  ].map(([Icon, value, label]) => (
                    <div key={label as string} className="rounded-2xl bg-white/80 p-3 text-center shadow-sm dark:bg-white/10">
                      <Icon className="mx-auto mb-1 h-4 w-4 text-indigo-500" />
                      <p className="font-black text-slate-950 dark:text-white">{value as string}</p>
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-300">{label as string}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-14">
        <Reveal>
          <div className="grid gap-4 rounded-3xl border border-white/70 bg-white/75 p-4 shadow-xl shadow-indigo-950/10 backdrop-blur dark:border-white/10 dark:bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(([value, label]) => (
              <div key={label} className="rounded-2xl bg-gradient-to-br from-white to-indigo-50 p-5 text-center dark:from-white/10 dark:to-white/5">
                <p className="text-4xl font-black text-gradient">{value}</p>
                <p className="mt-1 text-sm font-bold text-slate-500 dark:text-slate-300">{label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="container mx-auto px-4 py-14">
        <Reveal>
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="mb-2 text-sm font-black uppercase tracking-wide text-pink-500">Why students use it</p>
              <h2 className="safe-wrap text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
                Built for fast, confident decisions
              </h2>
            </div>
            <p className="max-w-xl text-slate-600 dark:text-slate-300">
              Every section is designed to scan quickly on mobile, tablet, and
              desktop without broken cards or overflowing content.
            </p>
          </div>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 0.08}>
              <MotionCard className="h-full">
                <div className="h-full rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-900/8 backdrop-blur dark:border-white/10 dark:bg-white/10">
                  <div className={`mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${feature.color} text-white shadow-lg`}>
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="safe-wrap text-2xl font-black text-slate-950 dark:text-white">{feature.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{feature.text}</p>
                </div>
              </MotionCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-14">
        <Reveal>
          <div className="section-shell overflow-hidden p-6 sm:p-8">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="mb-2 text-sm font-black uppercase tracking-wide text-indigo-600 dark:text-cyan-300">
                  Trusted shortlist
                </p>
                <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
                  Popular colleges
                </h2>
              </div>
              <Link href="/colleges">
                <Button variant="outline" className="w-full gap-2 sm:w-auto">
                  View all colleges
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {topColleges.map((college) => (
                <MotionCard key={college.name}>
                  <div className="rounded-3xl border border-white/70 bg-white/85 p-5 shadow-lg shadow-indigo-950/8 dark:border-white/10 dark:bg-white/10">
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="safe-wrap text-xl font-black text-slate-950 dark:text-white">{college.name}</h3>
                        <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-300">
                          <MapPin className="h-4 w-4 text-pink-500" />
                          {college.city}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-2 text-sm font-black text-white">
                        #{college.rank}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-amber-50 p-3 text-amber-900">
                        <Star className="mb-1 h-4 w-4 fill-amber-500 text-amber-500" />
                        <p className="font-black">{college.rating}</p>
                        <p className="text-xs font-bold">Rating</p>
                      </div>
                      <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-900">
                        <BarChart3 className="mb-1 h-4 w-4" />
                        <p className="font-black">{college.tag}</p>
                        <p className="text-xs font-bold">Signal</p>
                      </div>
                    </div>
                  </div>
                </MotionCard>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section className="container mx-auto px-4 py-14">
        <Reveal>
          <div className="premium-gradient rounded-3xl p-6 text-white shadow-2xl shadow-purple-500/20 sm:p-10">
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div>
                <div className="mb-4 flex flex-wrap gap-3 text-sm font-black">
                  <span className="rounded-full bg-white/15 px-4 py-2 backdrop-blur"><ShieldCheck className="mr-2 inline h-4 w-4" />Accessible</span>
                  <span className="rounded-full bg-white/15 px-4 py-2 backdrop-blur"><Users className="mr-2 inline h-4 w-4" />Student-ready</span>
                  <span className="rounded-full bg-white/15 px-4 py-2 backdrop-blur"><Building2 className="mr-2 inline h-4 w-4" />Production-grade</span>
                </div>
                <h2 className="safe-wrap text-3xl font-black tracking-tight sm:text-5xl">
                  Start your admission research with a cleaner system.
                </h2>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-white/85">
                  Created by Hritik Singh for students making one of their most
                  important education decisions.
                </p>
              </div>
              <Link href="/register">
                <Button size="lg" className="w-full bg-white text-indigo-700 hover:bg-white/95 sm:w-auto">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
