# Example Feature - Business Rules

## Validation Rules

1. **Item name required** - Name cannot be empty or whitespace only
2. **Item name length** - Name must be 1-100 characters
3. **Item name unique** - No duplicate names allowed

## Business Rules

1. **Soft delete** - Items are not permanently deleted, only marked as deleted
2. **Audit trail** - All changes must be logged with timestamp and user
3. **Rate limiting** - Maximum 100 items per user

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Empty name submitted | Return 400 with message "Name is required" |
| Name > 100 chars | Return 400 with message "Name too long" |
| Duplicate name | Return 409 with message "Item already exists" |
| Delete non-existent item | Return 404 with message "Item not found" |
| Rate limit exceeded | Return 429 with message "Too many items" |

## Error Handling

All errors return JSON:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```
