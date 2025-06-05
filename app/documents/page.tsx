'use client';

import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { FilterMatchMode } from 'primereact/api';
import '../styles/documents.scss';

interface Document {
  id: number;
  title: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

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

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    title: { value: null, matchMode: FilterMatchMode.CONTAINS },
    type: { value: null, matchMode: FilterMatchMode.EQUALS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS }
  });

  // Generate sample data
  useEffect(() => {
    const sampleData: Document[] = Array.from({ length: 10 }, (_, index) => ({
      id: index + 1,
      title: `Document ${index + 1}`,
      type: documentTypes[Math.floor(Math.random() * documentTypes.length)].value,
      status: documentStatuses[Math.floor(Math.random() * documentStatuses.length)].value,
      createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0],
      updatedAt: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0]
    }));
    setDocuments(sampleData);
  }, []);

  const handleCreate = () => {
    setSelectedDocument(null);
    setDialogVisible(true);
  };

  const handleEdit = (document: Document) => {
    setSelectedDocument(document);
    setDialogVisible(true);
  };

  const handleDelete = (document: Document) => {
    setDocuments(documents.filter(doc => doc.id !== document.id));
  };

  const handleSave = (formData: Partial<Document>) => {
    if (selectedDocument) {
      // Edit existing document
      setDocuments(documents.map(doc =>
        doc.id === selectedDocument.id
          ? { ...doc, ...formData, updatedAt: new Date().toISOString().split('T')[0] }
          : doc
      ));
    } else {
      // Create new document
      const newDocument: Document = {
        id: documents.length + 1,
        ...formData as Omit<Document, 'id'>,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setDocuments([...documents, newDocument]);
    }
    setDialogVisible(false);
  };

  const actionBodyTemplate = (rowData: Document) => {
    return (
      <div className="document-actions">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-text"
          onClick={() => handleEdit(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-text p-button-danger"
          onClick={() => handleDelete(rowData)}
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
      <Dropdown
        placeholder="Filter by type"
        options={documentTypes}
        onChange={(e) => setFilters({
          ...filters,
          type: { value: e.value, matchMode: FilterMatchMode.EQUALS }
        })}
        showClear
      />
      <Dropdown
        placeholder="Filter by status"
        options={documentStatuses}
        onChange={(e) => setFilters({
          ...filters,
          status: { value: e.value, matchMode: FilterMatchMode.EQUALS }
        })}
        showClear
      />
    </div>
  );

  return (
    <div className="documents-container">
      <div className="documents-header">
        <h1>Documents</h1>
        <Button
          label="Create Document"
          icon="pi pi-plus"
          onClick={handleCreate}
        />
      </div>

      <DataTable
        value={documents}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
        filters={filters}
        filterDisplay="menu"
        globalFilterFields={['title', 'type', 'status']}
        header={header}
        emptyMessage="No documents found."
        className="p-datatable-sm"
      >
        <Column field="id" header="ID" sortable style={{ width: '5%' }} />
        <Column field="title" header="Title" sortable filter style={{ width: '25%' }} />
        <Column field="type" header="Type" sortable filter style={{ width: '15%' }} />
        <Column field="status" header="Status" sortable filter style={{ width: '15%' }} />
        <Column field="createdAt" header="Created" sortable style={{ width: '15%' }} />
        <Column field="updatedAt" header="Updated" sortable style={{ width: '15%' }} />
        <Column body={actionBodyTemplate} style={{ width: '10%' }} />
      </DataTable>

      <Dialog
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        header={selectedDocument ? 'Edit Document' : 'Create Document'}
        className="document-dialog"
        style={{ width: '500px' }}
      >
        <DocumentForm
          document={selectedDocument}
          onSave={handleSave}
          onCancel={() => setDialogVisible(false)}
        />
      </Dialog>
    </div>
  );
}

interface DocumentFormProps {
  document: Document | null;
  onSave: (data: Partial<Document>) => void;
  onCancel: () => void;
}

function DocumentForm({ document, onSave, onCancel }: DocumentFormProps) {
  const [formData, setFormData] = useState<Partial<Document>>({
    title: '',
    type: '',
    status: ''
  });

  useEffect(() => {
    if (document) {
      setFormData({
        title: document.title,
        type: document.type,
        status: document.status
      });
    }
  }, [document]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
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
        <label htmlFor="type">Type</label>
        <Dropdown
          id="type"
          value={formData.type}
          options={documentTypes}
          onChange={(e) => setFormData({ ...formData, type: e.value })}
          placeholder="Select a type"
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="status">Status</label>
        <Dropdown
          id="status"
          value={formData.status}
          options={documentStatuses}
          onChange={(e) => setFormData({ ...formData, status: e.value })}
          placeholder="Select a status"
          required
        />
      </div>

      <div className="form-field" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        <Button
          type="button"
          label="Cancel"
          className="p-button-text"
          onClick={onCancel}
        />
        <Button
          type="submit"
          label={document ? 'Update' : 'Create'}
          className="p-button-primary"
        />
      </div>
    </form>
  );
} 