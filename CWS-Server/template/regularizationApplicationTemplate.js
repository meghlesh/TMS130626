const logoURL = "https://res.cloudinary.com/dfvumzr0q/image/upload/v1764346150/email-assets/hzcl6heksswnumx0dpvj.jpg";

const regularizationApplicationTemplate = (employeeName, employeeId, designation, department, date, requestedCheckIn, requestedCheckOut, mode, reason, email) => {
  
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

  const formatTime = (timeStr) => {
    if (!timeStr) return "N/A";
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
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
    Attendance Regularization Request
  </h3>

  <p>Dear Sir,</p>

  <p>${getGreeting()},</p>

  <p>I hope you are doing well.</p>

  <p>
    I am requesting attendance regularization for
    <strong>${formatDate(date)}</strong>.
  </p>

  <div 
    <p><strong>Date:</strong> ${formatDate(date)}</p>
    <p><strong>Requested Check-In Time:</strong> ${formatTime(requestedCheckIn)}</p>
    <p><strong>Requested Check-Out Time:</strong> ${formatTime(requestedCheckOut)}</p>
    <p><strong>Mode:</strong> ${mode || "Office"}</p>
    <p><strong>Reason:</strong> ${reason || "Not provided"}</p>
  </div>

  <p style="margin-top:20px;">
    Kindly approve my attendance regularization request for the above-mentioned date.
  </p>
<!--
  <div style="
    margin-top:25px;
    padding:15px;
    background:#f8f9fa;
    border-left:4px solid #000;
    border-radius:5px;
  ">
    <p><strong>Employee Name:</strong> ${employeeName}</p>
    <p><strong>Employee ID:</strong> ${employeeId}</p>
    <p><strong>Designation:</strong> ${designation || "-"}</p>
    <p><strong>Department:</strong> ${department || "-"}</p>
    <p><strong>Email:</strong> ${email || "-"}</p>
  </div>
  -->

<p style="margin-top:30px;">
  Thanks & Regards,<br/>
  <strong>${employeeName}</strong><br/>
  Employee ID: ${employeeId}<br/>
  Designation: ${designation}<br/>
  Department: ${department}<br/>
  Email: ${email}
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

module.exports = regularizationApplicationTemplate;

