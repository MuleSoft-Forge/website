# Component Examples

This page demonstrates all custom components available in the MuleSoft Forge documentation. These components enable rich, interactive documentation that mirrors the functionality previously provided by GitBook.

## Hint Component

The Hint component creates callout boxes for important information, tips, warnings, and errors. Use these to draw attention to critical information in your documentation.

### Success Hints

Use success hints to confirm successful operations or indicate positive outcomes.

<Hint type="success">
Connector installation completed successfully! You can now use the connector in your Mule flows.
</Hint>

### Info Hints

Use info hints for general information, tips, or additional context.

<Hint type="info">
The IDP Connector supports multiple document formats including PDF, PNG, JPG, and TIFF. Check the connector documentation for a complete list of supported formats.
</Hint>

### Warning Hints

Use warning hints to alert users about potential issues or important considerations.

<Hint type="warning">
Make sure to configure your API credentials before deploying to production. Missing credentials will cause runtime errors.
</Hint>

### Danger Hints

Use danger hints for critical information, errors, or actions that cannot be undone.

<Hint type="danger">
Deleting this configuration will permanently remove all associated data. This action cannot be reversed.
</Hint>

## Tabs Component

The Tabs component allows you to present multiple code examples or platform-specific instructions in an organized, space-efficient way.

### Basic Example

Here's how to configure a connection in different programming approaches:

::: tabs

== Java Configuration

```java
@Configuration
public class MuleConfig {
    @Bean
    public ConnectionProvider getConnectionProvider() {
        return new ConnectionProvider()
            .withHost("api.example.com")
            .withPort(443)
            .withUsername("admin");
    }
}
```

== XML Configuration

```xml
<mule xmlns="http://www.mulesoft.org/schema/mule/core">
    <connection-config name="apiConnection">
        <connection
            host="api.example.com"
            port="443"
            username="admin" />
    </connection-config>
</mule>
```

== Properties File

```properties
# Connection Configuration
api.host=api.example.com
api.port=443
api.username=admin
api.password=${secure::password}
```

:::

### Multi-Language Code Example

Platform-specific implementations for the same functionality:

::: tabs

== Java

```java
public class DocumentProcessor {
    public Document extractText(InputStream input) {
        PDFTextExtractor extractor = new PDFTextExtractor();
        String text = extractor.extract(input);
        return new Document(text);
    }
}
```

== Python

```python
def extract_text(input_stream):
    """Extract text from PDF document."""
    extractor = PDFTextExtractor()
    text = extractor.extract(input_stream)
    return Document(text)
```

== JavaScript

```javascript
function extractText(inputStream) {
  const extractor = new PDFTextExtractor();
  const text = extractor.extract(inputStream);
  return new Document(text);
}
```

:::

## Stepper Component

The Stepper component creates sequential, numbered step-by-step instructions for workflows and tutorials.

### Basic Workflow Example

<Stepper>
  <Step title="Install the Connector">
    Add the connector dependency to your project's `pom.xml` file:

```xml
<dependency>
    <groupId>com.mulesoft.connectors</groupId>
    <artifactId>mule-idp-connector</artifactId>
    <version>1.0.0</version>
    <classifier>mule-plugin</classifier>
</dependency>
```

Run `mvn clean install` to download and install the connector.
  </Step>

  <Step title="Configure Global Connection">
    Create a global configuration element in your Mule flow:

```xml
<idp:config name="IDP_Config">
    <idp:connection
        apiKey="${secure::idp.apiKey}"
        endpoint="https://api.idp-service.com" />
</idp:config>
```

<Hint type="info">
Store sensitive credentials like API keys in secure property files, never hardcode them in your configuration.
</Hint>
  </Step>

  <Step title="Add Connector Operation">
    Drag the "Extract Document" operation from the Mule palette into your flow:

```xml
<flow name="documentProcessingFlow">
    <http:listener path="/process" config-ref="HTTP_Config" />

    <idp:extract-document config-ref="IDP_Config">
        <idp:document>#[payload]</idp:document>
    </idp:extract-document>

    <logger level="INFO" message="#[payload]" />
</flow>
```
  </Step>

  <Step title="Test Your Flow">
    Start the Mule application and test the endpoint:

```bash
curl -X POST http://localhost:8081/process \
  -H "Content-Type: application/pdf" \
  --data-binary "@sample-document.pdf"
```

<Hint type="success">
If configured correctly, you should see extracted document data in the response and application logs.
</Hint>
  </Step>
</Stepper>

### Advanced Deployment Workflow

<Stepper>
  <Step title="Prepare Application">
    Ensure your application builds successfully and all tests pass:

```bash
mvn clean test
mvn package
```

Verify the generated JAR file exists in the `target` directory.
  </Step>

  <Step title="Configure CloudHub Properties">
    Create a `cloudhub.properties` file with deployment configuration:

```properties
# CloudHub Deployment Configuration
cloudhub.environment=production
cloudhub.region=us-east-1
cloudhub.workerType=MICRO
cloudhub.workers=1
```

<Hint type="warning">
Review your worker size requirements based on expected load. MICRO workers are suitable for development but may not handle production traffic.
</Hint>
  </Step>

  <Step title="Deploy to CloudHub">
    Use the Anypoint CLI or Maven plugin to deploy:

::: tabs

== Maven Plugin

```bash
mvn deploy -DmuleDeploy \
  -Dcloudhub.environment=production \
  -Dcloudhub.workerType=SMALL
```

== Anypoint CLI

```bash
anypoint-cli runtime-mgr cloudhub-application deploy \
  --environment production \
  myapp target/myapp-1.0.0.jar
```

:::
  </Step>

  <Step title="Verify Deployment">
    Monitor the deployment status in Anypoint Platform Runtime Manager.

Once deployed:
- Check application logs for errors
- Verify health check endpoints respond correctly
- Test API endpoints with sample requests
- Monitor application metrics and performance

<Hint type="success">
Your application is now live in CloudHub! Monitor the Runtime Manager dashboard for ongoing health and performance metrics.
</Hint>
  </Step>
</Stepper>

## Combined Components Example

Here's a real-world scenario combining multiple components:

### Troubleshooting Guide

<Hint type="warning">
Before proceeding with troubleshooting, ensure you have admin access to Runtime Manager and can view application logs.
</Hint>

<Stepper>
  <Step title="Identify the Issue">
    Check the Runtime Manager logs for error messages:

::: tabs

== Via UI

1. Navigate to Runtime Manager
2. Select your application
3. Click on "Logs" tab
4. Filter by "ERROR" level

== Via CLI

```bash
anypoint-cli runtime-mgr cloudhub-application tail-logs \
  --environment production myapp
```

:::
  </Step>

  <Step title="Analyze Error Pattern">
    Common error patterns and their causes:

<Hint type="info">
Connection timeout errors often indicate firewall rules blocking outbound traffic or incorrect endpoint URLs.
</Hint>

<Hint type="danger">
Out of memory errors require immediate attention and usually indicate a worker size upgrade is needed.
</Hint>
  </Step>

  <Step title="Apply Fix and Redeploy">
    After identifying and fixing the issue, redeploy your application:

```bash
mvn clean package deploy -DmuleDeploy
```

<Hint type="success">
Monitor the deployment closely for the first few minutes to ensure the issue is resolved.
</Hint>
  </Step>
</Stepper>

## Usage Guidelines

### When to Use Each Component

- **Hint (Success)**: Confirmations, successful completions, positive outcomes
- **Hint (Info)**: Additional context, tips, non-critical information
- **Hint (Warning)**: Cautions, important considerations, potential issues
- **Hint (Danger)**: Errors, critical warnings, irreversible actions
- **Tabs**: Multi-platform code examples, alternative approaches, language-specific implementations
- **Stepper**: Sequential tutorials, installation guides, deployment workflows, troubleshooting procedures

### Best Practices

1. **Keep hints concise** - One or two sentences is ideal
2. **Use appropriate hint types** - Match the severity to the content
3. **Organize tabs logically** - Put the most common option first
4. **Make steps actionable** - Each step should have a clear objective
5. **Combine components thoughtfully** - Use hints within steps to highlight important details

---

These components form the foundation of rich, interactive documentation for MuleSoft Forge connectors. Use them to create engaging, professional documentation that helps users succeed.
