import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  PropTypes,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Modal,
  Box,
} from "@mui/material";

import { auth, db } from "../../config/firebase";
import { getDocs, collection } from "firebase/firestore";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CancelIcon from "@mui/icons-material/Cancel";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const option = { month: "long", day: "numeric", year: "numeric" };

  const formatTimestampToDate = (timestampInSeconds) => {
    return new Date(timestampInSeconds * 1000).toLocaleDateString(
      "en-US",
      option
    );
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const FormateTimestampToTime = (seconds) => {
    try {
      var date = new Date(seconds * 1000);
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var seconds = date.getSeconds();

      var ampm = hours >= 12 ? "PM" : "AM";

      hours = hours % 12;
      hours = hours ? hours : 12;

      hours = (hours < 10 ? "0" : "") + hours;
      minutes = (minutes < 10 ? "0" : "") + minutes;
      seconds = (seconds < 10 ? "0" : "") + seconds;

      return hours + ":" + minutes + ":" + seconds + " " + ampm;
    } catch (err) {
      console.error(err);
    }
  };

  const [emergencyData, setemergencyData] = useState([]);

  const emergencyDataCollection = collection(db, "emergencybutton");

  useEffect(() => {
    const getEmergencyData = async () => {
      try {
        const data = await getDocs(emergencyDataCollection);
        const filtered = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        console.log(filtered);
        setemergencyData(filtered);
      } catch (err) {
        console.error(err);
      }
    };
    getEmergencyData();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('user');
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>

          {user && (
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ flexGrow: 100 }}
            >
              Welcome, Responder
            </Typography>
          )}
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ marginTop: "20px" }}>
        {/* Add your dashboard content here */}
        <Typography
          variant="h4"
          component="div"
          sx={{ paddingTop: "80px", paddingLeft: "20px" }}
        >
          Welcome to the Dashboard
        </Typography>
        <Typography variant="body1"></Typography>
        <Paper sx={{ marginTop: "20px" }}>
          <Table>
            <colgroup>
              <col style={{ width: "15%" }} />
              <col style={{ width: "20%" }} />
            </colgroup>
            <TableHead>
              <TableRow>
                <TableCell>Nature of Emergency</TableCell>
                <TableCell align="center">Sender (Button #)</TableCell>
                <TableCell align="center">Location (lat , long)</TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">Time</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {emergencyData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell align="center">
                    {row.nature_of_emergency}
                  </TableCell>
                  <TableCell align="center">{row.sender}</TableCell>
                  <TableCell align="center">
                    {"[" +
                      row.location.latitude +
                      "," +
                      row.location.longitude +
                      "]"}
                  </TableCell>
                  <TableCell align="center">
                    {formatTimestampToDate(row.timestamp.seconds)}
                  </TableCell>
                  <TableCell align="center">
                    {FormateTimestampToTime(row.timestamp.seconds)}
                  </TableCell>
                  <TableCell align="center">
                    {row.status === 0 ? "Pending" : "Responded"}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      endIcon={<DoneAllIcon />}
                      onClick={handleOpen}
                    ></Button>
                    <Button endIcon={<CancelIcon />}></Button>
                  </TableCell>{" "}
                  <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={style}>
                      <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                      >
                        Text in a modal
                      </Typography>
                      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Duis mollis, est non commodo luctus, nisi erat porttitor
                        ligula.
                      </Typography>
                    </Box>
                  </Modal>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Container>
    </div>
  );
};

export default Dashboard;
