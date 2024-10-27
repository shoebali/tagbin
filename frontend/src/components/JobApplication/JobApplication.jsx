import React, { useState, useRef, useEffect, act } from "react";
import DataTable from "react-data-table-component";
import { endPoints, Image_Url } from "../../Constant/Environment";
import {
  addItemToken,
} from "../../Utility/Api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Toaster from "../../components/Toast";
import Loader from "../../components/Loader";
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
import DeleteModel from "../../components/DeleteModel";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";


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

const JobApplication = () => {
  const [rowDataToDelete, setRowDataToDelete] = useState(false);
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
    fetchJobApplicationList();
  }, []);

  const fetchJobApplicationList = async () => {
    let url = `${endPoints.api.GETJOBAPPLICATION}`;
    setIsLoading(true);
    await addItemToken(url)
      .then((response) => {
        setIsLoading(false);
        if (response.status === 'success') {
          setRows(response.applications);
          setPending(false);
        } else {
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error(error);
      });
  };





  // Job Filter
  const [filteredRows, setFilteredRows] = useState(rows);
  const [filterValue, setFilterValue] = useState("");

  const handleFilterChange = (event) => {
    const newFilterValue = event.target.value.toLowerCase();
    setFilterValue(newFilterValue);

    if (newFilterValue === "") {
      setFilteredRows(rows);
    } else {
      const filteredData = rows.filter((item) =>
        item.seekerId.fullname.toLowerCase().includes(newFilterValue)
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

          {isLoading && <Loader spinner={true} visible={isLoading} />}
          <div id="Sportbook" style={{ padding: "0px" }}>
            <div className="container-fluid bg-color-sportbook custom-card4">
              <div className="inner-space1">
                <div className="row">
                  <div
                    className="col-md-12"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderBottom: "1px solid #444",
                    }}
                  >
                    <h3
                      className="mb-2"
                      style={{ fontFamily: "ArticulatCF-Bold" }}
                    >
                      Jobs Applications
                    </h3>
                    <TextField
                      style={{ marginBottom: "10px", width: "25%" }}
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
                              <TableCell align="center">Application ID</TableCell>
                              <TableCell align="center">Name</TableCell>
                              <TableCell align="center">Email</TableCell>
                              <TableCell align="center">Mobile No.</TableCell>
                              <TableCell align="center">Cover Letter</TableCell>
                              <TableCell align="center">Resume</TableCell>
                              <TableCell align="center">Date</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {rowsToDisplay
                              .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                              )
                              .map((row) => (
                                <TableRow
                                  key={row.id}
                                  sx={{
                                    "&:last-child td, &:last-child th": {
                                      border: 0,
                                    },
                                  }}
                                >
                                  <TableCell align="center">{row._id}</TableCell>
                                  <TableCell align="center">
                                    {row.seekerId.fullname}
                                  </TableCell>
                                  <TableCell align="center">
                                    {row.seekerId.email}
                                  </TableCell>
                                  <TableCell align="center">
                                    {row.seekerId.phoneNumber}
                                  </TableCell>
                                  <TableCell align="center">
                                    {row.coverLetter}
                                  </TableCell>
                                  <TableCell align="center">
                                    <Link to={`${Image_Url}${row.resume}`}>Resume</Link>
                                  </TableCell>
                                  <TableCell align="center">
                                    {moment.utc(row.createdAt).format('YYYY-MM-DD HH:mm')}
                                  </TableCell>

                                </TableRow>
                              ))}

                            {emptyRows > 0 && (
                              <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={8} />{" "}
                                {/* Updated to match the number of columns */}
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default JobApplication;
