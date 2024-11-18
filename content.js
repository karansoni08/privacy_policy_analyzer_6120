// Function to create and display the modal on the webpage
function createPrivacyAnalyzerModal() {
  // Check if the modal has already been shown in this session
  if (sessionStorage.getItem("privacyAnalyzerShown")) {
    return; // If the modal has been shown, do not display it again
  }

  // Set a flag in sessionStorage to indicate that the modal has been shown
  sessionStorage.setItem("privacyAnalyzerShown", "true");

  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.zIndex = "10000";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";

  const modal = document.createElement("div");
  modal.style.backgroundColor = "#ffffff";
  modal.style.borderRadius = "10px";
  modal.style.padding = "20px";
  modal.style.width = "400px";
  modal.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.2)";
  modal.style.textAlign = "center"; // Center text in the modal
  modal.style.overflowY = "auto";
  modal.style.maxHeight = "80vh";

  const title = document.createElement("h2");
  title.textContent = "Privacy Analyzer";
  title.style.marginBottom = "10px";
  title.style.fontSize = "1.5rem";
  title.style.color = "#2c3e50";
  modal.appendChild(title);

  // Function to create star rating display
  function createStarRating(rating) {
    const starContainer = document.createElement("div");
    starContainer.style.display = "flex";
    starContainer.style.justifyContent = "center"; // Center the stars horizontally
    starContainer.style.marginBottom = "15px"; // Add space below the stars

    for (let i = 1; i <= 5; i++) {
      const star = document.createElement("span");
      star.style.fontSize = "24px";
      star.style.marginRight = "5px";
      star.style.color = "#e0e0e0"; // Gray color for empty stars by default

      if (i <= Math.floor(rating)) {
        // Full star
        star.textContent = "★";
        star.style.color = "#f1c40f"; // Gold color for full stars
      } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
        // Half star
        star.textContent = "★";
        star.style.color = "#f1c40f"; // Gold color for half stars
        star.style.clipPath = "polygon(0 0, 50% 0, 50% 100%, 0 100%)"; // Clip the star to show half
        star.style.webkitClipPath = "polygon(0 0, 50% 0, 50% 100%, 0 100%)"; // For compatibility with WebKit
      } else {
        // Empty star
        star.textContent = "★";
      }

      starContainer.appendChild(star);
    }

    return starContainer;
  }

  // Placeholder for the star rating
  const starRatingPlaceholder = document.createElement("div");
  modal.appendChild(starRatingPlaceholder); // Append the star rating placeholder to the modal

  const contentBox = document.createElement("div");
  contentBox.style.color = "#555";
  contentBox.style.fontSize = "1rem";
  contentBox.style.lineHeight = "1.6";
  contentBox.style.marginBottom = "20px";
  contentBox.textContent = "Analyzing privacy policy...";
  modal.appendChild(contentBox);

  const analyzeButton = document.createElement("button");
  analyzeButton.textContent = "Analyze";
  analyzeButton.style.backgroundColor = "#3498db";
  analyzeButton.style.color = "#fff";
  analyzeButton.style.border = "none";
  analyzeButton.style.padding = "10px 20px";
  analyzeButton.style.borderRadius = "5px";
  analyzeButton.style.cursor = "pointer";
  analyzeButton.style.marginBottom = "15px"; // Add space below the button
  analyzeButton.onclick = async () => {
    contentBox.textContent = "Analyzing... Please wait.";

    try {
      const policyText = document.body.innerText; // Simplified policy text extraction
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ policy_text: policyText })
      });

      const data = await response.json();
      if (data.error) {
        contentBox.textContent = `Error: ${data.error}`;
      } else {
        // Create the star rating based on the overall rating
        const overallRating = data.final_rating.rating;
        const starRating = createStarRating(overallRating);
        starRatingPlaceholder.innerHTML = ""; // Clear any existing stars
        starRatingPlaceholder.appendChild(starRating); // Append the new star rating

        let formattedContent = `<strong>Final Rating:</strong> ${overallRating} out of 5<br>${data.final_rating.explanation}`;
        formattedContent += "<ul>";
        data.ratings.forEach(item => {
          formattedContent += `<li><strong>${item.parameter}:</strong> ${item.rating} out of 5<br>${item.explanation}</li>`;
        });
        formattedContent += "</ul>";
        contentBox.innerHTML = formattedContent;

        // Show the navigation buttons after the analysis is complete
        buttonContainer.style.display = "flex";
      }
    } catch (error) {
      contentBox.textContent = `Error: ${error.message}`;
    }
  };
  modal.appendChild(analyzeButton);

  // Create a container for the navigation buttons
  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "none"; // Hidden by default
  buttonContainer.style.marginTop = "20px";
  buttonContainer.style.display = "flex";
  buttonContainer.style.justifyContent = "space-between";

  // "Proceed to Website" button
  const proceedButton = document.createElement("button");
  proceedButton.textContent = "Proceed to Website";
  proceedButton.style.backgroundColor = "#27ae60";
  proceedButton.style.color = "#fff";
  proceedButton.style.border = "none";
  proceedButton.style.padding = "10px 20px";
  proceedButton.style.borderRadius = "5px";
  proceedButton.style.cursor = "pointer";
  proceedButton.style.marginRight = "10px";
  proceedButton.onclick = () => {
    overlay.remove(); // Close the modal and allow the user to browse the website
  };
  buttonContainer.appendChild(proceedButton);

  // "Go to Chrome Home" button
  const goHomeButton = document.createElement("button");
  goHomeButton.textContent = "Go to Chrome Home";
  goHomeButton.style.backgroundColor = "#e74c3c";
  goHomeButton.style.color = "#fff";
  goHomeButton.style.border = "none";
  goHomeButton.style.padding = "10px 20px";
  goHomeButton.style.borderRadius = "5px";
  goHomeButton.style.cursor = "pointer";
  goHomeButton.onclick = () => {
    // Use chrome.tabs API to navigate to Chrome home page
    chrome.runtime.sendMessage({ action: "goToHomePage" }, () => {
      overlay.remove(); // Remove the modal
    });
  };
  buttonContainer.appendChild(goHomeButton);

  // Append the button container to the modal
  modal.appendChild(buttonContainer);

  // Append the modal to the overlay and the overlay to the document body
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

// Run the modal when the content script is loaded
createPrivacyAnalyzerModal();
