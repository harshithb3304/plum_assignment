import { WellnessTip, UserProfile } from "./types";

// Function to clean markdown text for PDF export
const cleanMarkdownText = (text: string): string => {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1") // Remove **bold**
    .replace(/\*(.*?)\*/g, "$1") // Remove *italic*
    .replace(/_{2}(.*?)_{2}/g, "$1") // Remove __bold__
    .replace(/_(.*?)_/g, "$1") // Remove _italic_
    .replace(/`(.*?)`/g, "$1") // Remove `code`
    .replace(/#{1,6}\s*(.*)/g, "$1") // Remove # headers
    .replace(/^\s*[-*+]\s*/gm, "") // Remove bullet points
    .replace(/^\s*\d+\.\s*/gm, "") // Remove numbered lists
    .trim();
};

export async function exportFavoritesToPDF(
  favorites: WellnessTip[],
  userProfile: UserProfile | null
) {
  try {
    // Create a simple HTML content for PDF generation
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>My Wellness Favorites</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #3b82f6;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #1e40af;
              margin: 0;
              font-size: 2.5em;
            }
            .profile-info {
              background: #f8fafc;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 30px;
              border-left: 4px solid #3b82f6;
            }
            .tip {
              margin-bottom: 30px;
              padding: 20px;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              break-inside: avoid;
            }
            .tip-header {
              display: flex;
              align-items: center;
              margin-bottom: 15px;
            }
            .tip-icon {
              font-size: 2em;
              margin-right: 15px;
            }
            .tip-title {
              font-size: 1.4em;
              font-weight: bold;
              color: #1e40af;
              margin: 0;
            }
            .tip-category {
              display: inline-block;
              background: #dbeafe;
              color: #1e40af;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 0.8em;
              font-weight: 500;
              margin-top: 8px;
            }
            .tip-description {
              margin: 15px 0;
              color: #4b5563;
            }
            .tip-explanation {
              background: #f0f9ff;
              padding: 15px;
              border-radius: 6px;
              margin: 15px 0;
              border-left: 3px solid #0ea5e9;
            }
            .tip-steps {
              margin: 15px 0;
            }
            .tip-steps h4 {
              color: #1e40af;
              margin-bottom: 10px;
            }
            .step {
              margin: 8px 0;
              padding-left: 20px;
              position: relative;
            }
            .step::before {
              content: counter(step-counter);
              counter-increment: step-counter;
              position: absolute;
              left: 0;
              top: 0;
              background: #3b82f6;
              color: white;
              width: 18px;
              height: 18px;
              border-radius: 50%;
              font-size: 0.8em;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
            }
            .tips-container {
              counter-reset: step-counter;
            }
            .step-item {
              counter-reset: step-counter;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
              color: #6b7280;
              font-size: 0.9em;
            }
            @media print {
              body { margin: 0; }
              .tip { break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>✨ My Wellness Favorites</h1>
            <p>Personalized wellness tips for your journey</p>
          </div>

          ${
            userProfile
              ? `
            <div class="profile-info">
              <h3>Profile Information</h3>
              <p><strong>Age:</strong> ${userProfile.age} years old</p>
              <p><strong>Gender:</strong> ${userProfile.gender}</p>
              <p><strong>Goals:</strong> ${userProfile.goals.join(", ")}</p>
            </div>
          `
              : ""
          }

          <div class="tips-container">
            ${favorites
              .map(
                (tip, index) => `
              <div class="tip">
                <div class="tip-header">
                  <span class="tip-icon">${tip.icon}</span>
                  <h2 class="tip-title">${tip.title}</h2>
                </div>
                
                <span class="tip-category">${tip.category
                  .replace("-", " ")
                  .split(" ")
                  .map(
                    (word: string) =>
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  )
                  .join(" ")}</span>
                
                <div class="tip-description">
                  ${cleanMarkdownText(tip.shortDescription)}
                </div>

                ${
                  tip.longExplanation
                    ? `
                  <div class="tip-explanation">
                    <h4>Why This Works:</h4>
                    <p>${cleanMarkdownText(tip.longExplanation)}</p>
                  </div>
                `
                    : ""
                }

                ${
                  tip.steps && tip.steps.length > 0
                    ? `
                  <div class="tip-steps step-item">
                    <h4>Step-by-Step Guide:</h4>
                    ${tip.steps
                      .map(
                        (step: string) => `
                      <div class="step">${cleanMarkdownText(step)}</div>
                    `
                      )
                      .join("")}
                  </div>
                `
                    : ""
                }
              </div>
            `
              )
              .join("")}
          </div>

          <div class="footer">
            <p>Generated on ${new Date().toLocaleDateString()} • WellnessAI</p>
            <p>Keep up the great work on your wellness journey! 🌟</p>
          </div>
        </body>
      </html>
    `;

    // Create a new window and print as PDF
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Wait a bit for content to load, then trigger print
      setTimeout(() => {
        printWindow.print();
      }, 500);
    } else {
      // Fallback: create a blob and download
      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `wellness-favorites-${
        new Date().toISOString().split("T")[0]
      }.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error("Failed to export PDF:", error);
    alert("Failed to export PDF. Please try again.");
  }
}
