# TRNC / research sources (saved) + project brief gap analysis

Use this file as the project’s **bibliography and scope checklist**. URLs were gathered from web research; verify each link before final submission.

---

## 1. Official TRNC statistics (usable for context & citations)

| Resource | URL | What you can use it for |
|----------|-----|-------------------------|
| KKTC İstatistik Kurumu — Statistical Yearbook (PDF, e.g. 2023) | https://stat.gov.ct.tr/Portals/39/ISTATISTIK_YILLIGI_2023_1.pdf | National vehicle fleet, transport chapter, accident tables (sourced from Police reports). **Not** junction-level calibration. |
| Same yearbook (mirror path pattern) | https://istatistik.gov.ct.tr/Portals/39/ISTATISTIK_YILLIGI_2023_1.pdf | Same as above if primary host is slow. |
| Bayındırlık ve Ulaştırma — statistics index | https://bub.gov.ct.tr/%C4%B0STAT%C4%B0ST%C4%B0K-VE-RAPORLAR | Hub for ministry PDFs. |
| Trafik Dairesi 2023 statistics page (PDF list) | https://bub.gov.ct.tr/TRAF%C4%B0K-DA%C4%B0RES%C4%B0-%C4%B0STAT%C4%B0ST%C4%B0KLER%C4%B0-2023 | Monthly / comparative vehicle registration, fuel type, licensing PDFs. |
| Example PDF (comparative vehicle registration table) | https://bub.gov.ct.tr/Portals/42/TRD%20MOTORLU%20ARAC%20MUKAYESELI%20KAYIT%20TABLOSU%2012_1.pdf | Fleet mix context for truck % discussion. |
| Example PDF (fuel type distribution) | https://bub.gov.ct.tr/Portals/42/TRD%20YAKIT%20TIPINE%20GORE%20ARAC%20KAYIT%20DAGILIMI%2012_1.pdf | Same. |
| Ministry archive (older Trafik Dairesi listing) | http://arsiv.bub.gov.ct.tr/%C4%B0STAT%C4%B0ST%C4%B0K-VE-RAPORLAR/%C4%B0STAT%C4%B0ST%C4%B0KLER/TRAF%C4%B0K-DA%C4%B0RES%C4%B0 | Historical PDFs if live site changes. |

---

## 2. Academic & grey literature (usable for methodology & Girne relevance)

| Resource | URL | What you can use it for |
|----------|-----|-------------------------|
| SIDRA Intersection 5 — Nicosia signalized intersections & roundabouts (NEU) | https://pdfs.semanticscholar.org/c1ad/7e602a07f2be5707ac5c62ae3933486c1a20.pdf | Prior work: professional LOS/delay/fuel/CO₂ comparison. Cite for “how junction studies are done.” |
| DOI (from article front matter) | http://dx.doi.org/10.17576/jkukm-2018-30(2) | Formal citation. |
| Traffic accident GIS — Kyrenia City (METU Open) | https://open.metu.edu.tr/handle/11511/64548 | Girne-specific accident spatial analysis; extract tables/figures if PDF accessible. |
| Statistical Anatomy of Traffic Accidents in Northern Cyprus (IJARBSS / HRMARS) | https://hrmars.com/index.php/papers/detail/IJARBSS/3945/Statistical-Anatomy-of-Traffic-Accidents-in-Northern-Cyprus | National accident patterns, narrative for “safety importance.” |
| Sustainable mobility — EMU campus (MDPI) | https://www.mdpi.com/2071-1050/10/12/4842 | Regional mobility context (secondary). |

---

## 3. Municipality & news (usable for motivation & policy narrative — verify primaries)

| Resource | URL | Notes |
|----------|-----|--------|
| Girne Belediyesi (official) | https://www.girnebelediyesi.com/ | May block automated fetch; use browser. |
| Girne — reported traffic counts at junctions | https://www.detaykibris.com/girne-belediyesi-17-nisan-cuma-gunu-bazi-kavsaklarda-trafik-sayimi-gerceklestirecek-64175h.htm | News; ask municipality for underlying data if needed. |
| Girne — smart signals / major roundabouts (reported) | https://www.kibrissondakika.com/girne-trafigi-rahatlatiliyorhirondel-ve-yeni-liman-cemberleri-akilli-isik-sistemine-donusturuluyor/ | Policy/engineering narrative. |
| Lefkoşa Türk Belediyesi | https://www.lefkosabelediyesi.org/ | Official. |
| LTB traffic arrangement example (news) | https://lefkosa.com.tr/ltbden-trafik-duzenlemesi-bilgilendirmesi-12469/ | Secondary. |
| Weekly traffic report example (news republishing PGM stats) | https://haberkibris.com/haftalik-trafik-raporu-aciklandi-1402-2026-03-31.html | National weekly snapshot; not junction OD. |

---

## 4. Use with caution (jurisdiction / access)

| Resource | URL | Warning |
|----------|-----|---------|
| Cyprus National Access Point (CyNAP) | http://www.traffic4cyprus.org.cy/ | Often **Republic of Cyprus / EU ITS** scope. Confirm coverage before calling it “TRNC data.” |
| TRNC-wide AADT / tube survey (press article) | https://www.fullcyprus.com/traffic-flow-survey-conducted-across-the-trnc/ | Good lead for **national** volume study; you still need **published count tables** from authorities to calibrate a specific junction. |

---

## 5. Stated project aim & objectives — what exists vs what is missing

**Aim (verbatim themes):** lane closures → flow + safety; congestion, travel times, accident probability; varying scenarios.

### Current software (`sim/kyrenia_sim.html`) — what it already does

- Microscopic 2D canvas simulation: vehicles, lanes, signals / priority / all-stop, optional roundabout mode.
- **Lane closures:** north or south **approach lane** closure on **intersection** mode only, with merge behaviour and markers. **Roundabout:** closure UI hidden and logic disabled for roundabout (by design in current build).
- **Congestion proxies:** active vehicles, average speed, stopped vehicles, average wait (`stopTime`), throughput (completed trips / elapsed time).
- **Driver behaviour:** sliders for inflow, max speed, politeness, truck ratio, timelapse.
- **UI:** live metrics panel; not a separate “prediction” engine.

### Gap analysis vs each objective

| Objective | Status | Missing or needs change |
|-----------|--------|---------------------------|
| **Design & implement simulation with appropriate tools** | **Partially met** | Tooling is appropriate for a prototype (HTML5 Canvas + JS). For the brief wording, either (a) state tools explicitly in report, or (b) add optional export pipeline (e.g. CSV + Python) if “appropriate software tools” must include analysis toolchain. |
| **Validate against TRNC traffic data** | **Not met as stated** | No junction-level observed flows, speeds, or crashes fed into the model. Yearbook / BUB PDFs are **national aggregates** — use for **contextual plausibility**, not numerical validation of this junction. **Needed:** manual count, municipality count, or study PDF tables; then compare at least one metric (e.g. peak throughput band or queue trend). |
| **Real-time conditions and predictions** | **Half met** | **Real-time:** yes (live metrics). **Predictions:** not implemented (no forecast horizon, no “what if in 15 minutes”). **Needed:** define “prediction” minimally (e.g. linear extrapolation of throughput from last N seconds, or scenario replay) or soften the objective in writing. |
| **Incorporate volume, lane closures, driver behaviour** | **Mostly met** | Volume and behaviour: yes. Closures: yes for **intersection**; explicitly **out of scope for roundabout** in current product — align brief text with that or re-implement roundabout-specific work-zone logic. |
| **Evaluate impact of lane closures on congestion and travel times** | **Partially met** | Congestion: yes via metrics. **Travel time:** no explicit OD travel time or per-route delay distribution — only global averages. **Needed:** per-vehicle trip time from spawn to exit, or average delay in network; compare with vs without closure. |
| **Estimate probability of accidents** | **Not met** | No crash model, no conflict surrogates (TTC/PET), no calibration to crash data. **Needed:** implement **conflict metrics** (e.g. severe TTC events per hour) and label as **risk proxy**, not literal crash probability; optional calibration if local crash counts exist. |

---

## 6. Recommended wording adjustments (if you cannot implement everything)

- Replace “validate … accuracy” with **“compare against available TRNC aggregate statistics and discuss limitations; calibrate when local counts are obtained.”**
- Replace “probability of accidents” with **“surrogate safety / conflict rate (proxy for crash risk).”**
- Replace “predictions” with **“live metrics and scenario comparison”** unless you add a forecast module.

---

## 7. Implementation priority (if aligning code to brief)

1. **Travel time / delay:** log entry time per vehicle, compute mean & p95 trip time; table with vs without closure.  
2. **Safety proxy:** TTC-based severe conflict counter + rate per hour; optional CSV export.  
3. **Validation appendix:** one page using yearbook + BUB for fleet/context + explicit “not junction-calibrated.”  
4. **Prediction (minimal):** rolling average throughput + simple trend line next 5 minutes, clearly labeled as extrapolation.  

---

*Last updated: saved sources + gap analysis for project brief alignment.*
