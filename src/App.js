import { useRef, useState, forwardRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import {
  Navbar,
  Container,
  Nav,
  Button,
  Table,
  Alert,
  Spinner,
} from "react-bootstrap";
import { monthlyTicket, newTicket, weeklyTicket } from "./api";

const Print = forwardRef(({ record }, ref) => {
  return (
    <div ref={ref} className="text-center my-4 mx-5 p-4">
      <Table responsive hover bordered>
        <thead>
          <tr>
            <td>Id</td>
            <td>Date Created</td>
          </tr>
        </thead>
        <tbody>
          {record.map(({ _id, createdAt }, idx) => {
            const date = new Date(createdAt).toLocaleString();
            return (
              <tr key={idx}>
                <td key={idx + _id}>{_id}</td>
                <td key={idx + date}>{date}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
});

function App() {
  const [ticketRecords, setTickets] = useState([]);
  const [event, setEvent] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setLoading] = useState(false);

  const printRef = useRef();
  const handlePrint = useReactToPrint({ content: () => printRef.current });

  const generateNewTicket = async (ev) => {
    setLoading(true);
    if (errorMessage) {
      setErrorMessage("");
    }
    try {
      const { data } = await newTicket();
      await setTickets(data);
      await setEvent(ev);
      setLoading(false);
    } catch (e) {
      if (e.response.status >= 500)
        setErrorMessage("Something Went wrong! maybe server error");
      setLoading(false);
    }
  };

  const generateWeeklyTickets = async (ev) => {
    setLoading(true);
    if (errorMessage) {
      setErrorMessage("");
    }
    try {
      const { data } = await weeklyTicket();
      if (data.length == 0) {
        setErrorMessage("No tickets yet");
      } else {
        await setTickets(data);
        await setEvent(ev);
      }
      setLoading(false);
    } catch (e) {
      if (e.response.status >= 500)
        setErrorMessage("Something Went wrong! maybe server error");
      setLoading(false);
    }
  };

  const generateMonthlyTickets = async (ev) => {
    setLoading(true);
    if (errorMessage) {
      setErrorMessage("");
    }
    try {
      const { data } = await monthlyTicket();
      if (data.length == 0) {
        setErrorMessage("No tickets yet");
      } else {
        await setTickets(data);
        await setEvent(ev);
      }
      setLoading(false);
    } catch (e) {
      if (e.response.status >= 500)
        setErrorMessage("Something Went wrong! maybe server error");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticketRecords.length > 0) handlePrint(event);
  }, [ticketRecords]);

  if (!isLoading)
    return (
      <div>
        <Navbar bg="dark" expand="sm" className="text-white">
          <Container>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav
                  style={{ cursor: "pointer" }}
                  onClick={generateWeeklyTickets}
                  className="mx-4"
                >
                  Weekly Record
                </Nav>
                <Nav
                  style={{ cursor: "pointer" }}
                  onClick={generateMonthlyTickets}
                >
                  Monthly Record
                </Nav>
              </Nav>
              <Button variant="outline-light" onClick={generateNewTicket}>
                Generate New Ticket
              </Button>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        {!!ticketRecords.length && (
          <Print record={ticketRecords} ref={printRef} />
        )}
      </div>
    );
  else
    return (
      <Spinner
        style={{ position: "fixed", top: "50%", left: "50%" }}
        animation="border"
      />
    );
}

export default App;
