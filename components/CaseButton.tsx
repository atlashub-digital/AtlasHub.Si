"use client";
export default function CaseButton({
  scenario,
  children,
}: {
  scenario: string;
  children: React.ReactNode;
}) {
  return (
    <button
      className="button secondary"
      data-case={scenario}
      onClick={() => {
        window.dispatchEvent(
          new CustomEvent("clara:scenario", { detail: scenario }),
        );
        document
          .getElementById("clara")
          ?.scrollIntoView({
            behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
              ? "auto"
              : "smooth",
          });
      }}
    >
      {children}
    </button>
  );
}
