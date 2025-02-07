
export function cleanJsonResponse(text: string): string {
  let cleanedText = text
    .replace(/```json\s*|\s*```/g, '') // Remove markdown
    .replace(/^[\s\n]*{/, '{')        // Clean leading whitespace
    .trim()
  
  // Count expected days and meals
  const daysMatch = cleanedText.match(/\"day\"\s*:\s*\"[^\"]+\"/g) || []
  const expectedDays = 7
  const currentDays = daysMatch.length

  // If we have incomplete days, try to fix the JSON structure
  if (currentDays < expectedDays) {
    console.log(`Found ${currentDays} days, expecting ${expectedDays}. JSON appears to be truncated.`)
    
    // Check if we have a partially complete day
    const lastCompleteIndex = cleanedText.lastIndexOf('      }')
    if (lastCompleteIndex !== -1) {
      cleanedText = cleanedText.substring(0, lastCompleteIndex + 7)
      
      // Count open/close brackets and braces
      const openBraces = (cleanedText.match(/{/g) || []).length
      const closeBraces = (cleanedText.match(/}/g) || []).length
      const openBrackets = (cleanedText.match(/\[/g) || []).length
      const closeBrackets = (cleanedText.match(/\]/g) || []).length
      
      // Add missing closing brackets for meals array if needed
      if (openBrackets > closeBrackets) {
        cleanedText += '\n      ]'
      }
      
      // Add missing closing braces for day object if needed
      if (openBraces > closeBraces) {
        cleanedText += '\n    }'
      }
      
      // Close the days array and root object
      cleanedText += '\n  ]\n}'
      
      // If we still don't have enough days, throw an error
      // This will trigger a retry in the main function
      const finalDaysMatch = cleanedText.match(/\"day\"\s*:\s*\"[^\"]+\"/g) || []
      if (finalDaysMatch.length < expectedDays) {
        throw new Error(`Expected ${expectedDays} days, got ${finalDaysMatch.length}`)
      }
    }
  }

  // Validate the cleaned JSON structure
  try {
    JSON.parse(cleanedText)
  } catch (error) {
    console.error('Failed to parse cleaned JSON:', error)
    console.error('Cleaned text that failed parsing:', cleanedText)
    throw error
  }

  return cleanedText
}
