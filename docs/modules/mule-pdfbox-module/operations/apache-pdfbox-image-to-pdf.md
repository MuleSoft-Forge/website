---
title: Apache PDFBox - Image to PDF
description: Convert image files to PDF format
---

# Apache PDFBox - Image to PDF

#### 🔧 Operation Name

**Apache PDFBox – Image to PDF**
`imageToPdf`

---

#### 🧾 Description

Converts a single image (e.g., JPG, PNG, GIF, BMP) into a one-page PDF document.
The resulting PDF has a single page sized to match the dimensions of the source image.

Perfect for embedding scanned receipts, screenshots, or images into a PDF workflow.

---

#### ✅ Inputs

* **Image File [Binary]** (`InputStream`)
  Binary content of the image (JPEG, PNG, etc.).

---

#### 📤 Output

* **Payload**: `InputStream` (binary stream)
  A one-page PDF containing the provided image.
* **Attributes**: `PdfBoxFileAttributes`
  Metadata of the generated PDF: number of pages (always 1), file size, creation date, etc.

---

#### 🔍 Notes

* The generated page is automatically **sized to the image's pixel dimensions** (no scaling).
* You can adjust scaling or margins later by combining this with other operations (e.g., rotatePages, filterPages).
* Currently supports formats loadable by `PDImageXObject` (PNG, JPEG, BMP, GIF).
* Always outputs a **single-page PDF** regardless of the image dimensions.

---

### Underlying Application Interface

See [Apache PDFBox JavaDoc](https://javadoc.io/doc/org.apache.pdfbox/pdfbox/latest/index.html)

<details>
<summary>Pseudo Code</summary>

```
Operation: imageToPdf

Input:

imageStream: Binary content of the image (InputStream)

streamingHelper: MuleSoft StreamingHelper (for context/utilities)

Output:
Result containing:

A single InputStream representing the new one-page PDF document.

PdfBoxFileAttributes containing metadata of the generated PDF (page count, size, etc.).

Errors:

PDF_PROCESSING_ERROR: If the input is not a valid image or embedding fails.

PDF_METADATA_EXTRACTION_FAILED: If metadata cannot be retrieved from the generated PDF.

Steps:

Convert the imageStream to a byte array.

Create a new empty PDDocument.

Try to create a PDImageXObject from the byte array inside the document.

If this fails, throw a ModuleException with PDF_PROCESSING_ERROR.

Get the width and height of the image from the PDImageXObject.

Create a new PDRectangle using the image's width and height.

Create a new PDPage with this rectangle and add it to the document.

Create a PDPageContentStream bound to the new page.

Draw the image on the page at coordinates (0,0) with full width and height.

Close the content stream.

Create a ByteArrayOutputStream.

Save the PDF document to the ByteArrayOutputStream.

Try to extract metadata from the PDF (using extractPdfMetadata).

If extraction fails, throw a ModuleException with PDF_METADATA_EXTRACTION_FAILED.

Convert the ByteArrayOutputStream to a ByteArrayInputStream.

Create a new Result object containing:

The ByteArrayInputStream as output.

The PdfBoxFileAttributes as attributes.

Return the Result object.

In a finally block, ensure the PDDocument is closed to release resources.
```

</details>

<details>
<summary>Methods used from the Apache PDFBox library</summary>

📂 **Classes & Methods from PDFBox**

1. **`PDDocument`**
   * `new PDDocument()` → creates a new empty PDF document.
   * `addPage(PDPage page)` → adds a new page to the document.
   * `save(OutputStream)` → saves the document to an output stream.
   * `close()` → releases resources held by the document.
2. **`PDImageXObject`**
   * `PDImageXObject.createFromByteArray(PDDocument doc, byte[] imageData, String name)`\
     → creates a PDF image object from raw image bytes.
3. **`PDRectangle`**
   * `new PDRectangle(float width, float height)` → defines a rectangle (page size) with the same dimensions as the image.
4. **`PDPage`**
   * `new PDPage(PDRectangle mediaBox)` → creates a new page with the given dimensions.
5. **`PDPageContentStream`**
   * `new PDPageContentStream(PDDocument doc, PDPage page)` → creates a content stream to draw onto a page.
   * `drawImage(PDImageXObject image, float x, float y, float width, float height)` → draws the image onto the page at `(x, y)` scaled to width/height.
   * `close()` → finalizes and closes the content stream.

</details>

**Supported Image Formats:**
- JPEG / JPG
- PNG
- BMP
- GIF
