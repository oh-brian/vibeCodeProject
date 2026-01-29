import { useState } from "react";
import { appendEvent } from "./lib/eventLog";

const USER_ID_KEY = "demo_user_id";

function getOrCreateUserId() {
  let id = localStorage.getItem(USER_ID_KEY);
  if (!id) {
    id = `user_${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(USER_ID_KEY, id);
  }
  return id;
}

function App() {
  const [version, setVersion] = useState(0);
  const userId = getOrCreateUserId();

  return (
    <div style={{ padding: "24px", fontFamily: "Arial, sans-serif" }}>
      <h1>Demo Retailer</h1>
      <p>Click a product to simulate browsing behavior.</p>

      <ul>
        <li
          onClick={() => {
            appendEvent({
              type: "PRODUCT_CLICK",
              product: "running",
              userId,
              ts: Date.now(),
            });

            const key = "clicks_running";
            const current = Number(localStorage.getItem(key) || 0);
            localStorage.setItem(key, String(current + 1));

            setVersion((v) => v + 1);
          }}
        >
          Running Shoes
        </li>

        <li
          onClick={() => {
            appendEvent({
              type: "PRODUCT_CLICK",
              product: "skincare",
              userId,
              ts: Date.now(),
            });

            const key = "clicks_skincare";
            const current = Number(localStorage.getItem(key) || 0);
            localStorage.setItem(key, String(current + 1));

            setVersion((v) => v + 1);
          }}
        >
          Skincare Set
        </li>

        <li
          onClick={() => {
            appendEvent({
              type: "PRODUCT_CLICK",
              product: "headphones",
              userId,
              ts: Date.now(),
            });

            setVersion((v) => v + 1);
          }}
        >
          Wireless Headphones
        </li>
      </ul>
      <div style={{ marginTop: "16px", padding: "12px", border: "1px dashed #999" }}>
        {(() => {
          const offer = JSON.parse(localStorage.getItem("active_offer") || "null");

          if (!offer) {
            return <p><strong>Email Preview:</strong> No offer generated yet.</p>;
          }

          const subject =
            offer.offerType === "RUNNING_15"
              ? "Brian — 15% off Running Shoes just for you"
              : "Brian — 20% off Skincare Sets this week";

          const body =
            offer.offerType === "RUNNING_15"
              ? `Hi ${offer.userId},

Based on what you’ve been browsing, here’s a deal for you:

15% off all Running Shoes

Use code: RUN15
(Generated at: ${new Date(offer.generatedAt).toLocaleString()})`
              : `Hi ${offer.userId},

Based on what you’ve been browsing, here’s a deal for you:

20% off Skincare Sets (free shipping this week)

Use code: SKIN20
(Generated at: ${new Date(offer.generatedAt).toLocaleString()})`;

          return (
            <div>
              <p><strong>Email Preview</strong></p>
              <p><strong>Subject:</strong> {subject}</p>
              <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{body}</pre>
            </div>
          );
        })()}
      </div>

      <div style={{ marginTop: "24px", padding: "16px", border: "1px solid #ccc" }}>
        {(() => {
          const events = JSON.parse(localStorage.getItem("vc_events_v1") || "[]");

          const recent = events
            .filter((e) => e.type === "PRODUCT_CLICK" && e.userId === userId)
            .slice(-20);

          const running = recent.filter((e) => e.product === "running").length;
          const skincare = recent.filter((e) => e.product === "skincare").length;

          let newOffer = null;

          if (running >= 5 && running >= skincare) {
            newOffer = {
              userId,
              offerType: "RUNNING_15",
              product: "running",
              discount: 15,
              generatedAt: Date.now(),
            };
          }

          if (skincare >= 5 && skincare > running) {
            newOffer = {
              userId,
              offerType: "SKINCARE_20",
              product: "skincare",
              discount: 20,
              generatedAt: Date.now(),
            };
          }

          const existing = JSON.parse(localStorage.getItem("active_offer") || "null");

          // If behavior changed → overwrite stored offer
          if (
            newOffer &&
            (!existing || existing.offerType !== newOffer.offerType)
          ) {
            localStorage.setItem("active_offer", JSON.stringify(newOffer));
            return (
              <p>
                <strong>Your Offer:</strong> {newOffer.discount}% off{" "}
                {newOffer.product === "running"
                  ? "Running Shoes"
                  : "Skincare Sets"}
              </p>
            );
          }

          // Otherwise show existing offer
          if (existing) {
            return (
              <p>
                <strong>Your Offer:</strong> {existing.discount}% off{" "}
                {existing.product === "running"
                  ? "Running Shoes"
                  : "Skincare Sets"}
              </p>
            );
          }

          return <p><strong>Your Offer:</strong> Browse more to unlock a deal</p>;
        })()}
      </div>
    </div>
  );
}

export default App;