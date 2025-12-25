# Example Feature

## Overview

This is an example feature to demonstrate the documentation structure.

## User Story

As a **developer**, I want **example documentation**, so that **I understand how to write specs for my features**.

## Acceptance Criteria

- [ ] User can view list of items
- [ ] User can add new item
- [ ] User can delete existing item
- [ ] Items persist across page refresh

## API Endpoints

### GET /api/items

Returns list of all items.

**Response:**
```json
{
  "items": [
    { "id": "1", "name": "Item 1", "createdAt": "2024-01-01T00:00:00Z" }
  ]
}
```

### POST /api/items

Creates a new item.

**Request:**
```json
{
  "name": "New Item"
}
```

**Response:**
```json
{
  "id": "2",
  "name": "New Item",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### DELETE /api/items/:id

Deletes an item by ID.

**Response:** 204 No Content
