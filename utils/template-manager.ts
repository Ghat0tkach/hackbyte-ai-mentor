import { zigzagConversionTemplate } from '@/components/dsa-template/templates/zigzag_conversion';
import { longestPalindromicSubstringTemplate } from '@/components/dsa-template/templates/longest_palindromic_substring';
import { containerWithMostWaterTemplate } from '@/components/dsa-template/templates/container_with_most_water';

export const getTemplate = (questionTitle: string): string => {
  // Clean up the question title to match exactly
  const cleanTitle = questionTitle.trim();
  
  const templateMap: { [key: string]: string } = {
    'Zigzag Conversion': zigzagConversionTemplate,
    'Longest Palindromic Substring': longestPalindromicSubstringTemplate,
    'Container With Most Water': containerWithMostWaterTemplate
  };

  const template = templateMap[cleanTitle];
  if (!template) {
    console.error(`No template found for question: ${cleanTitle}`);
    return '';
  }
  
  return template;
};