import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [open, setOpen] = useState(false);
  const [formMode, setMode] = useState("Add");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState(null);
  const [phoneNo, setPhoneNo] = useState("");
  const [id, setId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const token = sessionStorage.getItem("access_token");
  const headers = {
    Authorization: "Bearer " + token, // Replace with your access token
  };
  const fetchHospitals = async () => {
    try {
      const response = await axios.get("http://localhost:8080/hospital", {
        headers: headers, // Include the headers in the request
      });
      setHospitals(response.data); // Assuming the response contains an array of hospitals
    } catch (error) {
      console.error("Error fetching hospitals:", error);
    }
  };
  useEffect(() => {
    fetchHospitals();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      name,
      address,
      phoneNo,
      cityId: { id: city }, // Assuming cityId needs an object structure
    };
    const formDataUpdate = {
      id,
      name,
      address,
      phoneNo,
      cityId: { id: city }, // Assuming cityId needs an object structure
    };
    if (formMode === "Add") {
      try {
        await axios.post("http://localhost:8080/hospital", formData, {
          headers,
        });
        fetchHospitals();
        handleClose();
      } catch (error) {
        console.error("Error adding hospital:", error);
      }
    } else if (formMode === "Update") {
      try {
        await axios.put("http://localhost:8080/hospital", formDataUpdate, {
          headers,
        });
        fetchHospitals();
        handleClose();
      } catch (error) {
        console.error("Error updating hospital:", error);
      }
    }
  };

  // Function to handle editing a hospital
  const handleEdit = async (hospitalId) => {
    setId(hospitalId);
    setMode("Update");
    setOpen(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/hospital/${hospitalId}`,
        {
          headers: headers,
        }
      );
      const data = response.data; // Assuming the response contains an array of hospitals
      setName(data.name);
      setAddress(data.address);
      setPhoneNo(data.phoneNo);
      setCity(data.cityId?.id);
    } catch (error) {
      console.error("Error fetching hospitals:", error);
    }
  };

  // Function to handle deleting a hospital
  const handleDelete = async (hospitalId) => {
    try {
        const response = await axios.delete(
          `http://localhost:8080/hospital/${hospitalId}`,
          {
            headers: headers,
          }
        );
        if(response.status === 200) {
            fetchHospitals();
        }
    }
    catch (error) {

    }
  };
  const handleAdd = () => {
    setMode("Add");
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setName(null);
    setAddress(null);
    setPhoneNo(null);
    setCity(null);
  };
  const handleSearch = () => {
    const filteredHospitals = hospitals.filter(
      (hospital) => hospital.id === parseInt(searchQuery)
    );
    setHospitals(filteredHospitals);
  }

  useEffect(() => {
    if (searchQuery === "") {
      // Fetch hospitals only if the searchQuery meets the criteria (length > 1)
      fetchHospitals();
    }
  }, [searchQuery]);
  
  return (
    <div>
      <div className="D_maincontainer">
        <div className="D_containerleft">
          <div className="D_date-display">Date:  14-May-2024</div>

          <div className="D_user-info">
            <span>Admin</span>
            <span>admin@au.edu.pk</span>
            <a href="/login">
              <button type="button">Log out</button>
            </a>
          </div>

          <div className="D_navigation">
            <ul>
              <li>
                <a href="/admin">Home</a>
              </li>
              <li>
                <a href="/hospitals">Hospitals</a>
              </li>
              <li>
                <a href="/inpatientroomsadmin">Inpatients Rooms</a>
              </li>
              <li>
                <a href="/inpatientroomhistoryadmin">Inpatient Room History</a>
              </li>
              <li>
                <a href="/addroomsadmin">Add Room</a>
              </li>
              <li>
                <a href="/doctorappointmenthistoryadmin">
                  Doctor Appointments History
                </a>
              </li>
              {/* <li>
                <a href="/addDoctor">Add Doctor</a>
              </li> */}
            </ul>
          </div>
        </div>
        <div className="D_containerright">
          <h4>Admin Panel</h4>
          <h2>Other Hospitals</h2>
          <div className="D_search-bar">
            <input type="text" placeholder="Search " value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}/>
            <button type="button" onClick={handleSearch}>Search</button>
          </div>

          <div className="Ap_lowerleftcontainer">
            <div className="Ap_upcoming-appointments">
              <h2> Hospitals</h2>
              {/* <p>More details available in @Appointment section.</p> */}
              <table>
                <thead>
                  <tr>
                    <th>Hospital ID</th>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Phone No</th>
                    <th>City Id</th>
                    <th>City Name</th>
                    <th>Province Id</th>
                    <th>Province</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {hospitals.map((hospital) => (
                    <tr key={hospital.id}>
                      <td>{hospital.id}</td>
                      <td>{hospital.name}</td>
                      <td>{hospital.address}</td>
                      <td>{hospital.phoneNo}</td>
                      <td>{hospital.cityId.id}</td>
                      <td>{hospital.cityId.name}</td>
                      <td>{hospital.cityId.provinceId.id}</td>
                      <td>{hospital.cityId.provinceId.name}</td>
                      <td>
                        {/* Edit and Delete buttons */}
                        <button onClick={() => handleEdit(hospital.id)}>
                          Edit
                        </button>
                        <button
                          style={{ marginLeft: "1rem", backgroundColor: "red" }}
                          onClick={() => handleDelete(hospital.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="Button">
            <button className="add" onClick={handleAdd}>
              Add
            </button>
          </div>
        </div>
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{formMode}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              required
              fullWidth
              value={name}
              margin="normal"
              type="text"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <TextField
              label="Address"
              required
              fullWidth
              margin="normal"
              value={address}
              type="text"
              onChange={(e) => {
                setAddress(e.target.value);
              }}
            />
            <TextField
              label="Phone No"
              required
              fullWidth
              margin="normal"
              value={phoneNo}
              type="text"
              onChange={(e) => {
                setPhoneNo(e.target.value);
              }}
            />
            <TextField
              label="City Id"
              required
              fullWidth
              margin="normal"
              value={city}
              type="number"
              onChange={(e) => {
                setCity(e.target.value);
              }}
            />

            <DialogActions>
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                sx={{ minWidth: "6rem" }}
                type="submit"
                variant="contained"
                color="primary"
              >
                {formMode}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Hospitals;
