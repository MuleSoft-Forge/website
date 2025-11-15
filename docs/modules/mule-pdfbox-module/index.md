---
title: MuleSoft PDFBox Module
description: PDF Utilities for MuleSoft powered by Apache PDFBox
---

# mule-pdfbox-module

Empower your MuleSoft flows with native PDF manipulation powered by [Apache PDFBox](https://pdfbox.apache.org/). This connector provides high-performance PDF operations with no external dependencies.

![PDFBox Module Icon](/images/pdfbox-module/icon.svg)

### PDF Manipulation

<Hint type="success">

* I would like to **classify a PDF by its text** before sending and therefore save on IDP charges
* **Yes** sure use [Apache PDFBox - Extract Text](./operations/apache-pdfbox-extract-text)

</Hint>

<Hint type="success">

* I would like to **delete blank PDF pages** before submitting to MuleSoft IDP to make the response more manageable and cheaper?
* **Yes** sure use [Apache PDFBox - Split Pages](./operations/apache-pdfbox-split-pages)

</Hint>

<Hint type="success">

* I have a PDF of XXX pages but only want to submit pages 1 and 4
* **Yes** sure use [Apache PDFBox - Filter Pages](./operations/apache-pdfbox-filter-pages)

</Hint>

### Value Adds

**Key Features**

* **Metadata Extraction** – Get author, title, number of pages, and more.
* **Text Extraction** – Pull text from a specific range of pages.
* **Blank Page Removal** – Clean your documents before delivery.
* **Page Rotation** – Rotate document pages as needed.
* **PDF Splitting** – Break large PDFs into separate single-page files.
* **PDF Merging** – Combine multiple PDFs into a single cohesive document

**Built For Developers**

* Lightweight, single-dependency module
* Designed using MuleSoft Java SDK
* Input/output via standard Java streams

**Under the Hood**

* Built using [Apache PDFBox](https://pdfbox.apache.org/)
* Fully compatible with Mule 4.x
* Handles page ranges and robust PDF parsing

#### Implemented Operations:

**1. `extractPdfInfo`**

* **Purpose:** Extracts document metadata such as number of pages, author, title, subject, and version.
* **Input:** InputStream of the PDF.
* **Output:** POJO with document properties.
* **Under the Hood -** [**PDFDocumentInformation**](https://javadoc.io/static/org.apache.pdfbox/pdfbox/3.0.3/org/apache/pdfbox/pdmodel/PDDocumentInformation.html)

**2. `extractTextByPageRange`**

* **Purpose:** Extracts plain text from a given page range.
* **Input:** PDF stream + optional startPage / endPage.
* **Output:** Extracted text as a string.
* **Under the Hood -**  [PDFTextStripper](https://javadoc.io/static/org.apache.pdfbox/pdfbox/3.0.5/org/apache/pdfbox/text/PDFTextStripper.html)

**3. `filterPages`**

* **Purpose:** Removes blank pages and/or filters based on a page range.
* **Mechanism:** Detects blankness using text visibility, annotations, and embedded images.
* **Parameters:** Page range, remove blank pages flag.
* **Output:** Filtered PDF stream.

**4. `rotatePages`**

* **Purpose:** Rotates pages within a specified range clockwise or counterclockwise.
* **Parameters:** Page range, rotation direction.
* **Output:** Modified PDF stream.
* **Under the Hood -** [setRotation](https://pdfbox.apache.org/docs/2.0.2/javadocs/org/apache/pdfbox/pdmodel/PDPage.html#setRotation\(int\))

**5. `splitPages`**

* **Purpose:** Splits a PDF into individual pages.
* **Output:** A list of InputStreams, each containing a single-page PDF.

**6. `mergePdfs` (New 1.0.1)**

* **Purpose:** Combines two or more PDF documents into one.
* **Input:** A list of PDF InputStreams.
* **Output:** A single merged PDF stream with extracted metadata.
* _Under the Hood_: `PDFMergerUtility + RandomAccessReadBuffer`
