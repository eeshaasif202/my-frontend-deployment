import "./Sessions.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

const Sessions = () => {
    const [oppointment, setOppointment] = useState([]);
    const token = sessionStorage.getItem("access_token");
  const headers = {
    Authorization: "Bearer " + token, // Replace with your access token
  };
  const fetchOppointments = async () => {
    try {
      const response = await axios.get("http://localhost:8080/appointment/doctor", {
        headers: headers, // Include the headers in the request
      });
      const appointments = response.data;

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().slice(0, 10);

    // Filter appointments for today's date
    const appointmentsToday = appointments.filter(appointment => {
      return appointment.appointmentDate.slice(0, 10) === today;
    });

    setOppointment(appointmentsToday); 
    } catch (error) {
      console.error("Error fetching hospitals:", error);
    }
  };
  console.log(oppointment)
  useEffect(() => {
    fetchOppointments();
  }, []);
  function DateConverter(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [day, month, year].join('-');
}
  return (
    <div className="D_maincontainer">
      <div className="D_containerleft">
        <div className="D_date-display">Date:  14-May-2024</div>

        <div className="D_user-info">
          <span>Administrator</span>
          <span>admin@au.edu.pk</span>
          <a href="/login">
            <button type="button">Log out</button>
          </a>
        </div>

        <div className="D_navigation">
          <ul>
            <li>
              <a href="/doctor">Doctors</a>
            </li>
            <li>
              <a href="/patient">Patients</a>
            </li>
            <li>
              <a href="/appointments">Appointments</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="D_containerright">
        <h4>Sessions</h4>

        <div className="D_lowermaincontainer">
          <div className="S_lowerrightcontainer">
            <div className="S_upcoming-session">
              <h2>Today Sessions</h2>
              {/* <p>More details available in @Session section.</p> */}
              <table>
                <thead>
                  <tr>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Scheduled Date</th>
                  </tr>
                </thead>
                <tbody>
                {oppointment.map(appointment => (
                  <tr key={appointment.id}>
                    <td>{appointment.startTime}</td>
                    <td>{appointment.endTime}</td>
                    <td>{DateConverter(appointment.appointmentDate)}</td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sessions;
