import multer from 'multer'

// ✅ Use memoryStorage — files go to req.file.buffer (no local disk writes)
// This works on any hosting platform (Render, Railway, Vercel etc.)
const storage = multer.memoryStorage()

export const upload = multer({ storage })