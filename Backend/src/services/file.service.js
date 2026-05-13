import fs from "fs"
import pdfParse from "pdf-parse"
import mammoth from "mammoth"

export async function extractText(file){

   // PDF
   if(file.mimetype === "application/pdf"){

      const buffer = fs.readFileSync(file.path)

      const data = await pdfParse(buffer)

      return data.text
   }

   // DOCX
   if(
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
   ){

      const result =
      await mammoth.extractRawText({
         path:file.path
      })

      return result.value
   }

   return ""
}