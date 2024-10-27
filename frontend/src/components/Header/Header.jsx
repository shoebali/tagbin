import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import { useSelector, useDispatch } from "react-redux";
import { FaPowerOff } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Actions } from "../../redux/Actions/Actions";
import { getAllItemsData } from "../../Utility/Api";
import { endPoints } from "../../Constant/Environment";
import { Link } from 'react-router-dom';

// Helper function to convert job title to slug
const convertToSlug = (text) => {
  return text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
};

// Function to get unique job titles
const getUniqueJobs = (jobs) => {
  const titles = new Set();
  return jobs.filter(job => {
    if (!titles.has(job.title)) {
      titles.add(job.title);
      return true;
    }
    return false;
  });
};

function Header() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    dispatch({ type: Actions.LOGOUT });
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchSearchResults = async (query) => {
    if (!query) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    try {
      const url = `${endPoints.api.JobListing}?keyword=${query}`;
      const response = await getAllItemsData(url);
      if (response.status === 200) {
        const uniqueJobs = getUniqueJobs(response.jobs);
        setSearchResults(uniqueJobs);
        setShowDropdown(true);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const debouncedFetchResults = useCallback(debounce(fetchSearchResults, 500), []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedFetchResults(value);
  };

  // Function to handle search result click
  const handleSearchResultClick = (jobTitle) => {
    setSearchQuery(jobTitle); // Set the clicked job title in the search box
    setShowDropdown(false); // Hide the dropdown
  };

  // Function to clear search box on link click
  const handleLinkClick = () => {
    setSearchQuery(''); // Clear the search box
  };

  useEffect(() => {
    if (!searchQuery) setShowDropdown(false);
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchQuery]);

  return (
    <Navbar expand="lg" bg="dark" variant="dark" className="p-3">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" onClick={handleLinkClick}>
          <img src="https://tagbin.in/assets/images/logo/logo.webp" height={50} alt="Logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="ms-auto my-2 my-lg-0" navbarScroll>
            {!isAuthenticated && (
              <Nav.Link as={Link} to="/login" className="text-white me-3 mb-3" onClick={handleLinkClick}>
                Login/Register
              </Nav.Link>
            )}
            {isAuthenticated && (
              <Nav className="ms-auto">
                <span className="text-warning d-flex align-items-center">
                  <Nav.Link as={Link} to={'/'} className="text-white me-3 mb-3" onClick={handleLinkClick}>
                    {user?.fullname}
                  </Nav.Link>
                  {user?.role === 'Employer' && (
                    <>
                      <Nav.Link as={Link} to={'/jobs'} className="text-white me-3 mb-3" onClick={handleLinkClick}>
                        Jobs
                      </Nav.Link>
                      <Nav.Link as={Link} to="/job-applications" className="text-white me-3 mb-3" onClick={handleLinkClick}>
                        Job Applications
                      </Nav.Link>
                    </>
                  )}
                  <FaPowerOff
                    size={20}
                    className='me-3 mb-3'
                    style={{ cursor: "pointer", marginRight: 20 }}
                    onClick={() => {
                      handleLogout();
                      handleLinkClick(); // Clear search on logout
                    }}
                  />
                </span>
              </Nav>
            )}
          </Nav>
          <Form className="d-flex mb-3 position-relative" ref={dropdownRef}>
            <Form.Control
              type="search"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              aria-label="Search"
              onFocus={() => setShowDropdown(true)}
            />
            {showDropdown && searchResults.length > 0 && (
              <Dropdown.Menu show className="w-100 position-absolute" style={{ top: '100%' }}>
                {searchResults.map((job, index) => (
                  <Dropdown.Item
                    key={index}
                    as={Link}
                    to={`/search/${convertToSlug(job.title)}`}
                    onClick={() => {
                      handleSearchResultClick(job.title);
                      handleLinkClick();
                    }}
                  >
                    {job.title}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            )}
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
