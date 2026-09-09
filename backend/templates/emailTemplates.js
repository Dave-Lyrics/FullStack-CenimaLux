const BRAND_GOLD = "#FFD700";
const BRAND_DARK = "#0a0a0a";

export const RESET_CODE_TEMPLATE = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Password Reset Code</title></head>
<body style="margin:0;padding:0;background:#111;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#1a1a1a;border:1px solid #2a2a2a;border-radius:16px;overflow:hidden;">
    <div style="background:${BRAND_DARK};padding:32px;text-align:center;border-bottom:2px solid ${BRAND_GOLD};">
      <h1 style="color:${BRAND_GOLD};margin:0;font-size:28px;letter-spacing:2px;">CINEMA<span style="color:#fff;">LUX</span></h1>
      <p style="color:#888;margin:6px 0 0;font-size:12px;letter-spacing:3px;">PREMIUM MOVIE EXPERIENCE</p>
    </div>
    <div style="padding:32px;">
      <h2 style="color:#fff;margin:0 0 12px;">Reset Your Admin Password</h2>
      <p style="color:#aaa;font-size:14px;line-height:1.6;">Hello <strong style="color:#fff;">{fullName}</strong>,</p>
      <p style="color:#aaa;font-size:14px;line-height:1.6;">We received a request to reset the password for your CinemaLux admin account. Use the verification code below:</p>
      <div style="text-align:center;margin:28px 0;">
        <div style="display:inline-block;background:#222;border:1px solid ${BRAND_GOLD};color:${BRAND_GOLD};font-size:34px;font-weight:bold;letter-spacing:10px;padding:18px 34px;border-radius:12px;">{resetCode}</div>
      </div>
      <p style="color:#aaa;font-size:13px;">This code will expire in <strong style="color:#fff;">10 minutes</strong>.</p>
      <p style="color:#e74c3c;font-size:13px;"><strong>Important:</strong> Do not share this code with anyone.</p>
      <p style="color:#777;font-size:12px;">If you did not request a password reset, you can safely ignore this email.</p>
      <p style="color:#aaa;font-size:13px;margin-top:24px;">Best Regards,<br><strong style="color:${BRAND_GOLD};">CinemaLux Team</strong></p>
    </div>
  </div>
</body>
</html>`;

export const TICKET_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Your CinemaLux Ticket</title></head>
<body style="margin:0;padding:0;background:#111;font-family:Arial,sans-serif;">
  <div style="max-width:640px;margin:0 auto;padding:24px;">
    <div style="text-align:center;margin-bottom:20px;">
      <h1 style="color:${BRAND_GOLD};margin:0;font-size:26px;letter-spacing:2px;">CINEMA<span style="color:#fff;">LUX</span></h1>
      <p style="color:#888;font-size:11px;letter-spacing:3px;margin:4px 0 0;">YOUR TICKET IS CONFIRMED</p>
    </div>

    <!-- Physical-style ticket -->
    <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:16px;overflow:hidden;">
      <!-- Main -->
      <div style="padding:28px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="vertical-align:top;">
              <p style="color:#888;font-size:10px;letter-spacing:2px;margin:0 0 4px;">MOVIE</p>
              <h2 style="color:#fff;margin:0 0 18px;font-size:22px;">{movieTitle}</h2>
            </td>
            <td style="vertical-align:top;text-align:right;">
              <p style="color:#888;font-size:10px;letter-spacing:2px;margin:0 0 4px;">TICKET NO.</p>
              <p style="color:${BRAND_GOLD};font-weight:bold;font-size:16px;margin:0;">{ticketCode}</p>
            </td>
          </tr>
        </table>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;">
              <p style="color:#888;font-size:10px;letter-spacing:2px;margin:0 0 2px;">DATE</p>
              <p style="color:#fff;font-size:14px;margin:0;font-weight:bold;">{showDate}</p>
            </td>
            <td style="padding:8px 0;">
              <p style="color:#888;font-size:10px;letter-spacing:2px;margin:0 0 2px;">TIME</p>
              <p style="color:#fff;font-size:14px;margin:0;font-weight:bold;">{showTime}</p>
            </td>
            <td style="padding:8px 0;">
              <p style="color:#888;font-size:10px;letter-spacing:2px;margin:0 0 2px;">SCREEN</p>
              <p style="color:#fff;font-size:14px;margin:0;font-weight:bold;">{screen}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 0;">
              <p style="color:#888;font-size:10px;letter-spacing:2px;margin:0 0 2px;">SEATS</p>
              <p style="color:${BRAND_GOLD};font-size:14px;margin:0;font-weight:bold;">{seats}</p>
            </td>
            <td style="padding:8px 0;">
              <p style="color:#888;font-size:10px;letter-spacing:2px;margin:0 0 2px;">GUEST</p>
              <p style="color:#fff;font-size:14px;margin:0;font-weight:bold;">{customerName}</p>
            </td>
            <td style="padding:8px 0;">
              <p style="color:#888;font-size:10px;letter-spacing:2px;margin:0 0 2px;">AMOUNT PAID</p>
              <p style="color:#fff;font-size:14px;margin:0;font-weight:bold;">&#8358;{amount}</p>
            </td>
          </tr>
        </table>
      </div>
      <!-- Stub -->
      <div style="border-top:2px dashed #333;padding:18px 28px;background:#141414;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td>
              <p style="color:#555;font-size:10px;letter-spacing:3px;margin:0;">{ticketCode} &bull; {seats}</p>
            </td>
            <td style="text-align:right;">
              <p style="color:#555;font-size:10px;margin:0;">Ref: {paymentReference}</p>
            </td>
          </tr>
        </table>
      </div>
    </div>

    <p style="color:#888;font-size:12px;text-align:center;margin:20px 0 0;line-height:1.6;">
      Arrive at least 15 minutes before showtime. Present this ticket (printed or on your phone) at the entrance.<br>
      Need help? Reply to this email or call the box office.
    </p>
    <p style="color:#666;font-size:11px;text-align:center;margin-top:16px;">&copy; CinemaLux. All rights reserved.</p>
  </div>
</body>
</html>`;