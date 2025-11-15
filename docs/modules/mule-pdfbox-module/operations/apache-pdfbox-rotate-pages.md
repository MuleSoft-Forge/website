---
title: Apache PDFBox - Rotate Pages
description: Rotate PDF pages by 90, 180, or 270 degrees
---

# Apache PDFBox - Rotate Pages

### Operation Name

**Apache PDFBox - Rotate Pages**
`rotatePages`

---

### Description

Rotates one or more pages in a PDF document clockwise by 90, 180, or 270 degrees. You can optionally limit the rotation to specific pages using a page range.

---

### Inputs

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `PDF File [Binary]` | `InputStream` (Binary) | Required | The PDF file to rotate. |
| `Degrees` | `Integer` | Required | The rotation angle: must be one of `90`, `180`, or `270`. |
| `Page Range` | `String` | Optional | A comma-separated list of pages and/or ranges to rotate (e.g., `1,3,5-6`). If not provided, all pages will be rotated. |

---

### Output

* **Payload**: `InputStream` (Binary)
  A new binary PDF stream with the specified pages rotated.
* **Attributes**: `PdfBoxFileAttributes`
  Includes original PDF metadata such as:
  * `numberOfPages`
  * `title`, `author`, etc.

---

### MuleSoft Flow Example

This example uses both Filter and Rotate as our [test pdf](https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf) is password protected so we use a filter to effectively make a copy.

::: tabs

== Anypoint Code Builder

![Anypoint Code Builder](/images/pdfbox-module/screenshot-2025-05-07-20-57-37.png)

```xml
<mule
	xmlns="http://www.mulesoft.org/schema/mule/core"
	xmlns:doc="http://www.mulesoft.org/schema/mule/documentation"
	xmlns:pdfbox="http://www.mulesoft.org/schema/mule/pdfbox"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:file="http://www.mulesoft.org/schema/mule/file"
	xsi:schemaLocation="http://www.mulesoft.org/schema/mule/core
	http://www.mulesoft.org/schema/mule/core/current/mule.xsd
	http://www.mulesoft.org/schema/mule/pdfbox
	http://www.mulesoft.org/schema/mule/pdfbox/current/mule-pdfbox.xsd
	http://www.mulesoft.org/schema/mule/file
	http://www.mulesoft.org/schema/mule/file/current/mule-file.xsd">

	<flow name="main">
		<scheduler doc:name="Scheduler" doc:id="dsgkfy" >
			<scheduling-strategy>
				<fixed-frequency timeUnit="HOURS"/>
			</scheduling-strategy>
		</scheduler>
		<flow-ref name="Apache PDFBox - Rotate Pages" />
	</flow>

	<sub-flow name="Apache PDFBox - Rotate Pages">
		<set-payload doc:id="vxsfk4" doc:name="Set payload" mimeType="application/octet-stream" value='#[%dw 2.0
output application/java
---readUrl("https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf", "application/octet-stream") as Binary]'></set-payload>
		<pdfbox:filter-pages doc:name="Apache PDFBox - Filter Pages" doc:id="fryjll" removeBlankPages="YES"/>
		<pdfbox:rotate-pdf-pages rotationAngle="ROTATION_90" doc:name="Apache PDFBox - Rotate Pages" doc:id="gvirqt" pageRange="2"/>
		<logger doc:name="Logger" doc:id="ecdqs4s" message='#[%dw 2.0
output text
---
"\n\n Apache PDFBox - Rotate Pages"
++ "\n\n⌄⌄⌄⌄⌄⌄⌄⌄⌄⌄⌄⌄⌄⌄⌄⌄⌄⌄⌄⌄"
++ "\n\nRotate Pages Attributes: " ++ (write(attributes, "application/json")) as String
++ "\n\n^^^^^^^^^^^^^^^^^^^^"
++ "\n\n Apache PDFBox - Rotate Pages"
++ "\n\n"]'/>
		<file:write path="test.pdf" doc:name="Write" doc:id="edxzk4" />
	</sub-flow>

</mule>
```

:::

---

### Notes

* **Rotation is cumulative**: If you run this operation multiple times on the same PDF, rotations stack.
* **Valid angles**: Only `90`, `180`, `270` degrees are supported (clockwise).
* **Page numbering**: 1-based indexing.

---

### Underlying Application Interface

See [Apache PDFBox JavaDoc](https://javadoc.io/doc/org.apache.pdfbox/pdfbox/latest/index.html)

<details>

<summary>Pseudo Code</summary>

```
 Operation: rotatePdfPages

Input:
  pdfFile: Binary content of the PDF (InputStream)
  pageRange: Comma-separated string of pages or ranges to rotate (Optional)
  rotationAngle: The angle in degrees to rotate the pages (e.g., 90, 180, 270)
  streamingHelper: MuleSoft StreamingHelper (for context/utilities)

Output:
  Result containing:
    - Rotated PDF content (InputStream) as output
    - PDF file attributes of the rotated document as attributes

Errors:
  PDF_LOAD_FAILED: If the PDF document cannot be loaded (corrupt or invalid).
  PDF_PROCESSING_ERROR: If there's an error during rotation or saving the document.
  PDF_INVALID_PAGE_RANGE: If the provided pageRange format is invalid.

Steps:
1. Convert the input `pdfFile` InputStream to a byte array.
2. Get the size of the byte array (originalPdfSize).
3. Try to load the PDF document from the byte array using PDFBox Loader.
4. If loading fails, throw a ModuleException with PDF_LOAD_FAILED.
5. Get the total number of pages from the loaded PDF document.
6. Parse the `pageRange` string into a Set of unique page numbers to rotate.
   - If `pageRange` is null or empty, include all pages.
   - Validate the format and bounds of the page range using the `parsePageRange` helper logic.
   - If parsing or validation fails, throw a ModuleException with PDF_INVALID_PAGE_RANGE.
7. Get the integer value of the `rotationAngle`.
8. Iterate through each page number in the parsed Set of pages to rotate:
   a. Check if the page number is valid (between 1 and totalPages).
   b. If valid, get the corresponding PDPage object from the document (adjusting for 0-based index).
   c. Set the rotation of the PDPage object to the specified `rotationAngle` value.
9. After rotating the specified pages, save the modified PDDocument to a ByteArrayOutputStream.
10. If saving fails, throw a ModuleException with PDF_PROCESSING_ERROR.
11. Create PdfBoxFileAttributes for the rotated document:
    - Set the number of pages (same as original unless pages were somehow removed, which isn't the case here).
    - Set the pdfSize from the size of the ByteArrayOutputStream.
    - Optionally, extract and set other metadata fields from the modified document (though the Java code only sets pages and size in the rotate operation's attributes creation).
12. Create a Result object containing:
    - An InputStream created from the ByteArrayOutputStream (the rotated PDF content) as the output.
    - Set the media type to APPLICATION_OCTET_STREAM.
    - The created PdfBoxFileAttributes object as attributes.
13. Return the Result object.
14. Ensure the loaded PDF document is closed properly after processing (using try-with-resources or a finally block).

```

</details>

<details>

<summary>Methods used from the Apache PDFBox library</summary>

* `org.apache.pdfbox.Loader.loadPDF(byte[] input)`: Used to load the PDF document from a byte array (Step 3).
* `org.apache.pdfbox.pdmodel.PDDocument.getNumberOfPages()`: Used to get the total number of pages in the loaded document (Step 5) and when creating attributes (Step 11).
* `org.apache.pdfbox.pdmodel.PDDocument.getPage(int pageIndex)`: Used to get a specific page object by its index (Step 8b).
* `org.apache.pdfbox.pdmodel.PDPage.setRotation(int rotation)`: Used to set the rotation angle for a specific page (Step 8c).
* `org.apache.pdfbox.pdmodel.PDDocument.save(OutputStream output)`: Used to save the modified document to an output stream (Step 9).
* `org.apache.pdfbox.pdmodel.PDDocument.close()`: Used to close the loaded document and release resources (Step 14).

</details>