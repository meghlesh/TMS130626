// import React, { useEffect, useState } from "react";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
// import axios from "axios";
// import "./MyAttendance.css";

// function MyAttendanceCalendar({ employeeId }) {
//   const [attendance, setAttendance] = useState([]);
//   const [leaves, setLeaves] = useState([]);
//   const [weeklyOff, setWeeklyOff] = useState([]);
//   const [holidays, setHolidays] = useState([]);
//   const [regularizations, setRegularizations] = useState([]);
//   const [summary, setSummary] = useState({
//     leave: 0,
//     present: 0,
//     regularized: 0,
//     holidays: 0,
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [attRes, leaveRes, weeklyRes, holidayRes, regRes] = await Promise.all([
//           axios.get(`api-emsdev-be-epb9fbg0e7ewese6.southindia-01.azurewebsites.net/attendance/${employeeId}`),
//           axios.get(`api-emsdev-be-epb9fbg0e7ewese6.southindia-01.azurewebsites.net/leave/my/${employeeId}`),
//           axios.get(`api-emsdev-be-epb9fbg0e7ewese6.southindia-01.azurewebsites.net/admin/weeklyoff/${new Date().getFullYear()}`),
//           axios.get(`api-emsdev-be-epb9fbg0e7ewese6.southindia-01.azurewebsites.net/getHolidays`),
//           axios.get(`api-emsdev-be-epb9fbg0e7ewese6.southindia-01.azurewebsites.net/attendance/regularization/my/${employeeId}`),
//         ]);

//         setWeeklyOff(weeklyRes.data.data?.saturdays || []);
//         setHolidays(holidayRes.data || []);
//         setLeaves(leaveRes.data);
//         setRegularizations(regRes.data);

//         // Expand approved leaves by date
//         const expandedLeaves = [];
//         leaveRes.data.forEach((leave) => {
//           if (leave.status === "approved") {
//             let current = new Date(leave.dateFrom);
//             const to = new Date(leave.dateTo);
//             while (current <= to) {
//               expandedLeaves.push({
//                 date: new Date(current),
//                 dayStatus: "Leave",
//                 leaveType: leave.leaveType,
//               });
//               current.setDate(current.getDate() + 1);
//             }
//           }
//         });

//         // Expand approved regularizations
//         const expandedRegularizations = regRes.data
//           .filter((r) => r.status === "Approved")
//           .map((r) => ({
//             date: new Date(r.date),
//             dayStatus: "Regularized",
//             checkIn: r.requestedCheckIn,
//             checkOut: r.requestedCheckOut,
//           }));

//         // Merge attendance + leaves + regularizations
//         const merged = [...attRes.data, ...expandedLeaves, ...expandedRegularizations];
//         setAttendance(merged);
//       } catch (err) {
//         console.error("Error fetching data:", err);
//       }
//     };

//     fetchData();
//   }, [employeeId]);

//   // --- Helper functions ---
//   const isHoliday = (date) =>
//     holidays.some((h) => new Date(h.date).toDateString() === date.toDateString());

//   const isWeeklyOff = (date) => {
//     if (date.getDay() === 0) return true; // Sunday
//     if (date.getDay() === 6) {
//       const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
//       let count = 0;
//       for (let d = new Date(firstDay); d <= date; d.setDate(d.getDate() + 1)) {
//         if (d.getDay() === 6) count++;
//       }
//       return weeklyOff.includes(count);
//     }
//     return false;
//   };

//   // --- Prioritize what to show on the same day ---
//   const attendanceMap = {};
//   attendance.forEach((rec) => {
//     const dateKey = new Date(rec.date).toDateString();
//     const existing = attendanceMap[dateKey];

//     if (!existing) attendanceMap[dateKey] = rec;
//     else {
//       if (rec.dayStatus === "Leave") attendanceMap[dateKey] = rec;
//       else if (rec.dayStatus === "Regularized" && existing.dayStatus !== "Leave")
//         attendanceMap[dateKey] = rec;
//       else if (
//         (rec.dayStatus === "Present" || rec.dayStatus === "Full Day") &&
//         !["Leave", "Regularized"].includes(existing.dayStatus)
//       )
//         attendanceMap[dateKey] = rec;
//     }
//   });

//   // --- Calendar coloring ---
//   const tileClassName = ({ date, view }) => {
//     if (view !== "month") return "";
//     const rec = attendanceMap[date.toDateString()];

//     if (isHoliday(date)) return "holiday-day";
//     if (isWeeklyOff(date)) return "weekly-off-day";
//     if (rec) {
//       if (rec.dayStatus === "Regularized") return "regularized-day";
//       if (rec.dayStatus === "Leave") return "leave-day";
//       if (rec.dayStatus === "Present" || rec.dayStatus === "Full Day")
//         return "present-day";
//       if (rec.dayStatus === "Half Day") return "halfday-day";
//     }
//     return "";
//   };

//   // --- Monthly summary ---
//   useEffect(() => {
//     const now = new Date();
//     const month = now.getMonth();
//     const year = now.getFullYear();

//     let leaveCount = 0,
//       presentCount = 0,
//       regularizedCount = 0,
//       holidayCount = 0;

//     attendance.forEach((rec) => {
//       const d = new Date(rec.date);
//       if (d.getMonth() === month && d.getFullYear() === year) {
//         if (rec.dayStatus === "Leave") leaveCount++;
//         if (rec.dayStatus === "Regularized") regularizedCount++;
//         if (rec.dayStatus === "Present" || rec.dayStatus === "Full Day")
//           presentCount++;
//       }
//     });

//     holidays.forEach((h) => {
//       const d = new Date(h.date);
//       if (d.getMonth() === month && d.getFullYear() === year) holidayCount++;
//     });

//     setSummary({ leave: leaveCount, present: presentCount, regularized: regularizedCount, holidays: holidayCount });
//   }, [attendance, holidays]);

//   // --- Render UI ---
//   return (
//     // <div className="card shadow-sm mt-3 h-100 border-0">
//     //   <h4 className="text-center mt-1" style={{ color: "#3A5FBE" }}>
//     //     Attendance Calendar
//     //   </h4>

//     //   <div
//     //     style={{
//     //       width: "100%",
//     //       maxWidth: "350px",
//     //       margin: "0 auto",
//     //       backgroundColor: "#FFFFFF",
//     //     }}
//     //   >
//     //     <Calendar
//     //       tileClassName={tileClassName}
//     //       defaultActiveStartDate={
//     //         new Date(new Date().getFullYear(), new Date().getMonth(), 1)
//     //       }
//     //     />
//     //   </div>

//     //   <div
//     //     className="d-flex justify-content-center mt-3 flex-wrap"
//     //     style={{ gap: "20px" }}
//     //   >
//     //     <span><span className="legend-box present"></span> Present</span>
//     //     <span><span className="legend-box regularized"></span> Regularized</span>
//     //     <span><span className="legend-box leave"></span> Leave</span>
//     //     <span><span className="legend-box holiday"></span> Holiday</span>
//     //     <span><span className="legend-box weekend"></span> Weekly Off</span>
//     //   </div>
//     // </div>

//     <div className="card shadow-sm mt-2 h-100 border-0">
//       <h4 className="text-center mt-3" style={{ color: "#3A5FBE",fontSize: "25px" }}>
//         Attendance Calendar
//       </h4>

//       <div
//         style={{
//           width: "100%",
//           maxWidth: "350px",
//           margin: "0 auto",
//           backgroundColor: "#FFFFFF",
//         }}
//       >
//         <Calendar
//           tileClassName={tileClassName}
//           defaultActiveStartDate={
//             new Date(new Date().getFullYear(), new Date().getMonth(), 1)
//           }
//         />
//       </div>

//       <div
//         className="d-flex justify-content-center mt-3 flex-wrap"
//         style={{ gap: "20px" }}
//       >
//         <span><span className="legend-box present"></span> Present</span>
//         {/* <span><span className="legend-box regularized"></span> Regularized</span> */}
//         <span><span className="legend-box leave"></span> Leave</span>
//         <span><span className="legend-box holiday"></span> Holiday</span>
//         {/* <span><span className="legend-box weekend"></span> Weekly Off</span> */}

//       </div>
//     </div>
//   );
// }

// export default MyAttendanceCalendar;

// jaicy  code

import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./MyAttendanceCalendar.css";
import axios from "axios";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

function MyAttendanceCalendar({ employeeId }) {
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [weeklyOff, setWeeklyOff] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [regularizations, setRegularizations] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [selectedStatus, setSelectedStatus] = useState("All");

  useEffect(() => {
    if (!employeeId) return; // ✅ Skip until defined
    const fetchData = async () => {
      try {
        const [attRes, leaveRes, weeklyRes, holidayRes, regRes] =
          await Promise.all([
            axios.get(`api-emsdev-be-epb9fbg0e7ewese6.southindia-01.azurewebsites.net/attendance/${employeeId}`),
            axios.get(`api-emsdev-be-epb9fbg0e7ewese6.southindia-01.azurewebsites.net/leave/my/${employeeId}`),
            axios.get(
              `api-emsdev-be-epb9fbg0e7ewese6.southindia-01.azurewebsites.net/admin/weeklyoff/${new Date().getFullYear()}`,
            ),
            axios.get(`api-emsdev-be-epb9fbg0e7ewese6.southindia-01.azurewebsites.net/getHolidays`),
            axios.get(
              `api-emsdev-be-epb9fbg0e7ewese6.southindia-01.azurewebsites.net/attendance/regularization/my/${employeeId}`,
            ),
            
          ])
        setWeeklyOff(weeklyRes.data.data?.saturdays || []);
        setHolidays(holidayRes.data || []);
        setLeaves(leaveRes.data);
        setRegularizations(regRes.data);

        // Expand leaves
        const expandedLeaves = [];
        leaveRes.data.forEach((leave) => {
          let current = new Date(leave.dateFrom);
          const to = new Date(leave.dateTo);
          while (current <= to) {
            expandedLeaves.push({
              date: new Date(current),
              leaveRef: leave,
              dayStatus: leave.status === "approved" ? "Leave" : leave.status,
            });
            current.setDate(current.getDate() + 1);
          }
        });

        // Merge attendance + leaves first
        const mergedAttendance = [...attRes.data, ...expandedLeaves];

        // Merge regularizations
        regRes.data.forEach((reg) => {
          const dateKey = new Date(reg.date).toDateString();

          const existingIndex = mergedAttendance.findIndex(
            (att) => new Date(att.date).toDateString() === dateKey,
          );

          const regDate = new Date(reg.date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          regDate.setHours(0, 0, 0, 0);

          const isToday = regDate.getTime() === today.getTime();
          const mergedRecord = {
            date: new Date(reg.date),
            checkIn:
              mergedAttendance[existingIndex]?.checkIn ||
              reg.regularizationRequest?.checkIn ||
              null,
            checkOut:
              mergedAttendance[existingIndex]?.checkOut ||
              reg.regularizationRequest?.checkOut ||
              null,
            mode: mergedAttendance[existingIndex]?.mode || reg.mode,
            regStatus: reg.regularizationRequest?.status,
            approvedByRole: reg.regularizationRequest?.approvedByRole,
            dayStatus:
              isToday &&
              mergedAttendance[existingIndex]?.checkIn &&
              !mergedAttendance[existingIndex]?.checkOut
                ? "Working"
                : reg.regularizationRequest?.status === "Approved"
                  ? "Regularized"
                  : "Absent",
          };

          if (existingIndex > -1) {
            mergedAttendance[existingIndex] = {
              ...mergedAttendance[existingIndex],
              ...mergedRecord,
            };
          } else {
            mergedAttendance.push(mergedRecord);
          }
        });

        setAttendance(mergedAttendance);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [employeeId]);
  const getHoliday = (date) =>
    holidays.find(
      (h) => new Date(h.date).toDateString() === date.toDateString(),
    );
  const isHoliday = (date) => !!getHoliday(date);
  const getWorkedHoursDecimal = (checkIn, checkOut) =>
    (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60);

//   const getDayStatus = (record) => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const recordDate = new Date(record.date);
//     recordDate.setHours(0, 0, 0, 0);

//     if (record.leaveRef) return record.dayStatus;

//     let hours =
//       record.workingHours ||
//       (record.checkIn && record.checkOut
//         ? getWorkedHoursDecimal(record.checkIn, record.checkOut)
//         : 0);

//     if (record.regStatus === "Approved") {
//       if (hours >= 8) return "Regularized (Full Day)";
//       if (hours >= 4) return "Regularized (Half Day)";
//       return "Regularized";
//     }
//     if (record.regStatus === "Pending") {
//   return "Pending Regularization";
// }
// if (hours >= 8) return "Full Day";

//     if (recordDate.getTime() === today.getTime()) {
//       if (record.checkIn && !record.checkOut) return "Working";
//     }

//     if (
//       recordDate.getTime() < today.getTime() &&
//       record.checkIn &&
//       !record.checkOut
//     )
//       return "Absent";
//     if (!record.checkIn && !record.checkOut) return "Absent";

//     if (hours >= 8) return "Full Day";
//     if (hours >= 4) return "Half Day";
//     return "Absent";
//   };
// ✅ UPDATED getDayStatus FUNCTION

// const getDayStatus = (record) => {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   const recordDate = new Date(record.date);
//   recordDate.setHours(0, 0, 0, 0);

//   if (record.leaveRef) return record.dayStatus;

//   let hours =
//     record.workingHours ||
//     (record.checkIn && record.checkOut
//       ? getWorkedHoursDecimal(record.checkIn, record.checkOut)
//       : 0);

//   // ✅ NEW CONDITION FOR LATE CHECK-IN
//   if (record.lateCheckInCount >= 3) {
//     return "Late Check-In Half Day";
//   }

//   if (record.lateCheckInCount > 0) {
//     return "Late Check-In";
//   }

//   if (record.regStatus === "Approved") {
//     if (hours >= 8) return "Regularized (Full Day)";
//     if (hours >= 4) return "Regularized (Half Day)";
//     return "Regularized";
//   }

//   if (record.regStatus === "Pending") {
//     return "Pending Regularization";
//   }

//   if (hours >= 8) return "Full Day";

//   if (recordDate.getTime() === today.getTime()) {
//     if (record.checkIn && !record.checkOut) return "Working";
//   }

//   if (
//     recordDate.getTime() < today.getTime() &&
//     record.checkIn &&
//     !record.checkOut
//   )
//     return "Absent";

//   if (!record.checkIn && !record.checkOut) return "Absent";

//   if (hours >= 4) return "Half Day";

//   return "Absent";
// };




const getDayStatus = (record) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const recordDate = new Date(record.date);
  recordDate.setHours(0, 0, 0, 0);

  // Leave
  if (record.leaveRef) return record.dayStatus;

  // Working Hours
  let hours =
    record.workingHours ||
    (record.checkIn && record.checkOut
      ? getWorkedHoursDecimal(record.checkIn, record.checkOut)
      : 0);

  // Today Working
  if (
    recordDate.getTime() === today.getTime() &&
    record.checkIn &&
    !record.checkOut
  ) {
    return "Working";
  }

  // Past date but forgot checkout
  if (
    recordDate.getTime() < today.getTime() &&
    record.checkIn &&
    !record.checkOut
  ) {
    return "Absent";
  }

  // No attendance
  if (!record.checkIn && !record.checkOut) {
    return "Absent";
  }

  // Regularization
  if (record.regStatus === "Approved" && record.lateCheckInCount > 0) {
    if (record.lateCheckInCount % 3 === 0) {
      return "Late Check-In Half Day Penalty";
    }
    if (hours >= 8) return "Late Check-In Full Day";
    if (hours >= 4) return "Late Check-In Half Day";
    return "Late Check-In";
  }

  if (record.regStatus === "Pending") {
    return "Pending Regularization";
  }

  // LATE CHECK-IN CONDITIONS
  // 3rd late check-in => Penalty Half Day
  if (record.lateCheckInCount > 0 && record.lateCheckInCount % 3 === 0) {
    return "Late Check-In Half Day Penalty";
  }

  // Late check-in + Full Day
  if (record.lateCheckInCount > 0 && hours >= 8) {
    return "Late Check-In Full Day";
  }

  // Late check-in + Half Day
  if (record.lateCheckInCount > 0 && hours >= 4) {
    return "Late Check-In Half Day";
  }

  // Full Day
  if (hours >= 8) {
    return "Full Day";
  }

  // Half Day
  if (hours >= 4) {
    return "Half Day";
  }

  // Less than 4 hr
  return "Absent";
};

  const attendanceMap = {};
  attendance.forEach((rec) => {
    const dateKey = new Date(rec.date).toDateString();
    if (!attendanceMap[dateKey] || rec.leaveRef || rec.regStatus) {
      attendanceMap[dateKey] = { ...rec, dayStatus: getDayStatus(rec) };
    }
  });

  const isWeeklyOff = (date) => {
    if (date.getDay() === 0) return true;
    if (date.getDay() === 6) {
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      let satCount = 0;
      for (let d = new Date(firstDay); d <= date; d.setDate(d.getDate() + 1)) {
        if (d.getDay() === 6) satCount++;
      }
      return weeklyOff.includes(satCount);
    }
    return false;
  };


const getTooltipContent = (date) => {
  const key1 = date.toDateString();
  const key2 = date.toISOString().slice(0, 10);

  const rec = attendanceMap[key1] ?? attendanceMap[key2];

  if (isHoliday(date)) {
    return `Holiday: ${getHoliday(date)?.name}`;
  }

  if (isWeeklyOff(date)) {
    return "Weekly Off";
  }

  if (!rec) return "No record";

  // ✅ SHOW LATE ATTEMPT
  // if (rec.lateCheckInCount >= 3) {
  //   return `Late Check-In (3rd Attempt - Half Day)`;
  // }

  // if (rec.lateCheckInCount > 0) {
  //   return `Late Check-In (${rec.lateCheckInCount} Attempt)`;
  // }
  if (rec.dayStatus === "Late Check-In Half Day Penalty") {
  return `Late Check-In + Half Day + Penalty`;
}

if (rec.dayStatus === "Late Check-In Full Day") {
  return `Late Check-In + Full Day`;
}

if (rec.dayStatus === "Late Check-In Half Day") {
  return `Late Check-In + Half Day`;
}

  if (rec.leaveRef) {
    return `Leave: ${rec.leaveRef.leaveType} (${rec.leaveRef.status})`;
  }

  const ds = rec.dayStatus || "";
    const reg = rec.regStatus || "";

    if (reg === "Approved") {
      if (ds.includes("Full")) return "Regularized (Full Day)";
      if (ds.includes("Half")) return "Regularized (Half Day)";
      return "Regularized";
    }

    if (reg === "Pending") return "Pending Regularization";
    if (reg === "Rejected") return "Regularization Rejected";
    if (ds === "Working") return "Working (Not Checked Out)";
    if (ds === "Full Day") return "Present (Full Day)";
    if (ds === "Half Day") return "Half Day Present";
    if (ds === "Absent") return "Absent";
    if (rec.checkIn && !rec.checkOut) return "Checked In (No Checkout)";
    if (!rec.checkIn && rec.checkOut) return "Checked Out (No Checkin)";
    if (!rec.checkIn && !rec.checkOut) return "No Check-in/out";

    return ds || "No record";

};
const tileClassName = ({ date, view }) => {
  if (view !== "month") return "";

  const today = new Date();
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const key1 = date.toDateString();
  const key2 = date.toISOString().slice(0, 10);
  const rec = attendanceMap[key1] ?? attendanceMap[key2];

  if (selectedStatus === "All") {
    if (isToday) return "today-day";
    if (isWeeklyOff(date)) return "weekly-off-day";
    if (isHoliday(date)) return "holiday-day";
  }

  if (selectedStatus === "Holiday") {
    return isHoliday(date) ? "holiday-day" : "";
  }

  if (selectedStatus === "Today") {
    return isToday ? "today-day" : "";
  }

  if (!rec) return "";

  const ds = rec.dayStatus || "";
  
  if (selectedStatus && selectedStatus !== "All") {
    // Present
    if (selectedStatus === "Present") {
      if (ds === "Full Day" || ds === "Working" || ds === "Regularized Full Day" || ds === "Late Check-In Full Day") {
        return "present-day";
      }
      return "";
    }

    // Leave
    if (selectedStatus === "Leave" && rec.leaveRef) {
      return "leave-day";
    }

    // Half Day
    if (selectedStatus === "Half Day" && (ds === "Half Day" || ds === "Regularized Half Day" || ds === "Late Check-In Half Day Penalty" || ds === "Late Check-In Half Day")) {
      return "halfday-day";
    }

    // Late Check-In
    if (selectedStatus === "Late Check-In" && (ds === "Late Check-In Full Day" || ds === "Late Check-In Half Day")) {
      return "late-checkin-day";
    }

    // Late Half Day
    if (selectedStatus === "Late Half Day" && (ds === "Late Check-In Half Day Penalty")) {
      return "late-halfday-penalty";
    }

    return "";
  }

  const reg = rec.regStatus || "";

  if (reg === "Rejected") {
    return "";
  }

  // Pending regularization
  if (reg === "Pending") return "pending-regularization-day";

  // 3rd late penalty
  if (ds === "Late Check-In Half Day Penalty") {
    return "late-halfday-penalty";
  }

  // Late + Full Day or Late + Half Day
  if (ds === "Late Check-In Full Day" || ds === "Late Check-In Half Day") {
    return "late-checkin-day";
  }

  if (ds === "Half Day" || ds === "Regularized Half Day") {
    return "halfday-day";
  }

  // Approved regularization 
  if (ds === "Working" || ds === "Full Day" || ds === "Regularized Full Day") {
    return "present-day";
  }

  if (rec.leaveRef) {
    const st = (rec.leaveRef.status || "").toLowerCase();
    if (st === "approved") return "leave-day";
    if (st === "rejected") return "rejected-leave-day";
    if (st === "pending") return "pending-leave-day";
  }

  if (!rec.checkIn || !rec.checkOut) return "forgot-checkinout";

  return "";
};
const tileContent = ({ date, view }) => {
  if (view !== "month") return null;
  const isCurrentMonth =
    date.getMonth() === currentMonth.getMonth() &&
    date.getFullYear() === currentMonth.getFullYear();

  if (!isCurrentMonth) return null;

  const tooltipText = getTooltipContent(date);
  if (!tooltipText) return null;

  return (
    <div
      data-tooltip-id="calendar-tip"
      data-tooltip-content={tooltipText}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        cursor: "pointer",
        zIndex: 2,
      }}
    />
  );
};

  const tileDisabled = ({ date, view }) => {
    if (view !== "month") return false;

    return (
      date.getMonth() !== currentMonth.getMonth() ||
      date.getFullYear() !== currentMonth.getFullYear()
    );
  };

const internalStyles = `
.react-calendar {
  width: 100% !important;
  max-width: 100% !important;
}

.calendar-container .react-calendar .react-calendar__navigation {
  margin-bottom: 0px;
  height: 50px;
}

.react-calendar__month-view__weekdays {
  text-align: center;
  font-size: 12px;
}

.react-calendar__tile {
  min-height: 38px !important;
  padding: 5px !important;
}

.react-calendar__month-view__days__day {
  min-height: 38px !important;
}

.react-calendar__month-view__days {
  gap: 4px;
}

/* mobile */
@media (max-width: 768px) {
  .react-calendar__tile {
    min-height: 32px !important;
    font-size: 12px;
  }
}
`;

  // --- Render UI ---
  return (
    <div
      className="card shadow-sm mt-2  border-0"
      style={{ borderRadius: "12px", width: "100%", maxHeight: "auto" }}
    >
      <h4
        className="text-center mt-3 mb-2"
        style={{
          color: "#3A5FBE",
          fontSize: "25px",
          margin: "0px",
        }}
      >
        Attendance Calendar
      </h4>

      <style>{internalStyles}</style>
      <div className="calendar-container">
        <Calendar
          tileClassName={tileClassName}
          tileContent={tileContent}
          defaultActiveStartDate={
            new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
          //  showNeighboringMonth={false}
          onActiveStartDateChange={({ activeStartDate }) =>
            setCurrentMonth(activeStartDate)
          }
          tileDisabled={tileDisabled}
        />
      </div>
      <Tooltip
        id="calendar-tip"
        place="top"
        style={{
          backgroundColor: "#3A5FBE",
          color: "#fff",
          padding: "8px 14px",
          borderRadius: "8px",
          fontSize: "13px",
          fontWeight: "500",
          maxWidth: "250px",
          zIndex: 1000,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
        delayShow={300}
        delayHide={100}
      />

      <div
        className="d-flex justify-content-center flex-wrap mt-3"
        style={{ gap: "25px", }}
      >
      
      <span style={{ cursor: "pointer" }} onClick={() => setSelectedStatus("All")}>
          <span className="legend-box" style={{ background: "#6c757d" }}></span> All
        </span>
        
      <span
        style={{ cursor: "pointer" }}
        onClick={() =>
          setSelectedStatus("Present")}>
        <span className="legend-box present"></span> Present
      </span>

      <span style={{ cursor: "pointer" }} onClick={() => setSelectedStatus("Leave")}>
          <span className="legend-box leave"></span> Leave
        </span>
        
        <span style={{ cursor: "pointer" }} onClick={() => setSelectedStatus("Holiday")}>
          <span className="legend-box holiday"></span> Holidays
        </span>

        <span style={{ cursor: "pointer" }} onClick={() => setSelectedStatus("Half Day")}>
          <span className="legend-box halfday"></span> Half Day
        </span>

       <span style={{ cursor: "pointer" }} onClick={() => setSelectedStatus("Today")}>
          <span className="legend-box today"></span> Today
        </span>

        <span style={{ cursor: "pointer" }} onClick={() => setSelectedStatus("Late Check-In")}>
          <span className="legend-box late-checkin-day" style={{ background: "#f723be" }}></span> Late Check-In
        </span>

        <span style={{ cursor: "pointer" }} onClick={() => setSelectedStatus("Late Half Day")}>
          <span className="legend-box late-halfday-penalty" style={{ background: "#dc3545" }}></span> Late Half Day
        </span>
       
        <span>
          <span
      className="legend-box"
      style={{ background: "#7b2cbf" }}></span>{" "}
      Selected
     </span>
      </div>
    </div>
  );
}

export default MyAttendanceCalendar;