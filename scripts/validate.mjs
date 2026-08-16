import fs from "node:fs";
const d = JSON.parse(fs.readFileSync(new URL("../data/ru-vet-prices.json", import.meta.url), "utf8"));
const ids = new Set(d.sources.map((s) => s.id));
let bad = 0;
for (const s of d.services) {
  for (const [id, v] of Object.entries(s.prices)) {
    if (!ids.has(id)) { console.error("unknown source", id, "in", s.key); bad++; }
    if (v !== null && (typeof v !== "number" || v <= 0)) { console.error("bad price", s.key, id, v); bad++; }
  }
  const xs = Object.values(s.prices).filter((v) => typeof v === "number");
  if (xs.length !== s.n) { console.error("n mismatch", s.key); bad++; }
  if (xs.length && (Math.min(...xs) !== s.min || Math.max(...xs) !== s.max)) { console.error("min/max mismatch", s.key); bad++; }
}
for (const s of d.sources) if ("site" in s || "url" in s) { console.error("source not anonymized:", s.id); bad++; }
console.log(bad ? `FAILED: ${bad}` : `OK: ${d.services.length} services, ${d.sources.length} anonymized sources`);
process.exit(bad ? 1 : 0);
