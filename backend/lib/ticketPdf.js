import PDFDocument from "pdfkit";

const GOLD = "#FFD700";
const DARK = "#0a0a0a";
const GREY = "#888888";

// Builds a physical-style cinema ticket PDF and pipes it into the response
export function buildTicketPDF(booking, res) {
  const doc = new PDFDocument({ size: [620, 280], margin: 0 });
  const filename = `CinemaLux-Ticket-${booking.ticketCode}.pdf`;
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  doc.pipe(res);

  // ---- Main ticket body ----
  doc.roundedRect(10, 10, 440, 260, 12).fillAndStroke(DARK, GOLD);
  doc.rect(10, 10, 440, 6).fill(GOLD);

  doc.fillColor(GOLD).font("Helvetica-Bold").fontSize(20).text("CINEMA", 30, 32);
  const cinemaW = doc.widthOfString("CINEMA");
  doc.fillColor("#ffffff").text("LUX", 30 + cinemaW, 32);
  doc.fillColor(GREY).font("Helvetica").fontSize(7)
    .text("P R E M I U M   M O V I E   E X P E R I E N C E", 30, 55);

  doc.fillColor(GREY).fontSize(8).text("MOVIE", 30, 85);
  doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(19)
    .text(booking.movieTitle, 30, 97, { width: 400 });

  const cols = [
    { label: "DATE", value: new Date(booking.showDate).toDateString() },
    { label: "TIME", value: booking.showTime },
    { label: "SCREEN", value: booking.screen || "Hall 1" },
    { label: "GUEST", value: booking.customerName },
    { label: "SEATS", value: booking.seats.join(", ") },
    { label: "PAID", value: `N${Number(booking.amount).toLocaleString()}` },
  ];
  let x = 30, y = 145;
  cols.forEach((c, i) => {
    if (i === 3) { x = 30; y += 55; }
    doc.fillColor(GREY).font("Helvetica").fontSize(7).text(c.label, x, y);
    doc.fillColor(i === 4 ? GOLD : "#ffffff").font("Helvetica-Bold").fontSize(11)
      .text(c.value, x, y + 12, { width: 130 });
    x += 135;
  });

  // ---- Perforation ----
  doc.circle(450, 20, 8).fill("#ffffff");
  doc.circle(450, 260, 8).fill("#ffffff");
  doc.moveTo(450, 28).lineTo(450, 252).dash(4, { space: 5 }).lineWidth(1)
    .strokeColor("#555555").stroke().undash();

  // ---- Stub ----
  doc.roundedRect(458, 10, 152, 260, 12).fillAndStroke("#141414", "#333333");
  doc.fillColor(GOLD).font("Helvetica-Bold").fontSize(9)
    .text("TICKET NO.", 472, 30);
  doc.fillColor("#ffffff").fontSize(13).text(booking.ticketCode, 472, 44);

  // Fake barcode generated deterministically from the code
  let bx = 472;
  const src = booking.ticketCode + booking.seats.join("");
  for (let i = 0; i < src.length * 2; i++) {
    const ch = src.charCodeAt(i % src.length);
    const w = (ch % 3) + 1;
    if ((ch & 1) === 1) doc.rect(bx, 75, w, 60).fill(GOLD);
    bx += w + 2;
    if (bx > 590) break;
  }
  doc.fillColor(GREY).font("Helvetica").fontSize(7)
    .text(booking.seats.join("  "), 472, 145, { width: 126 });
  doc.fillColor("#555555").fontSize(6)
    .text(`Ref: ${booking.paymentReference || "N/A"}`, 472, 240, { width: 126 });

  doc.end();
}