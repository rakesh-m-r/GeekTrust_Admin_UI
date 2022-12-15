import "./styles.scss";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "boxicons";
import Checkbox from "./Components/Checkbox";
import Pagination from "./Components/Pagination";
import Input from "./Components/Input";
const API_ENDPOINT =
  "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";

const pageSize = 10;
export default function App() {
  const [users, setUsers] = useState();
  const [tempUsers, setTempUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editable, setEditable] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return tempUsers?.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, tempUsers]);

  //Fetching the list of items from API initially
  useEffect(() => {
    setLoading(!loading);
    axios
      .get(API_ENDPOINT)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        setError("Some error occurred. Retry after some time.");
      });
  }, []);

  useEffect(() => {
    setLoading(!loading);
  }, [users, error]);

  useEffect(() => {
    setTempUsers(users);
  }, [users]);

  const search = () => {
    setTempUsers((tempUsers) =>
      tempUsers?.filter((item) => {
        return (
          item.name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.email.toLowerCase().includes(searchText.toLowerCase()) ||
          item.role.toLowerCase().includes(searchText.toLowerCase())
        );
      })
    );
  };

  useEffect(() => {
    setTempUsers(users);
    setCurrentPage(1);
    search();
  }, [searchText]);

  const handleSelectAll = (e) => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(currentTableData.map((li) => li.id));
    if (isCheckAll) {
      setIsCheck([]);
    }
  };

  const handleClick = (e) => {
    const { id, checked } = e.target;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheckAll(false);
      setIsCheck(isCheck.filter((item) => item !== id));
    }
  };

  const deleteUser = (id) => {
    setSearchText("");
    setIsCheckAll(false);
    setIsCheck(isCheck.filter((item) => item !== id));
    setUsers(users.filter((user) => user.id !== id));
  };

  const deleteSelectedUser = () => {
    setIsCheckAll(false);
    setCurrentPage(1);
    setSearchText("");
    setIsCheck([]);
    setUsers((users) => users.filter((user) => !isCheck.includes(user.id)));
  };

  const updateData = () => {
    setUsers(
      [users?.filter((user) => user.id !== editable.id), editable]
        .flat()
        .sort((a, b) => a.id - b.id)
    );
    setEditable();
  };
  if (loading)
    return (
      <div className="App">
        <div className="loading-wrapper">
          <box-icon
            size="3rem"
            animation="burst"
            name="circle"
            color="#0b294e"
          ></box-icon>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="App">
        <div className="error-wrapper">
          <h1 className="heading">{error}</h1>
          <button className="btn" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  return (
    <div className="App">
      <h1 className="heading">User Dashboard</h1>
      <div className="wrapper">
        <Input
          className="search"
          type="search"
          placeholder="Search Name, Email and Role"
          value={searchText}
          onChange={(e) => setSearchText((searchText) => e.target.value)}
        />
        {tempUsers?.length === 0 ? (
          <div className="empty">No Data</div>
        ) : (
          <>
            <table className="table">
              <thead className="table-head">
                <tr>
                  <td className="table-head-cell">
                    <Checkbox
                      type="checkbox"
                      name="selectAll"
                      id="selectAll"
                      handleClick={handleSelectAll}
                      isChecked={isCheckAll}
                    />
                  </td>
                  <td className="table-head-cell">Name</td>
                  <td className="table-head-cell">Email Id</td>
                  <td className="table-head-cell">Role</td>
                  <td className="table-head-cell">Actions</td>
                </tr>
              </thead>
              <tbody className="table-body">
                {currentTableData?.map((item) => (
                  <tr key={item.id} className="table-body-row">
                    <td className="table-body-row-cell">
                      <Checkbox
                        key={item.id}
                        type="checkbox"
                        name={item.name}
                        id={item.id}
                        handleClick={handleClick}
                        isChecked={isCheck.includes(item.id)}
                      />
                    </td>

                    <td className="table-body-row-cell">
                      {editable?.id === item.id ? (
                        <Input
                          className="input"
                          name="name"
                          type="text"
                          value={editable.name}
                          onChange={(e) => {
                            setEditable({ ...editable, name: e.target.value });
                          }}
                        />
                      ) : (
                        item.name
                      )}
                    </td>
                    <td className="table-body-row-cell">
                      {editable?.id === item.id ? (
                        <Input
                          className="input"
                          name="email"
                          type="text"
                          value={editable.email}
                          onChange={(e) => {
                            setEditable({ ...editable, email: e.target.value });
                          }}
                        />
                      ) : (
                        item.email
                      )}
                    </td>
                    <td className="table-body-row-cell">
                      {editable?.id === item.id ? (
                        <>
                          <select
                            className="input"
                            name="role"
                            value={editable.role}
                            onChange={(e) =>
                              setEditable({ ...editable, role: e.target.value })
                            }
                          >
                            <option value="admin">Admin</option>
                            <option value="member">Member</option>
                          </select>
                        </>
                      ) : (
                        item.role
                      )}
                    </td>
                    <td className="table-body-row-cell">
                      {editable?.id === item.id ? (
                        <>
                          <button
                            className="text-btn"
                            onClick={() => updateData()}
                          >
                            <box-icon
                              type="solid"
                              name="check-circle"
                              color="#3CF30A"
                            ></box-icon>{" "}
                          </button>
                          <button
                            className="text-btn"
                            onClick={() => setEditable()}
                          >
                            <box-icon
                              name="x-circle"
                              color="red"
                              type="solid"
                            ></box-icon>{" "}
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="text-btn"
                            onClick={() => setEditable(item)}
                          >
                            <box-icon
                              type="solid"
                              color="#0b294e"
                              name="edit"
                            ></box-icon>
                          </button>
                          <button
                            className="text-btn"
                            onClick={() => deleteUser(item.id)}
                          >
                            <box-icon
                              type="solid"
                              color="red"
                              name="trash"
                            ></box-icon>
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination-wrapper">
              <button
                className="btn"
                onClick={deleteSelectedUser}
                disabled={isCheck.length === 0}
              >
                Deleted Selected
              </button>
              <Pagination
                currentPage={currentPage}
                totalCount={tempUsers?.length}
                pageSize={pageSize}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
