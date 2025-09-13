const { readCSV, writeCSV, initializeCSV, generateId, cleanupCSVFiles } = require('./utils/csv-utils');

// Define all models based on the Prisma schema
const MODELS = [
  {
    name: 'users',
    fields: ['id', 'email', 'name', 'emailVerified', 'image', 'avatar', 'password', 'role', 'createdAt', 'updatedAt']
  },
  {
    name: 'listings',
    fields: ['id', 'title', 'description', 'price', 'location', 'images', 'features', 'ownerId', 'createdAt', 'updatedAt']
  },
  {
    name: 'bookings',
    fields: ['id', 'listingId', 'userId', 'startDate', 'endDate', 'totalPrice', 'status', 'createdAt', 'updatedAt']
  },
  {
    name: 'messages',
    fields: ['id', 'content', 'senderId', 'receiverId', 'roomId', 'listingId', 'read', 'createdAt', 'updatedAt']
  },
  {
    name: 'chatrooms',
    fields: ['id', 'listingId', 'customerId', 'ownerId', 'createdAt', 'updatedAt']
  },
  {
    name: 'reviews',
    fields: ['id', 'listingId', 'userId', 'rating', 'comment', 'createdAt', 'updatedAt']
  },
  {
    name: 'wishlist',
    fields: ['id', 'userId', 'listingId', 'createdAt']
  },
  {
    name: 'transactions',
    fields: ['id', 'bookingId', 'userId', 'amount', 'currency', 'paymentMethod', 'status', 'createdAt', 'updatedAt']
  },
  {
    name: 'accounts',
    fields: ['id', 'userId', 'type', 'provider', 'providerAccountId', 'refresh_token', 'access_token', 'expires_at', 'token_type', 'scope', 'id_token', 'session_state']
  },
  {
    name: 'sessions',
    fields: ['id', 'sessionToken', 'userId', 'expires']
  },
  {
    name: 'verificationtokens',
    fields: ['identifier', 'token', 'expires']
  },
  {
    name: 'aifeedback',
    fields: ['id', 'userId', 'messageId', 'rating', 'comment', 'createdAt']
  },
  {
    name: 'aiinteractions',
    fields: ['id', 'userId', 'userInput', 'aiResponse', 'actionTaken', 'createdAt']
  },
  {
    name: 'abtests',
    fields: ['id', 'testName', 'variants', 'durationDays', 'metrics', 'startDate', 'endDate', 'status', 'createdAt', 'updatedAt']
  },
  {
    name: 'abtestresults',
    fields: ['id', 'testId', 'variantName', 'metricName', 'value', 'createdAt', 'userId']
  },
  {
    name: 'reinforcementlearningrecords',
    fields: ['id', 'updates', 'timestamp', 'createdAt', 'updatedAt']
  },
  {
    name: 'activelearningrecords',
    fields: ['id', 'userId', 'results', 'timestamp', 'createdAt', 'updatedAt']
  },
  {
    name: 'userbehavioranalytics',
    fields: ['id', 'userId', 'analyticsData', 'timestamp', 'createdAt', 'updatedAt']
  },
  {
    name: 'userpreferences',
    fields: ['id', 'userId', 'preferredCategories', 'preferredPriceRangeMin', 'preferredPriceRangeMax', 'preferredLocations', 'engagementLevel', 'preferredBookingDays', 'preferredBookingHours', 'createdAt', 'updatedAt']
  },
  {
    name: 'usertiers',
    fields: ['id', 'userId', 'tier', 'points', 'totalListingsRented', 'totalListingsOwned', 'totalSuccessfulRentals', 'createdAt', 'updatedAt']
  },
  {
    name: 'userbadges',
    fields: ['id', 'userId', 'badgeType', 'purchaseId', 'expiresAt', 'createdAt']
  },
  {
    name: 'vouchers',
    fields: ['id', 'userId', 'voucherType', 'code', 'discount', 'expiresAt', 'used', 'usedAt', 'createdAt']
  },
  {
    name: 'purchases',
    fields: ['id', 'userId', 'itemType', 'itemId', 'amount', 'currency', 'status', 'createdAt']
  },
  {
    name: 'commissionrates',
    fields: ['id', 'durationType', 'rate', 'createdAt', 'updatedAt']
  },
  {
    name: 'personalitytraits',
    fields: ['id', 'userId', 'traitName', 'traitValue', 'interactions', 'lastUpdated', 'createdAt', 'updatedAt']
  },
  {
    name: 'personalitydevelopment',
    fields: ['id', 'userId', 'traitName', 'oldValue', 'newValue', 'reason', 'interactionId', 'createdAt']
  }
];

class CSVDatabaseService {
  /**
   * Initialize all CSV files with proper headers
   */
  async initialize() {
    console.log('Initializing CSV database');
    
    try {
      // Initialize each model
      for (const model of MODELS) {
        initializeCSV(`${model.name}.csv`, model.fields);
      }
      
      console.log('CSV database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize CSV database:', error);
      throw error;
    }
  }

  /**
   * Cleanup all CSV files
   */
  async cleanup() {
    console.log('Cleaning up CSV database');
    
    try {
      cleanupCSVFiles();
      console.log('CSV database cleaned up successfully');
    } catch (error) {
      console.error('Failed to cleanup CSV database:', error);
      throw error;
    }
  }

  /**
   * Create a new record
   * @param model The model name
   * @param data The data to create
   * @returns The created record
   */
  async create(model, data) {
    const filename = `${model}.csv`;
    const records = await readCSV(filename);
    
    // Add ID and timestamps if not provided
    const newData = { ...data };
    
    if (!newData.id) {
      newData.id = generateId();
    }
    
    const now = new Date().toISOString();
    if (!newData.createdAt) {
      newData.createdAt = now;
    }
    if (!newData.updatedAt) {
      newData.updatedAt = now;
    }
    
    // Serialize complex data types to JSON strings
    const serializedData = {};
    for (const [key, value] of Object.entries(newData)) {
      if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
        serializedData[key] = JSON.stringify(value);
      } else if (value instanceof Date) {
        serializedData[key] = value.toISOString();
      } else {
        serializedData[key] = value;
      }
    }
    
    records.push(serializedData);
    await writeCSV(filename, records);
    
    // Deserialize the returned data
    const deserializedData = {};
    for (const [key, value] of Object.entries(serializedData)) {
      if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
        try {
          deserializedData[key] = JSON.parse(value);
        } catch {
          deserializedData[key] = value;
        }
      } else {
        deserializedData[key] = value;
      }
    }
    
    return deserializedData;
  }

  /**
   * Find multiple records
   * @param model The model name
   * @param where Optional filter criteria
   * @returns Array of matching records
   */
  async findMany(model, where) {
    const filename = `${model}.csv`;
    let records = await readCSV(filename);
    
    // Apply filters if provided
    if (where) {
      records = records.filter(record => {
        for (const [key, value] of Object.entries(where)) {
          if (record[key] !== value) {
            return false;
          }
        }
        return true;
      });
    }
    
    return records;
  }

  /**
   * Find a unique record
   * @param model The model name
   * @param where Filter criteria (should uniquely identify a record)
   * @returns The matching record or null
   */
  async findUnique(model, where) {
    const filename = `${model}.csv`;
    const records = await readCSV(filename);
    
    const record = records.find(record => {
      for (const [key, value] of Object.entries(where)) {
        if (record[key] !== value) {
          return false;
        }
      }
      return true;
    });
    
    return record || null;
  }

  /**
   * Update a record
   * @param model The model name
   * @param where Filter criteria to find the record
   * @param data The data to update
   * @returns The updated record
   */
  async update(model, where, data) {
    const filename = `${model}.csv`;
    const records = await readCSV(filename);
    
    const index = records.findIndex(record => {
      for (const [key, value] of Object.entries(where)) {
        if (record[key] !== value) {
          return false;
        }
      }
      return true;
    });
    
    if (index === -1) {
      throw new Error(`Record not found for update in ${model}`);
    }
    
    // Update the record
    const updatedRecord = { ...records[index], ...data, updatedAt: new Date().toISOString() };
    
    // Serialize complex data types
    const serializedData = {};
    for (const [key, value] of Object.entries(updatedRecord)) {
      if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
        serializedData[key] = JSON.stringify(value);
      } else if (value instanceof Date) {
        serializedData[key] = value.toISOString();
      } else {
        serializedData[key] = value;
      }
    }
    
    records[index] = serializedData;
    await writeCSV(filename, records);
    
    // Deserialize the returned data
    const deserializedData = {};
    for (const [key, value] of Object.entries(serializedData)) {
      if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
        try {
          deserializedData[key] = JSON.parse(value);
        } catch {
          deserializedData[key] = value;
        }
      } else {
        deserializedData[key] = value;
      }
    }
    
    return deserializedData;
  }

  /**
   * Delete a record
   * @param model The model name
   * @param where Filter criteria to find the record
   * @returns The deleted record
   */
  async delete(model, where) {
    const filename = `${model}.csv`;
    const records = await readCSV(filename);
    
    const index = records.findIndex(record => {
      for (const [key, value] of Object.entries(where)) {
        if (record[key] !== value) {
          return false;
        }
      }
      return true;
    });
    
    if (index === -1) {
      throw new Error(`Record not found for delete in ${model}`);
    }
    
    const deletedRecord = records[index];
    records.splice(index, 1);
    await writeCSV(filename, records);
    
    return deletedRecord;
  }

  /**
   * Count records
   * @param model The model name
   * @param where Optional filter criteria
   * @returns The count of matching records
   */
  async count(model, where) {
    const filename = `${model}.csv`;
    let records = await readCSV(filename);
    
    // Apply filters if provided
    if (where) {
      records = records.filter(record => {
        for (const [key, value] of Object.entries(where)) {
          if (record[key] !== value) {
            return false;
          }
        }
        return true;
      });
    }
    
    return records.length;
  }
}

// Export singleton instance
module.exports = { CSVDatabaseService, csvDatabaseService: new CSVDatabaseService() };