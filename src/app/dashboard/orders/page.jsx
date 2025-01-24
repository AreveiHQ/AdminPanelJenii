'use client';
import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { CsvExportModule, ModuleRegistry } from "ag-grid-community";
import { ExcelExportModule } from "ag-grid-enterprise";
import { Loader } from "lucide-react";
import jsPDF from "jspdf";
import { margin } from "@mui/system";


ModuleRegistry.registerModules([CsvExportModule, ExcelExportModule]);

const OrdersDashboard = () => {
  // State management
  const [rowData, setRowData] = useState([]);
  const [orderCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const gridRef = useRef();

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/orders");
        console.log(res.data);
        const formattedData = res.data.orders
          .flatMap((order) =>
            order.orders.flatMap((subOrder) =>
              subOrder.items.map((item) => ({
                orderId: subOrder.orderID,
                itemName: item.productId?.name || "N/A",
                customerName: subOrder.customer?.name || "N/A",
                date: new Date(subOrder.createdAt).toLocaleDateString("en-GB"),
                paymentStatus: subOrder.payment?.mode || "N/A",
                total: `Rs.${subOrder.items[0]?.price}/-`,
                address: `${subOrder.customer?.contact},${subOrder.customer?.address}` || "N/A",
                items: subOrder.items[0]?.quantity || 0,
                orderStatus: subOrder.orderStatus || "Processing",
                delivery: subOrder.delivery || "N/A",
              }))
            )
          );

        setRowData(formattedData);
        setOrderCount(formattedData.length);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // Handle Order Status Update
  const handleStatusChange = async (params, newStatus) => {
    setLoading(true);
    try {
      await axios.put(`/api/orders/${params.data.orderId}`, {
        orderStatus: newStatus,
      });
      const updatedRowData = rowData.map((row) =>
        row.orderId === params.data.orderId
          ? { ...row, orderStatus: newStatus }
          : row
      );
      setRowData(updatedRowData);
      // alert(`Status Updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Export data to CSV
  const onExportToCsv = useCallback(() => {
    gridRef.current.api.exportDataAsCsv({
      fileName: "orders.csv",
    });
  }, []);

  const printOrderAddress = () => {
    const selectedNodes = gridRef.current.api.getSelectedNodes(); // Get selected rows
    const selectedOrders = selectedNodes.map((node) => ({
      address: node.data.address || "N/A",
      customerName: node.data.customerName || "N/A",
      phone: node.data.contact || "N/A", // Add phone if available in data
      orderItems: node.data.itemName || "N/A", // Example for single item; customize for multiple items
    }));

    if (selectedOrders.length === 0) {
      alert("No orders selected!");
      return;
    }

    const printWindow = window.open("Printing");
    printWindow.document.write(`
      <html>
        <head>
          <title>Selected Order Details</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.5; padding: 20px; }
            h1 { text-align: center; }
            ul { list-style-type: none; padding: 0; }
            li { margin-bottom: 10px; }
            hr {
              border: none;        
              border-top: 2px dashed #000; 
              margin: 10px 0;   
            }
      .postcard {
        width: auto;
        height: auto;
        border: 1px solid #ccc;
        border-radius: 10px;
        background: white;
        padding: 3px;
    }

    .postcard hr {
      border: none;
      border-top: 1px dashed #ddd;
    }

    .address-section {
      text-align: left;
      font-size: 10px;
    }

          </style>
        </head>
        <body>
          <h1>Selected Order Details</h1>
          <ul>
              ${selectedOrders
        .map(
          (order) => `
                    <div class="printing">
                    <hr>
                    <div class="postcard">
                        <div class="address-section">
                          <p>To,<br>
                            <strong>${order.customerName}</strong>,<br>
                            <strong>${order.phone}</strong>,<br>
                            ${order.address}<br>
                          </p>
                          <p>From,<br>
                            <strong>Jenni Jewellery</strong><br>
                            Thanks for shopping with us!
                          </p>
                        </div>
                    </div>
                    <hr>
                    <div>
                `
        )
        .join("")}
           </ul>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };


  // Get color styling for order status
  const getStatusColor = (status) => {
    const statusColors = {
      Shipped: { background: "#BFDBFE", color: "#2563EB" },
      Delivered: { background: "#BBF7D0", color: "#22C55E" },
      Canceled: { background: "#FECACA", color: "#EF4444" },
      Processing: { background: "#FEF3C7", color: "#EAB308" },
    };
    return statusColors[status] || { background: "#E5E7EB", color: "#374151" };
  };


  

  

  // Column definitions for Ag-Grid
  const columnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 50,
    },
    { headerName: "Order ID", field: "orderId", flex: 0.5 },
    { headerName: "Product", field: "itemName", flex: 1 },
    { headerName: "Customer", field: "customerName", flex: 1 },
    { headerName: "Date", field: "date", flex: 0.8 },
    {
      headerName: "Payment",
      field: "paymentStatus",
      flex: 0.8,
      cellStyle: (params) => ({
        backgroundColor:
          params.value === "Prepaid" ? "#BBF7D0" : "#FEF3C7",
        color: params.value === "Prepaid" ? "#22C55E" : "#EAB308",
      }),
    },
    { headerName: "Total", field: "total", flex: 0.8 },
    { headerName: "Address", field: "address", flex: 1.5 },
    { headerName: "Items", field: "items", flex: 0.5 },
    {
      headerName: "Status",
      field: "orderStatus",
      flex: 1,
      cellRenderer: (params) => {
        const statuses = ["Confirmed", "Processing", "Shipped", "Delivered", "Canceled"];
        return (
          <select
            value={params.value}
            onChange={(e) => handleStatusChange(params, e.target.value)}
            style={{
              ...getStatusColor(params.value),
              padding: "4px",
              borderRadius: "4px",
              fontWeight: "bold",
            }}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        );
      },
    },
    {
      headerName: "Actions",
      field: "actions",
      flex: 1,
      
      cellRenderer: (params) => (
        <button
          className="bg-blue-500 text-white rounded-md"
          onClick={() => generateInvoice(params.data)}
          style={{
            padding: "3px",
            width:"75px",
            fontWeight: "bold",
          }}
        >
          Invoice
        </button>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      {/* Loader */}
      {loading && (
        <div className="absolute inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-10">
          <div className="animate-spin">
            <Loader size={50} className="text-pink-400" />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          All Orders{" "}
          <span className="text-sm px-3 py-1 rounded-xl bg-[#F3D2DD] text-[#C52158]">
            {orderCount}
          </span>
        </h1>
        <div className="flex gap-2">
          <button
            className="bg-[#F3D2DD] text-[#C52158] py-2 px-4 rounded-md"
            onClick={onExportToCsv}
          >
            Export to CSV
          </button>

          <button
            className="bg-[#F3D2DD] text-[#C52158] py-2 px-4 rounded-md"
            onClick={printOrderAddress}
          >
            Print Address
          </button>
        </div>
      </div>

      {/* Ag-Grid Table */}
      <div
        className="ag-theme-alpine bg-white shadow-md rounded-lg p-4"
        style={{ height: 600, width: "100%" }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
          }}
          pagination={true}
          paginationPageSize={11}
          rowSelection="multiple"
        />
      </div>
    </div>
  );
};

export default OrdersDashboard;



const generateInvoice = (order) => {
  const doc = new jsPDF();

  // Business Name and Logo
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Jenii Jewellery", 20, 20);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Vadodara, Gujarat, India", 20, 30);
  doc.text("Email: jenii@gmail.com | Phone: +123-456-7890", 20, 40);

  // Horizontal Line
  doc.setLineWidth(0.5);
  doc.line(20, 45, 190, 45);

  {console.log(order)}

  // Invoice Title and Date
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", 150, 20);
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  const currentDate = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  doc.text(`Date: ${currentDate}`, 150, 30);
  doc.text(`Invoice No: ${order.orderId}`, 150, 40);

  // "From" and "To" Sections
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("From:", 20, 55);
  doc.setFont("helvetica", "normal");
  doc.text("Jenii Jewellery", 20, 65);
  doc.text("Vadodara, Gujarat, India", 20, 75);

  doc.setFont("helvetica", "bold");
  doc.text("To:", 100, 55);
  doc.setFont("helvetica", "normal");
  doc.text(`${order.customerName}`, 100, 65);
  const addressLines = doc.splitTextToSize(order.address, 70); // Adjust 70 to set the maximum width
  doc.text(addressLines, 100, 70);

  // Horizontal Line
  doc.line(20, 85, 190, 85);

  // Order Details Table Header
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Description", 20, 95);
  doc.text("Quantity", 110, 95);
  doc.text("Price", 140, 95);
  doc.text("Total", 170, 95);
  doc.line(20, 100, 190, 100);

  // Single Item Details
  let currentY = 110;
  doc.setFont("helvetica", "normal");
  doc.text(order.itemName, 20, currentY);
  doc.text(`${order.items}`, 115, currentY, { align: "right" });
  doc.text(`${order.total}`, 145, currentY, { align: "right" });
  doc.text(`${(order.total)}`, 175, currentY, { align: "right" });

  // Table Footer with Subtotal, Tax, and Total
  currentY += 20;
  doc.setLineWidth(0.2);
  doc.line(20, currentY, 190, currentY);
  currentY += 10;
  doc.setFont("helvetica", "normal");
  doc.text("Subtotal:", 140, currentY);
  doc.text(`${order.total}`, 180, currentY, { align: "right" });
  currentY += 10;
  doc.text("Payment Type):", 140, currentY);
  doc.text(`${order.paymentStatus}`, 190, currentY, { align: "right" });
  currentY += 10;
  doc.text("Total:", 140, currentY);
  doc.setFont("helvetica", "bold");
  doc.text(`${order.total}`, 175, currentY, { align: "right" });

  // Horizontal Line
  currentY += 10;
  doc.line(20, currentY, 190, currentY);

  // Footer Message
  currentY += 20;
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Thank you for shopping with us!", 20, currentY);
  doc.text("For any queries, please contact our customer support.", 20, currentY + 10);
  doc.setFontSize(9);
  doc.text("Developed & Maintain by www.arevei.com", 20, currentY + 20);

  // Save the PDF
  doc.save(`Invoice_${order.orderId}.pdf`);
};