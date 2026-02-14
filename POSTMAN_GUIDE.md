# API Testing with Postman

This directory contains a Postman collection for testing the Per Diem Restaurant Menu API endpoints.

## Quick Start

### Option 1: Import into Postman Desktop/Web

1. Open Postman (Desktop app or web version at https://www.postman.com)
2. Click "Import" button in the top left
3. Select the `postman_collection.json` file
4. The collection will be imported with all endpoints and example responses

### Option 2: Use with Newman (CLI)

Install Newman globally:
```bash
npm install -g newman
```

Run the collection:
```bash
newman run postman_collection.json
```

## Collection Variables

The collection includes two variables that you can customize:

- **baseUrl**: The base URL for the API (default: `http://localhost:3000`)
- **locationId**: A Square location ID to test location-specific endpoints (default: `REPLACE_WITH_ACTUAL_LOCATION_ID`)

### How to Set Variables in Postman

1. Click on the collection name
2. Go to the "Variables" tab
3. Update the "Current Value" for each variable
4. Click "Save"

## Available Endpoints

### 1. Health Check
- **Method**: GET
- **URL**: `/api/health`
- **Description**: Verify the API server is running
- **Expected Response**: 200 OK with health status

### 2. Get All Locations
- **Method**: GET
- **URL**: `/api/locations`
- **Description**: Fetch all active locations from Square
- **Expected Response**: Array of location objects
- **Use Case**: Call this first to get a valid location ID for other endpoints

### 3. Get Catalog Items by Location
- **Method**: GET
- **URL**: `/api/catalog?locationId={{locationId}}`
- **Description**: Get all menu items grouped by category for a specific location
- **Query Parameters**:
  - `locationId` (required): The Square location ID
- **Expected Response**: Object with categories as keys and arrays of menu items as values

### 4. Get Categories by Location
- **Method**: GET
- **URL**: `/api/catalog/categories?locationId={{locationId}}`
- **Description**: Get all categories with item counts for a specific location
- **Query Parameters**:
  - `locationId` (required): The Square location ID
- **Expected Response**: Array of category objects with item counts

## Testing Workflow

### Recommended Testing Order:

1. **Start the application**:
   ```bash
   # From project root
   npm run docker:up
   ```

2. **Test Health Check**:
   - Ensures the backend is running properly

3. **Get All Locations**:
   - Call this endpoint first
   - Copy a location ID from the response
   - Update the `locationId` variable in the collection

4. **Get Categories**:
   - Test with the location ID you obtained
   - Verify you get a list of categories with item counts

5. **Get Catalog Items**:
   - Test with the same location ID
   - Verify you get menu items grouped by category

## Example Response Formats

### Locations Response
```json
[
  {
    "id": "LQHK3ZTFVPC0M",
    "name": "Main Street Cafe",
    "address": "123 Main St, San Francisco, CA, 94102",
    "timezone": "America/Los_Angeles",
    "status": "ACTIVE"
  }
]
```

### Categories Response
```json
[
  {
    "id": "appetizers",
    "name": "Appetizers",
    "item_count": 5
  },
  {
    "id": "main-course",
    "name": "Main Course",
    "item_count": 8
  }
]
```

### Catalog Response
```json
{
  "Appetizers": [
    {
      "id": "ITEM_ID",
      "name": "Spring Rolls",
      "description": "Fresh vegetable spring rolls",
      "category": "Appetizers",
      "image_url": null,
      "variations": [
        {
          "name": "Regular",
          "price": 850
        }
      ]
    }
  ]
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Location ID is required"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to fetch locations from Square API"
}
```

## Tips for Testing

1. **Check Logs**: Monitor backend logs with `docker logs -f full-stack-backend-1`
2. **Verify Environment**: Ensure `SQUARE_ACCESS_TOKEN` is set in `.env` file
3. **Rate Limits**: Square Sandbox has rate limits, wait between rapid requests if needed
4. **Cache Behavior**: Results are cached (locations: 10min, catalog: 5min)
5. **Test with Real Data**: Use the Square Sandbox Dashboard to create test catalog items

## Troubleshooting

### Issue: "Location ID is required" error
**Solution**: Make sure you're passing the `locationId` query parameter

### Issue: No locations returned
**Solution**: 
- Verify Square access token is correct in `.env`
- Check if you have active locations in your Square Sandbox account
- Visit https://developer.squareup.com/console to manage test locations

### Issue: Empty catalog
**Solution**:
- Add catalog items in Square Sandbox Dashboard
- Ensure items are marked as "Present at all locations" or assigned to specific locations
- Check backend logs for Square API errors

## Additional Resources

- [Postman Documentation](https://learning.postman.com/docs/getting-started/introduction/)
- [Square API Documentation](https://developer.squareup.com/docs)
- [Newman CLI Documentation](https://learning.postman.com/docs/running-collections/using-newman-cli/command-line-integration-with-newman/)
