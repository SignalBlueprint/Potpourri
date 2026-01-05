import { createRoute, redirect } from '@tanstack/react-router'
import { useState, useEffect, useCallback, type FormEvent } from 'react'
import { rootRoute } from '../app'
import { clientConfig } from '../client.config'
import { useAuth } from '../hooks/useAuth'
import {
  Container,
  PageHeader,
  SectionTitle,
  AdminStatCard,
  AdminStatCardSkeleton,
  AdminProductsTable,
  AdminProductsTableSkeleton,
  AdminQuickActions,
  AdminQuickActionsSkeleton,
  AdminInquiriesTable,
  AdminInquiriesTableSkeleton,
  AdminProductForm,
  AdminLookbookForm,
  CSVImportModal,
  DeleteConfirmModal,
  AdminCategoriesPanel,
  defaultCategories,
  InquiryDetailModal,
  PackageIcon,
  TagIcon,
  InboxIcon,
  ShoppingCartIcon,
} from '../ui'
import { AdminCharts } from '../ui/AdminCharts'
import { AdminInventory } from '../ui/AdminInventory'
import type { AdminProduct, ProductFormData, Category, AdminInquiry } from '../ui'
import { updateInquiryStatus, getLocalInquiries, type StoredInquiry } from '../api/inquiries'
import { exportProductsCSV, exportInquiriesCSV } from '../lib/exportData'
import {
  saveProduct,
  deleteProduct as deleteStoredProduct,
  getAllAdminProducts,
  getProductCount,
  type StoredProduct,
} from '../api/productStorage'
import { saveImages, getAllLookbooks, deleteLookbook } from '../api/imageStorage'
import type { Lookbook } from '../types/images'

// =============================================================================
// Route guard: block access if enableAdmin is false
// =============================================================================

export const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  beforeLoad: () => {
    if (!clientConfig.features.enableAdmin) {
      throw redirect({ to: '/' })
    }
  },
  component: AdminPage,
})

// =============================================================================
// Admin Login Form
// =============================================================================

function AdminLoginForm() {
  const [password, setPassword] = useState('')
  const { login, error } = useAuth()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    login(password)
  }

  return (
    <Container>
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <div className="mb-4 text-4xl">🔐</div>
            <h1 className="text-2xl font-semibold text-neutral-900">
              Admin Login
            </h1>
            <p className="mt-2 text-sm text-neutral-600">
              Enter the admin password to access the dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-neutral-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-neutral-900 placeholder-neutral-400 transition-colors focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                placeholder="Enter admin password"
                autoFocus
              />
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-brand-primary px-6 py-3 font-medium text-white transition-colors hover:bg-neutral-800"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-neutral-500 transition-colors hover:text-neutral-700"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </Container>
  )
}

// =============================================================================
// Admin Dashboard Page
// =============================================================================

function AdminPage() {
  const [isLoading, setIsLoading] = useState(true)
  const { isAuthenticated, logout } = useAuth()

  // Products state - now stores real products
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [productCount, setProductCount] = useState(0)

  // Product form modal state
  const [isProductFormOpen, setIsProductFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null)

  // Delete confirmation modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<AdminProduct | null>(null)

  // Categories panel state
  const [isCategoriesPanelOpen, setIsCategoriesPanelOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>(defaultCategories)

  // Inquiry state
  const [selectedInquiry, setSelectedInquiry] = useState<AdminInquiry | null>(null)
  const [inquiries, setInquiries] = useState<StoredInquiry[]>([])

  // Lookbook state
  const [lookbooks, setLookbooks] = useState<Lookbook[]>([])
  const [isLookbookFormOpen, setIsLookbookFormOpen] = useState(false)
  const [editingLookbookId, setEditingLookbookId] = useState<string | null>(null)

  // CSV Import state
  const [isCSVImportOpen, setIsCSVImportOpen] = useState(false)

  // Load products from storage
  const loadProducts = useCallback(async () => {
    try {
      const adminProducts = await getAllAdminProducts()
      setProducts(adminProducts)
      setProductCount(getProductCount())
    } catch (error) {
      console.error('Failed to load products:', error)
    }
  }, [])

  // Load lookbooks from storage
  const loadLookbooks = useCallback(async () => {
    try {
      const allLookbooks = await getAllLookbooks()
      setLookbooks(allLookbooks)
    } catch (error) {
      console.error('Failed to load lookbooks:', error)
    }
  }, [])

  // Load data on mount
  useEffect(() => {
    const init = async () => {
      await Promise.all([loadProducts(), loadLookbooks()])
      setInquiries(getLocalInquiries())
      setIsLoading(false)
    }
    init()
  }, [loadProducts, loadLookbooks])

  // Product form handlers
  const handleAddProduct = () => {
    setEditingProduct(null)
    setIsProductFormOpen(true)
  }

  const handleEditProduct = (product: AdminProduct) => {
    setEditingProduct(product)
    setIsProductFormOpen(true)
  }

  const handleCloseProductForm = () => {
    setIsProductFormOpen(false)
    setEditingProduct(null)
  }

  const handleSaveProduct = async (formData: ProductFormData) => {
    const productId = editingProduct?.id || `prod_${Date.now()}`

    // Save images to IndexedDB if any
    if (formData.images && formData.images.length > 0) {
      const imagesWithProductId = formData.images.map((img) => ({
        ...img,
        productId,
      }))
      await saveImages(imagesWithProductId)
    }

    // Save product to localStorage
    const storedProduct: StoredProduct = {
      id: productId,
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
      status: formData.status,
      imageIds: formData.images?.map((img) => img.id),
      createdAt: editingProduct?.lastUpdated || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    saveProduct(storedProduct)

    // Reload products to update UI
    await loadProducts()
  }

  // Delete confirmation handlers
  const handleDeleteClick = (product: AdminProduct) => {
    setProductToDelete(product)
    setIsDeleteModalOpen(true)
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setProductToDelete(null)
  }

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      deleteStoredProduct(productToDelete.id)
      await loadProducts()
    }
  }

  // Inquiry handlers
  const handleViewInquiry = (inquiry: AdminInquiry) => {
    setSelectedInquiry(inquiry)
  }

  const handleCloseInquiryDetail = () => {
    setSelectedInquiry(null)
  }

  const handleInquiryStatusChange = (inquiryId: string, status: AdminInquiry['status']) => {
    updateInquiryStatus(inquiryId, status)
    // Update local selected inquiry if it's the one being changed
    if (selectedInquiry && selectedInquiry.id === inquiryId) {
      setSelectedInquiry({ ...selectedInquiry, status })
    }
  }

  // Lookbook handlers
  const handleCreateLookbook = () => {
    setEditingLookbookId(null)
    setIsLookbookFormOpen(true)
  }

  const handleEditLookbook = (lookbookId: string) => {
    setEditingLookbookId(lookbookId)
    setIsLookbookFormOpen(true)
  }

  const handleCloseLookbookForm = () => {
    setIsLookbookFormOpen(false)
    setEditingLookbookId(null)
  }

  const handleDeleteLookbook = async (lookbookId: string) => {
    if (confirm('Are you sure you want to delete this lookbook?')) {
      await deleteLookbook(lookbookId)
      await loadLookbooks()
    }
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <AdminLoginForm />
  }

  return (
    <Container>
      <div className="mb-8 flex items-start justify-between">
        <PageHeader
          title="Admin Dashboard"
          subtitle="Manage your inventory, view inquiries, and track orders"
        />
        <button
          onClick={logout}
          className="mt-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
        >
          Sign Out
        </button>
      </div>

      {/* Summary Cards */}
      <section className="pb-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            <>
              <AdminStatCardSkeleton />
              <AdminStatCardSkeleton />
              <AdminStatCardSkeleton />
              <AdminStatCardSkeleton />
            </>
          ) : (
            <>
              <AdminStatCard
                label="Total Products"
                value={productCount}
                icon={<PackageIcon />}
              />
              <AdminStatCard
                label="Categories"
                value={categories.length}
                icon={<TagIcon />}
              />
              <AdminStatCard
                label="Inquiries"
                value={8}
                icon={<InboxIcon />}
                trend={{ value: 3, label: 'new this week', direction: 'up' }}
                variant="success"
              />
              <AdminStatCard
                label="Orders"
                value={0}
                icon={<ShoppingCartIcon />}
                variant="default"
              />
            </>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="pb-8">
        <div className="mb-4">
          <SectionTitle>Quick Actions</SectionTitle>
        </div>
        {isLoading ? (
          <AdminQuickActionsSkeleton />
        ) : (
          <AdminQuickActions
            onAddProduct={handleAddProduct}
            onImportCSV={() => setIsCSVImportOpen(true)}
            onExportProducts={exportProductsCSV}
            onExportInquiries={exportInquiriesCSV}
            onManageCategories={() => setIsCategoriesPanelOpen(true)}
          />
        )}
      </section>

      {/* Analytics Charts */}
      <section className="pb-12">
        <div className="mb-6">
          <SectionTitle subtitle="Visual overview of your store performance">
            Analytics
          </SectionTitle>
        </div>
        {!isLoading && (
          <AdminCharts products={products} inquiries={inquiries} />
        )}
      </section>

      {/* Inventory Management */}
      <section className="pb-12">
        <div className="mb-6">
          <SectionTitle subtitle="Track stock levels and manage inventory">
            Inventory
          </SectionTitle>
        </div>
        {!isLoading && (
          <AdminInventory
            products={products}
            onUpdateStock={(productId, newStock) => {
              setProducts((prev) =>
                prev.map((p) =>
                  p.id === productId ? { ...p, stock: newStock } : p
                )
              )
            }}
          />
        )}
      </section>

      {/* Products Table */}
      <section className="pb-12">
        <div className="mb-6">
          <SectionTitle subtitle="View and manage your product catalog">
            Products
          </SectionTitle>
        </div>
        {isLoading ? (
          <AdminProductsTableSkeleton />
        ) : (
          <AdminProductsTable
            products={products}
            onEdit={handleEditProduct}
            onDelete={handleDeleteClick}
            onAddProduct={handleAddProduct}
          />
        )}
      </section>

      {/* Lookbooks Section */}
      <section className="pb-12">
        <div className="mb-6 flex items-center justify-between">
          <SectionTitle subtitle="Create visual catalogs for your products">
            Lookbooks
          </SectionTitle>
          <button
            onClick={handleCreateLookbook}
            className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
          >
            + Create Lookbook
          </button>
        </div>
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-48 animate-pulse rounded-lg bg-neutral-200" />
            ))}
          </div>
        ) : lookbooks.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 py-12 text-center">
            <span className="mb-2 block text-3xl">📖</span>
            <p className="mb-4 text-neutral-600">No lookbooks yet</p>
            <button
              onClick={handleCreateLookbook}
              className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
            >
              Create Your First Lookbook
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lookbooks.map((lookbook) => (
              <div
                key={lookbook.id}
                className="group relative overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Cover image */}
                <div className="aspect-[16/9] bg-neutral-100">
                  {lookbook.coverImage?.url ? (
                    <img
                      src={lookbook.coverImage.url}
                      alt={lookbook.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-neutral-400">
                      <span className="text-4xl">📖</span>
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="p-4">
                  <h3 className="font-medium text-neutral-900">{lookbook.name}</h3>
                  <div className="mt-1 flex items-center gap-2 text-sm text-neutral-600">
                    <span>{lookbook.pages.length} page{lookbook.pages.length !== 1 ? 's' : ''}</span>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                      lookbook.isPublished
                        ? 'bg-green-100 text-green-700'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}>
                      {lookbook.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
                {/* Actions overlay */}
                <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => handleEditLookbook(lookbook.id)}
                    className="rounded bg-white/90 p-1.5 text-neutral-600 shadow hover:bg-white hover:text-neutral-900"
                    title="Edit"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteLookbook(lookbook.id)}
                    className="rounded bg-white/90 p-1.5 text-red-600 shadow hover:bg-white hover:text-red-700"
                    title="Delete"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                  <a
                    href={`/lookbook/${lookbook.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded bg-white/90 p-1.5 text-neutral-600 shadow hover:bg-white hover:text-neutral-900"
                    title="View"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Inquiries Table */}
      <section className="pb-16">
        <div className="mb-6">
          <SectionTitle subtitle="View and respond to customer inquiries">
            Inquiries
          </SectionTitle>
        </div>
        {isLoading ? (
          <AdminInquiriesTableSkeleton />
        ) : (
          <AdminInquiriesTable
            onView={handleViewInquiry}
            onStatusChange={handleInquiryStatusChange}
          />
        )}
      </section>

      {/* Inquiry Detail Modal */}
      <InquiryDetailModal
        isOpen={selectedInquiry !== null}
        onClose={handleCloseInquiryDetail}
        inquiry={selectedInquiry}
        onStatusChange={handleInquiryStatusChange}
      />

      {/* Product Form Modal */}
      <AdminProductForm
        isOpen={isProductFormOpen}
        onClose={handleCloseProductForm}
        onSave={handleSaveProduct}
        product={editingProduct}
        categories={categories.map(c => c.name)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        itemName={productToDelete?.name || ''}
      />

      {/* Categories Panel Modal */}
      <AdminCategoriesPanel
        isOpen={isCategoriesPanelOpen}
        onClose={() => setIsCategoriesPanelOpen(false)}
        categories={categories}
        onCategoriesChange={setCategories}
      />

      {/* Lookbook Form Modal */}
      <AdminLookbookForm
        isOpen={isLookbookFormOpen}
        onClose={handleCloseLookbookForm}
        onSave={loadLookbooks}
        lookbookId={editingLookbookId}
      />

      {/* CSV Import Modal */}
      <CSVImportModal
        isOpen={isCSVImportOpen}
        onClose={() => setIsCSVImportOpen(false)}
        onImportComplete={loadProducts}
        categories={categories.map((c) => c.name)}
      />

    </Container>
  )
}

// =============================================================================
// Not Found Page (for direct access when admin is disabled)
// =============================================================================

export function AdminNotFound() {
  return (
    <Container>
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-6 text-6xl">🔒</div>
        <h1 className="mb-2 text-2xl font-semibold text-neutral-900">
          Access Restricted
        </h1>
        <p className="mb-6 max-w-md text-neutral-600">
          The admin panel is not available. Please contact your administrator if you
          believe this is an error.
        </p>
        <a
          href="/"
          className="rounded-lg bg-brand-primary px-6 py-3 font-medium text-white transition-colors hover:bg-neutral-800"
        >
          Return Home
        </a>
      </div>
    </Container>
  )
}
