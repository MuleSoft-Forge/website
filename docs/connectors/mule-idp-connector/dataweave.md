---
title: DataWeave
description: DataWeave example for IDP connector multipart request
---

# Dataweave

```dataweave
%dw 2.0
output java
---
{
	parts: {
		callback: {
			content: '{"noAuthUrl": "' ++ (vars.callbackUrl default "") ++'"}'
		},
		file: {
			headers: {
				"Content-Disposition": {
					name: "file",				 			// Required and hard-coded to LOWERCASE file
            		filename: "myFileName.pdf", 			// Required Name & Extension {YOUR_DOCUMENT_NAME}.pdf
					subtype: "form-data" 					// Required and hard-coded to form-data
				},
				"Content-Type": "application/octet-stream"	// Required and hard-coded to application/octet-stream no need to pass media type
			},
			content: payload 								// Required Raw Binary NO Base64 (Base64 will be accepted but fails latter as incorrect image image)

		}
	}
}
```
