'use client';

import { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { FilterMatchMode } from 'primereact/api';
import { useRouter } from 'next/navigation';
import '../styles/documents.scss';
import { Toast } from 'primereact/toast';
import 'primeicons/primeicons.css';

interface Document {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Add simulated summary templates
const summaryTemplates = [
  "This document highlights key objectives and goals.",
  "The content focuses on strategic planning and implementation.",
  "A comprehensive analysis of market trends and opportunities.",
  "Detailed overview of project requirements and specifications.",
  "Summary of key findings and recommendations.",
  "Document outlines best practices and guidelines.",
  "Contains important metrics and performance indicators.",
  "Presents a detailed analysis of current challenges and solutions."
];

const documentTypes = [
  { label: 'PDF', value: 'PDF' },
  { label: 'DOC', value: 'DOC' },
  { label: 'XLS', value: 'XLS' },
  { label: 'TXT', value: 'TXT' }
];

const documentStatuses = [
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Published', value: 'PUBLISHED' },
  { label: 'Archived', value: 'ARCHIVED' }
];

// Utility functions
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function Documents() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [detailsDialogVisible, setDetailsDialogVisible] = useState(false);
  const [summaryDialogVisible, setSummaryDialogVisible] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const toast = useRef<Toast>(null);
  const [filters, setFilters] = useState<{
    global: { value: string | null; matchMode: FilterMatchMode };
    title: { value: string | null; matchMode: FilterMatchMode };
  }>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    title: { value: null, matchMode: FilterMatchMode.CONTAINS }
  });

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5000/api/documents', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }

      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      showToast('error', 'Error', error instanceof Error ? error.message : 'Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const fetchDocumentDetails = async (documentId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:5000/api/documents/${documentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch document details');
      }

      const data = await response.json();
      setSelectedDocument(data);
      setDetailsDialogVisible(true);
    } catch (error) {
      console.error('Error fetching document details:', error);
      showToast('error', 'Error', error instanceof Error ? error.message : 'Failed to fetch document details');
    }
  };

  const handleUpdateDocument = async (documentId: string, updates: { title: string; description: string }) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:5000/api/documents/${documentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error('Failed to update document');
      }

      showToast('success', 'Success', 'Document updated successfully');
      setDetailsDialogVisible(false);
      fetchDocuments(); // Refresh the documents list
    } catch (error) {
      console.error('Error updating document:', error);
      showToast('error', 'Error', error instanceof Error ? error.message : 'Failed to update document');
    } finally {
      setUpdating(false);
    }
  };

  const generateSimulatedSummary = (document: Document) => {
    // Simulate AI processing delay
    setTimeout(() => {
      // Randomly select a template or use document description
      const randomIndex = Math.floor(Math.random() * summaryTemplates.length);
      const templateSummary = summaryTemplates[randomIndex];
      
      // Sometimes use the first 30 words of description
      const descriptionSummary = document.description.split(' ').slice(0, 30).join(' ');
      
      // Randomly choose between template and description
      const summary = Math.random() > 0.5 ? templateSummary : `Summary: ${descriptionSummary}...`;
      
      setGeneratedSummary(summary);
      setSummaryDialogVisible(true);
    }, 1000); // Simulate 1 second processing time
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const showToast = (severity: 'success' | 'error', summary: string, detail: string) => {
    toast.current?.show({
      severity,
      summary,
      detail,
      life: 3000,
      style: { marginTop: '20px' },
      className: 'custom-toast'
    });
  };

  const handleCreate = () => {
    setSelectedDocument(null);
    setDialogVisible(true);
  };

  const handleViewDetails = (document: Document) => {
    fetchDocumentDetails(document.id);
  };

  const handleDelete = async (document: Document) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:5000/api/documents/${document.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      showToast('success', 'Success', 'Document deleted successfully');
      fetchDocuments(); // Refresh the documents list
    } catch (error) {
      console.error('Error deleting document:', error);
      showToast('error', 'Error', error instanceof Error ? error.message : 'Failed to delete document');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/signin');
  };

  const actionBodyTemplate = (rowData: Document) => {
    return (
      <div className="document-actions">
        <Button
          icon="pi pi-eye"
          className="p-button-rounded p-button-text p-button-info"
          onClick={() => handleViewDetails(rowData)}
          tooltip="View Details"
        />
        <Button
          icon="pi pi-download"
          className="p-button-rounded p-button-text p-button-primary"
          onClick={() => window.open(`http://localhost:5000/${rowData.fileUrl}`, '_blank')}
          tooltip="Download"
        />
        <Button
          icon="pi pi-file"
          className="p-button-rounded p-button-text p-button-success"
          onClick={() => generateSimulatedSummary(rowData)}
          tooltip="Generate Summary"
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-text p-button-danger"
          onClick={() => handleDelete(rowData)}
          tooltip="Delete"
        />
      </div>
    );
  };

  const header = (
    <div className="documents-toolbar">
      <InputText
        placeholder="Search documents..."
        onInput={(e) => setFilters({
          ...filters,
          global: { value: e.currentTarget.value, matchMode: FilterMatchMode.CONTAINS }
        })}
      />
    </div>
  );

  return (
    <div className="documents-container">
      <Toast ref={toast} position="top-right" className="custom-toast-container" />
      <div className="documents-header">
        <h1>Documents</h1>
        <div className="header-actions">
          <Button
            label="Upload Document"
            icon="pi pi-upload"
            onClick={handleCreate}
            className="p-button-primary"
          />
          <Button
            label="Logout"
            icon="pi pi-sign-out"
            onClick={handleLogout}
            className="p-button-secondary"
          />
        </div>
      </div>

      <DataTable
        value={documents}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
        filters={filters}
        filterDisplay="menu"
        globalFilterFields={['title', 'description']}
        header={header}
        emptyMessage="No documents found."
        className="p-datatable-sm"
        showGridlines
        stripedRows
        loading={loading}
      >
        <Column field="title" header="Title" sortable filter style={{ width: '25%' }} />
        <Column field="description" header="Description" sortable style={{ width: '25%' }} />
        <Column 
          field="fileSize" 
          header="Size" 
          sortable 
          body={(rowData) => formatFileSize(rowData.fileSize)} 
          style={{ width: '10%' }} 
        />
        <Column 
          field="fileType" 
          header="Type" 
          sortable 
          style={{ width: '15%' }} 
        />
        <Column 
          field="createdAt" 
          header="Created" 
          sortable 
          body={(rowData) => formatDate(rowData.createdAt)} 
          style={{ width: '15%' }} 
        />
        <Column body={actionBodyTemplate} style={{ width: '10%' }} />
      </DataTable>

      <Dialog
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        header="Upload Document"
        className="document-dialog"
        style={{ width: '500px' }}
      >
        <DocumentForm
          document={selectedDocument}
          onSave={() => {
            setDialogVisible(false);
            fetchDocuments();
          }}
          onCancel={() => setDialogVisible(false)}
        />
      </Dialog>

      <Dialog
        visible={detailsDialogVisible}
        onHide={() => setDetailsDialogVisible(false)}
        header="Document Details"
        className="document-dialog"
        style={{ width: '500px' }}
      >
        <DocumentDetails
          document={selectedDocument}
          onUpdate={handleUpdateDocument}
          onCancel={() => setDetailsDialogVisible(false)}
          updating={updating}
        />
      </Dialog>

      <Dialog
        visible={summaryDialogVisible}
        onHide={() => setSummaryDialogVisible(false)}
        header="AI Generated Summary"
        className="document-dialog"
        style={{ width: '500px' }}
      >
        <div className="summary-content">
          <p>{generatedSummary}</p>
          <div className="summary-footer">
            <small className="text-muted">* This is a simulated AI-generated summary</small>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

interface DocumentFormProps {
  document: Document | null;
  onSave: () => void;
  onCancel: () => void;
}

function DocumentForm({ document, onSave, onCancel }: DocumentFormProps) {
  const [formData, setFormData] = useState<Partial<Document>>({
    title: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    if (document) {
      setFormData({
        title: document.title
      });
      setDescription(document.description);
    }
  }, [document]);

  const showToast = (severity: 'success' | 'error', summary: string, detail: string) => {
    toast.current?.show({
      severity,
      summary,
      detail,
      life: 3000,
      style: { marginTop: '20px' },
      className: 'custom-toast'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      showToast('error', 'Error', 'Please select a file to upload');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('file', file);
      formDataToSend.append('title', formData.title || '');
      formDataToSend.append('description', description);

      const response = await fetch('http://localhost:5000/api/documents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload document');
      }

      const data = await response.json();
      showToast('success', 'Success', 'Document uploaded successfully');
      onSave();
    } catch (error) {
      console.error('Error uploading document:', error);
      showToast('error', 'Error', error instanceof Error ? error.message : 'Failed to upload document');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Toast ref={toast} position="top-right" className="custom-toast-container" />
      <div className="form-field">
        <label htmlFor="title">Title</label>
        <InputText
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="description">Description</label>
        <InputText
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter document description"
        />
      </div>

      <div className="form-field">
        <label htmlFor="file">File</label>
        <input
          type="file"
          id="file"
          onChange={handleFileChange}
          className="p-inputtext"
          required
        />
      </div>

      <div className="form-field" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        <Button
          type="button"
          label="Cancel"
          className="p-button-text"
          onClick={onCancel}
          disabled={loading}
        />
        <Button
          type="submit"
          label={loading ? 'Uploading...' : 'Upload'}
          className="p-button-primary submit-button"
          icon={loading ? "pi pi-spin pi-spinner" : "pi pi-upload"}
          iconPos="left"
          disabled={loading}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontWeight: '600',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            gap: '0.5rem'
          }}
        />
      </div>
    </form>
  );
}

interface DocumentDetailsProps {
  document: Document | null;
  onUpdate: (documentId: string, updates: { title: string; description: string }) => void;
  onCancel: () => void;
  updating: boolean;
}

function DocumentDetails({ document, onUpdate, onCancel, updating }: DocumentDetailsProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setDescription(document.description);
    }
  }, [document]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (document) {
      onUpdate(document.id, { title, description });
    }
  };

  if (!document) return null;

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="title">Title</label>
        <InputText
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="description">Description</label>
        <InputText
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter document description"
        />
      </div>

      <div className="form-field">
        <label>File Information</label>
        <div className="file-info">
          <p><strong>Type:</strong> {document.fileType}</p>
          <p><strong>Size:</strong> {formatFileSize(document.fileSize)}</p>
          <p><strong>Created:</strong> {formatDate(document.createdAt)}</p>
          <p><strong>Last Updated:</strong> {formatDate(document.updatedAt)}</p>
        </div>
      </div>

      <div className="form-field" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        <Button
          type="button"
          label="Cancel"
          className="p-button-text"
          onClick={onCancel}
          disabled={updating}
        />
        <Button
          type="submit"
          label={updating ? 'Updating...' : 'Update'}
          className="p-button-primary submit-button"
          icon={updating ? "pi pi-spin pi-spinner" : "pi pi-check"}
          iconPos="left"
          disabled={updating}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontWeight: '600',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            gap: '0.5rem'
          }}
        />
      </div>
    </form>
  );
} 