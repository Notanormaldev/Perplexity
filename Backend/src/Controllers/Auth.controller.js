import redis from "../config/cache.js"
import usermodel from "../model/user.model.js"
import { sendEmail } from "../services/mail.service.js"
import jwt from 'jsonwebtoken'

export async function register(req,res){

    const {username,email,password} = req.body

    const isuserlareadyexist  = await usermodel.findOne({
        $or:[
            {email},{username}
        ]
    })

    
    if(isuserlareadyexist){
        return res.status(403).json({
            msg:"already exist",
            err:'already exist',
            sucess:false
        })
    }

    const user= await usermodel.create({email,username,password})



    const emailverifytoken = jwt.sign({
    email:user.email
    },process.env.JWT)




    await sendEmail({
        to:email,
      subject: "Welcome to ZErio AI",

html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to ZErio AI</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=DM+Mono:wght@300;400;500&display=swap');
  </style>
</head>
<body style="margin:0;padding:0;background:#080808;font-family:'DM Mono',monospace;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#080808;padding:48px 16px;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- ── HEADER MARK ── -->
        <tr>
          <td align="center" style="padding-bottom:36px;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="
                  width:2px;
                  background:#c8c8c8;
                  border-radius:2px;
                  vertical-align:top;
                "></td>
                <td style="width:16px;"></td>
                <td style="
                  font-family:'DM Mono',monospace;
                  font-size:10px;
                  letter-spacing:3px;
                  color:#555;
                  text-transform:uppercase;
                  padding-top:2px;
                ">
                  CONFIDENTIAL · ACCOUNT ACTIVATION
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ── MAIN CARD ── -->
        <tr>
          <td style="
            background:#0f0f0f;
            border:1px solid #222;
            border-radius:4px;
            overflow:hidden;
          ">

            <!-- Top silver rule -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="height:1px;background:#3a3a3a;"></td>
              </tr>
            </table>

            <!-- Body content -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:60px 56px 52px;">

                  <!-- Logo mark + wordmark -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding-bottom:48px;">

                        <!-- Logo Icon — base64 embedded, white→silver gradient, no filter needed -->
                        <div style="margin-bottom:18px;">
                        
                        </div>

                        <!-- Wordmark -->
                        <div style="
                          font-family:'Cormorant Garamond',Georgia,serif;
                          font-size:38px;
                          font-weight:700;
                          letter-spacing:6px;
                          color:#E1EDEF;
                          text-transform:uppercase;
                          line-height:1;
                          margin-bottom:10px;
                        ">ZErio AI</div>

                        <!-- Thin rule under wordmark -->
                        <table cellpadding="0" cellspacing="0" align="center">
                          <tr>
                            <td style="width:24px;height:1px;background:#333;"></td>
                            <td style="width:8px;height:1px;background:#999;"></td>
                            <td style="width:8px;height:1px;background:#999;"></td>
                            <td style="width:24px;height:1px;background:#333;"></td>
                          </tr>
                        </table>

                        <div style="
                          font-family:'DM Mono',monospace;
                          font-size:9px;
                          letter-spacing:4px;
                          color:#777;
                          margin-top:12px;
                          text-transform:uppercase;
                        ">INTELLIGENCE · REDEFINED</div>

                      </td>
                    </tr>
                  </table>

                  <!-- Divider -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:44px;">
                    <tr>
                      <td style="height:1px;background:#1e1e1e;"></td>
                    </tr>
                  </table>

                  <!-- Greeting -->
                  <p style="
                    margin:0 0 6px;
                    font-family:'DM Mono',monospace;
                    font-size:10px;
                    letter-spacing:3px;
                    color:#555;
                    text-transform:uppercase;
                  ">ACCOUNT NOTICE</p>

                  <h2 style="
                    margin:0 0 28px;
                    font-family:'Cormorant Garamond',Georgia,serif;
                    font-size:32px;
                    font-weight:600;
                    color:#ececec;
                    letter-spacing:1px;
                    line-height:1.2;
                  ">Welcome, ${user.username}</h2>

                  <p style="
                    margin:0 0 32px;
                    font-family:'DM Mono',monospace;
                    font-size:13px;
                    color:#888;
                    line-height:2;
                  ">
                    Your ZErio AI account has been created.<br/>
                    One final step remains — verify your email address<br/>
                    to activate the full platform.
                  </p>

                  <!-- CTA Button -->
                  <table cellpadding="0" cellspacing="0" style="margin-bottom:44px;">
                    <tr>
                      <td>
                        <a href="https://zerio-ai-backend.onrender.com/api/auth/verify-email?token=${emailverifytoken}"
                          style="
                            display:inline-block;
                            padding:16px 40px;
                            background:#f0f0f0;
                            color:#0a0a0a;
                            text-decoration:none;
                            font-family:'DM Mono',monospace;
                            font-size:12px;
                            font-weight:500;
                            letter-spacing:3px;
                            text-transform:uppercase;
                            border-radius:2px;
                          ">
                          Verify Email →
                        </a>
                      </td>
                    </tr>
                  </table>

                  <!-- Token info box -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:40px;">
                    <tr>
                      <td style="
                        border-left:2px solid #333;
                        padding:16px 20px;
                        background:#0a0a0a;
                      ">
                        <p style="
                          margin:0 0 4px;
                          font-family:'DM Mono',monospace;
                          font-size:9px;
                          letter-spacing:3px;
                          color:#666;
                          text-transform:uppercase;
                        ">LINK VALID FOR</p>
                        <p style="
                          margin:0;
                          font-family:'DM Mono',monospace;
                          font-size:12px;
                          color:#777;
                        ">24 hours from receipt of this message</p>
                      </td>
                    </tr>
                  </table>

                  <!-- Disclaimer -->
                  <p style="
                    margin:0;
                    font-family:'DM Mono',monospace;
                    font-size:11px;
                    color:#666;
                    line-height:1.9;
                  ">
                    Didn't create an account? You can safely disregard this email.
                    No action is required on your part.
                  </p>

                </td>
              </tr>
            </table>

            <!-- Bottom rule -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="height:1px;background:#1a1a1a;"></td>
              </tr>
            </table>

            <!-- Footer -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:24px 56px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <!-- Left: Logo micro via CDN -->
                      <td style="vertical-align:middle;">
                      
                        <span style="
                          font-family:'DM Mono',monospace;
                          font-size:10px;
                          color:#666;
                          letter-spacing:2px;
                          vertical-align:middle;
                        ">ZERIO AI</span>
                      </td>

                      <!-- Right: Year -->
                      <td align="right" style="vertical-align:middle;">
                        <span style="
                          font-family:'DM Mono',monospace;
                          font-size:10px;
                          color:#666;
                          letter-spacing:1px;
                        ">© 2026</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- Bottom tag -->
        <tr>
          <td align="center" style="padding-top:32px;">
            <span style="
              font-family:'DM Mono',monospace;
              font-size:9px;
              letter-spacing:3px;
              color:#555;
              text-transform:uppercase;
            ">BUILT FOR THE FUTURE</span>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>`
    })

    res.status(200).json({
        msg:"created sucessfully",
        user:user,
        success:true
    })


}
export async function verifyemail(req,res){
    const token = req.query.token
    if(!token){
        return res.status(404).json({
            msg:"empty token"
        })
    }

    try {
    const decoded = jwt.verify(token,process.env.JWT)


    const user = await usermodel.findOne({email:decoded.email})


    if(!user){
       return res.status(404).json({
        msg:"user not eixst",
        sucess:false,
        err:'user not exist'
       })
    }

    user.verify=true

    await user.save()

    const loginToken = jwt.sign({
      id: user._id,
      username: user.username
    }, process.env.JWT)

    res.cookie("token", loginToken, {
  httpOnly: true,
  secure: true,
  sameSite: "none"
});

    const html =  `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Email Verified — ZErio AI</title>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=DM+Mono:wght@300;400;500&display=swap" rel="stylesheet"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --black:   #080808;
      --card:    #0f0f0f;
      --border:  #222;
      --silver:  #3a3a3a;
      --mid:     #666;
      --light:   #aaa;
      --white:   #f0f0f0;
      --green:   #4ade80;
      --green-dim: #166534;
    }

    html, body {
      min-height: 100vh;
      background: var(--black);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'DM Mono', monospace;
      overflow: hidden;
    }

    /* subtle grain overlay */
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
      pointer-events: none;
      z-index: 0;
    }

    /* animated radial glow behind card */
    .glow {
      position: fixed;
      width: 600px; height: 600px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(74,222,128,0.04) 0%, transparent 70%);
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      animation: pulse-glow 4s ease-in-out infinite;
      pointer-events: none;
      z-index: 0;
    }
    @keyframes pulse-glow {
      0%, 100% { opacity: 0.5; transform: translate(-50%,-50%) scale(1); }
      50%       { opacity: 1;   transform: translate(-50%,-50%) scale(1.15); }
    }

    /* page wrapper */
    .page {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 520px;
      padding: 24px 16px;
      animation: fade-up 0.7s cubic-bezier(.22,1,.36,1) both;
    }
    @keyframes fade-up {
      from { opacity: 0; transform: translateY(28px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* top label */
    .top-label {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 32px;
      animation: fade-up 0.6s .1s cubic-bezier(.22,1,.36,1) both;
    }
    .top-label-bar {
      width: 2px; height: 16px;
      background: var(--light);
      border-radius: 2px;
      flex-shrink: 0;
    }
    .top-label span {
      font-size: 9px;
      letter-spacing: 3px;
      color: var(--mid);
      text-transform: uppercase;
    }

    /* card */
    .card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 4px;
      overflow: hidden;
      animation: fade-up 0.6s .2s cubic-bezier(.22,1,.36,1) both;
    }
    .card-top-rule { height: 1px; background: var(--silver); }
    .card-body { padding: 56px 52px 48px; text-align: center; }

    /* logo */
    .logo-wrap {
      margin-bottom: 40px;
      animation: fade-up 0.6s .35s cubic-bezier(.22,1,.36,1) both;
    }
    .logo-icon {
      display: block;
      margin: 0 auto 16px;
      width: 44px; height: 44px;
    }
    .logo-name {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 34px;
      font-weight: 700;
      letter-spacing: 6px;
      color: var(--white);
      text-transform: uppercase;
      line-height: 1;
      margin-bottom: 10px;
    }
    .logo-rule {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      margin-bottom: 10px;
    }
    .logo-rule span:nth-child(1), .logo-rule span:nth-child(4) { display:block; width:24px; height:1px; background:#333; }
    .logo-rule span:nth-child(2), .logo-rule span:nth-child(3) { display:block; width:8px;  height:1px; background:#999; }
    .logo-tag {
      font-size: 9px;
      letter-spacing: 4px;
      color: var(--mid);
      text-transform: uppercase;
    }

    /* divider */
    .divider { height: 1px; background: #1e1e1e; margin-bottom: 44px; }

    /* check badge */
    .check-wrap {
      display: flex;
      justify-content: center;
      margin-bottom: 32px;
      animation: fade-up 0.5s .5s cubic-bezier(.22,1,.36,1) both;
    }
    .check-ring {
      position: relative;
      width: 72px; height: 72px;
    }
    /* SVG ring animation */
    .check-ring svg.ring {
      position: absolute;
      inset: 0;
      width: 100%; height: 100%;
    }
    .ring-circle {
      stroke-dasharray: 200;
      stroke-dashoffset: 200;
      animation: draw-ring 0.7s 0.6s cubic-bezier(.22,1,.36,1) forwards;
    }
    @keyframes draw-ring {
      to { stroke-dashoffset: 0; }
    }
    .check-inner {
      position: absolute;
      inset: 8px;
      background: rgba(74,222,128,0.07);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .check-mark {
      font-size: 26px;
      color: var(--green);
      line-height: 1;
      opacity: 0;
      animation: pop-in 0.4s 1s cubic-bezier(.34,1.56,.64,1) forwards;
    }
    @keyframes pop-in {
      from { opacity:0; transform: scale(0.5); }
      to   { opacity:1; transform: scale(1); }
    }

    /* heading */
    .status-tag {
      font-size: 9px;
      letter-spacing: 3px;
      color: var(--mid);
      text-transform: uppercase;
      margin-bottom: 10px;
      animation: fade-up 0.5s .6s both;
    }
    .heading {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 36px;
      font-weight: 600;
      color: var(--white);
      letter-spacing: 1px;
      line-height: 1.2;
      margin-bottom: 20px;
      animation: fade-up 0.5s .65s both;
    }
    .sub {
      font-size: 12px;
      color: #888;
      line-height: 2;
      margin-bottom: 40px;
      animation: fade-up 0.5s .7s both;
    }

    /* button */
    .btn-wrap { animation: fade-up 0.5s .8s both; margin-bottom: 40px; }
    .btn {
      display: inline-block;
      padding: 15px 48px;
      background: var(--white);
      color: #0a0a0a;
      text-decoration: none;
      font-family: 'DM Mono', monospace;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 3px;
      text-transform: uppercase;
      border-radius: 2px;
      border: 1px solid transparent;
      transition: background 0.2s, color 0.2s, border-color 0.2s;
    }
    .btn:hover {
      background: transparent;
      color: var(--white);
      border-color: var(--silver);
    }

    /* info strip */
    .info-strip {
      border-left: 2px solid #2e2e2e;
      padding: 14px 18px;
      background: #0a0a0a;
      text-align: left;
      margin-bottom: 36px;
      animation: fade-up 0.5s .85s both;
    }
    .info-strip-label {
      font-size: 8px;
      letter-spacing: 3px;
      color: var(--mid);
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .info-strip-text { font-size: 11px; color: #777; line-height: 1.8; }

    /* disclaimer */
    .disclaimer {
      font-size: 10px;
      color: var(--mid);
      line-height: 1.9;
      animation: fade-up 0.5s .9s both;
    }

    /* footer */
    .card-footer {
      border-top: 1px solid #1a1a1a;
      padding: 20px 52px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .footer-left { display: flex; align-items: center; gap: 8px; }
    .footer-logo { width: 15px; height: 15px; }
    .footer-name { font-size: 9px; letter-spacing: 2px; color: var(--mid); text-transform: uppercase; }
    .footer-copy { font-size: 9px; letter-spacing: 1px; color: #444; }

    /* bottom tag */
    .bottom-tag {
      text-align: center;
      margin-top: 28px;
      font-size: 8px;
      letter-spacing: 3px;
      color: #333;
      text-transform: uppercase;
      animation: fade-up 0.5s 1s both;
    }
  </style>
</head>
<body>

<div class="glow"></div>

<div class="page">

  <!-- top label -->
  <div class="top-label">
    <span class="top-label-bar"></span>
    <span>SECURE · EMAIL VERIFICATION</span>
  </div>

  <!-- card -->
  <div class="card">
    <div class="card-top-rule"></div>

    <div class="card-body">

      <!-- logo -->
      <div class="logo-wrap">
        <img class="logo-icon" alt="ZErio AI"
          src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9InNnIiB4MT0iMCIgeTE9IjAiIHgyPSIwIiB5Mj0iMSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmZmZmZmYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjYTBhMGEwIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cGF0aCBmaWxsPSJ1cmwoI3NnKSIgZD0iTTYuOTY0MDcgM0gxNy4wMzU4QzE3LjI4NDQgNC43MjIwMSAxOC43NjAxIDYgMjAuNSA2IDIwLjgzMjEgNiAyMS4xNjI2IDUuOTUyNzIgMjEuNDgxNCA1Ljg1OTU3IDIxLjI5NzIgNy42NDM4NiAxOS43OTM3IDkgMTggOUg1Ljk5OTk3QzQuMjA2MTkgOSAyLjcwMjc4IDcuNjQzODYgMi41MTg0OSA1Ljg1OTU3IDIuODM3MzMgNS45NTI3MiAzLjE2NzgxIDYgMy40OTk5NyA2IDUuMjM5ODIgNiA2LjcxNTUyIDQuNzIyMDEgNi45NjQwNyAzWk0xNi44OTk0IDYuNjU3NjFDMTYuMzM5MSA2LjE3MjQgMTUuOTAyIDUuNjE5ODYgMTUuNTg4MSA1SDguNDExODRDOC4wOTc5MyA1LjYxOTg2IDcuNjYwODQgNi4xNzI0IDcuMTAwNTcgNi42NTc2MSA2Ljk1OTEgNi43ODAxMyA2LjgxNDUgNi44OTQyNiA2LjY2Njc4IDdIMTcuMzMzMUMxNy4xODU1IDYuODk0MjYgMTcuMDQwOSA2Ljc4MDEzIDE2Ljg5OTQgNi42NTc2MVpNMjEuNSAxMS41MDA1QzIyLjAzNzYgMTEuNTAwNSAyMi41NDIyIDExLjM1OTEgMjIuOTc4NiAxMS4xMTE0IDIyLjk5MjcgMTEuMjM5MSAyMyAxMS4zNjkgMjMgMTEuNTAwNSAyMyAxMi44OTY3IDIyLjE4MjUgMTQuMTAxOSAyMSAxNC42NjM3VjIxSDE0VjE5QzE0IDE3Ljg5NTQgMTMuMTA0NiAxNyAxMiAxNyAxMC44OTU0IDE3IDEwIDE3Ljg5NTQgMTAgMTlWMjFIM1YxNC42NjM3QzEuODE3NTMgMTQuMTAxOSAxIDEyLjg5NjcgMSAxMS41MDA1IDEgMTEuMzY5IDEuMDA3MjUgMTEuMjM5MSAxLjAyMTM4IDExLjExMTQgMS40NTc3OCAxMS4zNTkxIDEuOTYyMzcgMTEuNTAwNSAyLjUgMTEuNTAwNSAzLjYxMDQyIDExLjUwMDUgNC41Nzk5NCAxMC44OTcyIDUuMDk4NjUgMTAuMDAwNUgxOC45MDEzQzE5LjQyMDEgMTAuODk3MiAyMC4zODk2IDExLjUwMDUgMjEuNSAxMS41MDA1Wk0xOC45NjMyIDEyLjgwOTdDMTguNTc1NiAxMi41ODEyIDE4LjIyOTYgMTIuMzExNSAxNy45MjUyIDEyLjAwMDVINi4wNzQ3OUM1Ljc3MDQyIDEyLjMxMTUgNS40MjQ0MyAxMi41ODEyIDUuMDM2ODMgMTIuODA5NyA0LjgzNCAxMi45MjkzIDQuNjI2ODMgMTMuMDMzMyA0LjQxNTMyIDEzLjEyMThMNSAxMy4zOTk2VjE5SDhDOCAxNy44OTU0IDguMzkwNTIgMTYuOTUyNiA5LjE3MTU3IDE2LjE3MTYgOS45NTI2MiAxNS4zOTA1IDEwLjg5NTQgMTUgMTIgMTUgMTMuMTA0NiAxNSAxNC4wNDc0IDE1LjM5MDUgMTQuODI4NCAxNi4xNzE2IDE1LjYwOTUgMTYuOTUyNiAxNiAxNy44OTU0IDE2IDE5SDE5VjEzLjM5OTZMMTkuNTg0NyAxMy4xMjE4QzE5LjM3MzIgMTMuMDMzMyAxOS4xNjYgMTIuOTI5MyAxOC45NjMyIDEyLjgwOTdaIi8+Cjwvc3ZnPg=="
        />
        <div class="logo-name">ZErio AI</div>
        <div class="logo-rule">
          <span></span><span></span><span></span><span></span>
        </div>
        <div class="logo-tag">Intelligence · Redefined</div>
      </div>

      <div class="divider"></div>

      <!-- animated green check ring -->
      <div class="check-wrap">
        <div class="check-ring">
          <svg class="ring" viewBox="0 0 72 72" fill="none">
            <circle class="ring-circle"
              cx="36" cy="36" r="31"
              stroke="#4ade80" stroke-width="1.2"
              stroke-linecap="round"
              transform="rotate(-90 36 36)"
            />
          </svg>
          <div class="check-inner">
            <span class="check-mark">✓</span>
          </div>
        </div>
      </div>

      <p class="status-tag">STATUS UPDATE</p>
      <h1 class="heading">Email Verified</h1>
      <p class="sub">
        Your email address has been confirmed.<br/>
        Your ZErio AI account is now fully active<br/>
        and ready to use.
      </p>

      <div class="btn-wrap">
        <a href="https://zerio-ai.onrender.com/" class="btn">Enter Platform →</a>
      </div>

      <div class="info-strip">
        <p class="info-strip-label">What's next</p>
        <p class="info-strip-text">Log in with your credentials to access the full ZErio AI experience and begin your journey.</p>
      </div>

      <p class="disclaimer">
        If you did not verify this account, please contact support immediately.
      </p>

    </div>

    <!-- footer -->
    <div class="card-footer">
      <div class="footer-left">
        <img class="footer-logo" alt=""
          src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+CiAgPHBhdGggZmlsbD0iIzY2NjY2NiIgZD0iTTYuOTY0MDcgM0gxNy4wMzU4QzE3LjI4NDQgNC43MjIwMSAxOC43NjAxIDYgMjAuNSA2IDIwLjgzMjEgNiAyMS4xNjI2IDUuOTUyNzIgMjEuNDgxNCA1Ljg1OTU3IDIxLjI5NzIgNy42NDM4NiAxOS43OTM3IDkgMTggOUg1Ljk5OTk3QzQuMjA2MTkgOSAyLjcwMjc4IDcuNjQzODYgMi41MTg0OSA1Ljg1OTU3IDIuODM3MzMgNS45NTI3MiAzLjE2NzgxIDYgMy40OTk5NyA2IDUuMjM5ODIgNiA2LjcxNTUyIDQuNzIyMDEgNi45NjQwNyAzWk0xNi44OTk0IDYuNjU3NjFDMTYuMzM5MSA2LjE3MjQgMTUuOTAyIDUuNjE5ODYgMTUuNTg4MSA1SDguNDExODRDOC4wOTc5MyA1LjYxOTg2IDcuNjYwODQgNi4xNzI0IDcuMTAwNTcgNi42NTc2MSA2Ljk1OTEgNi43ODAxMyA2LjgxNDUgNi44OTQyNiA2LjY2Njc4IDdIMTcuMzMzMUMxNy4xODU1IDYuODk0MjYgMTcuMDQwOSA2Ljc4MDEzIDE2Ljg5OTQgNi42NTc2MVpNMjEuNSAxMS41MDA1QzIyLjAzNzYgMTEuNTAwNSAyMi41NDIyIDExLjM1OTEgMjIuOTc4NiAxMS4xMTE0IDIyLjk5MjcgMTEuMjM5MSAyMyAxMS4zNjkgMjMgMTEuNTAwNSAyMyAxMi44OTY3IDIyLjE4MjUgMTQuMTAxOSAyMSAxNC42NjM3VjIxSDE0VjE5QzE0IDE3Ljg5NTQgMTMuMTA0NiAxNyAxMiAxNyAxMC44OTU0IDE3IDEwIDE3Ljg5NTQgMTAgMTlWMjFIM1YxNC42NjM3QzEuODE3NTMgMTQuMTAxOSAxIDEyLjg5NjcgMSAxMS41MDA1IDEgMTEuMzY5IDEuMDA3MjUgMTEuMjM5MSAxLjAyMTM4IDExLjExMTQgMS40NTc3OCAxMS4zNTkxIDEuOTYyMzcgMTEuNTAwNSAyLjUgMTEuNTAwNSAzLjYxMDQyIDExLjUwMDUgNC41Nzk5NCAxMC44OTcyIDUuMDk4NjUgMTAuMDAwNUgxOC45MDEzQzE5LjQyMDEgMTAuODk3MiAyMC4zODk2IDExLjUwMDUgMjEuNSAxMS41MDA1Wk0xOC45NjMyIDEyLjgwOTdDMTguNTc1NiAxMi41ODEyIDE4LjIyOTYgMTIuMzExNSAxNy45MjUyIDEyLjAwMDVINi4wNzQ3OUM1Ljc3MDQyIDEyLjMxMTUgNS40MjQ0MyAxMi41ODEyIDUuMDM2ODMgMTIuODA5NyA0LjgzNCAxMi45MjkzIDQuNjI2ODMgMTMuMDMzMyA0LjQxNTMyIDEzLjEyMThMNSAxMy4zOTk2VjE5SDhDOCAxNy44OTU0IDguMzkwNTIgMTYuOTUyNiA5LjE3MTU3IDE2LjE3MTYgOS45NTI2MiAxNS4zOTA1IDEwLjg5NTQgMTUgMTIgMTUgMTMuMTA0NiAxNSAxNC4wNDc0IDE1LjM5MDUgMTQuODI4NCAxNi4xNzE2IDE1LjYwOTUgMTYuOTUyNiAxNiAxNy44OTU0IDE2IDE5SDE5VjEzLjM5OTZMMTkuNTg0NyAxMy4xMjE4QzE5LjM3MzIgMTMuMDMzMyAxOS4xNjYgMTIuOTI5MyAxOC45NjMyIDEyLjgwOTdaIi8+Cjwvc3ZnPg=="
        />
        <span class="footer-name">ZErio AI</span>
      </div>
      <span class="footer-copy">© 2026</span>
    </div>

  </div>

  <div class="bottom-tag">BUILT FOR THE FUTURE</div>

</div>

</body>
</html>
    `


      return res.send(html);
    } catch (error) {
        return res.status(409).json({
            msg:"verify email failed",error
        })
    }
}
export async function login(req,res){
  const { email , password} = req.body

 const user  = await usermodel.findOne({
    $or:[{email}]
 })

 if(!user){
    return res.status(400).json({
        msg:"invalid creditnals",
        sucess:false,
        err:"email or pass incorrrect"
    })
 }

 const ispassmatch = await user.comparepassword(password)

  if(!ispassmatch){
    return res.status(400).json({
        msg:"invalid creditnals",
        sucess:false,
        err:"email or pass incorrrect"
    })
 }


 if(!user.verify){
     return res.status(400).json({
        msg:"please verify by email or check your mail-box"
     })
 }
   

 const token = jwt.sign({
    id:user._id,
    username:user.username
 },process.env.JWT)

res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none"
});

 res.status(200).json({
    msg:"login sucess",
    user:user
 })





}
export async function getme(req,res){
   const decoded = req.user
//    console.log(decoded);
   

   const user = await usermodel.findById(decoded.id)

   return res.status(200).json({
    msg:"getme",
    user:user
   })
}
export async function logout(req,res){
  const token = req.cookies.token;
  res.clearCookie('token');
  await redis.set(token,Date.now().toString(),'EX',3600)


  return res.status(200).json({
    msg:"logout sucessfully"
  })
}
export async function deleteaccount(req,res){
    const id = req.user.id

     
    const finduser = await usermodel.findById(id)

    if(!finduser){
        return res.status(401).json({
            msg:"user not exist"
        })
    }
    
    await usermodel.findByIdAndDelete(id)
    res.clearCookie('token')

    return res.status(200).json({
        msg:"user deleted sucessfully"
    })




}