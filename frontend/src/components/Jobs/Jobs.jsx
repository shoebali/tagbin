import React, { useState, useRef, useEffect, act } from "react";
import DataTable from "react-data-table-component";
import { endPoints } from "../../Constant/Environment";
import {
  addItemToken,
  deleteItem,
  updateItem,
  getAllItemsToken,
  updateItemToken,
} from "../../Utility/Api";
import { Modal, Form, Button } from "react-bootstrap";

import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Actions } from "../../redux/Actions/Actions";
import Toaster from "../Toast";
import Loader from "../Loader";
import { ErrorToast, SuccesToast } from "../Toast/message";
import { AiTwotoneEyeInvisible, AiFillEyeInvisible } from "react-icons/ai";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import moment from "moment-timezone";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";

import Switch from "@mui/material/Switch";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import DeleteModel from "../DeleteModel";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

const Jobs = () => {
  const [editData, setEditData] = useState({
  });
  const [rowDataToDelete, setRowDataToDelete] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [createData, setCreateData] = useState(false);

  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [description, setDescription] = useState("");




  const [pending, setPending] = useState(true);
  const [show, setShow] = useState(false);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleClose = () => setShow(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    // api call
    fetchJobList();
  }, []);

  const fetchJobList = async () => {
    let url = `${endPoints.api.GETJOB}`;
    setIsLoading(true);
    await getAllItemsToken(url)
      .then((response) => {
        setIsLoading(false);
        if (response.status === 200) {
          setRows(response.jobs);
          setPending(false);
        } else {
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error(error);
      });
  };

  const handleOk = () => {
    // Early return if fields are missing
    let errorMessage = '';

    // Check each field and append an appropriate message if it's empty
    if (!title) {
      errorMessage += "Title is required. ";
    }
    if (!type) {
      errorMessage += "Job type is required. ";
    }
    if (!company) {
      errorMessage += "Company name is required. ";
    }
    if (!location) {
      errorMessage += "Location is required. ";
    }
    if (!description) {
      errorMessage += "Description is required. ";
    }

    // If there's any error message, show it and return
    if (errorMessage) {
      return ErrorToast(errorMessage.trim()); // Trim to remove trailing space
    }

    const url = editData?._id ? `${endPoints.api.UPDATEJOBS}/${editData._id}` : `${endPoints.api.ADDJOBS}`;
    const payload = {
      title,
      company,
      location,
      type,
      salary,
      description,
      ...(editData?._id && { id: editData._id }) // Only add `id` if it exists in `editData`
    };

    // Determine which function to call
    const action = editData?._id ? updateItemToken : addItemToken;

    setIsLoading(true);

    action(url, payload)
      .then((response) => {
        setIsLoading(false);
        // Check response structure to ensure it matches expected format
        if (response?.status === 'success') {
          SuccesToast(response?.message || "Item saved successfully"); // Change message for clarity
          fetchJobList(); // Refresh job list
          handleClose(); // Close modal or perform another action
        } else {
          ErrorToast(response?.message || "An unexpected error occurred.");
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error occurred:", error);
        ErrorToast(error.message || "Failed to save item.");
      });
  };



  useEffect(() => {
    if (editData) {
      setTitle(editData.title || '');
      setCompany(editData.company || '');
      setLocation(editData.location || '');
      setType(editData.type || '');
      setSalary(editData.salary || '');
      setDescription(editData.description || '');
    }
  }, [editData]);



  const handleDelete = (row) => {
    setRowDataToDelete(row);
    setShowDeleteModal(true);
  };

  const deleteJob = () => {

    const id = rowDataToDelete._id;

    let url = `${endPoints.api.DELETEJOBS}/${id}`;
    setIsLoading(false);
    deleteItem(url)
      .then((response) => {
        console.log("update_Res", response);
        setIsLoading(false);
        if (response.status == 'success') {
          setShowDeleteModal(false);
          fetchJobList();
          SuccesToast("Deleted Successfully")

        } else {
        }
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }



  // Job Filter 
  const [filteredRows, setFilteredRows] = useState(rows);
  const [filterValue, setFilterValue] = useState('');

  const handleFilterChange = (event) => {
    const newFilterValue = event.target.value.toLowerCase();
    setFilterValue(newFilterValue);

    if (newFilterValue === "") {
      setFilteredRows(rows);
    } else {
      const filteredData = rows.filter(item =>
        item.title.toLowerCase().includes(newFilterValue)
      );
      setFilteredRows(filteredData);
    }
  };

  const rowsToDisplay = filterValue.length > 0 ? filteredRows : rows;


  return (
    <>
      <div className="main">
        <section className="sec-padd">
          <Toaster></Toaster>
          <DeleteModel
            showModal={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onDelete={deleteJob}
          />
          {isLoading && <Loader spinner={true} visible={isLoading} />}
          <div id="Sportbook" style={{ padding: "0px" }}>
            <div className="container-fluid bg-color-sportbook custom-card4">
              <div className="inner-space1">
                <div className="row">
                  <div className="col-md-12" style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #444" }}>
                    <h3 className="mb-2" style={{ fontFamily: "ArticulatCF-Bold" }}>
                      Jobs
                    </h3>
                    <TextField
                      style={{ marginBottom: '10px', width: '25%' }}
                      placeholder="Enter Job Title..."
                      type="text"
                      onChange={handleFilterChange}
                      value={filterValue}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>

                </div>

                <div style={{ marginTop: "10px" }}>
                  <div className="row">
                    <div className="col-md-12">
                      <TableContainer component={Paper}>
                        <Table
                          size="small"
                          stickyHeader
                          sx={{ minWidth: 500 }}
                          aria-label="custom pagination table"
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell align="center">Job ID</TableCell>
                              <TableCell align="center">Job Title</TableCell>
                              <TableCell align="center">Company</TableCell>
                              <TableCell align="center">Location</TableCell>
                              <TableCell align="center">Job Type</TableCell>
                              <TableCell align="center">Salary</TableCell>
                              <TableCell align="center">Description</TableCell>
                              <TableCell align="center">Date</TableCell>
                              <TableCell align="center">Options</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {rowsToDisplay.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                              <TableRow
                                key={row.id}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell align="center">{row._id}</TableCell>
                                <TableCell align="center">{row.title}</TableCell>
                                <TableCell align="center">{row.company}</TableCell>
                                <TableCell align="center">{row.location}</TableCell>
                                <TableCell align="center">{row.type}</TableCell>
                                <TableCell align="center">{row.salary}</TableCell>
                                <TableCell align="center">{row.description}</TableCell>
                                <TableCell align="center">
                                  {moment.utc(row.createdAt).format('YYYY-MM-DD HH:mm')}
                                </TableCell>
                                <TableCell align="center">
                                  <EditIcon
                                    onClick={() => {
                                      setShow(true);
                                      setCreateData(true);
                                      setEditData(row);
                                    }}
                                    style={{ cursor: 'pointer' }}
                                  />
                                  <DeleteIcon
                                    onClick={() => handleDelete(row)}
                                    style={{ cursor: 'pointer', marginLeft: '8px' }} // Optional margin for better spacing
                                  />
                                </TableCell>
                              </TableRow>
                            ))}

                            {emptyRows > 0 && (
                              <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={8} /> {/* Updated to match the number of columns */}
                              </TableRow>
                            )}
                          </TableBody>
                          <TableFooter>
                            <TableRow>
                              <TablePagination
                                rowsPerPageOptions={[
                                  5,
                                  10,
                                  25,
                                  { label: "All", value: -1 },
                                ]}
                                colSpan={8} // Update this to match the number of columns
                                count={rowsToDisplay.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                SelectProps={{
                                  inputProps: {
                                    "aria-label": "rows per page",
                                  },
                                  native: true,
                                }}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                              />
                            </TableRow>
                          </TableFooter>
                        </Table>
                      </TableContainer>
                    </div>
                    <>
                      <Modal
                        show={show}
                        onHide={handleClose}
                        // style={{ marginTop: "10%" }}
                      >
                        <Modal.Header closeButton>
                          <Modal.Title id="contained-modal-title-vcenter">
                            Manage Jobs
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body scrollable>
                          <div className="row">
                            <div className="col-md-6">
                              <Form.Group
                                className="mb-3"
                                controlId="jobTitle"
                              >
                                <Form.Label>Job Title </Form.Label>
                                <Form.Control type="text" placeholder="Job Title" value={title} onChange={(event) => {
                                  setTitle(event.target.value);
                                }} />
                              </Form.Group>
                            </div>
                            <div className="col-md-6">
                              <Form.Group
                                className="mb-3"
                                controlId="company"
                              >
                                <Form.Label>Company </Form.Label>
                                <Form.Control type="text" placeholder="Company Name" value={company} onChange={(event) => {
                                  setCompany(event.target.value);
                                }} />
                              </Form.Group>
                            </div>
                            <div className="col-md-6">
                              <Form.Group
                                className="mb-3"
                                controlId="Salary"
                              >
                                <Form.Label>Salary </Form.Label>
                                <Form.Control type="number" placeholder="Salary" value={salary} onChange={(event) => {
                                  setSalary(event.target.value);
                                }} />
                              </Form.Group>
                            </div>
                            <div className="col-md-6">
                              <Form.Group
                                className="mb-3"
                                controlId="Location"
                              >
                                <Form.Label>Location </Form.Label>
                                <Form.Control type="text" placeholder="Location" value={location} onChange={(event) => {
                                  setLocation(event.target.value);
                                }} />
                              </Form.Group>
                            </div>
                            <div className="col-md-12">
                              <Form.Group className="mb-3">
                                <Form.Label>Job Type</Form.Label>
                                <Form.Select
                                  value={type || ''}  // Set default as empty if `type` is undefined
                                  onChange={(event) => setType(event.target.value)}
                                >
                                  <option value="">Select Type</option>
                                  <option value="Remote">Remote</option>
                                  <option value="Full-Time">Full-Time</option>
                                  <option value="Part-Time">Part-Time</option>
                                </Form.Select>
                              </Form.Group>
                            </div>

                            <div className="col-md-12">
                              <Form.Group className="mb-3" controlId="promoCopy">
                                <Form.Label>
                                  Descriptions :
                                </Form.Label>
                                <Form.Control as="textarea" value={description} onChange={(event) => {
                                  setDescription(event.target.value);
                                }}

                                />
                              </Form.Group>
                            </div>

                          </div>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button
                            onClick={handleOk}
                            style={{
                              background: "#04631e",
                              borderColor: "#04631e",
                            }}
                          >
                            Apply
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "end",
                    marginTop: "20px",
                  }}
                >
                  <Button
                    variant="primary"
                    style={{ background: "#04631e", borderColor: "#04631e" }}
                    onClick={() => {
                      setShow(true);
                      setEditData({})
                      setCreateData(true);
                    }}
                  >
                    Add New Jobs
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Jobs;