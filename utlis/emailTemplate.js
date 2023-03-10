export const emailTemplate = ({ otp }) => {
    return `<div style="background-color:#f6f6f6;margin:0">
  <table style="font-family:'akzidenz','helvetica','arial',sans-serif;font-size:14px;color:#5e5e5e;width:98%;max-width:600px;float:none;margin:0 auto" border="0" cellpadding="0" cellspacing="0" valign="top" align="left">
    <tbody>
      <tr bgcolor="#ffffff">
        <td>
          <table bgcolor="#ffffff" style="width:100%;line-height:20px;padding:32px;border:1px solid;border-color:#f0f0f0" cellpadding="0">
            <tbody>
              <tr>
                <td style="color:#000000;font-size:24px;font-weight:bold;line-height:28px">One-Time Verification Code</td>
              </tr>
              <tr>
                <td style="padding-top:24px;font-size:16px">You are receiving this email because a request was made for a one-time code that can be used for authentication.</td>
              </tr>
              <tr>
                <td style="padding-top:24px;font-size:16px">Please enter the following code for verification:</td>
              </tr>
              <tr>
                <td style="padding-top:24px;font-size:16px" align="center"><span id="m_-8787331735390009175verification-code" style="font-size:18px"><p style="background-color:#5fbe00;margin:0;color:white;font-weight: 600; letter-spacing: 5px; text-align: center; display: inline-block; padding:10px 20px;">${otp}</p></span></td>
              </tr>
              <tr>
                <td style="padding-top:24px;font-size:16px">This code expire after 5 mintues. So please verify your account within 5 mintues. If you don't verify your account please resend email.</td>
              </tr>
            </tbody>
          </table></td>
      </tr>
      <tr>
        <td align="center" style="font-size:12px;padding:24px 0;color:#999">This message was sent from Tourist Guide, Mirpur, Dhaka, Bangladesh</td>
      </tr>
    </tbody>
  </table><div class="yj6qo"></div><div class="adL">
</div></div>`;
};
