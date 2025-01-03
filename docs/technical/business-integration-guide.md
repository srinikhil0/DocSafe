# Business Integration Guide

## Introduction
This guide helps businesses integrate DocSafe's secure document sharing system into their applications and workflows. Our system provides secure access to verified user documents while maintaining user privacy and control.

## Integration Options

### 1. Web Component
Fastest integration method using our drop-in component.

```html
<!-- Add to your HTML -->
<script src="https://api.docsafe.com/v1/component.js"></script>

<doc-safe-request
  business-id="YOUR_ID"
  document-type="SSN"
  callback="onDocumentReceived"
  theme="modern"
/>
```

### 2. REST API
Direct API integration for complete control.

```javascript
// Initialize DocSafe
const docSafe = new DocSafe({
  apiKey: 'your_api_key',
  businessId: 'your_business_id'
});

// Generate passcode
const passcode = await docSafe.generatePasscode({
  documentType: 'SSN',
  purpose: 'Loan Application',
  expiry: '5m'
});

// Display passcode to user
showPasscode(passcode.code);

// Handle document receipt
docSafe.on('documentReceived', (document) => {
  // Process verified document
  processDocument(document);
});
```

### 3. Server SDK
For backend integration and automated processing.

```javascript
const DocSafe = require('@docsafe/server-sdk');

const docSafe = new DocSafe({
  apiKey: process.env.DOCSAFE_API_KEY,
  businessId: process.env.BUSINESS_ID
});

// Verify received document
const verifyDocument = async (documentId) => {
  const verification = await docSafe.verify(documentId);
  return verification.isValid;
};
```

## Security Requirements

### API Authentication
- Use API keys for server-side calls
- JWT tokens for client-side
- Implement rate limiting
- Secure key storage

### Data Handling
- Never store received documents
- Process in memory only
- Implement secure error handling
- Log access attempts

### Compliance Requirements
- Maintain audit logs
- Implement session timeouts
- Follow data privacy guidelines
- Regular security reviews

## Best Practices

### User Experience
1. Clear Instructions
   - Explain document request purpose
   - Show clear passcode entry field
   - Provide help documentation
   - Display verification status

2. Error Handling
   - Clear error messages
   - Retry mechanisms
   - Support contact information
   - Fallback options

### Security
1. Implementation
   - Use HTTPS only
   - Implement CSP headers
   - Enable CORS properly
   - Regular security updates

2. Monitoring
   - Track failed attempts
   - Monitor API usage
   - Set up alerts
   - Regular audits

## Testing

### Sandbox Environment
```javascript
const docSafe = new DocSafe({
  apiKey: 'test_key',
  environment: 'sandbox'
});
```

### Test Cases
1. Valid document requests
2. Expired passcodes
3. Invalid document types
4. Network failures
5. Rate limit handling

## Support
- Developer Discord channel
- API documentation
- Integration examples
- Technical support email
- Security contact 