import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { ExternalLink } from "lucide-react";
import { useRef, useState } from "react";
import { editorialSpring, useFinePointer } from "@/lib/motion";
import { Magnetic } from "./Magnetic";

export const registrationFormUrl =
  "https://docs.google.com/forms/d/e/1FAIpQLSeAlw6IDFc9S9dRGxDRaQjfL05RW4DVN-0mv5pqmYHLoGc7JQ/viewform?utm_source=ig&utm_medium=social&utm_content=link_in_bio";

/** A bounded perspective response: the card feels physical without becoming a novelty. */
export function RegistrationTicket() {
  const finePointer = useFinePointer();
  const reduce = useReducedMotion();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const lift = useMotionValue(0);
  const springRotateX = useSpring(rotateX, editorialSpring);
  const springRotateY = useSpring(rotateY, editorialSpring);
  const springLift = useSpring(lift, editorialSpring);
  const [active, setActive] = useState(false);
  const enabled = finePointer && !reduce;
  const rectRef = useRef<DOMRect | null>(null);

  return (
    <div className="registration-ticket-stage mx-auto max-w-[680px] [perspective:1200px]">
      <motion.article
        onPointerEnter={(event) => {
          if (!enabled) return;
          rectRef.current = event.currentTarget.getBoundingClientRect();
          setActive(true);
        }}
        onPointerMove={(event) => {
          if (!enabled || !rectRef.current) return;
          const rect = rectRef.current;
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          rotateX.set(-y * 5);
          rotateY.set(x * 7);
          lift.set(-7);
        }}
        onPointerLeave={() => {
          rectRef.current = null;
          rotateX.set(0);
          rotateY.set(0);
          lift.set(0);
          setActive(false);
        }}
        style={{ rotateX: springRotateX, rotateY: springRotateY, y: springLift }}
        className="registration-ticket relative overflow-hidden border border-sun/65 bg-sun p-5 text-ink shadow-[10px_12px_0_rgba(216,27,114,0.66)] md:p-8"
      >
        <motion.div
          aria-hidden="true"
          animate={{ opacity: active && enabled ? 0.35 : 0 }}
          transition={{ duration: 0.25 }}
          className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-paper blur-3xl"
        />
        <div className="relative flex items-start justify-between gap-5 border-b-2 border-ink pb-5">
          <div>
            <p className="font-type text-[10px] uppercase tracking-[0.26em]">
              Orators&apos; Club MJCET
            </p>
            <p className="display mt-2 text-6xl leading-none md:text-8xl">DE&apos;BAIT</p>
          </div>
          <div className="border-2 border-ink px-3 py-2 text-center font-type text-xs font-bold uppercase leading-tight">
            Admit
            <br />
            <span className="display text-4xl">5</span>
          </div>
        </div>

        <div className="relative grid grid-cols-2 gap-x-6 gap-y-4 py-6 font-type text-xs uppercase tracking-wider md:grid-cols-5">
          <TicketField label="Theme" value="Social Media" />
          <TicketField label="Date" value="12–13 Oct" />
          <TicketField label="Venue" value="Seminar Hall" />
          <TicketField label="Block" value="04" />
          <TicketField label="Fee" value="₹199 / Team" />
        </div>

        <div className="registration-ticket__perforation relative -mx-5 border-t-2 border-dashed border-ink/70 md:-mx-8" />

        <div className="relative mt-6 flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="display text-3xl">One team. One ticket.</p>
            <p className="mt-1 max-w-sm font-serif text-sm italic text-ink/80">
              5 members: 3 Main Speakers + 2 Substitutes. Team leads cannot be changed once
              finalized. Fee ₹199/team for shortlisted participants.
            </p>
          </div>
          <Magnetic strength={12}>
            <a
              href={registrationFormUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center gap-2 border-2 border-ink bg-ink px-5 py-3 font-type text-xs font-bold uppercase tracking-wider text-sun transition-colors hover:bg-hot hover:text-paper focus-visible:outline-3 focus-visible:outline-hot focus-visible:outline-offset-4"
            >
              Open form <ExternalLink size={15} />
            </a>
          </Magnetic>
        </div>
      </motion.article>
    </div>
  );
}

function TicketField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] text-ink/60">{label}</p>
      <p className="mt-1 font-bold leading-tight">{value}</p>
    </div>
  );
}
