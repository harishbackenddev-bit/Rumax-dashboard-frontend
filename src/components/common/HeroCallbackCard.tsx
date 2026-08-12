"use client";

import { AssetImage } from "@/components/ui/AssetImage";

export function HeroCallbackCard() {
  return (
    <form className="callback-card" aria-label="Request a callback" onSubmit={(event) => event.preventDefault()}>
      <h2>Request a Callback</h2>
      <p>Connect with our experts</p>
      <label htmlFor="full-name">
        Full Name <span>*</span>
      </label>
      <input id="full-name" type="text" placeholder="Enter full name" />
      <label htmlFor="phone">
        Phone Number <span>*</span>
      </label>
      <input id="phone" type="tel" placeholder="Enter Phone Number" />
      <button type="submit">
        <AssetImage name="rumax-hero-callback.svg" aria-hidden="true" />
        Request a Callback
      </button>
    </form>
  );
}
