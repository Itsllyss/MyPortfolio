// Project 5: the n8n + Gemini Vision receipt and invoice extraction workflow.
// Shown in the project detail view and fed to the avatar's system prompt.
// Text in `backticks` renders as a node/field chip.

import type { Phase } from './fleet-workflows';

export const INVOICE_WORKFLOW: Phase = {
  id: 'invoice',
  tab: 'Workflow',
  short: 'Workflow',
  title: 'AI Invoice, Receipt & Expense Extraction: a 6-node n8n workflow',
  lead: 'Finance and operations teams lose hours reading receipt photos and PDF invoices by hand, renaming files, categorising expenses and flagging high-value purchases for a manager. This workflow does all of it from one upload.',
  image: {
    src: '/images/n8n-invoice-extraction.png',
    width: 1290,
    height: 676,
    alt: 'n8n workflow: Upload Receipt or Supplier Invoice form, then an Extract receipt data group with Analyze Receipt with Gemini and Parse Gemini JSON, then Upload Receipt to Drive, then a Total Over 500? check that routes true to Log Pending Approval and false to Log Auto-Approved, both appending to a Google Sheet.',
  },
  steps: [
    {
      title: 'Web Intake Form (n8n Form Trigger)',
      short: 'Upload form',
      span: 'Receipt photo or supplier invoice',
      text: 'An `n8n Form Trigger` gives the team a self-serve upload form that accepts receipt images and supplier invoices (`.pdf`, `.png`, `.jpg`, `.jpeg`).',
    },
    {
      title: 'Multimodal AI Document Extraction (Google Gemini, gemini-2.5-flash)',
      short: 'Gemini Vision extraction',
      span: 'File to strict JSON fields',
      text: 'Gemini Vision (`gemini-2.5-flash`) reads the raw binary file natively, with no OCR step, and returns the financial fields `date`, `vendor`, `category`, `subtotal`, `tax` and `total` in strict JSON.',
    },
    {
      title: 'JSON Sanitization & Schema Normalization (JavaScript Code node)',
      short: 'JSON clean-up',
      span: 'Raw AI reply to clean fields',
      text: 'A JavaScript `Code` node strips markdown fences from the AI reply, parses it into clean fields, maps the category to one of `Software`, `Travel`, `Office Supplies`, `Meals`, `Utilities` or `Other`, and sanitises the vendor name so it is safe to use in a Drive filename.',
    },
    {
      title: 'Automated Cloud Archiving (Google Drive)',
      short: 'Drive archive',
      span: 'Renamed file with a share link',
      text: 'Uploads every receipt to Google Drive, renamed to one convention (`YYYY-MM-DD_VendorName_$Total`), and returns a shareable file link for the ledger.',
    },
    {
      title: 'Threshold Approval Router (IF node)',
      short: '$500 approval check',
      span: 'Over $500 goes to a manager',
      text: 'An `IF` node checks whether the extracted `total` is over $500. Standard expenses go down the auto-approval path; anything above it is flagged for manager review.',
    },
    {
      title: 'Dual-Branch Ledger Logging (Google Sheets)',
      short: 'Expense ledger',
      span: 'One audit row per receipt',
      text: 'Each branch appends one audit row to the master Expense Tracker in Google Sheets: `Date`, `Vendor`, `Category`, `Subtotal`, `Tax`, `Total`, `Approval Status` and `File Link`, with the status set to `Auto-Approved` or `Pending Manager Approval`.',
    },
  ],
};

export const INVOICE_WORKFLOW_TEXT =
  `Problem solved: ${INVOICE_WORKFLOW.lead}\n` +
  INVOICE_WORKFLOW.steps.map((s, i) => `  Node ${i + 1}. ${s.title}: ${s.text.replace(/`/g, '')}`).join('\n');
