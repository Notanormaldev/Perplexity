import ImageKit from "imagekit"
import "dotenv/config"

// ✅ ImageKit v6 initialization (latest SDK)
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "public_placeholder",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/zerioai",
})

/**
 * Upload a file buffer to ImageKit.
 * @param {Buffer} buffer       - File buffer from multer memoryStorage
 * @param {string} fileName     - Original file name
 * @param {string} folder       - ImageKit folder path (e.g. "/chats/images")
 * @returns {{ url: string, fileId: string }}
 */
export async function uploadToImageKit(buffer, fileName, folder = "/uploads") {
  const sanitizedName = `${Date.now()}-${fileName.replace(/\s+/g, "_")}`

  const response = await imagekit.upload({
    file: buffer,            // Buffer directly supported in v6
    fileName: sanitizedName,
    folder,
    useUniqueFileName: false, // we already prefix with timestamp
  })

  return {
    url: response.url,
    fileId: response.fileId,
  }
}
