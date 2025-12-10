"use client"
import { Zap, Users, Bus } from "lucide-react"
import { NavigationMenu } from "@/component/navigation-menu"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-background via-background to-muted flex flex-col items-center justify-center px-4 py-12">
      <NavigationMenu />

      {/* Header Section */}
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4 text-balance">
          <span className="text-primary">Your Journey</span>, Your Way
        </h1>
        <p className="text-lg md:text-xl text-foreground/70 text-balance">
          Connect with drivers, find riders, or discover public transit options. Pick the way that works for you.
        </p>
      </div>

      {/* Three Main Button Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        {/* Carpool Driver Button */}
        <button className="group relative overflow-hidden rounded-2xl bg-primary text-primary-foreground p-8 md:p-10 h-80 md:h-96 flex flex-col items-center justify-center gap-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
          <div className="absolute inset-0 bg-linear-to-br from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="bg-primary-foreground/20 p-4 rounded-full">
              <Zap className="w-12 h-12 md:w-16 md:h-16" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Carpool Driver</h2>
              <p className="text-sm md:text-base text-primary-foreground/90">Share your ride and earn money</p>
            </div>
          </div>
        </button>

        {/* Carpool Rider Button */}
        <button className="group relative overflow-hidden rounded-2xl bg-secondary text-secondary-foreground p-8 md:p-10 h-80 md:h-96 flex flex-col items-center justify-center gap-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2">
          <div className="absolute inset-0 bg-linear-to-br from-secondary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="bg-secondary-foreground/20 p-4 rounded-full">
              <Users className="w-12 h-12 md:w-16 md:h-16" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Carpool Rider</h2>
              <p className="text-sm md:text-base text-secondary-foreground/90">
                Get affordable rides with verified drivers
              </p>
            </div>
          </div>
        </button>

        {/* Public Transport Button */}
        <button className="group relative overflow-hidden rounded-2xl bg-accent text-accent-foreground p-8 md:p-10 h-80 md:h-96 flex flex-col items-center justify-center gap-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2">
          <div className="absolute inset-0 bg-linear-to-br from-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="bg-accent-foreground/20 p-4 rounded-full">
              <Bus className="w-12 h-12 md:w-16 md:h-16" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Public Transport</h2>
              <p className="text-sm md:text-base text-accent-foreground/90">Find buses, trains, and transit near you</p>
            </div>
          </div>
        </button>
      </div>

      {/* Footer Accent */}
      <div className="mt-16 text-center text-foreground/60 text-sm">
        <p>Safe, reliable, and sustainable transportation for everyone</p>
      </div>
    </main>
  )
}
