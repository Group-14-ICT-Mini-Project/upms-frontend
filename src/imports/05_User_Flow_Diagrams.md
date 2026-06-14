# User Flow Diagrams

## University Procurement Management System (UPMS)

### University of Sri Jayewardenepura | UX Design Phase

> User Flow Diagrams map every decision point and screen transition as users move through specific tasks. These flows are used by UI designers to build wireframes and by developers to understand system logic.

**Legend:**

- `[ Screen ]` — a UI screen the user sees
- `( Decision )` — a branching decision point
- `{ System Action }` — automatic system action (no user input needed)
- `→` — user action / transition
- `✅` / `❌` — positive / negative outcome

---

## Flow 1: Lecturer — Submit a New Procurement Requisition

**Trigger**: Lecturer decides they need a new item for their department.

```
START
  ↓
[ Login Screen ]
  → Enter institutional email + password
  ↓
{ System validates credentials + detects role = LECTURER }
  ↓
[ Lecturer Dashboard ]
  → Click "Submit New Request"
  ↓
[ Requisition Wizard — Step 1: Item Details ]
  → Enter item name
  → Guided spec builder (function-based, no brand names)
    ↓
  ( Brand name detected in spec field? )
    ├── YES → ⚠️ Inline warning: "Please describe by specification, not brand name"
    │          → User revises → Back to spec field
    └── NO → ✅ Proceed
  ↓
[ Requisition Wizard — Step 2: Item Category & Form Type ]
  → Select item category (consumable / capital)
  ↓
  ( Category = Consumable? )
    ├── YES → "Attach SD1 Form" prompt
    └── NO  → "Attach SD2 Form" prompt (capital item)
  ↓
[ File Upload ] → Attach SD1 or SD2
  ↓
[ Requisition Wizard — Step 3: Value & Funding ]
  → Enter estimated value (LKR)
  → Select funding source (Local / Foreign / Grant)
  → Enter budget code (if known) — optional
  ↓
[ Requisition Wizard — Step 4: Review & Submit ]
  → Review all entered information
  → Optional: Save as Draft
  ↓
  ( Submit? )
    ├── NO (Save Draft) → { PR saved as DRAFT } → [ My Requests — Drafts View ]
    └── YES → Click "Submit Requisition"
  ↓
{ System assigns PR number (e.g., PR-2024-047) }
{ System sends notification to HOD: "New requisition awaiting endorsement" }
  ↓
[ Confirmation Screen ]
  → "Your requisition PR-2024-047 has been submitted."
  → "Current Status: Awaiting HOD Endorsement"
  → Button: "Track My Request" → [ Status Tracker ]
  ↓
[ Status Tracker — PR-2024-047 ]
  Stages shown as timeline:
  [●] Submitted → [○] HOD Endorsement → [○] Fund Verification →
  [○] Tender Published → [○] Evaluation → [○] Approved → [○] Delivered
  ↓
END (Lecturer waits; notifications arrive at each stage)
```

---

## Flow 2: Lecturer — Verify Supplier Specifications

**Trigger**: System notifies Lecturer that supplier bids have returned and spec verification is needed.

```
START
  ↓
[ Notification Received ]
  → "Action Required: Verify specifications for PR-2024-047"
  ↓
[ Lecturer Dashboard ] → Notification Badge visible
  → Click notification
  ↓
[ Spec Verification Screen — PR-2024-047 ]
  → Header: "Technical Specification Verification Required"
  ↓
  [ Side-by-side comparison table ]
  ┌─────────────────────────┬──────────────────────────────┐
  │  YOUR ORIGINAL REQUEST  │  SUPPLIER'S SPECIFICATION    │
  ├─────────────────────────┼──────────────────────────────┤
  │ A4/A3 monochrome, 25ppm │ A4/A3 monochrome, 28ppm ✅  │
  │ ADF 50-sheet capacity   │ ADF 50-sheet capacity ✅     │
  │ Network-ready           │ Network-ready ✅             │
  │ Monthly duty: 30,000    │ Monthly duty: 25,000      
  └─────────────────────────┴──────────────────────────────┘
  ↓
  ( All specifications match? )
    ├── FULLY MATCHES → Button: "Confirm — Specifications Meet Requirement" ✅
    │     ↓
    │   { System records verification with timestamp + user ID }
    │   { Notification sent to Supplies Division: "Spec verification complete" }
    │     ↓
    │   [ Confirmation: "Verification submitted. Evaluation will proceed." ]
    │
    ├── PARTIAL MISMATCH → Button: "Flag Concern" ⚠️
    │     ↓
    │   [ Flag Details Form ] → Enter specific concern
    │   { Notification sent to Supplies Division + HOD }
    │
    └── DOES NOT MATCH → Button: "Reject — Specifications Do Not Meet Requirement" ❌
          ↓
        [ Rejection Reason Form ] → Enter reason
        { Notification to Supplies Division: "Spec verification failed — bid does not meet requirements" }
        { Bid flagged for TEC review }
  ↓
END
```

---

## Flow 3: HOD — Endorse a Requisition and Co-Approve Low-Value Procurement

**Trigger**: Lecturer submits a requisition; HOD receives notification.

```
START
  ↓
[ Notification ] → "New Requisition PR-2024-047 from Dr. Chamari — Awaiting Endorsement"
  → Click notification
  ↓
[ HOD Dashboard — Pending Endorsements Tab ]
  → Row: PR-2024-047 | Chamari Perera | Photocopier | Est: LKR 185,000 | Submitted: Today
  → Click "Review"
  ↓
[ Requisition Detail View — PR-2024-047 ]
  → Item: A4/A3 monochrome photocopier (full specs displayed)
  → SD1 Form: Attached ✅
  → Estimated Value: LKR 185,000 (Local Funds)
  → Requested by: Dr. Chamari Perera
  ↓
  ( Information complete? )
    ├── NO → Click "Return for Revision" → [ Return Reason Form ]
    │          { PR returned to Lecturer with HOD comments }
    │          { Status: Returned — Awaiting Revision }
    │
    └── YES → Click "Endorse & Forward to Bursar"
  ↓
{ System logs endorsement with HOD digital signature + timestamp }
{ System routes PR to Bursar for fund verification }
{ Notification to Lecturer: "PR-2024-047 endorsed by HOD. Now at: Bursar Fund Verification" }
{ Notification to Bursar: "New requisition PR-2024-047 awaiting fund verification" }
  ↓
[ HOD Dashboard — now shows PR in "With Bursar" status ]

════════════════════════════════════════════

[Later — when BES report arrives for co-approval]

[ Notification ] → "Co-Approval Required: BES Report for Tender T-2024-031 (LKR 185,000)"
  → (Value < LKR 500,000 → HOD + Dean approval required)
  ↓
[ BES Report View ]
  → Tender: T-2024-031 | Method: National Shopping
  → Recommended Supplier: ABC Copier Solutions
  → Bid Value: LKR 172,500
  → Technical Evaluation: ✅ Passed
  → Financial Evaluation: ✅ Lowest compliant bid
  ↓
  ( HOD approves? )
    ├── YES → Click "Digitally Approve" → { Signature recorded }
    │          { System checks: Dean co-approval pending? }
    │          ├── YES → { Notification to Dean: "Co-approval required" }
    │          └── NO (Dean already approved) → { PO generation triggered }
    │
    └── NO → Click "Reject / Query" → [ Rejection/Query Form ]
               { Routed back to Supplies Division with comments }
  ↓
END
```

---

## Flow 4: Bursar — Fund Verification and Tender Publication to promise.lk

**Trigger**: Bursar receives endorsed requisition from HOD.

```
START
  ↓
[ Notification ] → "Fund Verification Required: PR-2024-047 (LKR 185,000)"
  ↓
[ Bursar Dashboard — Budget Control Center ]
  → Pending Verification Queue: PR-2024-047 | LKR 185,000 | Faculty of Technology | ICT Dept.
  → Click "Review"
  ↓
[ Budget Verification Screen ]
  → Vote Code: [Automatic from requisition or manually selected]
  → Budget Details:
    ┌────────────────────────────────────────┐
    │ Vote Code: 3-2-2 (Capital Equipment)   │
    │ Allocated (2024):     LKR 2,500,000    │
    │ Committed (pending):  LKR 1,890,000    │
    │ Available:            LKR   610,000    │
    │ This Request:         LKR   185,000    │
    │ Remaining after:      LKR   425,000    │
    └────────────────────────────────────────┘
  ↓
  ( Funds available? )
    ├── YES (LKR 185,000 < LKR 610,000 available) →
    │   Click "Approve Fund Verification"
    │   { System soft-locks LKR 185,000 against vote code }
    │   { PR status → "Funds Verified — Ready for Tender" }
    │   { Notification to SDC: "PR-2024-047 is funded and ready for tender setup" }
    │
    └── NO → Click "Reject — Insufficient Funds"
              → [ Rejection Reason + Alternative Vote Code suggestion ]
              { PR returned to HOD with Bursar comments }
  ↓
[ Tender Setup Screen ]
  → Tender for: PR-2024-047 (Auto-populated)
  → Estimated Value: LKR 185,000
  ↓
  { System calculates: LKR 185,000 < LKR 25,000,000 (Local) → Method: National Shopping ✅ }
  → Procurement Method shown: NATIONAL SHOPPING (Read-only, system-determined)
  → Minimum Bidding Period: 5 working days (Read-only, enforced)
  → Bursar sets: Bidding Start Date / End Date (minimum 5 days enforced)
  → Document Fee: LKR 8,000 (configurable)
  → Bid Bond: Required (120-day bank guarantee)
  ↓
[ Supplier Category Filter ]
  → Item Category: Office Equipment / Reprographics
  → System shows: 14 registered suppliers in this category
  → Bursar reviews list → Click "Send Tender Invitations to All 14 Suppliers"
  ↓
  { System sends email notifications to 14 category-matched suppliers }
  ↓
[ promise.lk Integration Panel ]
  → All tender data pre-filled (tender number, specs, deadline, fees)
  → Click "Publish to promise.lk"
  ↓
  { System pushes tender data to promise.lk via API }
  { promise.lk Reference: PRM-2024-8876 recorded in system }
  ↓
[ Confirmation ]
  → "Tender T-2024-031 published. Bidding period: [Start Date] to [End Date]"
  → "Visible on promise.lk as PRM-2024-8876"
  → { Notification to HOD/Lecturer: "Tender has been published. Closing date: [date]" }
  ↓
[ Active Tender Dashboard ]
  → Tender T-2024-031 | Deadline: [Date] | 0/14 submissions received | 5 days remaining
  ↓
END
```

---

## Flow 5: Supplies Division Clerk — Bid Opening and Evaluation Routing

**Trigger**: Bid deadline is reached; bids have been submitted on promise.lk.

```
START
  ↓
{ System: Bid deadline for T-2024-031 reached at 23:59 on [End Date] }
{ System: ALL bid submissions on promise.lk LOCKED — no further submissions accepted }
{ System: Auto-imports all bid data from promise.lk into UPMS }
  ↓
[ Notification to SDC ] → "Bid deadline reached for T-2024-031. 7 bids imported. Bid Opening required."
  ↓
[ Bid Opening Module — T-2024-031 ]
  → Status: BIDS LOCKED ✅
  → Submissions Received: 7
  ↓
[ Bid Summary Table — Auto-Generated ]
  ┌──────┬──────────────────────────┬──────────────┬────────┬───────────┐
  │ Bid# │ Supplier                 │ Value (LKR)  │ Bond   │ VAT/SSCL  │
  ├──────┼──────────────────────────┼──────────────┼────────┼───────────┤
  │  1   │ ABC Copier Solutions     │  172,500     │ ✅ Yes │ ✅ Declared│
  │  2   │ TechSupply Lanka         │  198,000     │ ✅ Yes │ ✅ Declared│
  │  3   │ Office World Pvt Ltd     │  165,000     │ ❌ No  │ ✅ Declared│
  │  4   │ Premier Office Systems   │  181,000     │ ✅ Yes │ ❌ Missing │
  │  5   │ Lanka Print Solutions    │  175,500     │ ✅ Yes │ ✅ Declared│
  │  6   │ Saman Traders            │  209,000     │ ✅ Yes │ ✅ Declared│
  │  7   │ Digital Office Co.       │  167,500     │ ✅ Yes │ ✅ Declared│
  └──────┴──────────────────────────┴──────────────┴────────┴───────────┘
  Flags: Bid #3 — ❌ No Bond (Automatic Rejection) | Bid #4 — ❌ No VAT (Automatic Rejection)
  ↓
SDC clicks "Conduct Bid Opening"
  ↓
{ System generates Bid Opening Minutes with timestamp, all bid values, and compliance flags }
  ↓
  ( Value > LKR 500,000? )
    ├── YES → { System generates TEC Appointment Request to Vice Chancellor }
    │          { SDC reviews appointment request → "Send to VC" }
    │          { Notification to VC's office: "TEC Appointment Required for T-2024-031" }
    │          Wait for TEC appointment confirmation...
    │
    └── NO (LKR 185,000 — this case) →
              SDC proceeds directly to evaluation routing
  ↓
[For value < LKR 500,000: Financial Evaluation Only]

[ Financial Evaluation Screen ]
  → Valid Bids (after rejections):
    ┌──────┬──────────────────────────┬──────────────┬──────────────────┐
    │ Bid# │ Supplier                 │ Value (LKR)  │ Rank             │
    ├──────┼──────────────────────────┼──────────────┼──────────────────┤
    │  7   │ Digital Office Co.       │  167,500     │ 🥇 1st (Lowest)  │
    │  1   │ ABC Copier Solutions     │  172,500     │ 🥈 2nd           │
    │  5   │ Lanka Print Solutions    │  175,500     │ 🥉 3rd           │
    │  2   │ TechSupply Lanka         │  198,000     │ 4th              │
    │  6   │ Saman Traders            │  209,000     │ 5th              │
    └──────┴──────────────────────────┴──────────────┴──────────────────┘
  → Recommendation: Award to Digital Office Co. (LKR 167,500 — lowest compliant bid)
  ↓
SDC clicks "Generate BES Report"
  ↓
{ System auto-generates Bid Evaluation Summary Report with:
    - Tender details
    - Bid opening minutes
    - Compliance check results
    - Financial comparison table
    - Recommendation }
  ↓
{ System checks: LKR 167,500 — which approval authority? }
{ LKR 167,500 < LKR 500,000 → Route to: HOD + Dean (co-approval) }
  ↓
{ BES Report automatically routed to HOD and Dean }
{ Notifications sent to HOD and Dean: "BES Report requires your co-approval" }
  ↓
[ SDC Dashboard — BES Status: Pending HOD + Dean Approval ]
  ↓
[After Approval — notifications come back to SDC]

{ Both HOD and Dean approve → PO generation triggered }
  ↓
[ Award Notification Screen ]
  → System pre-generates:
    ├── Award Letter → Digital Office Co. ✅
    ├── Rejection Notice → ABC Copier Solutions ❌
    ├── Rejection Notice → Lanka Print Solutions ❌
    ├── Rejection Notice → TechSupply Lanka ❌
    └── Rejection Notice → Saman Traders ❌
  → SDC reviews and clicks "Send All Notifications"
  ↓
{ System sends all notifications via email }
{ Performance Bond tracker activated for Digital Office Co. }
  ↓
END → PO generated by Bursar → Delivery tracking begins
```

---

## Flow 6: Full End-to-End Process Flow (Overview)

```
LECTURER                  HOD                   BURSAR                SDC / SYSTEM
    │                      │                       │                        │
    ├─[Submit Request]─────→│                       │                        │
    │                      ├─[Endorse]─────────────→│                        │
    │                      │                       ├─[Verify Funds]         │
    │                      │                       │                        │
    │                      │                       ├─[Set Up Tender]────────→│
    │                      │                       ├─[Push to promise.lk]──→│
    │                      │                       │                        │
    │                      │                [Suppliers bid on promise.lk]   │
    │                      │                       │                        │
    │                      │                       │  ←─[Bids imported]─────┤
    │                      │                       │                        ├─[Bid Opening]
    │                      │                       │                        ├─[Preliminary Check]
    │◄─[Spec Verify]────────────────────────────────────────────────────────┤
    ├─[Confirm/Reject]──────────────────────────────────────────────────────→│
    │                      │                       │                        ├─[TEC if >500k]
    │                      │                       │                        ├─[Generate BES]
    │                      │                       │                        ├─[Route to Board]
    │                      │                       │                        │
    │                      ├◄─[Co-Approve BES]─────────────────────────────┤
    │                      ├─[Approve]─────────────────────────────────────→│
    │                      │                       │                        ├─[Award Notification]
    │                      │                       ├─[Generate PO]          │
    │                      │                       │                        │
    │            [Supplier delivers → Storekeeper GRN]                      │
    │                      │                       │                        │
    ├─[Submit Quality Report]──→                   │                        │
    │                      │                       ├─[Process Payment]      │
    │                      │                       │                        │
    ├◄─[Delivery & Warranty Notification]──────────┤                        │
    │  (incl. service agreement expiry date)       │                        │
    │                      │                       │                        │

    [60d/30d/7d BEFORE EXPIRY → Warranty Alert to Lecturer & HOD]
```

---

## Flow 7: Service Agreement Expiry Alert Flow

**Trigger**: System background job runs daily checking for upcoming service agreement expiries.

```
START (Daily System Job — Midnight)
  ↓
{ System scans all active Purchase Orders with service agreement dates }
  ↓
  For each PO with service agreement:
  ↓
  ( Days until expiry? )
    ├── = 60 days → Send alert to: Lecturer (owner) + HOD
    │               Alert type: "UPCOMING — 60 days"
    │               Message: "Service agreement for [Item] (PO-XXXX) expires on [Date]. 
    │                         Consider renewal or new procurement."
    │
    ├── = 30 days → Send alert to: Lecturer + HOD + Bursar
    │               Alert type: "WARNING — 30 days"
    │               Message: "Action recommended. 30 days until expiry."
    │
    ├── = 7 days → Send alert to: Lecturer + HOD + Bursar + Supplies Division
    │              Alert type: "URGENT — 7 days"
    │              Message: "Immediate action required. Service agreement expires in 7 days."
    │
    ├── = 0 (TODAY) → Send alert: "EXPIRED — Service agreement has expired."
    │                 Dashboard flag: ⛔ Expired
    │
    └── > 60 days → No action
  ↓
{ Alerts logged in audit trail }
  ↓
END (Repeat tomorrow)
```

---

## Summary: Key Decision Points in the UPMS Flows


| Decision Point     | Condition               | Outcome A                 | Outcome B                     |
| ------------------ | ----------------------- | ------------------------- | ----------------------------- |
| Brand name in spec | Detected                | ⚠️ Warn, block submission | Allow                         |
| Funding available  | Check budget            | ✅ Proceed to tender       | ❌ Return to HOD               |
| Procurement method | Value ≤ LKR 25M (local) | National Shopping         | NCB                           |
| TEC required       | Value > LKR 500,000     | ✅ TEC appointed           | Skip TEC                      |
| Approval authority | Value < LKR 500,000     | HOD + Dean                | Faculty/Mgmt/University Board |
| Bid bond present   | Check submission        | ✅ Accept                  | ❌ Auto-reject                 |
| VAT/SSCL declared  | Check submission        | ✅ Accept                  | ❌ Auto-reject                 |
| Service agreement  | Days to expiry          | Alert thresholds          | No action                     |


---

*Document Version: 1.0 | UX Design Phase | UPMS Group 14 | University of Sri Jayewardenepura*