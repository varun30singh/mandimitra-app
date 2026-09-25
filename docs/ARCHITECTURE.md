# MandiMitra Architecture & Algorithm Specification

## 1. Smart Centre Recommendation Algorithm

MandiMitra avoids simple nearest-neighbour routing, which invariably causes congestion at the closest mandi. Instead, it computes an **Operational Optimization Score**:

$$\text{Recommendation Score} = w_d \cdot S_{\text{dist}} + w_q \cdot S_{\text{queue}} + w_s \cdot S_{\text{speed}} + w_c \cdot S_{\text{cap}} + w_a \cdot S_{\text{slot}}$$

### Default Configurable Weights:
- $w_d$ (Distance): 0.20
- $w_q$ (Queue length): 0.25
- $w_s$ (Processing speed): 0.15
- $w_c$ (Remaining yard capacity): 0.20
- $w_a$ (Dynamic slot availability): 0.20

### Constraints & Penalties:
- **Overload Penalty**: If a centre status is `OVERLOADED` or yard capacity $> 90\%$, total score is discounted by $50\%$ to automatically divert incoming traffic.
- **Fairness Constraint**: FIFO ordering is preserved across all booking slots. Priority lanes are strictly governed by transparent reasons (e.g. perishable goods or senior citizens) with full audit logging.

---

## 2. No-Wait Smart Departure Prediction Formula

Rather than forcing farmers to wait at the mandi yard, MandiMitra guides the farmer on when to depart from their farm:

$$\text{Estimated Turn} = T_{\text{current}} + \frac{N_{\text{ahead}} \cdot T_{\text{proc}}}{C_{\text{active}}}$$

$$\text{Recommended Departure Time} = \text{Estimated Turn} - (T_{\text{travel}} + T_{\text{buffer}})$$

Where:
- $N_{\text{ahead}}$ = Number of active farmers ahead in queue.
- $T_{\text{proc}}$ = Average processing time per farmer (minutes).
- $C_{\text{active}}$ = Number of currently operational weighbridge counters.
- $T_{\text{travel}}$ = Vehicle transit time (approx. 25 minutes).
- $T_{\text{buffer}}$ = Safety buffer (15–20 minutes).

### Dynamic Alert States:
1. `DO_NOT_LEAVE_YET`: $N_{\text{ahead}} > 6$ ("You don't need to leave yet. Estimated call around 11:42 AM.")
2. `GET_READY`: $4 \le N_{\text{ahead}} \le 6$ ("Get ready to leave soon. Departure recommended at 11:15 AM.")
3. `START_TRAVEL`: $N_{\text{ahead}} \le 3$ ("Your turn is approaching! Please start travelling.")
4. `ARRIVED_AT_MANDI`: Farmer scanned QR pass at gate.
5. `TURN_CALLED`: Counter announced for weighing & grading.
6. `IN_PROCESSING`: Assaying & weighbridge weighing in progress.
7. `COMPLETED`: Procurement completed and DBT payment initiated.

---

## 3. Demand Intelligence & Temporal Windows

MandiMitra models temporal demand across 6 discrete time horizons:
1. `15_MIN`: Immediate arrival burst detection
2. `30_MIN`: Short-term gate backlog
3. `60_MIN`: 1-hour horizon
4. `MORNING`: 08:00 AM – 12:00 PM
5. `AFTERNOON`: 12:00 PM – 04:00 PM
6. `EVENING`: 04:00 PM – 06:00 PM

Queue Pressure Index is calculated as:
$$\text{Queue Pressure} = \min\left(1.0, \frac{N_{\text{active}} \cdot T_{\text{proc}}}{C_{\text{active}} \cdot 120}\right)$$

---

## 4. Chatbot Grounding Hierarchy

To prevent hallucinations, the chatbot executes a strict 5-tier resolution hierarchy:
1. **Live PostgreSQL Database**: Query active token position, wait time, remaining slots, or payment record.
2. **Internal API Logic**: Dynamic distance and recommendation reasons.
3. **Deterministic Business Rules**: Departure advice based on travel time.
4. **Approved Agricultural Knowledge Base**: MSP rates 2026-27, required documents (7/12 Satbara, Aadhaar), quality FAQ.
5. **Google Gemini 1.5 Flash**: General agricultural pest, disease, and weather fallback.
