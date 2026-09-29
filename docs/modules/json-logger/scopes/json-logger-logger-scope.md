---
title: JSON Logger - Logger Scope
description: Log scope timing and processing events in structured JSON format
---

# JSON Logger - Logger Scope

### Operation Name

**JSON Logger - Logger Scope**
`loggerScope`

---

### Description

Wraps a group of Mule flow processors and writes structured JSON log entries before and after the scope executes. Use it to measure elapsed time for data transformations, outbound requests, or flow logic while preserving the wrapped processors' normal behavior.

If a processor in the scope fails, the operation writes an exception log entry and propagates the original error.

---

### Inputs

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `configurationRef` | `String` | Required | Name of the global JSON Logger configuration associated with the scope. |
| `priority` | `String` | Optional | Logger priority. Allowed values: `DEBUG`, `TRACE`, `INFO`, `WARN`, or `ERROR`. Defaults to `INFO`. |
| `scopeTracePoint` | `String` | Optional | Type of processing being measured. Allowed values: `DATA_TRANSFORM_SCOPE`, `OUTBOUND_REQUEST_SCOPE`, or `FLOW_LOGIC_SCOPE`. Defaults to `OUTBOUND_REQUEST_SCOPE`. |
| `category` | `String` | Optional | Logger category. If omitted, uses `org.mule.extension.jsonlogger.JsonLogger`. |
| `correlationId` | `String` | Optional | Correlation identifier for the scope logs. Defaults to the Mule `correlationId`. |

---

### Output

The scope returns the result of the wrapped processors unchanged:

* **Payload**: The payload produced by the inner scope.
* **Attributes**: The attributes produced by the inner scope.

The logger writes structured JSON entries with the correlation ID, trace point, priority, elapsed time, scope elapsed time, timestamp, application metadata, and optional location information. A normal execution produces `*_BEFORE` and `*_AFTER` trace points; a failed execution produces an `EXCEPTION_SCOPE` entry.

---

### MuleSoft Flow Example

Here's how to call this operation in a MuleSoft flow:

::: tabs

== Anypoint Code Builder

```xml
<mule
	xmlns="http://www.mulesoft.org/schema/mule/core"
	xmlns:doc="http://www.mulesoft.org/schema/mule/documentation"
	xmlns:json-logger="http://www.mulesoft.org/schema/mule/json-logger"
	xmlns:http="http://www.mulesoft.org/schema/mule/http"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"

	xsi:schemaLocation="http://www.mulesoft.org/schema/mule/core
	http://www.mulesoft.org/schema/mule/core/current/mule.xsd
	http://www.mulesoft.org/schema/mule/http
	http://www.mulesoft.org/schema/mule/http/current/mule-http.xsd
	http://www.mulesoft.org/schema/mule/json-logger
	http://www.mulesoft.org/schema/mule/json-logger/current/mule-json-logger.xsd">

	<json-logger:config name="JSON_Logger_Config"
		doc:name="JSON Logger Config"
		environment="dev"
		applicationName="example-app"
		applicationVersion="1.0.0" />

	<flow name="main">
		<json-logger:logger-scope
			doc:name="JSON Logger Scope"
			configurationRef="JSON_Logger_Config"
			scopeTracePoint="OUTBOUND_REQUEST_SCOPE"
			priority="INFO">
			<http:request method="GET" url="https://api.example.com/customers" />
		</json-logger:logger-scope>
	</flow>

</mule>
```

:::

---

### Notes

* The scope logs a `*_BEFORE` entry immediately before the inner processors execute.
* The `*_AFTER` entry includes the elapsed time for the wrapped processors in `scopeElapsed`.
* `OUTBOUND_REQUEST_SCOPE` is intended for outbound calls, `DATA_TRANSFORM_SCOPE` for transformations, and `FLOW_LOGIC_SCOPE` for general flow logic.
* If the inner processors fail, the scope logs `EXCEPTION_SCOPE` with priority `ERROR` and propagates the original error.
* If the selected priority is disabled, the inner processors still execute without logger processing.
* External destinations receive the before and after entries when configured for the selected logger category.

---

### Underlying Application Interface

The scope is implemented by the `loggerScope` method in the JSON Logger Java SDK extension. Its scope-specific parameter is generated from the [`loggerScopeProcessor.json` schema](https://github.com/anypointcloud/json-logger/blob/main/src/main/resources/schema/loggerScopeProcessor.json).

<details>

<summary>Pseudo Code</summary>

```
Operation: loggerScope

Input:
	configurationRef: Required global JSON Logger configuration name
	priority: Optional Priority, default INFO
	scopeTracePoint: Optional ScopeTracePoint, default OUTBOUND_REQUEST_SCOPE
	category: Optional logger category
	correlationId: Optional Mule correlationId expression
	operations: The processors wrapped by the scope

Output:
	The result of the wrapped operations
	The original error if a wrapped operation fails

Steps:
1. Resolve the referenced JSON Logger configuration and correlation ID.
2. Record the initial timestamp used to calculate elapsed time.
3. Write the before entry with the selected scope trace point and zero `scopeElapsed`.
4. Execute the wrapped processors.
5. On success, calculate elapsed and scope elapsed time, write the after entry, and return the wrapped result.
6. On failure, write an `EXCEPTION_SCOPE` entry with priority `ERROR` and propagate the error.
7. Forward generated scope entries to configured external destinations when applicable.
```

</details>

<details>

<summary>JSON Logger scope implementation details</summary>

* `JsonloggerOperations.loggerScope(...)`: Executes the scope and reports completion or failure through the Mule callback.
* `ScopeTracePoint`: Defines the type of work being measured.
* `FlowListener`: Removes the cached initial timestamp when the flow completes.
* `LogEventSingleton`: Publishes before and after scope entries to configured external destinations.

</details>
