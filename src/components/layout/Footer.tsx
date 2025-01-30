import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/2e998827-54b8-4981-b796-0eaa5c1cd8e2.png" 
                alt="NATAWO Logo" 
                className="h-10 w-10"
              />
              <h3 className="text-lg font-semibold">NATAWO</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              North America Tamil Writers Organization - Connecting writers and readers across the globe.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/writers" className="text-sm text-muted-foreground hover:text-foreground">
                  Writers Directory
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-sm text-muted-foreground hover:text-foreground">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="text-sm text-muted-foreground hover:text-foreground">
                  Blogs
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Community</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/guidelines" className="text-sm text-muted-foreground hover:text-foreground">
                  Guidelines
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} NATAWO. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}