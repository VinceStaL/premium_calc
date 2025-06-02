const fs = require('fs');
const path = require('path');

// Update the dataService.js file to use the business files
function updateDataPath() {
  const dataServicePath = path.join(__dirname, 'dataService.js');
  
  try {
    // Read the current file
    let content = fs.readFileSync(dataServicePath, 'utf8');
    
    // Replace the path to the data files
    const oldPath = "const filePath = path.join(__dirname, 'data', `${table}.xlsx`);";
    const newPath = "const filePath = path.join(__dirname, '..', 'data_files', `${table}.xlsx`);";
    
    content = content.replace(oldPath, newPath);
    
    // Write the updated content back to the file
    fs.writeFileSync(dataServicePath, content, 'utf8');
    
    console.log('Successfully updated dataService.js to use business files');
  } catch (error) {
    console.error('Error updating dataService.js:', error);
  }
}

updateDataPath();