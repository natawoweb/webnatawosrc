import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-semibold">Writers Hub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link to="/writers" className="text-foreground/80 hover:text-foreground px-3 py-2 rounded-md">
              Writers
            </Link>
            <Link to="/events" className="text-foreground/80 hover:text-foreground px-3 py-2 rounded-md">
              Events
            </Link>
            <Link to="/blogs" className="text-foreground/80 hover:text-foreground px-3 py-2 rounded-md">
              Blogs
            </Link>
            <Button variant="outline" className="ml-4">
              Sign In
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={cn("md:hidden", isOpen ? "block" : "hidden")}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/writers"
            className="block px-3 py-2 rounded-md text-foreground/80 hover:text-foreground hover:bg-accent"
          >
            Writers
          </Link>
          <Link
            to="/events"
            className="block px-3 py-2 rounded-md text-foreground/80 hover:text-foreground hover:bg-accent"
          >
            Events
          </Link>
          <Link
            to="/blogs"
            className="block px-3 py-2 rounded-md text-foreground/80 hover:text-foreground hover:bg-accent"
          >
            Blogs
          </Link>
          <Button variant="outline" className="w-full mt-4">
            Sign In
          </Button>
        </div>
      </div>
    </nav>
  );
}