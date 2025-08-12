import React, { useState, useRef, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

export default function App() {
  const gridRef = useRef();

  const [rowData, setRowData] = useState([
    { id: 1, name: "Varshu", age: 22, city: "Chennai" },
    { id: 2, name: "Mee", age: 23, city: "KK" },
    { id: 3, name: "Vish", age: 20, city: "Trichy" },
    { id: 4, name: "Sow", age: 22, city: "Madurai" },
    { id: 5, name: "Lav", age: 23, city: "Salem" },
    { id: 6, name: "Vaish", age: 20, city: "Korattur" },
    { id: 7, name: "Rohi", age: 22, city: "Chennai" },
    { id: 8, name: "Harsh", age: 23, city: "Munnar" },
    { id: 9, name: "Madhu", age: 20, city: "Kerala" },
  ]);

  const addRow = () => {
    const incompleteRow = rowData.find(
      (row) => !row.name || !row.age || !row.city
    );
    if (incompleteRow) {
      alert("All fields are mandatory before adding a new row!");
      return;
    }
    const nextId =  rowData.length > 0 ? Math.max(...rowData.map((r) => r.id)) + 1 : 1;
    const newEmptyRow = { id: nextId, name: "", age: null, city: "" };
    setRowData((prev) => [...prev, newEmptyRow]);
  };

  const deleteRow = (id) => {
    if (window.confirm("Are you sure you want to delete this row?")) {
      setRowData((prev) => prev.filter((row) => row.id !== id));
    }
  };

  const deleteSelectedRows = () => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    if (selectedNodes.length === 0) {
      alert("Please select at least one row to delete.");
      return;
    }
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedNodes.length} rows?`
      )
    ) {
      const selectedIds = selectedNodes.map((node) => node.data.id);
      setRowData((prev) => prev.filter((row) => !selectedIds.includes(row.id)));
    }
  };

  const onCellValueChanged = (params) => {
    const updatedRow = params.data;
    setRowData((prev) =>
      prev.map((row) => (row.id === updatedRow.id ? updatedRow : row))
    );
  };

  const showAllRows = () => {
    gridRef.current.api.stopEditing();
    console.table(rowData); 
  };

  const onSearch = (e) => {
    if (gridRef.current) {
      gridRef.current.api.setGridOption(
        "quickFilterText",
        e.target.value.trim()
      );
    }
  };

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      editable: true,
      flex: 1,
      width: 150,
    }),
    []
  );

  const columnDefs = useMemo(
    () => [
      {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        width: 50,
        editable: false,
        sortable: false,
        pinned: "left",
      },
      { field: "name", headerName: "Name" },
      {
        field: "age", headerName: "Age",
      },
      { field: "city", headerName: "City" },
      {
        headerName: "Actions",
        flex: 0.8,
        editable: false,
        filter: false,
        sortable: false,
        cellRenderer: (params) => {
          const rowId = params.data.id;
          return (
            <button
              onClick={() => deleteRow(rowId)}
              style={{
                background: "#f44336",
                color: "white",
                border: "none",
                padding: "5px 8px",
                cursor: "pointer",
                borderRadius: "4px",
                margin: "4px 0",
              }}
            >
              Delete
            </button>
          );
        },
      },
    ],
    []
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        padding: "20px",
        backgroundColor: "#f7f9fc",
        boxSizing: "border-box",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        AG Grid CRUD Example
      </h2>

      <div
        style={{
          marginBottom: "15px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px",
          maxWidth: "900px",
          margin: "0 auto 15px auto",
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={addRow}
            style={{
              background: "#4CAF50",
              color: "white",
              border: "none",
              padding: "6px 12px",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            Add Row
          </button>
          <button
            onClick={deleteSelectedRows}
            style={{
              background: "#d9534f",
              color: "white",
              border: "none",
              padding: "6px 12px",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            Delete Selected
          </button>
          <button
            onClick={showAllRows}
            style={{
              background: "#FF9800",
              color: "white",
              border: "none",
              padding: "6px 12px",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            Show All Rows
          </button>
        </div>

        <input
          type="text"
          placeholder="Search..."
          onChange={onSearch}
          style={{
            padding: "6px 10px",
            borderRadius: "4px",
            border: "1px solid black",
            outline: "none",
          }}
        />
      </div>

      <div
        className="ag-theme-alpine"
        style={{
          height: "calc(100vh - 200px)",
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          domLayout="autoHeight"
          pagination={true}
          paginationPageSize={20}
          onCellValueChanged={onCellValueChanged}
          rowHeight={35}
          rowSelection="multiple"
        />
      </div>
    </div>
  );
}
