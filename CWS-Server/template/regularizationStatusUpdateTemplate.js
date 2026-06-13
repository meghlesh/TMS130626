const logoURL = "https://res.cloudinary.com/dfvumzr0q/image/upload/v1764346150/email-assets/hzcl6heksswnumx0dpvj.jpg";

const regularizationStatusUpdateTemplate = (employeeName, date, requestedCheckIn, requestedCheckOut, status, actionReason, approverRole, approverName) => {
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '-');
  };

  const formatTime = (time) => {
    if (!time) return "N/A";
    const date = new Date(time);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getActionLabel = () => {
    if (status === "Approved") return "Approval Reason";
    return "Rejection Reason";
  };

  const getReviewerLabel = () => {
    if (status === "Approved") return "Approved By";
    return "Rejected By";
  };
return `

<body style="
  margin:0;
  padding:0;
  background:#f5f5f5;
  font-family:Arial, Helvetica, sans-serif;
">
  <div style="
    width:100%;
    display:flex;
    justify-content:center;
    padding:50px 20px;
  ">
    <div style="
      background:#ffffff;
      border-radius:10px;
      border:1px solid #ddd;
      border-bottom:10px solid #000000;
      max-width:700px;
      width:100%;
      padding:30px;
      box-sizing:border-box;
    ">


  <div style="
    text-align:center;
    margin-bottom:25px;
    border-bottom:1px solid #ccc;
    padding-bottom:15px;
  ">
    <img
      src="${logoURL}"
      alt="Logo"
      style="height:80px;width:auto;"
    />
  </div>

  <h3 style="
    margin-top:0;
    font-size:20px;
    color:#000;
  ">
    Attendance Regularization ${status}
  </h3>

  <p>Dear ${employeeName},</p>

  <p>${getGreeting()},</p>

  <p>
    Your attendance regularization request for
    <strong>${formatDate(date)}</strong>
    has been
    <strong>${status}</strong>.
  </p>

  <div 
    <p><strong>Requested Check-in:</strong> ${formatTime(requestedCheckIn)}</p>
    <p><strong>Requested Check-out:</strong> ${formatTime(requestedCheckOut)}</p>
    <p><strong>Status:</strong> ${status}</p>
    <p><strong>${getActionLabel()}:</strong> ${actionReason || 'No reason provided'}</p>
    <p><strong>${getReviewerLabel()}:</strong> ${approverName} (${approverRole})</p>
  </div>

  <p style="margin-top:20px;">
    Please ensure accurate attendance going forward. If you have any questions, please contact HR.
  </p>

  <p style="margin-top:30px;">
    Thanks & Regards,<br/>
    <strong>CWS EMS Team</strong>
  </p>

  <div style="margin-top:10px;">
    <img
      src="${logoURL}"
      alt="Logo"
      style="
        height:40px;
        width:auto;
        max-width:150px;
      "
    />
  </div>

  <footer style="
    margin-top:50px;
    padding-top:15px;
  
    font-size:12px;
   
    text-align:center;
  ">
    Creative Web Solution • Registered Office:
    LWT, 203, C/O ITI Rd, Above PNG,
    Near Parihar Chowk, Aundh,
    Maharashtra 411007.
  </footer>

</div>


  </div>
</body>


  `;
};

module.exports = regularizationStatusUpdateTemplate;