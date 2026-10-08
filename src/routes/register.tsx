import { createFileRoute } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { Nav } from "@/components/debait/Nav";
import { RegistrationTicket } from "@/components/debait/RegistrationTicket";
import { TransitionLink } from "@/components/debait/CinematicTransition";
import { cinematicEase } from "@/lib/motion";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register a Team | DE'BAIT 2026 — Orators' Club MJCET" },
      {
        name: "description",
        content: "Register your five-member team for DE'BAIT 2026 at MJCET.",
      },
    ],
  }),
  component: RegistrationPage,
});

function RegistrationPage() {
  const reduce = useReducedMotion();

  return (
    <main className="cinematic-site min-h-screen overflow-hidden bg-canvas text-mist">
      <Nav />
      <section className="grain relative isolate min-h-screen overflow-hidden px-5 pb-20 pt-32 md:px-10 md:pb-28 md:pt-40">
        <motion.div
          aria-hidden="true"
          initial={false}
          animate={reduce ? {} : { x: ["-8%", "10%", "-8%"], y: ["-4%", "8%", "-4%"] }}
          transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-[24%] top-[5%] h-[54vw] w-[54vw] rounded-full bg-hot/15 blur-[150px]"
        />
        <motion.div
          aria-hidden="true"
          initial={false}
          animate={reduce ? {} : { x: ["10%", "-8%", "10%"], y: ["6%", "-6%", "6%"] }}
          transition={{ duration: 21, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-[20%] bottom-[-20%] h-[56vw] w-[56vw] rounded-full bg-sun/15 blur-[160px]"
        />

        <div className="relative mx-auto max-w-[1400px]">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, ease: cinematicEase }}
            className="grid gap-12 lg:grid-cols-[1fr_1.08fr] lg:gap-16"
          >
            <div className="self-center">
              <p className="font-type text-xs uppercase tracking-[0.28em] text-hot">
                Chapter 12 · Entry pass
              </p>
              <h1 className="display mt-5 text-[24vw] leading-[0.74] text-sun md:text-[13vw] lg:text-[10rem]">
                Register
              </h1>
              <p className="mt-7 max-w-md font-serif text-2xl leading-relaxed text-mist/85 md:text-3xl">
                One form per team of five. Takes two minutes.
              </p>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-mist/55 md:text-lg">
                Secure your team&apos;s place for two days of argument, adaptation, and decisive
                speaking at DE&apos;BAIT 2026.
              </p>
              <TransitionLink
                href="#ticket"
                className="mt-8 inline-flex items-center gap-2 font-type text-xs uppercase tracking-widest text-mist/70 transition-colors hover:text-sun focus-visible:outline-2 focus-visible:outline-hot"
              >
                View the entry pass <ArrowDown size={15} />
              </TransitionLink>
            </div>

            <motion.div
              id="ticket"
              initial={reduce ? false : { opacity: 0, y: 44, rotate: 1.5 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ delay: reduce ? 0 : 0.16, duration: 0.92, ease: cinematicEase }}
              className="self-center"
            >
              <RegistrationTicket />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
