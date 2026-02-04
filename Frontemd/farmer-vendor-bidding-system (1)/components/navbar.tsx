"use client"

import { Search, Globe, User, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"

interface NavbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  isLoggedIn: boolean
  userRole?: "farmer" | "vendor" | "admin"
  onLogout?: () => void
}

export default function Navbar({
  searchQuery,
  onSearchChange,
  isLoggedIn,
  userRole,
  onLogout,
}: NavbarProps) {
  const { language, setLanguage, t } = useLanguage()

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center gap-6 px-4">

        {/* LEFT: Logo + Search */}
        <div className="flex items-center gap-6 flex-1">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg text-primary whitespace-nowrap"
          >
            <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center text-white font-bold">
              FV
            </div>
            <span className="hidden md:inline">AgroBid</span>
          </Link>

          {/* Search Bar */}
          <div className="max-w-xl w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-2">

          {/* Home */}
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">{t.home}</span>
            </Link>
          </Button>

          {/* Language */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage("en")}>
                English {language === "en" && "✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("hi")}>
                हिंदी {language === "hi" && "✓"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User / Login */}
          {isLoggedIn && userRole ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/${userRole}-dashboard`}>
                    {t.dashboard}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onLogout}>
                  {t.logout}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link href="/login">{t.login}</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}