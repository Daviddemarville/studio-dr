"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";
import type { LucideIcon } from "lucide-react";

// Icons (hard coded parts)
import {
  LayoutDashboard,
  FilePenLine,
  Briefcase,
  Wallet,
  Workflow,
  PlusCircle,
  Users,
  Mail,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Settings,
} from "lucide-react";

// Dynamic icon library
import { SECTION_ICONS, DEFAULT_SECTION_ICON } from "@/lib/section-icons";

/* ---------------------------------------------------------
   TYPES STRICTS
--------------------------------------------------------- */

interface NavLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface NavSection {
  section: string;
  items: NavLink[];
}

type NavEntry = NavLink | NavSection;

/* ---------------------------------------------------------
   COMPONENT
--------------------------------------------------------- */

export default function AdminNav() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = supabaseBrowser();

  // Sidebar states
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Settings
  const [siteName, setSiteName] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  // Dynamic site sections
  const [dynamicSections, setDynamicSections] = useState<
    { id: string; title: string; route: string; icon: string }[]
  >([]);

  /* ---------------------------------------------------------
     DETECT MOBILE
  --------------------------------------------------------- */
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (mobile) {
        setCollapsed(true);
        setMobileOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /* ---------------------------------------------------------
   LOAD SETTINGS + DYNAMIC SECTIONS
--------------------------------------------------------- */
useEffect(() => {
  async function load() {
    // Settings
    const { data: settings } = await supabase
      .from("settings")
      .select("site_name, logo_url")
      .single();

    setSiteName(settings?.site_name ?? null);
    setLogoUrl(settings?.logo_url ?? null);

    // Site sections dynamic
    const { data: sections } = await supabase
      .from("site_sections")
      .select("id, title, slug, icon")
      .order("position", { ascending: true });

    setDynamicSections(
      (sections ?? []).map((s) => ({
        id: s.id,
        title: s.title,
        slug: s.slug,
        icon: s.icon,
        route: `/admin/section/${s.slug}`,
      }))
    );
  }

  load();
}, [supabase]);


  /* ---------------------------------------------------------
     LOGOUT
  --------------------------------------------------------- */
  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  /* ---------------------------------------------------------
     HELPERS
  --------------------------------------------------------- */
  const isActive = (href: string) => pathname === href;

  useEffect(() => {
    if (!mobileOpen) return;

    const handleOutside = () => setMobileOpen(false);
    window.addEventListener("click", handleOutside);
    return () => window.removeEventListener("click", handleOutside);
  }, [mobileOpen]);

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  const handleMobileLinkClick = (href: string) => {
    router.push(href);
    setMobileOpen(false);
  };

  const showText =
    (!collapsed && !isMobile) || (isMobile && mobileOpen);

  /* ---------------------------------------------------------
     RENDER
  --------------------------------------------------------- */
  return (
    <>
      {isMobile && mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-20"></div>
      )}

      <aside
        onClick={stopPropagation}
        className={`
          fixed md:static z-30 top-0 left-0 h-screen bg-gray-800 text-gray-200 
          shadow-xl border-r border-gray-700/50 flex flex-col overflow-hidden
          transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)]

          ${
            isMobile
              ? mobileOpen
                ? "w-64"
                : "w-20"
              : collapsed
              ? "w-20"
              : "w-64"
          }
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700/40">
          <div className="flex items-center gap-3">
            {logoUrl && logoUrl.trim() !== "" ? (
              <img
                src={logoUrl}
                alt="Logo"
                className="h-10 w-10 object-contain rounded select-none"
              />
            ) : siteName && siteName.trim() !== "" ? (
              showText && (
                <span className="text-lg font-semibold select-none">
                  {siteName}
                </span>
              )
            ) : (
              showText && (
                <span className="text-lg font-semibold select-none">
                  Studio DR
                </span>
              )
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isMobile) setMobileOpen(!mobileOpen);
              else setCollapsed(!collapsed);
            }}
            className="text-gray-300 hover:text-white transition"
          >
            {isMobile
              ? mobileOpen
                ? <ChevronLeft size={20} />
                : <ChevronRight size={20} />
              : collapsed
              ? <ChevronRight size={20} />
              : <ChevronLeft size={20} />
            }
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto p-4">

          {/* 🟦 Bloc 1 : Dashboard */}
          <div className="mb-6">
            <button
              onClick={() =>
                isMobile
                  ? handleMobileLinkClick("/admin")
                  : router.push("/admin")
              }
              className={`
                flex items-center gap-3 px-3 py-2 rounded-lg shadow-sm w-full
                ${
                  isActive("/admin")
                    ? "bg-blue-600 text-white border-l-4 border-blue-300"
                    : "hover:bg-gray-700/50 text-gray-300"
                }
              `}
            >
              <LayoutDashboard size={20} />
              {showText && <span>Tableau de bord</span>}
            </button>
          </div>

          {/* 🟦 Bloc 2 : SECTIONS DU SITE (DYNAMIQUE) */}
          <div className="mb-8">
            {showText && (
              <>
                <p className="text-gray-400 uppercase text-xs mb-1">
                  Sections du site
                </p>
                <p className="text-gray-500 text-xs mb-4">
                  cliquez pour modifier une section
                </p>
              </>
            )}

            <div className="flex flex-col gap-2">
              {dynamicSections.map((sec) => {
                const Icon =
                  SECTION_ICONS[sec.icon] || DEFAULT_SECTION_ICON;
                const active = isActive(sec.route);

                return (
                  <button
                    key={sec.id}
                    onClick={() =>
                      isMobile
                        ? handleMobileLinkClick(sec.route)
                        : router.push(sec.route)
                    }
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg shadow-sm w-full text-left
                      ${
                        active
                          ? "bg-blue-600 text-white border-l-4 border-blue-300"
                          : "hover:bg-gray-700/50 text-gray-300"
                      }
                    `}
                  >
                    <Icon size={20} />
                    {showText && <span>{sec.title}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 🟦 Bloc 3 : Actions rapides */}
          <div className="mb-8">
            {showText && (
              <p className="text-gray-400 uppercase text-xs mb-2">
                Actions rapides
              </p>
            )}

            <div className="flex flex-col gap-2">
              <button
                onClick={() =>
                  isMobile
                    ? handleMobileLinkClick("/admin/section/newsection")
                    : router.push("/admin/newsection")
                }
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg shadow-sm w-full text-left
                  hover:bg-gray-700/50 text-gray-300
                `}
              >
                <PlusCircle size={20} />
                {showText && <span>Nouvelle section</span>}
              </button>

              <button
                onClick={() =>
                  isMobile
                    ? handleMobileLinkClick("/admin/valideusers")
                    : router.push("/admin/valideusers")
                }
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg shadow-sm w-full text-left
                  hover:bg-gray-700/50 text-gray-300
                `}
              >
                <Users size={20} />
                {showText && <span>Valider un utilisateur</span>}
              </button>

              <button
                onClick={() =>
                  isMobile
                    ? handleMobileLinkClick("/admin/message")
                    : router.push("/admin/message")
                }
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg shadow-sm w-full text-left
                  hover:bg-gray-700/50 text-gray-300
                `}
              >
                <Mail size={20} />
                {showText && <span>Administrer les mails reçus</span>}
              </button>
            </div>
          </div>

          {/* 🟦 Bloc 4 : Paramètres */}
          <div className="mb-6">
            {showText && (
              <p className="text-gray-400 uppercase text-xs mb-2">
                Paramètres
              </p>
            )}

            <button
              onClick={() =>
                isMobile
                  ? handleMobileLinkClick("/admin/settings")
                  : router.push("/admin/settings")
              }
              className={`
                flex items-center gap-3 px-3 py-2 rounded-lg shadow-sm w-full text-left
                ${
                  isActive("/admin/settings")
                    ? "bg-blue-600 text-white border-l-4 border-blue-300"
                    : "hover:bg-gray-700/50 text-gray-300"
                }
              `}
            >
              <Settings size={20} />
              {showText && <span>Réglages du site</span>}
            </button>
            <button
              onClick={() =>
                isMobile
                  ? handleMobileLinkClick("/admin/profil")
                  : router.push("/admin/profil")
              }
              className={`
                flex items-center gap-3 px-3 py-2 rounded-lg shadow-sm w-full text-left
                ${
                  isActive("/admin/profil")
                    ? "bg-blue-600 text-white border-l-4 border-blue-300"
                    : "hover:bg-gray-700/50 text-gray-300"
                }
              `}
            >
              <Settings size={20} />
              {showText && <span>Profil</span>}
            </button>
          </div>

        </nav>

        {/* 🟥 LOGOUT */}
        <button
          onClick={logout}
          className="m-4 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
        >
          <LogOut size={20} />
          {showText && "Déconnexion"}
        </button>
      </aside>
    </>
  );
}
