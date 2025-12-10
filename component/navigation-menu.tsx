"use client"

export function NavigationMenu() {
  return (
    <nav className="w-full mb-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">RideShare</h1>
        <div className="flex gap-4">
          <a href="#" className="text-foreground/70 hover:text-foreground transition">Home</a>
          <a href="#" className="text-foreground/70 hover:text-foreground transition">About</a>
          <a href="#" className="text-foreground/70 hover:text-foreground transition">Contact</a>
        </div>
      </div>
    </nav>
  )
}
