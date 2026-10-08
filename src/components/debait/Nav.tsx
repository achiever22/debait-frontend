import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";
import logoMark from "@/assets/logo-mark.png";
import { cinematicEase } from "@/lib/motion";
import { Magnetic } from "./Magnetic";
import { TransitionLink } from "./CinematicTransition";

const links = [
  { href: "/#event", label: "Event" },
  { href: "/#format", label: "Format" },
  { href: "/#schedule", label: "Schedule" },
  { href: "/#teams", label: "Teams" },
  { href: "/#rules", label: "Rules" },
  { href: "/#faq", label: "FAQ" },
  { href: "/scoreboard", label: "Live" },
  { href: "/register", label: "Register" },
];

export function Nav({ introReady = true }: { introReady?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const scrollFrameRef = useRef<number | null>(null);
  const scrolledRef = useRef(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const updateScrolledState = () => {
      scrollFrameRef.current = null;
      const nextScrolled = window.scrollY > 36;
      if (nextScrolled === scrolledRef.current) return;
      scrolledRef.current = nextScrolled;
      setScrolled(nextScrolled);
    };
    const onScroll = () => {
      if (scrollFrameRef.current === null) {
        scrollFrameRef.current = window.requestAnimationFrame(updateScrolledState);
      }
    };
    updateScrolledState();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollFrameRef.current !== null) window.cancelAnimationFrame(scrollFrameRef.current);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    window.setTimeout(() => firstLinkRef.current?.focus(), 80);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,opacity,padding] duration-500 ${
        scrolled ? "border-b border-line bg-canvas/88 py-3 backdrop-blur-xl" : "bg-transparent py-5"
      } ${introReady ? "opacity-100" : "pointer-events-none opacity-0"}`}
    >
      <nav
        className="relative z-20 mx-auto flex max-w-[1400px] items-center justify-between px-5 md:px-10"
        aria-label="Main"
      >
        <TransitionLink
          href="/#top"
          className="flex items-center gap-3 text-mist focus-visible:outline-2 focus-visible:outline-hot"
        >
          <img
            src={logoMark}
            alt="Orators' Club MJCET"
            className="h-11 w-11 rounded-full border border-mist/20 object-cover"
          />
          <div className="flex flex-col leading-tight">
            <span className="font-type text-[10px] uppercase tracking-widest text-hot">
              Orators&apos; Club
            </span>
            <span className="display text-2xl text-mist">
              De<span className="text-hot">&rsquo;</span>Bait
            </span>
          </div>
        </TransitionLink>

        <ul className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Magnetic strength={10}>
                <TransitionLink
                  href={link.href}
                  className={`group relative inline-flex rounded-full px-3 py-2 font-type text-xs uppercase tracking-wider transition-[color,background-color,box-shadow] hover:bg-mist/10 hover:text-sun focus-visible:outline-2 focus-visible:outline-hot ${
                    link.href === "/register"
                      ? "bg-sun text-ink hover:bg-sun hover:text-ink"
                      : "text-mist/80"
                  }`}
                >
                  {link.href === "/scoreboard" && (
                    <span className="pulse-dot mr-1.5 inline-block h-2 w-2 rounded-full bg-hot" />
                  )}
                  {link.label}
                  {link.href !== "/register" && (
                    <span className="absolute inset-x-3 bottom-1 h-px scale-x-0 bg-hot transition-transform duration-300 group-hover:scale-x-100" />
                  )}
                </TransitionLink>
              </Magnetic>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="text-mist focus-visible:outline-2 focus-visible:outline-hot md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-main-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-main-menu"
            initial={reduce ? { opacity: 0 } : { clipPath: "circle(0% at 100% 0%)" }}
            animate={reduce ? { opacity: 1 } : { clipPath: "circle(150% at 100% 0%)" }}
            exit={reduce ? { opacity: 0 } : { clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: reduce ? 0.15 : 0.52, ease: cinematicEase }}
            className="fixed inset-0 z-10 flex min-h-screen flex-col justify-center overflow-hidden bg-canvas px-8 text-mist md:hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,rgba(216,27,114,0.25),transparent_26%),radial-gradient(circle_at_12%_92%,rgba(255,214,0,0.18),transparent_34%)]" />
            <div className="relative flex flex-col">
              {links.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, x: 36 }}
                  animate={reduce ? { opacity: 1 } : { opacity: 1, x: 0 }}
                  transition={{
                    delay: reduce ? 0 : 0.12 + index * 0.055,
                    duration: 0.42,
                    ease: cinematicEase,
                  }}
                  className="border-b border-mist/15"
                >
                  <TransitionLink
                    ref={index === 0 ? firstLinkRef : undefined}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`display block py-2 text-5xl transition-colors hover:text-sun focus-visible:outline-2 focus-visible:outline-hot sm:text-6xl ${
                      link.href === "/register" ? "text-sun" : "text-mist"
                    }`}
                  >
                    {link.label}
                  </TransitionLink>
                </motion.div>
              ))}
              <p className="mt-10 font-hand text-xl text-hot">Same minds, different arguments.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
