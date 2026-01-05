// =============================================================================
// Image Storage Layer
// IndexedDB-based storage for product images and enhancement jobs (MVP)
// =============================================================================

import type {
  ProductImage,
  EnhancementJob,
  Lookbook,
} from '../types/images'

const DB_NAME = 'potpourri_images'
const DB_VERSION = 1

// Store names
const STORES = {
  IMAGES: 'images',
  JOBS: 'enhancement_jobs',
  LOOKBOOKS: 'lookbooks',
} as const

/**
 * Open the IndexedDB database
 */
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      // Images store - indexed by productId for efficient queries
      if (!db.objectStoreNames.contains(STORES.IMAGES)) {
        const imageStore = db.createObjectStore(STORES.IMAGES, { keyPath: 'id' })
        imageStore.createIndex('productId', 'productId', { unique: false })
        imageStore.createIndex('type', 'type', { unique: false })
        imageStore.createIndex('createdAt', 'createdAt', { unique: false })
      }

      // Enhancement jobs store
      if (!db.objectStoreNames.contains(STORES.JOBS)) {
        const jobStore = db.createObjectStore(STORES.JOBS, { keyPath: 'id' })
        jobStore.createIndex('productId', 'productId', { unique: false })
        jobStore.createIndex('status', 'status', { unique: false })
        jobStore.createIndex('createdAt', 'createdAt', { unique: false })
      }

      // Lookbooks store
      if (!db.objectStoreNames.contains(STORES.LOOKBOOKS)) {
        const lookbookStore = db.createObjectStore(STORES.LOOKBOOKS, { keyPath: 'id' })
        lookbookStore.createIndex('isPublished', 'isPublished', { unique: false })
        lookbookStore.createIndex('createdAt', 'createdAt', { unique: false })
      }
    }
  })
}

/**
 * Generic helper to perform a transaction
 */
async function withTransaction<T>(
  storeName: string,
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, mode)
    const store = transaction.objectStore(storeName)
    const request = operation(store)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    transaction.oncomplete = () => db.close()
  })
}

/**
 * Generic helper to get all items matching an index value
 */
async function getAllByIndex<T>(
  storeName: string,
  indexName: string,
  value: IDBValidKey
): Promise<T[]> {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly')
    const store = transaction.objectStore(storeName)
    const index = store.index(indexName)
    const request = index.getAll(value)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    transaction.oncomplete = () => db.close()
  })
}

// =============================================================================
// Image Operations
// =============================================================================

/**
 * Save a product image
 */
export async function saveImage(image: ProductImage): Promise<void> {
  await withTransaction(STORES.IMAGES, 'readwrite', (store) =>
    store.put(image)
  )
}

/**
 * Save multiple images in a single transaction
 */
export async function saveImages(images: ProductImage[]): Promise<void> {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.IMAGES, 'readwrite')
    const store = transaction.objectStore(STORES.IMAGES)

    images.forEach((image) => store.put(image))

    transaction.onerror = () => reject(transaction.error)
    transaction.oncomplete = () => {
      db.close()
      resolve()
    }
  })
}

/**
 * Get an image by ID
 */
export async function getImage(id: string): Promise<ProductImage | undefined> {
  return withTransaction(STORES.IMAGES, 'readonly', (store) => store.get(id))
}

/**
 * Get all images for a product
 */
export async function getProductImages(productId: string): Promise<ProductImage[]> {
  const images = await getAllByIndex<ProductImage>(STORES.IMAGES, 'productId', productId)
  return images.sort((a, b) => a.sortOrder - b.sortOrder)
}

/**
 * Delete an image by ID
 */
export async function deleteImage(id: string): Promise<void> {
  await withTransaction(STORES.IMAGES, 'readwrite', (store) => store.delete(id))
}

/**
 * Delete all images for a product
 */
export async function deleteProductImages(productId: string): Promise<void> {
  const images = await getProductImages(productId)
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.IMAGES, 'readwrite')
    const store = transaction.objectStore(STORES.IMAGES)

    images.forEach((image) => store.delete(image.id))

    transaction.onerror = () => reject(transaction.error)
    transaction.oncomplete = () => {
      db.close()
      resolve()
    }
  })
}

/**
 * Update image order for a product
 */
export async function updateImageOrder(
  productId: string,
  imageIds: string[]
): Promise<void> {
  const images = await getProductImages(productId)
  const updatedImages = images.map((img) => ({
    ...img,
    sortOrder: imageIds.indexOf(img.id),
    updatedAt: new Date(),
  }))
  await saveImages(updatedImages)
}

/**
 * Set primary image for a product
 */
export async function setPrimaryImage(
  productId: string,
  imageId: string
): Promise<void> {
  const images = await getProductImages(productId)
  const updatedImages = images.map((img) => ({
    ...img,
    isPrimary: img.id === imageId,
    updatedAt: new Date(),
  }))
  await saveImages(updatedImages)
}

/**
 * Get the primary image for a product
 */
export async function getPrimaryImage(productId: string): Promise<ProductImage | undefined> {
  const images = await getProductImages(productId)
  return images.find((img) => img.isPrimary) || images[0]
}

// =============================================================================
// Enhancement Job Operations
// =============================================================================

/**
 * Save an enhancement job
 */
export async function saveJob(job: EnhancementJob): Promise<void> {
  await withTransaction(STORES.JOBS, 'readwrite', (store) => store.put(job))
}

/**
 * Get an enhancement job by ID
 */
export async function getJob(id: string): Promise<EnhancementJob | undefined> {
  return withTransaction(STORES.JOBS, 'readonly', (store) => store.get(id))
}

/**
 * Get all jobs for a product
 */
export async function getProductJobs(productId: string): Promise<EnhancementJob[]> {
  return getAllByIndex<EnhancementJob>(STORES.JOBS, 'productId', productId)
}

/**
 * Get all pending/processing jobs
 */
export async function getActiveJobs(): Promise<EnhancementJob[]> {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.JOBS, 'readonly')
    const store = transaction.objectStore(STORES.JOBS)
    const request = store.getAll()

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const jobs = request.result as EnhancementJob[]
      resolve(jobs.filter((j) => j.status === 'pending' || j.status === 'processing'))
    }

    transaction.oncomplete = () => db.close()
  })
}

/**
 * Update job status
 */
export async function updateJobStatus(
  jobId: string,
  status: EnhancementJob['status'],
  progress?: number,
  error?: string
): Promise<void> {
  const job = await getJob(jobId)
  if (!job) return

  const updatedJob: EnhancementJob = {
    ...job,
    status,
    progress: progress ?? job.progress,
    error,
    ...(status === 'processing' && !job.startedAt ? { startedAt: new Date() } : {}),
    ...(status === 'completed' || status === 'failed' ? { completedAt: new Date() } : {}),
  }

  await saveJob(updatedJob)
}

/**
 * Delete a job
 */
export async function deleteJob(id: string): Promise<void> {
  await withTransaction(STORES.JOBS, 'readwrite', (store) => store.delete(id))
}

// =============================================================================
// Lookbook Operations
// =============================================================================

/**
 * Save a lookbook
 */
export async function saveLookbook(lookbook: Lookbook): Promise<void> {
  await withTransaction(STORES.LOOKBOOKS, 'readwrite', (store) =>
    store.put(lookbook)
  )
}

/**
 * Get a lookbook by ID
 */
export async function getLookbook(id: string): Promise<Lookbook | undefined> {
  return withTransaction(STORES.LOOKBOOKS, 'readonly', (store) => store.get(id))
}

/**
 * Get all lookbooks
 */
export async function getAllLookbooks(): Promise<Lookbook[]> {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.LOOKBOOKS, 'readonly')
    const store = transaction.objectStore(STORES.LOOKBOOKS)
    const request = store.getAll()

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    transaction.oncomplete = () => db.close()
  })
}

/**
 * Get published lookbooks
 */
export async function getPublishedLookbooks(): Promise<Lookbook[]> {
  const all = await getAllLookbooks()
  return all.filter((lb) => lb.isPublished)
}

/**
 * Delete a lookbook
 */
export async function deleteLookbook(id: string): Promise<void> {
  await withTransaction(STORES.LOOKBOOKS, 'readwrite', (store) => store.delete(id))
}

// =============================================================================
// Storage Statistics
// =============================================================================

/**
 * Get storage usage statistics
 */
export async function getStorageStats(): Promise<{
  imageCount: number
  jobCount: number
  lookbookCount: number
  estimatedSize: number
}> {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      [STORES.IMAGES, STORES.JOBS, STORES.LOOKBOOKS],
      'readonly'
    )

    let imageCount = 0
    let jobCount = 0
    let lookbookCount = 0

    const imageStore = transaction.objectStore(STORES.IMAGES)
    const jobStore = transaction.objectStore(STORES.JOBS)
    const lookbookStore = transaction.objectStore(STORES.LOOKBOOKS)

    const imageCountReq = imageStore.count()
    const jobCountReq = jobStore.count()
    const lookbookCountReq = lookbookStore.count()

    imageCountReq.onsuccess = () => (imageCount = imageCountReq.result)
    jobCountReq.onsuccess = () => (jobCount = jobCountReq.result)
    lookbookCountReq.onsuccess = () => (lookbookCount = lookbookCountReq.result)

    transaction.oncomplete = async () => {
      db.close()
      // Estimate storage usage (rough approximation)
      let estimatedSize = 0
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate()
        estimatedSize = estimate.usage || 0
      }
      resolve({ imageCount, jobCount, lookbookCount, estimatedSize })
    }

    transaction.onerror = () => reject(transaction.error)
  })
}

/**
 * Clear all stored data (use with caution!)
 */
export async function clearAllData(): Promise<void> {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      [STORES.IMAGES, STORES.JOBS, STORES.LOOKBOOKS],
      'readwrite'
    )

    transaction.objectStore(STORES.IMAGES).clear()
    transaction.objectStore(STORES.JOBS).clear()
    transaction.objectStore(STORES.LOOKBOOKS).clear()

    transaction.onerror = () => reject(transaction.error)
    transaction.oncomplete = () => {
      db.close()
      resolve()
    }
  })
}
