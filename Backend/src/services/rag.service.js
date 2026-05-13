export function chunkText(text){

   const chunkSize = 700

   const chunks = []

   for(
      let i=0;
      i<text.length;
      i+=chunkSize
   ){

      chunks.push(
         text.slice(i,i+chunkSize)
      )
   }

   return chunks
}