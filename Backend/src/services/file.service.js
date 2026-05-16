import mammoth from "mammoth"

import * as pdfjsLib
from "pdfjs-dist/legacy/build/pdf.mjs"

// ✅ Now uses file.buffer (multer memoryStorage) — no disk I/O
export async function extractText(file){

   // PDF — read from buffer
   if(file.mimetype === "application/pdf"){

      const data = new Uint8Array(file.buffer)

      const pdf =
      await pdfjsLib.getDocument({ data }).promise

      let text = ""

      for(let i=1;i<=pdf.numPages;i++){

         const page =
         await pdf.getPage(i)

         const content =
         await page.getTextContent()

         const strings =
         content.items.map(
            item=>item.str
         )

         text += strings.join(" ")
      }

      return text
   }

   // DOCX — read from buffer
   if(
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
   ){

      const result =
      await mammoth.extractRawText({
         buffer: file.buffer
      })

      return result.value
   }

   return ""
}