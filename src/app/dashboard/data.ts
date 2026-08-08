import type { Procurement, ProcurementStatus, UserContext } from "./types";
import { WORKFLOW_STEPS } from "./types";


export const MOCK_PROCUREMENTS: Procurement[] = [
  {
    id: "PR-2026-001",
    title: "Laboratory Microscopes",
    faculty: "Faculty of Applied Sciences",
    department: "Biology",
    value: 320000,
    method: "—",
    status: "Pending Fund Verification",
    updatedAt: "2026-02-10T13:30:00Z",
    submittedBy: "Dr. Nimal Perera",
    description: "10× binocular compound microscopes for undergraduate biology practicals.",
    activityLog: [
      {
        id: "log-001-1",
        stepIndex: 0,
        actor: "Dr. Nimal Perera",
        role: "HOD",
        action: "Purchase requisition created after confirming items are out of stock at Central Stores.",
        timestamp: "2026-02-10T13:30:00Z",
        notes: "Stock verification completed with Supply Division on 2026-02-08.",
      },
    ],
  },
  {
    id: "PR-2026-002",
    title: "Office Stationery",
    faculty: "Faculty of Applied Sciences",
    department: "Computer Science",
    value: 185000,
    method: "Shopping",
    status: "Funds Verified",
    updatedAt: "2026-02-12T09:00:00Z",
    submittedBy: "Dr. Nimal Perera",
    description: "Annual stationery supply for the Computer Science department.",
    budgetCode: "BUDGET-2026-FAS-CS-001",
    activityLog: [
      {
        id: "log-002-1",
        stepIndex: 0,
        actor: "Dr. Nimal Perera",
        role: "HOD",
        action: "Purchase requisition created for annual stationery supply.",
        timestamp: "2026-02-08T10:00:00Z",
      },
      {
        id: "log-002-2",
        stepIndex: 1,
        actor: "Mr. Kamal Silva",
        role: "BUR",
        action: "Funds verified. Budget Code: BUDGET-2026-FAS-CS-001. Available balance: LKR 950,000.",
        timestamp: "2026-02-12T09:00:00Z",
        notes: "Funds confirmed from Faculty Operating Budget 2026.",
      },
    ],
  },
  {
    id: "PR-2026-003",
    title: "Network Switches",
    faculty: "Faculty of Applied Sciences",
    department: "IT Unit",
    value: 1250000,
    method: "Shopping",
    status: "Bidding Open",
    updatedAt: "2026-02-20T08:00:00Z",
    submittedBy: "Dr. Kumari Fernando",
    description: "24-port managed gigabit switches for campus network upgrade.",
    budgetCode: "BUDGET-2026-FAS-IT-003",
    activityLog: [
      {
        id: "log-003-1",
        stepIndex: 0,
        actor: "Dr. Kumari Fernando",
        role: "HOD",
        action: "Purchase requisition created for campus network upgrade equipment.",
        timestamp: "2026-02-01T09:00:00Z",
      },
      {
        id: "log-003-2",
        stepIndex: 1,
        actor: "Mr. Kamal Silva",
        role: "BUR",
        action: "Funds verified. Budget Code: BUDGET-2026-FAS-IT-003. Capital expenditure approved.",
        timestamp: "2026-02-05T11:00:00Z",
      },
      {
        id: "log-003-3",
        stepIndex: 2,
        actor: "Ms. Dilhani Jayasena",
        role: "SDC",
        action: "Bidding documents prepared and approved by Procurement Committee. Method: Shopping.",
        timestamp: "2026-02-15T14:00:00Z",
      },
      {
        id: "log-003-4",
        stepIndex: 3,
        actor: "Ms. Dilhani Jayasena",
        role: "SDC",
        action: "Bidding opened. 3 registered suppliers invited to submit sealed quotations. Deadline: 2026-03-05.",
        timestamp: "2026-02-20T08:00:00Z",
      },
    ],
    bids: [
      { bidderName: "Techno Solutions (Pvt) Ltd", bidderContact: "techno@example.lk", amount: 1180000, submittedAt: "2026-02-28T10:00:00Z", notes: "Includes 2-year on-site warranty" },
      { bidderName: "Lanka IT Supplies Co.", bidderContact: "lankait@example.lk", amount: 1240000, submittedAt: "2026-03-01T14:30:00Z", notes: "Cisco certified reseller" },
    ],
  },
  {
    id: "PR-2026-004",
    title: "Auditorium AV System",
    faculty: "Faculty of Management Studies",
    department: "Management",
    value: 4500000,
    method: "NCB",
    status: "Technical Evaluation",
    updatedAt: "2026-07-03T23:02:00Z",
    submittedBy: "Prof. Saman Wickramasinghe",
    description: "Full AV system including projectors, PA, and control systems.",
    budgetCode: "BUDGET-2026-FMS-AV-004",
    activityLog: [
      {
        id: "log-004-1",
        stepIndex: 0,
        actor: "Prof. Saman Wickramasinghe",
        role: "HOD",
        action: "Purchase requisition created for full auditorium AV system replacement.",
        timestamp: "2026-06-10T09:30:00Z",
      },
      {
        id: "log-004-2",
        stepIndex: 1,
        actor: "Mr. Kamal Silva",
        role: "BUR",
        action: "Funds verified. Budget Code: BUDGET-2026-FMS-AV-004. Capital Grant allocation confirmed.",
        timestamp: "2026-06-15T11:00:00Z",
        notes: "Value exceeds LKR 1M — forwarded to Main Bursar for central confirmation.",
      },
      {
        id: "log-004-3",
        stepIndex: 2,
        actor: "Ms. Dilhani Jayasena",
        role: "SDC",
        action: "NCB bidding documents prepared. Approved by Vice Chancellor's office.",
        timestamp: "2026-06-22T14:00:00Z",
      },
      {
        id: "log-004-4",
        stepIndex: 3,
        actor: "Ms. Dilhani Jayasena",
        role: "SDC",
        action: "NCB tender opened. 4 suppliers submitted bids before deadline 2026-07-01.",
        timestamp: "2026-06-25T08:00:00Z",
      },
      {
        id: "log-004-5",
        stepIndex: 4,
        actor: "Dr. Ruwan Fernando",
        role: "TEC",
        action: "TEC commenced technical and financial evaluation of 4 received bids.",
        timestamp: "2026-07-03T23:02:00Z",
      },
    ],
    bids: [
      { bidderName: "AV Masters Lanka (Pvt) Ltd", bidderContact: "av@example.lk", amount: 4250000, submittedAt: "2026-06-30T09:00:00Z", technicalScore: 88, financialScore: 92, isWinner: true, notes: "Full installation & 3-year maintenance included" },
      { bidderName: "SoundVision Systems", bidderContact: "sv@example.lk", amount: 4480000, submittedAt: "2026-06-30T11:00:00Z", technicalScore: 82, financialScore: 78, notes: "Panasonic authorised dealer" },
      { bidderName: "Digital Pro Solutions", bidderContact: "dps@example.lk", amount: 4600000, submittedAt: "2026-07-01T08:00:00Z", technicalScore: 75, financialScore: 70 },
      { bidderName: "Electro Lanka (Pvt) Ltd", bidderContact: "el@example.lk", amount: 5100000, submittedAt: "2026-07-01T13:00:00Z", technicalScore: 65, financialScore: 55, notes: "Bid rejected — non-compliant specifications" },
    ],
  },
  {
    id: "PR-2026-005",
    title: "Chemistry Lab Chemicals",
    faculty: "Faculty of Applied Sciences",
    department: "Chemistry",
    value: 275000,
    method: "Shopping",
    status: "Purchase Order Issued",
    updatedAt: "2026-02-15T14:30:00Z",
    submittedBy: "Dr. Nimal Perera",
    description: "Reagents and consumables for undergraduate chemistry labs.",
    budgetCode: "BUDGET-2026-FAS-CHEM-005",
    supplierName: "Lanka Lab Supplies Co.",
    poNumber: "PO-2026-005",
    activityLog: [
      { id: "log-005-1", stepIndex: 0, actor: "Dr. Nimal Perera", role: "HOD", action: "Purchase requisition created for chemistry lab consumables.", timestamp: "2026-02-01T09:00:00Z" },
      { id: "log-005-2", stepIndex: 1, actor: "Mr. Kamal Silva", role: "BUR", action: "Funds verified. Budget Code: BUDGET-2026-FAS-CHEM-005.", timestamp: "2026-02-05T10:00:00Z" },
      { id: "log-005-3", stepIndex: 2, actor: "Ms. Dilhani Jayasena", role: "SDC", action: "Bidding docs prepared and approved. Shopping method selected.", timestamp: "2026-02-08T11:00:00Z" },
      { id: "log-005-4", stepIndex: 3, actor: "Ms. Dilhani Jayasena", role: "SDC", action: "Quotations opened. 2 suppliers responded.", timestamp: "2026-02-10T09:00:00Z" },
      { id: "log-005-5", stepIndex: 4, actor: "Dr. Ruwan Fernando", role: "TEC", action: "Evaluation completed. Lanka Lab Supplies recommended as best bidder.", timestamp: "2026-02-12T14:00:00Z" },
      { id: "log-005-6", stepIndex: 5, actor: "Mr. Registrar", role: "TB", action: "Approved by Registrar (value < LKR 75,000 threshold — Shopping method).", timestamp: "2026-02-13T10:00:00Z" },
      { id: "log-005-7", stepIndex: 6, actor: "Ms. Dilhani Jayasena", role: "SDC", action: "Purchase Order PO-2026-005 issued to Lanka Lab Supplies Co. Delivery expected 2026-02-25.", timestamp: "2026-02-15T14:30:00Z" },
    ],
    bids: [
      { bidderName: "Lanka Lab Supplies Co.", amount: 272000, submittedAt: "2026-02-09T10:00:00Z", technicalScore: 92, financialScore: 95, isWinner: true },
      { bidderName: "SciMed Distributors", amount: 285000, submittedAt: "2026-02-09T14:00:00Z", technicalScore: 88, financialScore: 82 },
    ],
  },
  {
    id: "PR-2026-006",
    title: "Library Books",
    faculty: "Faculty of Engineering",
    department: "Library",
    value: 420000,
    method: "Shopping",
    status: "Awaiting Delivery",
    updatedAt: "2026-02-20T13:30:00Z",
    submittedBy: "Mr. Chathura Jayasena",
    description: "Set of 250 engineering reference books for faculty library expansion.",
    budgetCode: "BUDGET-2026-FEN-LIB-006",
    supplierName: "Book House (Pvt) Ltd",
    poNumber: "PO-2026-006",
    activityLog: [
      { id: "log-006-1", stepIndex: 0, actor: "Mr. Chathura Jayasena", role: "HOD", action: "Requisition raised after stock verification — library titles not available in stores.", timestamp: "2026-02-01T10:00:00Z" },
      { id: "log-006-2", stepIndex: 1, actor: "Mr. Kamal Silva", role: "BUR", action: "Funds verified. Budget Code: BUDGET-2026-FEN-LIB-006.", timestamp: "2026-02-05T09:00:00Z" },
      { id: "log-006-3", stepIndex: 2, actor: "Ms. Dilhani Jayasena", role: "SDC", action: "Shopping documents prepared and approved.", timestamp: "2026-02-08T11:00:00Z" },
      { id: "log-006-4", stepIndex: 3, actor: "Ms. Dilhani Jayasena", role: "SDC", action: "3 quotations collected from approved suppliers.", timestamp: "2026-02-10T11:00:00Z" },
      { id: "log-006-5", stepIndex: 4, actor: "Dr. Ruwan Fernando", role: "TEC", action: "Book House (Pvt) Ltd selected as best quotation.", timestamp: "2026-02-12T14:00:00Z" },
      { id: "log-006-6", stepIndex: 5, actor: "Prof. Anura Wickramasinghe", role: "TB", action: "Registrar approved — value within Shopping threshold.", timestamp: "2026-02-13T10:00:00Z" },
      { id: "log-006-7", stepIndex: 6, actor: "Ms. Dilhani Jayasena", role: "SDC", action: "Purchase Order PO-2026-006 issued to Book House (Pvt) Ltd.", timestamp: "2026-02-20T13:30:00Z" },
    ],
  },
  {
    id: "PR-2026-007",
    title: "Desktop Computers",
    faculty: "Faculty of Humanities",
    department: "IT Unit",
    value: 2800000,
    method: "NCB",
    status: "Quality Report Required",
    updatedAt: "2026-03-01T15:30:00Z",
    submittedBy: "Dr. Nilmini Silva",
    description: "50× desktop computers for academic staff workstations.",
    budgetCode: "BUDGET-2026-FHU-IT-007",
    supplierName: "Techno Solutions (Pvt) Ltd",
    poNumber: "PO-2026-007",
    grnNumber: "GRN-2026-007",
    activityLog: [
      { id: "log-007-1", stepIndex: 0, actor: "Dr. Nilmini Silva", role: "HOD", action: "Requisition created for 50 desktop computers for staff workstations.", timestamp: "2026-02-01T09:00:00Z" },
      { id: "log-007-2", stepIndex: 1, actor: "Mr. Kamal Silva", role: "BUR", action: "Funds verified — Capital Equipment budget confirmed. Budget Code: BUDGET-2026-FHU-IT-007.", timestamp: "2026-02-05T11:00:00Z" },
      { id: "log-007-3", stepIndex: 2, actor: "Ms. Dilhani Jayasena", role: "SDC", action: "NCB bidding documents approved by Vice Chancellor's office.", timestamp: "2026-02-10T14:00:00Z" },
      { id: "log-007-4", stepIndex: 3, actor: "Ms. Dilhani Jayasena", role: "SDC", action: "NCB bidding opened. 3 suppliers submitted bids.", timestamp: "2026-02-14T08:00:00Z" },
      { id: "log-007-5", stepIndex: 4, actor: "Dr. Ruwan Fernando", role: "TEC", action: "TEC evaluation completed. BES report submitted. Techno Solutions recommended.", timestamp: "2026-02-18T16:00:00Z" },
      { id: "log-007-6", stepIndex: 5, actor: "Prof. Anura Wickramasinghe", role: "TB", action: "Tender Board approved BES report. Techno Solutions authorised.", timestamp: "2026-02-20T10:00:00Z" },
      { id: "log-007-7", stepIndex: 6, actor: "Ms. Dilhani Jayasena", role: "SDC", action: "Purchase Order PO-2026-007 issued to Techno Solutions (Pvt) Ltd.", timestamp: "2026-02-22T14:00:00Z" },
      { id: "log-007-8", stepIndex: 7, actor: "Mr. Saman Rathnayake", role: "STK", action: "50 desktop computers received and counted. GRN-2026-007 issued. All items in good condition.", timestamp: "2026-03-01T15:30:00Z" },
    ],
    bids: [
      { bidderName: "Techno Solutions (Pvt) Ltd", amount: 2750000, submittedAt: "2026-02-13T10:00:00Z", technicalScore: 90, financialScore: 93, isWinner: true, notes: "Core i7, 16GB RAM, 512GB SSD — meets all specs" },
      { bidderName: "CyberZone Lanka", amount: 2850000, submittedAt: "2026-02-13T14:00:00Z", technicalScore: 85, financialScore: 82 },
      { bidderName: "Office World (Pvt) Ltd", amount: 2900000, submittedAt: "2026-02-14T09:00:00Z", technicalScore: 78, financialScore: 76 },
    ],
  },
  {
    id: "PR-2026-008",
    title: "Air Conditioning Units",
    faculty: "Faculty of Medical Sciences",
    department: "Facilities",
    value: 890000,
    method: "Shopping",
    status: "Payment Pending",
    updatedAt: "2026-03-02T19:30:00Z",
    submittedBy: "Dr. Premal Gamage",
    description: "5× inverter AC units (18000 BTU) for Lecture Hall B renovation.",
    budgetCode: "BUDGET-2026-FMS-FAC-008",
    supplierName: "Cool Air Systems Lanka",
    poNumber: "PO-2026-008",
    grnNumber: "GRN-2026-008",
    activityLog: [
      { id: "log-008-1", stepIndex: 0, actor: "Dr. Premal Gamage", role: "HOD", action: "Requisition submitted for AC units for Lecture Hall B renovation project.", timestamp: "2026-02-01T09:00:00Z" },
      { id: "log-008-2", stepIndex: 1, actor: "Mr. Kamal Silva", role: "BUR", action: "Funds verified. Budget Code: BUDGET-2026-FMS-FAC-008. Renovation budget confirmed.", timestamp: "2026-02-06T10:00:00Z" },
      { id: "log-008-3", stepIndex: 2, actor: "Ms. Dilhani Jayasena", role: "SDC", action: "Shopping docs prepared and approved by VC.", timestamp: "2026-02-10T14:00:00Z" },
      { id: "log-008-4", stepIndex: 3, actor: "Ms. Dilhani Jayasena", role: "SDC", action: "3 quotations received from approved suppliers.", timestamp: "2026-02-14T11:00:00Z" },
      { id: "log-008-5", stepIndex: 4, actor: "Dr. Ruwan Fernando", role: "TEC", action: "Evaluation complete. Cool Air Systems selected — best price and warranty.", timestamp: "2026-02-16T15:00:00Z" },
      { id: "log-008-6", stepIndex: 5, actor: "Prof. Anura Wickramasinghe", role: "TB", action: "VC approved — value within LKR 1M threshold.", timestamp: "2026-02-18T10:00:00Z" },
      { id: "log-008-7", stepIndex: 6, actor: "Ms. Dilhani Jayasena", role: "SDC", action: "Purchase Order PO-2026-008 issued to Cool Air Systems Lanka.", timestamp: "2026-02-20T14:00:00Z" },
      { id: "log-008-8", stepIndex: 7, actor: "Mr. Saman Rathnayake", role: "STK", action: "5 AC units received and inspected. GRN-2026-008 issued. Units fully installed in Lecture Hall B.", timestamp: "2026-02-28T10:00:00Z" },
      { id: "log-008-9", stepIndex: 8, actor: "Dr. Premal Gamage", role: "HOD", action: "Quality inspection completed. All 5 units operational and meet specification. Quality report approved.", timestamp: "2026-03-02T19:30:00Z" },
    ],
    bids: [
      { bidderName: "Cool Air Systems Lanka", amount: 875000, submittedAt: "2026-02-13T09:00:00Z", technicalScore: 91, financialScore: 94, isWinner: true, notes: "5-year compressor warranty included" },
      { bidderName: "ClimaTech (Pvt) Ltd", amount: 895000, submittedAt: "2026-02-13T14:00:00Z", technicalScore: 86, financialScore: 88 },
      { bidderName: "AirMaster Lanka", amount: 920000, submittedAt: "2026-02-13T16:00:00Z", technicalScore: 80, financialScore: 80 },
    ],
  },
];

/** Helper: format LKR value */
export function formatLKR(value: number): string {
  if (value >= 1_000_000) {
    return `LKR ${(value / 1_000_000).toFixed(1)}M`;
  }
  return `LKR ${value.toLocaleString("en-LK")}`;
}

/** Filter procurements visible to a given role/user */
export function getProcurementsForRole(user: UserContext): Procurement[] {
  const { role, faculty, department } = user;

  if (role === "HOD") {
    // HOD only sees procurements submitted from their department & faculty
    return MOCK_PROCUREMENTS.filter(p =>
      p.faculty === faculty && p.department === department
    );
  }

  if (role === "BUR" || role === "FBUR") {
    // If faculty is specified on the user, they are a Faculty Bursar
    // Otherwise they are the Main Bursar and see everything
    if (faculty) {
      return MOCK_PROCUREMENTS.filter(p => p.faculty === faculty);
    }
    return MOCK_PROCUREMENTS;
  }

  if (role === "SUP") {
    return MOCK_PROCUREMENTS.filter(p =>
      p.status === "Bidding Open" || p.status === "Technical Evaluation"
    );
  }

  // Others (FIN, SDC, TEC, TB, STK) see all
  return MOCK_PROCUREMENTS;
}

/** Get procurements that require action for a given role/user */
export function getActionQueueForRole(user: UserContext): Procurement[] {
  const { role } = user;
  const filtered = getProcurementsForRole(user);

  const map: Record<string, ProcurementStatus[]> = {
    HOD: ["Quality Report Required"],
    BUR: ["Pending Fund Verification"],
    FBUR: ["Pending Fund Verification"],
    SDC: ["Funds Verified"],
    TEC: ["Technical Evaluation"],
    TB:  ["Technical Evaluation"],
    STK: ["Awaiting Delivery"],
    SUP: ["Bidding Open"],
    FIN: ["Payment Pending"],
  };
  const statuses = map[role] ?? [];
  return filtered.filter(p => statuses.includes(p.status));
}

/**
 * Returns the 0-based active step index for a given procurement status.
 * -1 means the status is unknown / rejected.
 * 10 means "Completed" (all steps done).
 */
export function getStepIndexForStatus(status: ProcurementStatus): number {
  if (status === "Completed") return 10;
  if (status === "Rejected")  return -1;
  for (const step of WORKFLOW_STEPS) {
    if (step.mapToStatuses.includes(status)) return step.index;
  }
  return 0;
}
