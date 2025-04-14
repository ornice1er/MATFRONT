

export const FileService={

    fromArrayBufferToBase64(buffer:any ) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const file = window.btoa(binary);
  
        const url = `data:application/pdf;base64,` + file;
      
        return url;
    },
    fromArrayBufferToBlob(buffer:any ) {

        return new Blob([buffer], { type: 'application/pdf' });
    },
    fromBlobToFile(theBlob: Blob, fileName:string){
        const b: any = theBlob;
        b.lastModifiedDate = new Date();
        b.name = fileName;
        return theBlob as File;
    },
    readFileAsync(file:any) {
        return new Promise((resolve, reject) => {
          let reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result);
          };
          reader.onerror = reject;
          reader.readAsArrayBuffer(file);
        });
        
      }
    
}