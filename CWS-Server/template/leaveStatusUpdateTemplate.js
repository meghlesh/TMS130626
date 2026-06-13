const logoURL = "https://res.cloudinary.com/dfvumzr0q/image/upload/v1764346150/email-assets/hzcl6heksswnumx0dpvj.jpg";

const leaveStatusUpdateTemplate = (employeeName, dateFrom, dateTo, status, actionReason, approverRole, approverName) => {
  
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

  const getDateText = () => {
    if (dateFrom === dateTo) return `on ${formatDate(dateFrom)}`;
    return `from ${formatDate(dateFrom)} to ${formatDate(dateTo)}`;
  };

  const getActionLabel = () => {
    if (status === "approved") return "Approval Reason";
    return "Rejection Reason";
  };

  const getReviewerLabel = () => {
    if (status === "approved") return "Approved By";
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

      <!-- Header -->
      <div style="
        text-align:center;
        margin-bottom:25px;
        border-bottom:1px solid #ccc;
        padding-bottom:15px;
      ">
        <img
          src="${logoURL}"
          alt="Logo"
          style="
            height:80px;
            width:auto;
            object-fit:contain;
          "
        />
      </div>

      <!-- Content -->
      <div>

        <h3 style="
          margin-top:0;
          font-size:20px;
          color:#000;
        ">
          Leave Request ${status === "approved" ? "Approved" : "Rejected"}
        </h3>

        <p>Dear ${employeeName},</p>

        <p>${getGreeting()},</p>

        <p>
          Your leave request ${getDateText()} has been
          <strong>${status === "approved" ? "Approved" : "Rejected"}</strong>.
        </p>

        <div 
          <p>
            <strong>Status:</strong>
            ${status === "approved" ? "Approved" : "Rejected"}
          </p>

          <p>
            <strong>${getActionLabel()}:</strong>
            ${actionReason}
          </p>

          <p>
            <strong>${getReviewerLabel()}:</strong>
            ${approverName} (${approverRole})
          </p>
        </div>

        <p style="margin-top:20px;">
          Please ensure that all pending work is handed over properly before your leave period.
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
              object-fit:contain;
            "
          />
        </div>

      </div>

      <!-- Footer -->
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

module.exports = leaveStatusUpdateTemplate;