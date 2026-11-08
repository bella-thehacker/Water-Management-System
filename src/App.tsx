
import React, { useEffect } from 'react';

import { AppProvider, useApp } from './context/AppContext';
import { canAccessPage } from './types/permissions';

// Components
import { LoginPage } from './pages/LoginPage';
import { AppSidebar } from './components/AppSidebar';
import { AppHeader } from './components/AppHeader';
import { ToastNotification } from './components/ToastNotification';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { InvoiceModal } from './components/InvoiceModal';
import { ReceiptModal } from './components/ReceiptModal';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { CustomersPage } from './pages/CustomersPage';
import { CustomerDetailPage } from './pages/CustomerDetailPage';
import { AddCustomerPage } from './pages/AddCustomerPage';
import { ConnectionsPage } from './pages/ConnectionsPage';
import { MeterReadingsPage } from './pages/MeterReadingsPage';
import { BillingPage } from './pages/BillingPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { FaultsPage } from './pages/FaultsPage';
import { InfrastructurePage } from './pages/InfrastructurePage';
import { ReportsPage } from './pages/ReportsPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { SettingsPage } from './pages/SettingsPage';
import { CustomerPortalPage } from './pages/CustomerPortalPage';

const AppContent: React.FC = () => {
  const {
    currentUser,
    portalMode,
    activeNavPage,
    setActiveNavPage,
    selectedInvoice,
    setSelectedInvoice,
    selectedReceipt,
    setSelectedReceipt,
    setSearchOpen,
    customers,
  } = useApp();

  // Global search keyboard shortcut: Ctrl + K / Cmd + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setSearchOpen]);

  // Prevent staff users from accessing unauthorized pages
  useEffect(() => {
    if (!currentUser || portalMode !== 'staff') {
      return;
    }

    if (!canAccessPage(currentUser.role, activeNavPage)) {
      setActiveNavPage('overview');
    }
  }, [currentUser, portalMode, activeNavPage, setActiveNavPage]);

  // Authentication check
  if (!currentUser) {
    return <LoginPage />;
  }

  // Customer portal
  if (portalMode === 'customer') {
    return (
      <>
        <CustomerPortalPage />

        <GlobalSearchModal />
        <ToastNotification />

        {selectedInvoice && (
          <InvoiceModal
            invoice={selectedInvoice}
            onClose={() => setSelectedInvoice(null)}
          />
        )}

        {selectedReceipt && (
          <ReceiptModal
            payment={selectedReceipt}
            customerBalance={
              customers.find(
                (customer) => customer.id === selectedReceipt.customerId
              )?.balance || 0
            }
            onClose={() => setSelectedReceipt(null)}
          />
        )}
      </>
    );
  }

  // Render the page selected by the staff member
  const renderStaffPage = () => {
    // Additional permission check
    if (!canAccessPage(currentUser.role, activeNavPage)) {
      return <DashboardPage />;
    }

    switch (activeNavPage) {
      case 'overview':
        return <DashboardPage />;

      case 'customers':
        return <CustomersPage />;

      case 'customer_detail':
        return <CustomerDetailPage />;

      case 'add_customer':
        return <AddCustomerPage />;

      case 'connections':
        return <ConnectionsPage />;

      case 'readings':
        return <MeterReadingsPage />;

      case 'billing':
        return <BillingPage />;

      case 'payments':
        return <PaymentsPage />;

      case 'faults':
        return <FaultsPage />;

      case 'infrastructure':
        return <InfrastructurePage />;

      case 'reports':
        return <ReportsPage />;

      case 'announcements':
        return <AnnouncementsPage />;

      case 'users':
        return <UserManagementPage />;

      case 'audit_logs':
        return <AuditLogsPage />;

      case 'settings':
        return <SettingsPage />;

      default:
        return <DashboardPage />;
    }
  };

  // Staff application layout
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FAF8F1]">

      {/* Sidebar */}
      <AppSidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Header */}
        <AppHeader />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1440px] mx-auto w-full">
            {renderStaffPage()}
          </div>
        </main>

      </div>

      {/* Global modals and notifications */}
      <GlobalSearchModal />
      <ToastNotification />

      {selectedInvoice && (
        <InvoiceModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          onRecordPayment={() => {
            setActiveNavPage('payments');
          }}
        />
      )}

      {selectedReceipt && (
        <ReceiptModal
          payment={selectedReceipt}
          customerBalance={
            customers.find(
              (customer) => customer.id === selectedReceipt.customerId
            )?.balance || 0
          }
          onClose={() => setSelectedReceipt(null)}
        />
      )}

    </div>
  );
};

// Main application
export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
