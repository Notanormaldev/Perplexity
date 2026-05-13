import fs from "fs"

import mammoth from "mammoth"

import * as pdfjsLib
from "pdfjs-dist/legacy/build/pdf.mjs"

export async function extractText(file){

   // PDF
   if(file.mimetype === "application/pdf"){

      const data = new Uint8Array(
         fs.readFileSync(file.path)
      )

      const pdf =
      await pdfjsLib.getDocument(data).promise

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