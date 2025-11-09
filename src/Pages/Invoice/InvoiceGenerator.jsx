import React, { useState } from "react";
import "./InvoiceGenerator.css";

const InvoiceGenerator = () => {
  // 🔹 Customer Details
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  // 🔹 Invoice Metadata
  const [metadata, setMetadata] = useState({
    invoiceNo: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    paymentTerms: "Net 7 days",
  });

  // 🔹 Product / Service Items
  const [items, setItems] = useState([
    { id: 1, description: "", quantity: 1, unitPrice: 0, tax: 0, discount: 0 },
  ]);
  
  const [error, setError] = useState("");
  const [invoicePdf, setInvoicePdf] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  // Handle Customer input
  const handleCustomerChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  // Handle Metadata input
  const handleMetadataChange = (e) => {
    setMetadata({ ...metadata, [e.target.name]: e.target.value });
  };

  // Handle Items input
  const handleItemChange = (id, e) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        // Convert number fields to actual numbers
        const value = ['quantity', 'unitPrice', 'tax', 'discount'].includes(e.target.name) 
          ? parseFloat(e.target.value) || 0 
          : e.target.value;
        
        return { ...item, [e.target.name]: value };
      }
      return item;
    });
    setItems(updatedItems);
  };

  // Add new item row
  const addItem = () => {
    setItems([...items, { 
      id: items.length + 1, 
      description: "", 
      quantity: 1, 
      unitPrice: 0, 
      tax: 0, 
      discount: 0 
    }]);
  };

  // Remove item row
  const removeItem = (id) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
  };

  // 🔹 Function to generate invoice PDF
  const generateInvoice = async () => {
    try {
      // Validate ALL required fields
      if (!customer.name || !customer.phone) {
        alert("Please fill in customer name and phone number");
        return;
      }

      if (!metadata.dueDate) {
        alert("Please select a due date");
        return;
      }

      if (!metadata.paymentTerms) {
        alert("Please enter payment terms");
        return;
      }

      // Validate items
      const validItems = items.filter(item => 
        item.description && item.quantity > 0 && item.unitPrice > 0
      );
      
      if (validItems.length === 0) {
        alert("Please add at least one valid item with description, quantity, and price");
        return;
      }

      setIsGenerating(true);
      setError("");
      
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        alert("Please log in to generate invoices");
        window.location.href = '/login';
        return;
      }

      // Prepare invoice data with ALL required fields
      const invoiceData = {
        customer: {
          name: customer.name,
          phone: customer.phone,
          email: customer.email || "",
          address: customer.address || ""
        },
        metadata: {
          invoiceNo: metadata.invoiceNo,
          issueDate: metadata.issueDate,
          dueDate: metadata.dueDate,
          paymentTerms: metadata.paymentTerms
        },
        items: validItems,
        totals: calculateTotals()
      };

      console.log("Sending invoice data:", invoiceData);
      const result = await invoiceAPI.generateInvoice(invoiceData, token);
      
      console.log("🔍 PDF result:", result);
      console.log("🔍 PDF URL:", result.pdfUrl);
      
      setInvoicePdf(result.pdfUrl);
      setActiveTab("preview");
      
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert(error.message || 'Failed to generate invoice');
    } finally {
      setIsGenerating(false);
    }
  };

  // 🔹 Function to send invoice via WhatsApp (Twilio)
  const sendViaWhatsApp = async () => {
    if (!customer.phone) {
      alert("Please enter a phone number to send via WhatsApp");
      return;
    }

    if (!invoicePdf) {
      alert("Please generate the invoice first");
      return;
    }
      console.log("invoicePdf value before sending WhatsApp:", invoicePdf);
    setIsSending(true);
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert("Please log in to send invoices");
        window.location.href = '/login';
        return;
      }

      const response = await twilioWhatsAppAPI.sendInvoice(
        {
          to: customer.phone,
          mediaUrl: invoicePdf,
          invoiceNumber: metadata.invoiceNo,
          amount: `₹${calculateTotals().grandTotal.toFixed(2)}`,
          dueDate: metadata.dueDate
        },
        token
      );

      if (response.success) {
        alert("Invoice sent successfully via WhatsApp!");
      } else {
        alert("Failed to send invoice. Please try again.");
      }
    } catch (error) {
      console.error("Error sending WhatsApp message:", error);
      alert("An error occurred while sending the invoice via WhatsApp.");
    } finally {
      setIsSending(false);
    }
  };

  // 🔹 Function to download PDF
  const downloadPdf = () => {
    if (!invoicePdf) {
      alert("Please generate the invoice first");
      return;
    }
    
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = invoicePdf;
    link.download = `invoice-${metadata.invoiceNo}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 🔹 Totals Calculation
  const calculateTotals = () => {
    let subtotal = 0;
    let totalTax = 0;
    let totalDiscount = 0;

    items.forEach((item) => {
      const itemTotal = item.quantity * item.unitPrice;
      const itemTax = (item.tax / 100) * itemTotal;
      const itemDiscount = (item.discount / 100) * itemTotal;

      subtotal += itemTotal;
      totalTax += itemTax;
      totalDiscount += itemDiscount;
    });

    const grandTotal = subtotal + totalTax - totalDiscount;

    return { subtotal, totalTax, totalDiscount, grandTotal };
  };

  const { subtotal, totalTax, totalDiscount, grandTotal } = calculateTotals();

  return (
    <div className="invoice-app">
      {/* Animated Header */}
      <header className="invoice-header">
        <div className="header-content">
          <div className="logo-container">
            <div className="logo">
              <i className="fas fa-file-invoice-dollar"></i>
            </div>
            <h1 className="invoice-title">InvoiceFlow</h1>
          </div>
          <div className="invoice-meta-preview">
            <span className="invoice-badge">Invoice #: {metadata.invoiceNo}</span>
            <span className="invoice-date">Date: {metadata.issueDate}</span>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="tabs-container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === "details" ? "active" : ""}`}
            onClick={() => setActiveTab("details")}
          >
            <i className="fas fa-edit"></i> Invoice Details
          </button>
          <button 
            className={`tab ${activeTab === "preview" ? "active" : ""}`}
            onClick={() => setActiveTab("preview")}
            disabled={!invoicePdf}
          >
            <i className="fas fa-eye"></i> Preview & Share
          </button>
        </div>
      </div>

      <div className="invoice-content">
        {activeTab === "details" ? (
          <>
            {/* Customer Details */}
            <section className="invoice-card glass-card">
              <h2 className="section-title">
                <i className="fas fa-user"></i> Customer Details
              </h2>
              <div className="form-grid">
                <div className="input-group">
                  <label>Customer Name *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter customer name"
                    value={customer.name}
                    onChange={handleCustomerChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>WhatsApp Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter WhatsApp number with country code"
                    value={customer.phone}
                    onChange={handleCustomerChange}
                    required
                  />
                  <small className="input-hint">Include country code (e.g., +91 for India)</small>
                </div>
                <div className="input-group">
                  <label>Email (optional)</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                    value={customer.email}
                    onChange={handleCustomerChange}
                  />
                </div>
                <div className="input-group">
                  <label>Address (optional)</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Enter address"
                    value={customer.address}
                    onChange={handleCustomerChange}
                  />
                </div>
              </div>
            </section>

            {/* Invoice Metadata */}
            <section className="invoice-card glass-card">
              <h2 className="section-title">
                <i className="fas fa-file-invoice"></i> Invoice Details
              </h2>
              <div className="form-grid">
                <div className="input-group">
                  <label>Invoice Number</label>
                  <input
                    type="text"
                    name="invoiceNo"
                    value={metadata.invoiceNo}
                    readOnly
                    className="read-only"
                  />
                </div>
                <div className="input-group">
                  <label>Issue Date</label>
                  <input
                    type="date"
                    name="issueDate"
                    value={metadata.issueDate}
                    onChange={handleMetadataChange}
                  />
                </div>
                <div className="input-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={metadata.dueDate}
                    onChange={handleMetadataChange}
                  />
                </div>
                <div className="input-group">
                  <label>Payment Terms</label>
                  <input
                    type="text"
                    name="paymentTerms"
                    value={metadata.paymentTerms}
                    onChange={handleMetadataChange}
                  />
                </div>
              </div>
            </section>

            {/* Product / Service Items */}
            <section className="invoice-card glass-card">
              <div className="section-header">
                <h2 className="section-title">
                  <i className="fas fa-list"></i> Items
                </h2>
                <button onClick={addItem} className="add-btn">
                  <i className="fas fa-plus"></i> Add Item
                </button>
              </div>
              
              <div className="items-table">
                <div className="table-header">
                  <span>Description</span>
                  <span>Qty</span>
                  <span>Unit Price</span>
                  <span>Tax %</span>
                  <span>Discount %</span>
                  <span>Action</span>
                </div>
                
                {items.map((item) => (
                  <div key={item.id} className="table-row">
                    <input
                      type="text"
                      name="description"
                      placeholder="Item description"
                      value={item.description}
                      onChange={(e) => handleItemChange(item.id, e)}
                    />
                    <input
                      type="number"
                      name="quantity"
                      placeholder="Qty"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(item.id, e)}
                    />
                    <input
                      type="number"
                      name="unitPrice"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(item.id, e)}
                    />
                    <input
                      type="number"
                      name="tax"
                      placeholder="0%"
                      min="0"
                      value={item.tax}
                      onChange={(e) => handleItemChange(item.id, e)}
                    />
                    <input
                      type="number"
                      name="discount"
                      placeholder="0%"
                      min="0"
                      value={item.discount}
                      onChange={(e) => handleItemChange(item.id, e)}
                    />
                    <button 
                      className="remove-btn"
                      onClick={() => removeItem(item.id)}
                      aria-label="Remove item"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Totals */}
            <section className="invoice-card glass-card totals-card">
              <h2 className="section-title">
                <i className="fas fa-calculator"></i> Invoice Summary
              </h2>
              <div className="totals-grid">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>Tax:</span>
                  <span>₹{totalTax.toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>Discount:</span>
                  <span>-₹{totalDiscount.toFixed(2)}</span>
                </div>
                <div className="total-row grand-total">
                  <span>Grand Total:</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </section>

            {/* Generate Button */}
            <section className="invoice-card glass-card actions-card">
              <div className="action-buttons">
                <button 
                  className="generate-btn"
                  onClick={generateInvoice}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Generating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-file-pdf"></i> Generate Invoice
                    </>
                  )}
                </button>
                {error && (
                  <div className="error-message">
                    <i className="fas fa-exclamation-triangle"></i> {error}
                  </div>
                )}
              </div>
            </section>
          </>
        ) : (
          /* Preview Tab */
          <section className="preview-container glass-card">
            <div className="preview-header">
              <h2>
                <i className="fas fa-check-circle"></i> Invoice Ready!
              </h2>
              <p>Your invoice has been generated successfully</p>
            </div>
            
            <div className="invoice-preview">
              <div className="preview-details">
                <div className="preview-row">
                  <span>Invoice Number:</span>
                  <span>{metadata.invoiceNo}</span>
                </div>
                <div className="preview-row">
                  <span>Customer:</span>
                  <span>{customer.name}</span>
                </div>
                <div className="preview-row">
                  <span>WhatsApp:</span>
                  <span>{customer.phone}</span>
                </div>
                <div className="preview-row">
                  <span>Grand Total:</span>
                  <span className="preview-total">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="preview-actions">
                <button className="preview-download-btn" onClick={downloadPdf}>
                  <i className="fas fa-download"></i> Download PDF
                </button>
                <button 
                  className="preview-whatsapp-btn"
                  onClick={sendViaWhatsApp}
                  disabled={isSending}
                >
                  {isSending ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Sending...
                    </>
                  ) : (
                    <>
                      <i className="fab fa-whatsapp"></i> Send via WhatsApp
                    </>
                  )}
                </button>
              </div>
              
              <div className="back-to-edit">
                <button onClick={() => setActiveTab("details")}>
                  <i className="fas fa-arrow-left"></i> Back to Editing
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

// ✅ Real API Implementation (connects to your Express backend)
const API_BASE_URL = "https://invoice-backend-lhno.onrender.com";

const invoiceAPI = {
  generateInvoice: async (invoiceData, token) => {
    console.log("Making API request to:", `${API_BASE_URL}/api/invoices`);

    // ✅ Create invoice
    const res = await fetch(`${API_BASE_URL}/api/invoices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(invoiceData),
    });

    console.log("API Response status:", res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error response:", errorText);
      throw new Error(`Failed to create invoice: ${res.status} ${res.statusText}`);
    }

    const response = await res.json();
    console.log("Invoice creation response:", response);

    const invoiceId = response._id || response.data?._id || response.invoice?._id || response.data?.invoice?._id;
    console.log("Extracted invoice ID:", invoiceId);

    if (!invoiceId) {
      console.error("No invoice ID found in response:", response);
      throw new Error("No invoice ID received from server - cannot generate PDF");
    }

    // ✅ Generate PDF for that invoice
    console.log("Generating PDF for invoice:", invoiceId);
    const pdfRes = await fetch(`${API_BASE_URL}/api/invoices/${invoiceId}/pdf`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!pdfRes.ok) {
      const errorText = await pdfRes.text();
      console.error("PDF Generation Error:", errorText);
      throw new Error("Failed to generate PDF");
    }

    const pdfData = await pdfRes.json();
    console.log("🔍 PDF Data:", pdfData);

    const pdfUrl = pdfData.pdfUrl || pdfData.url || pdfData.data?.pdfUrl || pdfData.data?.url || pdfData.fileUrl;
    console.log("🔍 Extracted PDF URL:", pdfUrl);

    if (!pdfUrl) {
      console.error("No PDF URL found in response:", pdfData);
      throw new Error("PDF generated but no download URL received");
    }

    return { success: true, pdfUrl };
  },
};


// In your React component - update the API calls
const twilioWhatsAppAPI = {
  sendInvoice: async ({ to, mediaUrl, invoiceNumber, amount, dueDate }, token) => {
    const res = await fetch(`https://invoice-backend-lhno.onrender.com/api/twilio/send-whatsapp-media`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        to: to,
        mediaUrl: mediaUrl,
        body: `Invoice ${invoiceNumber} for ${amount} is ready. Due: ${dueDate}.`
      }),
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to send WhatsApp message: ${errorText}`);
    }
    
    return await res.json();
  },
};

export default InvoiceGenerator;