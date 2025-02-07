
export function cleanJsonResponse(text: string): string {
  let cleanedText = text
    .replace(/```json\s*|\s*```/g, '') // Remove markdown
    .replace(/^[\s\n]*{/, '{')        // Clean leading whitespace
    .trim()
  
  // If the JSON is truncated, try to fix it by adding missing closing brackets
  if (!cleanedText.endsWith('}')) {
    const openBraces = (cleanedText.match(/{/g) || []).length
    const closeBraces = (cleanedText.match(/}/g) || []).length
    const missingBraces = openBraces - closeBraces
    
    if (missingBraces > 0) {
      cleanedText = cleanedText.replace(/[^}]*$/, '') // Remove truncated content
      cleanedText += '}'.repeat(missingBraces) // Add missing closing braces
    }
  }
  
  return cleanedText
}
