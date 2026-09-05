import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { MarketplaceView } from './components/marketplace/MarketplaceView';
import { SmartCatalogWizard } from './components/cataloging/SmartCatalogWizard';
import { ArtisanDashboard } from './components/artisan/ArtisanDashboard';
import { AdminCooperativePortal } from './components/admin/AdminCooperativePortal';
import { ProductDetailModal } from './components/marketplace/ProductDetailModal';
import { VisualSearchModal } from './components/marketplace/VisualSearchModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderTrackingModal } from './components/orders/OrderTrackingModal';
import { CommandPalette } from './components/common/CommandPalette';
import { KalaMitraCopilot } from './components/common/KalaMitraCopilot';
import { ToastContainer } from './components/common/ToastContainer';

export const App: React.FC = () => {
  const { activeView } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 transition-colors duration-200 selection:bg-artisan-500 selection:text-white subtle-grid">
      {/* Navigation */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeView === 'marketplace' && <MarketplaceView />}
        {activeView === 'catalog-wizard' && <SmartCatalogWizard />}
        {activeView === 'artisan-hub' && <ArtisanDashboard />}
        {activeView === 'admin-cooperative' && <AdminCooperativePortal />}
      </main>

      {/* Modals & Portals */}
      <ProductDetailModal />
      <VisualSearchModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackingModal />
      <CommandPalette />
      <KalaMitraCopilot />
      <ToastContainer />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
