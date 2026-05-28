"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function SiteEffects() {
  const pathname = usePathname();
  const [lightboxSrc, setLightboxSrc] = useState("");

  useEffect(() => {
    setLightboxSrc("");

    const observer =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  entry.target.classList.add("is-visible");
                  observer.unobserve(entry.target);
                }
              });
            },
            { threshold: 0.14 }
          )
        : null;

    const revealElements = Array.from(document.querySelectorAll(".reveal"));
    const showVisibleReveal = (element) => {
      const rect = element.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        element.classList.add("is-visible");
        observer?.unobserve(element);
      }
    };
    revealElements.forEach((element) => {
      if (observer) observer.observe(element);
      else element.classList.add("is-visible");
    });
    const checkVisibleReveals = () => revealElements.forEach(showVisibleReveal);
    const revealFrame = window.requestAnimationFrame(checkVisibleReveals);
    const revealTimers = [window.setTimeout(checkVisibleReveals, 120), window.setTimeout(checkVisibleReveals, 420)];
    window.addEventListener("scroll", checkVisibleReveals, { passive: true });
    window.addEventListener("resize", checkVisibleReveals);

    const lightboxButtons = Array.from(document.querySelectorAll("[data-lightbox]"));
    const onLightboxClick = (event) => setLightboxSrc(event.currentTarget.dataset.lightbox || "");
    lightboxButtons.forEach((button) => button.addEventListener("click", onLightboxClick));

    const processButtons = Array.from(document.querySelectorAll("[data-process]"));
    const processCopy = document.querySelector("[data-process-copy]");
    const onProcessClick = (event) => {
      processButtons.forEach((item) => item.classList.remove("active"));
      event.currentTarget.classList.add("active");
      if (processCopy) processCopy.textContent = event.currentTarget.dataset.process || "";
    };
    processButtons.forEach((button) => button.addEventListener("click", onProcessClick));

    const briefInputs = Array.from(document.querySelectorAll("[data-brief]"));
    const briefOutput = document.querySelector("[data-brief-output]");
    const updateBrief = () => {
      if (!briefOutput || briefInputs.length === 0) return;
      const values = Object.fromEntries(briefInputs.map((input) => [input.dataset.brief, input.value]));
      briefOutput.textContent = `We are preparing a ${values.order.toLowerCase()} for ${values.category.toLowerCase()} with ${values.finish.toLowerCase()} and ${values.packaging.toLowerCase()}. Please review dimensions, target quantity, destination market and sample timeline.`;
    };
    briefInputs.forEach((input) => input.addEventListener("change", updateBrief));
    updateBrief();

    const forms = Array.from(document.querySelectorAll("[data-inquiry-form]"));
    const onFormSubmit = (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const formStatus = form.querySelector("[data-form-status]") || document.querySelector("[data-form-status]");

      if (!form.checkValidity()) {
        if (formStatus) formStatus.textContent = "Please complete the required fields before preparing the email.";
        form.reportValidity();
        return;
      }

      const data = new FormData(form);
      const subject = encodeURIComponent(`Yankun inquiry - ${data.get("product")}`);
      const lines = [
        `Name: ${data.get("name")}`,
        `Email: ${data.get("email")}`,
        `Product interest: ${data.get("product")}`,
        `Target quantity: ${data.get("quantity") || "To be confirmed"}`
      ];
      if (data.get("finish")) lines.push(`Finish preference: ${data.get("finish")}`);
      if (data.get("packaging")) lines.push(`Packaging: ${data.get("packaging")}`);
      lines.push("", "Requirement:", data.get("message"));

      if (formStatus) formStatus.textContent = "Opening your email client with the inquiry details.";
      window.location.href = `mailto:will526394@gmail.com?subject=${subject}&body=${encodeURIComponent(lines.join("\n"))}`;
    };
    forms.forEach((form) => form.addEventListener("submit", onFormSubmit));

    return () => {
      window.cancelAnimationFrame(revealFrame);
      revealTimers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("scroll", checkVisibleReveals);
      window.removeEventListener("resize", checkVisibleReveals);
      observer?.disconnect();
      lightboxButtons.forEach((button) => button.removeEventListener("click", onLightboxClick));
      processButtons.forEach((button) => button.removeEventListener("click", onProcessClick));
      briefInputs.forEach((input) => input.removeEventListener("change", updateBrief));
      forms.forEach((form) => form.removeEventListener("submit", onFormSubmit));
    };
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = lightboxSrc ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxSrc]);

  return (
    <div className="lightbox" hidden={!lightboxSrc} data-lightbox-panel onClick={() => setLightboxSrc("")}>
      <button type="button" aria-label="Close certificate preview" onClick={() => setLightboxSrc("")}>
        Close
      </button>
      {lightboxSrc ? <img src={lightboxSrc} alt="Certificate preview" data-lightbox-image /> : null}
    </div>
  );
}
