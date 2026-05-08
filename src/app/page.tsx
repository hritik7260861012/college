import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Search,
  GitCompare,
  Bookmark,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Users,
} from "lucide-react";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect College
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Discover, compare, and make informed decisions about your engineering education in India
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/colleges">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8">
                  <Search className="mr-2 h-5 w-5" />
                  Explore Colleges
                </Button>
              </Link>
              <Link href="/compare">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 text-lg px-8">
                  <GitCompare className="mr-2 h-5 w-5" />
                  Compare Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose CollegeFinder?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Search</h3>
              <p className="text-slate-600">
                Filter colleges by location, fees, ranking, and more to find your perfect match.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <GitCompare className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Side-by-Side Compare</h3>
              <p className="text-slate-600">
                Compare up to 3 colleges at once with detailed statistics and information.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bookmark className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Save Favorites</h3>
              <p className="text-slate-600">
                Bookmark colleges you're interested in and access them anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center">
            <div>
              <p className="text-4xl font-bold text-blue-600">45+</p>
              <p className="text-slate-600 mt-2">Colleges Listed</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600">15</p>
              <p className="text-slate-600 mt-2">States Covered</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600">100+</p>
              <p className="text-slate-600 mt-2">Courses</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600">500+</p>
              <p className="text-slate-600 mt-2">Reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Colleges Preview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Top Engineering Colleges</h2>
          <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">
            Explore some of the best engineering institutions in India, including IITs, NITs, IIITs, and top private colleges.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { name: "IIT Bombay", location: "Mumbai", ranking: 1, rating: 4.8 },
              { name: "IIT Delhi", location: "New Delhi", ranking: 2, rating: 4.7 },
              { name: "IIT Madras", location: "Chennai", ranking: 3, rating: 4.7 },
              { name: "IIT Kanpur", location: "Kanpur", ranking: 4, rating: 4.6 },
              { name: "IIT Kharagpur", location: "Kharagpur", ranking: 5, rating: 4.6 },
              { name: "IIT Roorkee", location: "Roorkee", ranking: 6, rating: 4.5 },
            ].map((college) => (
              <div key={college.name} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{college.name}</h3>
                    <p className="text-slate-500 text-sm">{college.location}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-1 rounded">
                    #{college.ranking}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1">{college.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/colleges">
              <Button className="gap-2">
                View All Colleges
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Create an account to save your favorite colleges, compare options, and make the best decision for your future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                Get Started Free
              </Button>
            </Link>
            <Link href="/colleges">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                Browse Colleges
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}