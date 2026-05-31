"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type CandidateSummary } from "@/lib/types";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function toCell(value: string | number) {
  return `<Cell><Data ss:Type="${typeof value === "number" ? "Number" : "String"}">${escapeXml(String(value))}</Data></Cell>`;
}

function buildSpreadsheetXml(rows: CandidateSummary[], sheetName: string) {
  const headers = ["Name", "Email", "Phone", "Role", "Match %", "Skills", "Experience", "Status", "Upload Date", "Notes"];
  const xmlRows = [
    `<Row>${headers.map((header) => toCell(header)).join("")}</Row>`,
    ...rows.map((candidate) => {
      return [
        candidate.fullName,
        candidate.email,
        candidate.phone,
        candidate.role,
        candidate.matchPercentage,
        candidate.skills.join(", "),
        candidate.experienceYears,
        candidate.status,
        candidate.uploadDate,
        candidate.notes
      ]
        .map((value) => toCell(value))
        .join("");
    }).map((row) => `<Row>${row}</Row>`)
  ];

  return `<?xml version="1.0"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
  <Worksheet ss:Name="${escapeXml(sheetName)}">
    <Table>
      ${xmlRows.join("")}
    </Table>
  </Worksheet>
</Workbook>`;
}

export function ExportCandidatesButton({ candidates, jobTitle }: { candidates: CandidateSummary[]; jobTitle: string }) {
  const handleExport = () => {
    const xml = buildSpreadsheetXml(candidates, jobTitle || "Applicants");
    const blob = new Blob([xml], { type: "application/vnd.ms-excel;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(jobTitle || "applicants").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-applicants.xls`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleExport}>
      <Download className="h-4 w-4" /> Export to Excel
    </Button>
  );
}