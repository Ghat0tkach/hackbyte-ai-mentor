const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
import * as cheerio from 'cheerio';

export async function searchCompanyInfo(companyName: string, additionalInfo: string) {
  try {
    // First, search for relevant URLs
    const searchUrl = "https://api.tavily.com/search";
    const searchParams = {
      api_key: TAVILY_API_KEY,
      query: `${companyName} company DEV medium blogs on interview experience ${additionalInfo}`,
      include_answer: true,
      include_raw_content: true, 
      max_results: 10
    };

    const response = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(searchParams)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error in search! Status: ${response.status}`);
    }
    
    const searchResults = await response.json();
    
    // Extract URLs from search results
    if (!searchResults.results || searchResults.results.length === 0) {
      console.log(`No search results found for ${companyName}`);
      return { results: [] };
    }
    
    // Process each URL with our own scraper
    const extractedResults = [];
    
    for (const result of searchResults.results) {
      try {
        // Try to fetch the page content directly
        const pageResponse = await fetch(result.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
          }
        });
        
        if (pageResponse.ok) {
          const html = await pageResponse.text();
          const $ = cheerio.load(html);
          
          // Remove script and style elements
          $('script, style, nav, header, footer, iframe, .ads, .comments').remove();
          
          // Extract the main content
          let content = '';
          
          // For Medium articles
          if (result.url.includes('medium.com') || result.url.includes('freedium')) {
            content = $('article').text() || $('main').text() || $('body').text();
          } 
          // For Dev.to articles
          else if (result.url.includes('dev.to')) {
            content = $('.article-body').text() || $('article').text() || $('main').text();
          }
          // For other sites, try common content containers
          else {
            content = $('article').text() || $('main').text() || $('.content').text() || $('body').text();
          }
          
          // Clean up the content
          content = content.replace(/\s+/g, ' ').trim();
          console.log("content:", content);
          
          if (content.length > 100) { // Only add if we got meaningful content
            extractedResults.push({
              title: result.title || "No title",
              url: result.url,
              content: content,
              score: result.score || 1.0
            });
          } else {
            // Fallback to the snippet from search results
            extractedResults.push({
              title: result.title || "No title",
              url: result.url,
              content: result.content || "No content available",
              score: result.score || 1.0
            });
          }
        } else {
          console.warn(`Failed to fetch content from ${result.url}: ${pageResponse.status}`);
          // Fallback to the snippet from search results
          extractedResults.push({
            title: result.title || "No title",
            url: result.url,
            content: result.content || "No content available",
            score: result.score || 1.0
          });
        }
      } catch (scrapeError) {
        console.warn(`Error scraping from ${result.url}:`, scrapeError);
        // Fallback to the snippet from search results
        extractedResults.push({
          title: result.title || "No title",
          url: result.url,
          content: result.content || "No content available",
          score: result.score || 1.0
        });
      }
    }
    
    return { 
      results: extractedResults,
      query: searchResults.query
    };
  } catch (error) {
    console.error("Error searching with Tavily:", error);
    throw new Error(`Failed to search for company information: ${error instanceof Error ? error.message : String(error)}`);
  }
}