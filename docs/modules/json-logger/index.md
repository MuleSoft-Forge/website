---
title: MuleSoft JSON Logger
description: Unified logging in JSON format
---

# json-logger

Standardize and enforce consistent logging across your MuleSoft flows with a drop-in replacement for the default Mule Logger. Output logs in structured JSON format based on customizable schemas, making them instantly compatible with log aggregation platforms like Splunk and ELK.

<img src="/images/json-logger.svg" alt="JSON Logger Module Icon" width="80" />

### Structured Logging

<Hint type="success">

I want to **standardize logging across all my flows** and enforce best practices.
* **Yes**, use the JSON Logger as a drop‑in replacement for the default Mule Logger.

</Hint>

<Hint type="success">

I'm using **Splunk, ELK, or another log aggregation platform** and need structured data.
* **Yes**, the JSON Logger outputs key=value pairs and JSON structures optimized for analysis.

</Hint>

### Value Adds

**Key Features**

* **Structured JSON Output** – Logs conform to a predefined JSON schema for consistency and tooling compatibility.
* **Correlation Tracking** – Automatically tie multiple log entries to a single transaction using correlation IDs.
* **Data Masking** – Redact sensitive information from logs before they reach storage or aggregation platforms.
* **External Destinations** – Send logs to Anypoint MQ, JMS queues, or other external systems.
* **Scoped Loggers** – Capture elapsed time and performance metrics for specific components and outbound calls.
* **Custom Schema Support** – Define your own JSON output structure via schema files to match your organization's logging standards (requires recompilation of sources; using the provided schema allows usage of the version from Maven Central).

**Developer Experience**

* Drop-in replacement for the default Mule Logger—no learning curve required
* Designed using MuleSoft Java SDK
* Compatible with Mule 4.6+, supports Java 17

**Under the Hood**

* Optimized JSON generation and parsing
* Minimal dependency footprint (~13 MB)
* Efficiently handles TypedValue content fields
* Community-driven open-source project

#### Available Configuration Options:

**1. Data Masking Rules**

* **Purpose:** Define patterns and fields to mask in logs
* **Customizable Via:** Schema configuration
* **Use Cases:** Hide API keys, passwords, PII, credit card numbers

**2. External Destinations**

* **Purpose:** Route logs to external systems
* **Supported:** Anypoint MQ, JMS queues, custom endpoints
* **Optional Dependencies:** Only required dependencies added for your deployment

**3. Scoped Logger Operations**

* **Purpose:** Capture performance metrics for specific code sections
* **Use Cases:** Measure API call duration, database query time, flow execution time
* **Output:** Elapsed time automatically included in JSON output
