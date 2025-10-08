import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import { PenSquare, User, LogOut } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 transition-smooth hover:opacity-80">
          <img src="/logo.svg" alt="WordBloom logo" className="h-8 w-8 rounded-md flex-shrink-0" />
          {/* Hide the full site text on small screens to avoid overlap with right-side controls */}
          <span className="hidden sm:inline text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">WordBloom</span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          {user ? (
            <>
              <Button
                onClick={() => navigate("/create")}
                className="gradient-primary text-primary-foreground transition-smooth hover:opacity-90"
              >
                <PenSquare className="mr-2 h-4 w-4" />
                Write
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user.email?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button onClick={() => navigate("/auth")} variant="default" className="gradient-primary text-primary-foreground">
                Sign In
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
