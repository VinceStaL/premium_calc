const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Paths to the two ProductRateMaster files
const currentFilePath = path.join(__dirname, 'data', 'ProductRateMaster.xlsx');
const originalFilePath = path.join(__dirname, 'data_org', 'ProductRateMaster.xlsx');

// Function to read Excel file and return structured data
function readProductRateMaster(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return { error: `File does not exist: ${filePath}` };
    }
    
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON with header row
    const data = XLSX.utils.sheet_to_json(worksheet);
    const headers = Object.keys(data[0] || {});
    
    return { 
      data, 
      headers, 
      rowCount: data.length,
      sheetName,
      filePath 
    };
  } catch (error) {
    return { error: `Error reading file ${filePath}: ${error.message}` };
  }
}

// Function to compare headers/structure
function compareStructure(currentFile, originalFile) {
  console.log('\n=== STRUCTURE COMPARISON ===');
  
  if (currentFile.error || originalFile.error) {
    console.log('Error in file reading - cannot compare structure');
    return;
  }
  
  console.log(`Current file (${path.basename(currentFile.filePath)}):`);
  console.log(`  - Sheet: ${currentFile.sheetName}`);
  console.log(`  - Columns: ${currentFile.headers.length}`);
  console.log(`  - Rows: ${currentFile.rowCount}`);
  console.log(`  - Headers: ${currentFile.headers.join(', ')}`);
  
  console.log(`\nOriginal file (${path.basename(originalFile.filePath)}):`);
  console.log(`  - Sheet: ${originalFile.sheetName}`);
  console.log(`  - Columns: ${originalFile.headers.length}`);
  console.log(`  - Rows: ${originalFile.rowCount}`);
  console.log(`  - Headers: ${originalFile.headers.join(', ')}`);
  
  // Find differences in headers
  const missingInCurrent = originalFile.headers.filter(h => !currentFile.headers.includes(h));
  const missingInOriginal = currentFile.headers.filter(h => !originalFile.headers.includes(h));
  
  if (missingInCurrent.length > 0) {
    console.log(`\n❌ Columns in ORIGINAL but missing in CURRENT: ${missingInCurrent.join(', ')}`);
  }
  
  if (missingInOriginal.length > 0) {
    console.log(`\n❌ Columns in CURRENT but missing in ORIGINAL: ${missingInOriginal.join(', ')}`);
  }
  
  if (missingInCurrent.length === 0 && missingInOriginal.length === 0) {
    console.log('\n✅ Column structures are identical');
  }
  
  // Row count comparison
  const rowDifference = currentFile.rowCount - originalFile.rowCount;
  if (rowDifference > 0) {
    console.log(`\n📊 Current file has ${rowDifference} more rows than original`);
  } else if (rowDifference < 0) {
    console.log(`\n📊 Current file has ${Math.abs(rowDifference)} fewer rows than original`);
  } else {
    console.log('\n✅ Both files have the same number of rows');
  }
}

// Function to validate required columns for ProductRateMaster
function validateRequiredColumns(fileData, fileName) {
  const requiredColumns = [
    'ProductCode', 'StateCode', 'RateCode', 'DateOn', 'DateOff', 
    'BaseRate', 'LHCApplicable', 'RebateApplicable'
  ];
  
  console.log(`\n=== VALIDATION: ${fileName} ===`);
  
  if (fileData.error) {
    console.log(`❌ Cannot validate - file error: ${fileData.error}`);
    return false;
  }
  
  const missingRequired = requiredColumns.filter(col => !fileData.headers.includes(col));
  
  if (missingRequired.length > 0) {
    console.log(`❌ Missing required columns: ${missingRequired.join(', ')}`);
    return false;
  } else {
    console.log('✅ All required columns are present');
    return true;
  }
}

// Function to compare data content
function compareDataContent(currentFile, originalFile) {
  console.log('\n=== DATA CONTENT COMPARISON ===');
  
  if (currentFile.error || originalFile.error) {
    console.log('Error in file reading - cannot compare data content');
    return;
  }
  
  // Create maps for easier comparison (using ProductCode + StateCode + RateCode as key)
  const createRecordKey = (record) => {
    return `${record.ProductCode || ''}_${record.StateCode || ''}_${record.RateCode || ''}`;
  };
  
  const currentMap = new Map();
  const originalMap = new Map();
  
  currentFile.data.forEach((record, index) => {
    const key = createRecordKey(record);
    currentMap.set(key, { ...record, _rowIndex: index + 2 }); // +2 for Excel row (header + 0-based)
  });
  
  originalFile.data.forEach((record, index) => {
    const key = createRecordKey(record);
    originalMap.set(key, { ...record, _rowIndex: index + 2 });
  });
  
  // Find records only in current file
  const onlyInCurrent = [];
  currentMap.forEach((record, key) => {
    if (!originalMap.has(key)) {
      onlyInCurrent.push({ key, record });
    }
  });
  
  // Find records only in original file
  const onlyInOriginal = [];
  originalMap.forEach((record, key) => {
    if (!currentMap.has(key)) {
      onlyInOriginal.push({ key, record });
    }
  });
  
  // Find modified records
  const modifiedRecords = [];
  currentMap.forEach((currentRecord, key) => {
    const originalRecord = originalMap.get(key);
    if (originalRecord) {
      const differences = [];
      Object.keys(currentRecord).forEach(field => {
        if (field !== '_rowIndex' && currentRecord[field] !== originalRecord[field]) {
          differences.push({
            field,
            current: currentRecord[field],
            original: originalRecord[field]
          });
        }
      });
      
      if (differences.length > 0) {
        modifiedRecords.push({
          key,
          currentRow: currentRecord._rowIndex,
          originalRow: originalRecord._rowIndex,
          differences
        });
      }
    }
  });
  
  // Report findings
  console.log(`\n📊 Records only in CURRENT file: ${onlyInCurrent.length}`);
  if (onlyInCurrent.length > 0 && onlyInCurrent.length <= 10) {
    onlyInCurrent.forEach(item => {
      console.log(`  - Row ${item.record._rowIndex}: ${item.key}`);
    });
  } else if (onlyInCurrent.length > 10) {
    console.log(`  (Showing first 10 of ${onlyInCurrent.length})`);
    onlyInCurrent.slice(0, 10).forEach(item => {
      console.log(`  - Row ${item.record._rowIndex}: ${item.key}`);
    });
  }
  
  console.log(`\n📊 Records only in ORIGINAL file: ${onlyInOriginal.length}`);
  if (onlyInOriginal.length > 0 && onlyInOriginal.length <= 10) {
    onlyInOriginal.forEach(item => {
      console.log(`  - Row ${item.record._rowIndex}: ${item.key}`);
    });
  } else if (onlyInOriginal.length > 10) {
    console.log(`  (Showing first 10 of ${onlyInOriginal.length})`);
    onlyInOriginal.slice(0, 10).forEach(item => {
      console.log(`  - Row ${item.record._rowIndex}: ${item.key}`);
    });
  }
  
  console.log(`\n📊 Modified records: ${modifiedRecords.length}`);
  if (modifiedRecords.length > 0 && modifiedRecords.length <= 5) {
    modifiedRecords.forEach(item => {
      console.log(`  - ${item.key} (Current row ${item.currentRow}, Original row ${item.originalRow}):`);
      item.differences.forEach(diff => {
        console.log(`    * ${diff.field}: "${diff.current}" ← "${diff.original}"`);
      });
    });
  } else if (modifiedRecords.length > 5) {
    console.log(`  (Showing first 5 of ${modifiedRecords.length})`);
    modifiedRecords.slice(0, 5).forEach(item => {
      console.log(`  - ${item.key} (Current row ${item.currentRow}, Original row ${item.originalRow}):`);
      item.differences.forEach(diff => {
        console.log(`    * ${diff.field}: "${diff.current}" ← "${diff.original}"`);
      });
    });
  }
  
  return {
    onlyInCurrent: onlyInCurrent.length,
    onlyInOriginal: onlyInOriginal.length,
    modified: modifiedRecords.length,
    identical: currentMap.size - onlyInCurrent.length - modifiedRecords.length
  };
}

// Function to generate summary
function generateSummary(currentFile, originalFile, dataComparison) {
  console.log('\n=== SUMMARY ===');
  
  if (currentFile.error) {
    console.log(`❌ Current file error: ${currentFile.error}`);
  }
  
  if (originalFile.error) {
    console.log(`❌ Original file error: ${originalFile.error}`);
  }
  
  if (!currentFile.error && !originalFile.error) {
    const structuralChanges = 
      currentFile.headers.length !== originalFile.headers.length ||
      !currentFile.headers.every(h => originalFile.headers.includes(h)) ||
      !originalFile.headers.every(h => currentFile.headers.includes(h));
    
    console.log(`📁 Files compared: ${path.basename(currentFile.filePath)} vs ${path.basename(originalFile.filePath)}`);
    console.log(`📊 Structural changes: ${structuralChanges ? '❌ Yes' : '✅ No'}`);
    console.log(`📊 Row count changes: ${currentFile.rowCount !== originalFile.rowCount ? '❌ Yes' : '✅ No'}`);
    
    if (dataComparison) {
      console.log(`📊 Data changes summary:`);
      console.log(`  - Identical records: ${dataComparison.identical}`);
      console.log(`  - Modified records: ${dataComparison.modified}`);
      console.log(`  - New records (in current): ${dataComparison.onlyInCurrent}`);
      console.log(`  - Removed records (from original): ${dataComparison.onlyInOriginal}`);
      
      const totalChanges = dataComparison.modified + dataComparison.onlyInCurrent + dataComparison.onlyInOriginal;
      console.log(`  - Total changes: ${totalChanges}`);
      
      if (totalChanges === 0) {
        console.log('✅ Files are identical in content');
      } else {
        console.log(`❌ Files have ${totalChanges} differences`);
      }
    }
  }
}

// Main comparison function
function compareProductRateMasterFiles() {
  console.log('🔍 COMPARING PRODUCTRATMASTER.XLSX FILES');
  console.log('==========================================');
  
  // Read both files
  const currentFile = readProductRateMaster(currentFilePath);
  const originalFile = readProductRateMaster(originalFilePath);
  
  // Compare structure
  compareStructure(currentFile, originalFile);
  
  // Validate required columns
  validateRequiredColumns(currentFile, 'CURRENT FILE');
  validateRequiredColumns(originalFile, 'ORIGINAL FILE');
  
  // Compare data content
  const dataComparison = compareDataContent(currentFile, originalFile);
  
  // Generate summary
  generateSummary(currentFile, originalFile, dataComparison);
  
  console.log('\n==========================================');
  console.log('🏁 COMPARISON COMPLETE');
}

// Run the comparison
if (require.main === module) {
  compareProductRateMasterFiles();
}

module.exports = { compareProductRateMasterFiles };
