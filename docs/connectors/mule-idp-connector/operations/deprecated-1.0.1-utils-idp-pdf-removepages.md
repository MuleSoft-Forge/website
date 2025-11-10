---
title: Deprecated 1.0.1 - Utils IDP - PDF - RemovePages
description: Remove PDF Pages from PDF Doc before Submission (Deprecated - moved to mule-pdfbox-module)
---

# Deprecated 1.0.1 - Utils IDP - PDF - RemovePages

### **DEPRECATED 1.0.1 - Moved to [mule-pdfbox-module](/modules/mule-pdfbox-module/)**

### **Usage**:

Utilize [Apache PDFBox®](https://pdfbox.apache.org/) to manipulate a PDF document

* Submit only selected pdf pages ie 1,3,10,11 or 1-3,6,8-12
* Remove Blank Pages

---

### Configuration:

::: tabs

== Anypoint Code Builder

![Anypoint Code Builder Configuration](/images/idp-connector/screenshot-2025-04-07-17-35-29.png)

== Anypoint Studio

![Anypoint Studio Configuration](/images/idp-connector/screenshot-2025-04-07-17-29-54.png)

:::

---

### Underlying Application Interface:

See [Apache PDFBox JavaDoc](https://javadoc.io/doc/org.apache.pdfbox/pdfbox/latest/index.html)

<details>

<summary>Pseudo Code</summary>

```
FUNCTION utilsPdfRemovePages(Options, InputPdfStream)
  OUTPUT: ModifiedPdfStream, Attributes {originalPageCount, pagesRemoved}

  // 1. Load PDF from InputPdfStream into an editable pdfDocument
  Read InputPdfStream into memory
  Load PDF data into pdfDocument object
  originalCount = pdfDocument.getPageCount()

  // 2. Decide removal strategy based on Options
  IF Options say "Remove Blank Pages":
    // Find and remove pages with no text, images, or annotations
    Identify blank pages within pdfDocument
    Remove all identified blank pages
  ELSE:
    // Keep only specified pages, remove others
    Get list of PageNumbersToKeep from Options
    Identify all pages NOT in PageNumbersToKeep
    Remove identified pages from pdfDocument
  END IF

  // 3. Finalize and return
  removedCount = originalCount - pdfDocument.getPageCount()
  Save modified pdfDocument into outputBytes
  Create ModifiedPdfStream from outputBytes
  Create Attributes map {originalPageCount=originalCount, pagesRemoved=removedCount}

  RETURN ModifiedPdfStream, Attributes
  // Note: Includes error handling for invalid input and processing errors.

END FUNCTION
```

</details>

<details>

<summary>Methods used from the Apache PDFBox library</summary>

**From `org.apache.pdfbox.Loader`:**

* `loadPDF(byte[] pdfBytes)`: Loads a PDF document from a byte array.

**From `org.apache.pdfbox.pdmodel.PDDocument`:**

* `getNumberOfPages()`: Gets the total number of pages in the document.
* `getPages()`: Gets the page tree (`PDPageTree`) containing all pages.
* `getPage(int pageIndex)`: Gets a specific page by its 0-based index.
* `removePage(PDPage page)`: Removes the specified page object from the document.
* `save(OutputStream outputStream)`: Saves the document to an output stream.
* `close()`: Closes the document and releases resources (implicitly called by the try-with-resources statement).

**From `org.apache.pdfbox.pdmodel.PDPage`:**

* `getResources()`: Gets the resources dictionary (`PDResources`) associated with the page.
* `getAnnotations()`: Gets a list (`List<PDAnnotation>`) of annotations on the page.

**From `org.apache.pdfbox.pdmodel.PDResources`:**

* `getXObjectNames()`: Gets the names of external objects (like images) referenced in the resources.

**From `org.apache.pdfbox.pdmodel.common.PDPageable` (Interface implemented by `PDPageTree`):**

* `indexOf(PDPage page)`: Finds the 0-based index of a given page within the page tree.

**From `org.apache.pdfbox.text.PDFTextStripper`:**

* `PDFTextStripper()`: Constructor to create a text stripper object.
* `setStartPage(int pageNum)`: Sets the 1-based page number where text extraction should start.
* `setEndPage(int pageNum)`: Sets the 1-based page number where text extraction should end.
* `getText(PDDocument document)`: Extracts text from the specified page range within the document.

</details>
