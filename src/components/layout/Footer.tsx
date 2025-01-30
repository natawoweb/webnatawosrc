import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

export function Footer() {
  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    
    // Here you would typically handle the newsletter subscription
    toast.success("Thank you for subscribing to our newsletter!");
    (e.target as HTMLFormElement).reset();
  };

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
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link to="/guidelines" className="text-sm text-muted-foreground hover:text-foreground">
                  Guidelines
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Stay Connected</h3>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <Input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                className="w-full"
              />
              <Button type="submit" className="w-full">
                Subscribe
              </Button>
            </form>
            <div className="flex space-x-4 mt-4">
              <a href="https://facebook.com/natawo" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                <FaFacebook size={20} />
              </a>
              <a href="https://twitter.com/natawo" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                <FaTwitter size={20} />
              </a>
              <a href="https://instagram.com/natawo" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                <FaInstagram size={20} />
              </a>
              <a href="https://youtube.com/natawo" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                <FaYoutube size={20} />
              </a>
            </div>
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