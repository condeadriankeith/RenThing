#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load the Prisma config
const configPath = path.join(__dirname, '..', 'prisma', 'config.js');
const config = require(configPath);

// Get the database configuration
const dbConfig = config.getDatabaseConfig();

// Read the base schema template
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
let schemaContent = fs.readFileSync(schemaPath, 'utf8');

// Replace the datasource block with dynamic configuration
const datasourceBlock = `datasource db {
  provider = "${dbConfig.provider}"
  url      = "${dbConfig.url}"
}`;

schemaContent = schemaContent.replace(/datasource db \{[\s\S]*?\}/, datasourceBlock);

// Write the updated schema
fs.writeFileSync(schemaPath, schemaContent);

console.log('✅ Schema generated successfully!');
console.log(`📍 Provider: ${dbConfig.provider}`);
console.log(`🔗 URL: ${dbConfig.url}`);
