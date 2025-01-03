# API Reference

## Authentication
All API requests require authentication using API keys.

```bash
Authorization: Bearer YOUR_API_KEY
```

## Base URL
```
https://api.docsafe.com/v1
```

## Endpoints

### Passcode Management

#### Generate Passcode
```http
POST /passcode/generate
```

Request:
```json
{
  "businessId": "string",
  "documentType": "SSN",
  "purpose": "string",
  "expiry": "5m",
  "metadata": {
    "requestId": "string",
    "department": "string"
  }
}
```

Response:
```json
{
  "passcode": "ABC123XYZ789",
  "expiryTime": "2024-01-02T15:30:00Z",
  "requestId": "req_123456789"
}
```

#### Validate Passcode
```http
POST /passcode/validate
```

Request:
```json
{
  "passcode": "string",
  "businessId": "string"
}
```

Response:
```json
{
  "isValid": true,
  "documentType": "SSN",
  "expiryTime": "2024-01-02T15:30:00Z"
}
```

### Document Operations

#### Share Document
```http
POST /document/share
```

Request:
```json
{
  "passcode": "string",
  "documentId": "string",
  "accessDuration": "1h"
}
```

Response:
```json
{
  "shareId": "string",
  "accessToken": "string",
  "expiryTime": "2024-01-02T16:30:00Z"
}
```

#### Revoke Access
```http
POST /access/revoke
```

Request:
```json
{
  "shareId": "string"
}
```

Response:
```json
{
  "success": true,
  "revocationTime": "2024-01-02T15:35:00Z"
}
```

### Audit & Logging

#### Get Access Log
```http
GET /audit/log
```

Parameters:
- `documentId` (string)
- `startDate` (ISO 8601)
- `endDate` (ISO 8601)
- `page` (integer)
- `limit` (integer)

Response:
```json
{
  "logs": [
    {
      "timestamp": "2024-01-02T15:30:00Z",
      "action": "SHARE",
      "businessId": "string",
      "documentId": "string",
      "ipAddress": "string",
      "userAgent": "string",
      "location": {
        "country": "string",
        "city": "string"
      }
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10
  }
}
```

## Error Handling

### Error Codes
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error

### Error Response Format
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {}
  }
}
```

## Rate Limits
- 100 requests per minute per API key
- 1000 requests per hour per API key
- Custom limits for enterprise clients

## Webhooks

### Events
- document.shared
- access.revoked
- passcode.generated
- passcode.validated
- security.alert

### Webhook Format
```json
{
  "event": "string",
  "timestamp": "string",
  "data": {},
  "signature": "string"
}
```

## SDK Support
- JavaScript/TypeScript
- Python
- Java
- C#
- Ruby
- PHP
- Go

## Best Practices
1. Always validate passcodes server-side
2. Implement proper error handling
3. Use webhooks for async operations
4. Monitor rate limits
5. Secure API keys properly

## Testing
- Sandbox environment available
- Test API keys provided
- Mock data available
- Rate limits removed in sandbox

## Support
- API status page
- Developer forum
- Technical documentation
- Support tickets
- Security contact 