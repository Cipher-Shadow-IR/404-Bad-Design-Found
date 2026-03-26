const QUIZ_DATA = {
  "quiz_title": "UI/UX Scenario Based Quiz",
  "total_questions": 160,
  "questions": [
    {
      "id": 1,
      "type": "ui_ux",
      "level": "easy",
      "question": "A button is not clickable on a webpage. What is the most likely UI issue?",
      "options": [
        "Font size is small",
        "Low contrast",
        "Invisible overlapping element",
        "Color mismatch"
      ],
      "answer": "Invisible overlapping element"
    },
    {
      "id": 2,
      "type": "ui_ux",
      "level": "easy",
      "question": "Users are unable to find the Submit button on a form. What could be the reason?",
      "options": [
        "Fast loading speed",
        "Poor visual hierarchy",
        "Proper spacing",
        "Good contrast"
      ],
      "answer": "Poor visual hierarchy"
    },
    {
      "id": 3,
      "type": "ui_ux",
      "level": "easy",
      "question": "A form is too long and users abandon it frequently. What UX issue does this indicate?",
      "options": [
        "High cognitive load",
        "Low accessibility",
        "Server issue",
        "Color problem"
      ],
      "answer": "High cognitive load"
    },
    {
      "id": 4,
      "type": "ui_ux",
      "level": "easy",
      "question": "Users click on a logo expecting homepage navigation but nothing happens. Why?",
      "options": [
        "Mental model mismatch",
        "CSS issue",
        "SEO problem",
        "Typography error"
      ],
      "answer": "Mental model mismatch"
    },
    {
      "id": 5,
      "type": "ui_ux",
      "level": "easy",
      "question": "CTA button has the same color as background. What problem occurs?",
      "options": [
        "Branding issue",
        "Accessibility issue",
        "Visual hierarchy failure",
        "Backend issue"
      ],
      "answer": "Visual hierarchy failure"
    },
    {
      "id": 6,
      "type": "ui_ux",
      "level": "easy",
      "question": "Loading spinner keeps spinning without result. What UX impact does this create?",
      "options": [
        "Better engagement",
        "User frustration",
        "Faster interaction",
        "Improved accessibility"
      ],
      "answer": "User frustration"
    },
    {
      "id": 7,
      "type": "ui_ux",
      "level": "easy",
      "question": "Form submits but no confirmation message appears. What is missing?",
      "options": [
        "Feedback mechanism",
        "Animation",
        "Typography",
        "Navigation"
      ],
      "answer": "Feedback mechanism"
    },
    {
      "id": 8,
      "type": "ui_ux",
      "level": "easy",
      "question": "Dropdown closes immediately after clicking. Likely cause?",
      "options": [
        "Hover CSS conflict",
        "Color issue",
        "Animation delay",
        "Server issue"
      ],
      "answer": "Hover CSS conflict"
    },
    {
      "id": 9,
      "type": "ui_ux",
      "level": "easy",
      "question": "A mobile site layout breaks on smaller screens. What is missing?",
      "options": [
        "API integration",
        "Responsive design",
        "Dark mode",
        "SEO"
      ],
      "answer": "Responsive design"
    },
    {
      "id": 10,
      "type": "ui_ux",
      "level": "easy",
      "question": "Users can't tap a menu icon on mobile easily. Why?",
      "options": [
        "Too large icon",
        "Small touch target",
        "Animation issue",
        "Typography"
      ],
      "answer": "Small touch target"
    },
    {
      "id": 11,
      "type": "ui_ux",
      "level": "medium",
      "question": "A button works on desktop but not on mobile devices. Likely reason?",
      "options": [
        "Typography mismatch",
        "Media query conflict",
        "SEO error",
        "Color issue"
      ],
      "answer": "Media query conflict"
    },
    {
      "id": 12,
      "type": "ui_ux",
      "level": "medium",
      "question": "CSS: pointer-events:none is applied on a button. What happens?",
      "options": [
        "Button animates",
        "Button becomes unclickable",
        "Button enlarges",
        "Button gets highlighted"
      ],
      "answer": "Button becomes unclickable"
    },
    {
      "id": 13,
      "type": "ui_ux",
      "level": "medium",
      "question": "Modal opens but background content is clickable. Missing?",
      "options": [
        "Proper z-index",
        "Padding",
        "Font",
        "API"
      ],
      "answer": "Proper z-index"
    },
    {
      "id": 14,
      "type": "ui_ux",
      "level": "medium",
      "question": "Users ignore an important banner repeatedly. What is this phenomenon?",
      "options": [
        "Dark pattern",
        "Banner blindness",
        "Hick's Law",
        "Affordance"
      ],
      "answer": "Banner blindness"
    },
    {
      "id": 15,
      "type": "ui_ux",
      "level": "medium",
      "question": "Clickable card has no hover feedback. Which UX principle is violated?",
      "options": [
        "Affordance",
        "Branding",
        "Grid",
        "Typography"
      ],
      "answer": "Affordance"
    },
    {
      "id": 16,
      "type": "ui_ux",
      "level": "medium",
      "question": "JS click event is attached to an element ID that doesn't exist. Result?",
      "options": [
        "Event won't trigger",
        "Button animates",
        "Page reloads",
        "Layout breaks"
      ],
      "answer": "Event won't trigger"
    },
    {
      "id": 17,
      "type": "ui_ux",
      "level": "medium",
      "question": "Users abandon checkout at payment page. First UX step?",
      "options": [
        "Add animation",
        "Conduct usability testing",
        "Change logo",
        "Improve typography"
      ],
      "answer": "Conduct usability testing"
    },
    {
      "id": 18,
      "type": "ui_ux",
      "level": "medium",
      "question": "Too many navigation choices slow decision making. Which law applies?",
      "options": [
        "Fitts Law",
        "Hick Law",
        "Jakob Law",
        "Pareto"
      ],
      "answer": "Hick Law"
    },
    {
      "id": 19,
      "type": "ui_ux",
      "level": "medium",
      "question": "Tooltip appears too late after hover. Issue?",
      "options": [
        "Interaction timing problem",
        "SEO issue",
        "Typography",
        "Branding"
      ],
      "answer": "Interaction timing problem"
    },
    {
      "id": 20,
      "type": "ui_ux",
      "level": "medium",
      "question": "Form resets after validation error. UX problem?",
      "options": [
        "No error feedback",
        "Animation issue",
        "Grid issue",
        "Branding"
      ],
      "answer": "No error feedback"
    },
    {
      "id": 21,
      "type": "ui_ux",
      "level": "hard",
      "question": "Position:absolute causes UI components to overlap unexpectedly. Why?",
      "options": [
        "Out of normal document flow",
        "SEO issue",
        "Server error",
        "Color issue"
      ],
      "answer": "Out of normal document flow"
    },
    {
      "id": 22,
      "type": "ui_ux",
      "level": "hard",
      "question": "Users hesitate before clicking CTA due to unclear wording. This affects?",
      "options": [
        "Learnability",
        "Performance",
        "SEO",
        "Animation"
      ],
      "answer": "Learnability"
    },
    {
      "id": 23,
      "type": "ui_ux",
      "level": "hard",
      "question": "Dark theme fails WCAG standards. Why?",
      "options": [
        "Low color contrast ratio",
        "Animation speed",
        "Typography",
        "Grid"
      ],
      "answer": "Low color contrast ratio"
    },
    {
      "id": 24,
      "type": "ui_ux",
      "level": "hard",
      "question": "Heatmap shows users clicking non-clickable icons repeatedly. Indicates?",
      "options": [
        "False affordance",
        "Strong branding",
        "Consistency",
        "Animation"
      ],
      "answer": "False affordance"
    },
    {
      "id": 25,
      "type": "ui_ux",
      "level": "hard",
      "question": "Inconsistent button styles across pages lead to?",
      "options": [
        "Increased cognitive load",
        "Better UX",
        "Improved flow",
        "Fast onboarding"
      ],
      "answer": "Increased cognitive load"
    },
    {
      "id": 26,
      "type": "ui_ux",
      "level": "advanced",
      "question": "Product scales but UI becomes inconsistent across modules. Missing?",
      "options": [
        "Design system governance",
        "Animation",
        "Typography",
        "Dark mode"
      ],
      "answer": "Design system governance"
    },
    {
      "id": 27,
      "type": "ui_ux",
      "level": "advanced",
      "question": "Users complete tasks but feel unsatisfied. Which UX dimension lacks?",
      "options": [
        "Desirability",
        "Accessibility",
        "Navigation",
        "Typography"
      ],
      "answer": "Desirability"
    },
    {
      "id": 28,
      "type": "ui_ux",
      "level": "advanced",
      "question": "Enterprise UI inconsistency affects long-term usage. Result?",
      "options": [
        "Cognitive overload",
        "Faster onboarding",
        "Better retention",
        "Improved SEO"
      ],
      "answer": "Cognitive overload"
    },
    {
      "id": 29,
      "type": "ui_ux",
      "level": "advanced",
      "question": "High conversion UI fails user retention. What should be evaluated?",
      "options": [
        "Emotional experience",
        "Font size",
        "Animation",
        "Color"
      ],
      "answer": "Emotional experience"
    },
    {
      "id": 30,
      "type": "ui_ux",
      "level": "advanced",
      "question": "Scaling UI needs reusable components for consistency. Best solution?",
      "options": [
        "Component-driven architecture",
        "More animations",
        "Bright colors",
        "Random layout"
      ],
      "answer": "Component-driven architecture"
    },
    {
      "id": 31,
      "type": "ui_ux",
      "level": "medium",
      "question": "A user repeatedly fails to confirm a deletion. What could be the issue?",
      "options": [
        "Too many confirmation steps",
        "Destructive action lacks prominence",
        "Color of 'Cancel' is too red",
        "Undo is missing"
      ],
      "answer": "Destructive action lacks prominence"
    },
    {
      "id": 32,
      "type": "ui_ux",
      "level": "easy",
      "question": "Which of these is a 'dark pattern' in UX?",
      "options": [
        "Infinite scroll",
        "Sneak into basket",
        "Loading skeleton",
        "Progressive disclosure"
      ],
      "answer": "Sneak into basket"
    },
    {
      "id": 33,
      "type": "ui_ux",
      "level": "medium",
      "question": "Horizontal scrolling on a desktop website is usually considered...?",
      "options": [
        "Innovative",
        "Poor UX for primary content",
        "Mobile-friendly",
        "SEO friendly"
      ],
      "answer": "Poor UX for primary content"
    },
    {
      "id": 34,
      "type": "ui_ux",
      "level": "easy",
      "question": "What does 'Fitts's Law' primarily deal with?",
      "options": [
        "Color contrast",
        "Target size and distance",
        "Reading patterns",
        "Information density"
      ],
      "answer": "Target size and distance"
    },
    {
      "id": 35,
      "type": "ui_ux",
      "level": "medium",
      "question": "Skeleton screens improve perceived performance by...?",
      "options": [
        "Reducing server load",
        "Reducing JavaScript size",
        "Showing a visual placeholder",
        "Speeding up network"
      ],
      "answer": "Showing a visual placeholder"
    },
    {
      "id": 36,
      "type": "ui_ux",
      "level": "hard",
      "question": "In a dashboard, which layout principle helps focus on a specific metric?",
      "options": [
        "Chaos theory",
        "Figure-ground relationship",
        "Rule of thirds",
        "Venn diagrams"
      ],
      "answer": "Figure-ground relationship"
    },
    {
      "id": 37,
      "type": "ui_ux",
      "level": "easy",
      "question": "Consistent navigation helps build...?",
      "options": [
        "User trust",
        "Complex site map",
        "Heavier layouts",
        "Longer page load"
      ],
      "answer": "User trust"
    },
    {
      "id": 38,
      "type": "ui_ux",
      "level": "medium",
      "question": "Micro-interactions are used to...?",
      "options": [
        "Replace images",
        "Provide subtle feedback",
        "Slow down the user",
        "Decrease CSS size"
      ],
      "answer": "Provide subtle feedback"
    },
    {
      "id": 39,
      "type": "ui_ux",
      "level": "hard",
      "question": "Adding a 'Ghost Button' for secondary actions helps preserve...?",
      "options": [
        "Visual hierarchy",
        "Browser memory",
        "Dark mode aesthetics",
        "Font rendering"
      ],
      "answer": "Visual hierarchy"
    },
    {
      "id": 40,
      "type": "ui_ux",
      "level": "medium",
      "question": "The primary goal of accessibility (a11y) is...?",
      "options": [
        "Faster loading",
        "Inclusion of users with disabilities",
        "Better mobile scores",
        "Saving data"
      ],
      "answer": "Inclusion of users with disabilities"
    },
    {
      "id": 41,
      "type": "ui_ux",
      "level": "easy",
      "question": "Breadcrumbs in a website are used for...?",
      "options": [
        "Navigation hierarchy",
        "Eating virtual snacks",
        "Footer links",
        "Social media sharing"
      ],
      "answer": "Navigation hierarchy"
    },
    {
      "id": 42,
      "type": "ui_ux",
      "level": "hard",
      "question": "What is 'progressive disclosure' in UI?",
      "options": [
        "Showing all data at once",
        "Hiding advanced info until needed",
        "Slowly loading images",
        "Gradual font size change"
      ],
      "answer": "Hiding advanced info until needed"
    },
    {
      "id": 43,
      "type": "ui_ux",
      "level": "medium",
      "question": "Interpreting 'X' as close is an example of...?",
      "options": [
        "Cultural bias",
        "Mental models",
        "Affordance failure",
        "Anti-pattern"
      ],
      "answer": "Mental models"
    },
    {
      "id": 44,
      "type": "ui_ux",
      "level": "easy",
      "question": "White space in design is also known as...?",
      "options": [
        "Negative space",
        "Wasted area",
        "Grid lines",
        "Margins only"
      ],
      "answer": "Negative space"
    },
    {
      "id": 45,
      "type": "ui_ux",
      "level": "hard",
      "question": "High cognitive load often results from...?",
      "options": [
        "Too many fonts",
        "Too much information display",
        "Clean layouts",
        "Fast internet"
      ],
      "answer": "Too much information display"
    },
    {
      "id": 46,
      "type": "ui_ux",
      "level": "medium",
      "question": "What is the 60-30-10 rule in UI design?",
      "options": [
        "Grid ratios",
        "Color distribution",
        "Typography sizes",
        "Responsive breakpoints"
      ],
      "answer": "Color distribution"
    },
    {
      "id": 47,
      "type": "ui_ux",
      "level": "easy",
      "question": "A contrast ratio of 4.5:1 is recommended for...?",
      "options": [
        "Large images",
        "Normal body text",
        "Shadows",
        "Background gradients"
      ],
      "answer": "Normal body text"
    },
    {
      "id": 48,
      "type": "ui_ux",
      "level": "medium",
      "question": "Which gesture is most intuitive for viewing photos on mobile?",
      "options": [
        "Double tap",
        "Swipe",
        "Triple click",
        "Hold and drag"
      ],
      "answer": "Swipe"
    },
    {
      "id": 49,
      "type": "ui_ux",
      "level": "hard",
      "question": "The 'Peak-End' rule suggests users judge an experience based on...?",
      "options": [
        "The beginning",
        "Technical speed",
        "Peak moments and the end",
        "Total time spent"
      ],
      "answer": "Peak moments and the end"
    },
    {
      "id": 50,
      "type": "ui_ux",
      "level": "hard",
      "question": "Which principle states that objects near each other appear related?",
      "options": [
        "Similarity",
        "Proximity",
        "Continuity",
        "Closure"
      ],
      "answer": "Proximity"
    },
    {
      "id": 51,
      "type": "ui_ux",
      "level": "medium",
      "question": "A hamburger menu icon is best used to...?",
      "options": [
        "Show a list of dishes",
        "Hide secondary navigation on mobile",
        "Display a primary CTA",
        "Search the site"
      ],
      "answer": "Hide secondary navigation on mobile"
    },
    {
      "id": 52,
      "type": "ui_ux",
      "level": "easy",
      "question": "Call to Action (CTA) buttons should be...?",
      "options": [
        "Small and grey",
        "High contrast and prominent",
        "Hidden in the footer",
        "Text only"
      ],
      "answer": "High contrast and prominent"
    },
    {
      "id": 53,
      "type": "ui_ux",
      "level": "medium",
      "question": "Infinite scrolling is most effective for...?",
      "options": [
        "Checkouts",
        "Social feeds",
        "Contact pages",
        "FAQs"
      ],
      "answer": "Social feeds"
    },
    {
      "id": 54,
      "type": "ui_ux",
      "level": "hard",
      "question": "The 'Serial Position Effect' implies users remember...?",
      "options": [
        "Middle items only",
        "First and last items",
        "Every 3rd item",
        "Random items"
      ],
      "answer": "First and last items"
    },
    {
      "id": 55,
      "type": "ui_ux",
      "level": "medium",
      "question": "What is 'Affordance' in UI?",
      "options": [
        "Cheap elements",
        "Visual clues that suggest how to use it",
        "Price of the software",
        "Loading time"
      ],
      "answer": "Visual clues that suggest how to use it"
    },
    {
      "id": 56,
      "type": "ui_ux",
      "level": "easy",
      "question": "Which error message is most helpful?",
      "options": [
        "Error 404",
        "Invalid input",
        "Please enter a valid email address",
        "System failure"
      ],
      "answer": "Please enter a valid email address"
    },
    {
      "id": 57,
      "type": "ui_ux",
      "level": "medium",
      "question": "Using real-world icons (like a floppy disk for save) is called...?",
      "options": [
        "Flat design",
        "Skeuomorphism",
        "Material design",
        "Minimalism"
      ],
      "answer": "Skeuomorphism"
    },
    {
      "id": 58,
      "type": "ui_ux",
      "level": "easy",
      "question": "A tooltip should appear...?",
      "options": [
        "On click only",
        "On hover/focus",
        "Never on mobile",
        "Statically"
      ],
      "answer": "On hover/focus"
    },
    {
      "id": 59,
      "type": "ui_ux",
      "level": "hard",
      "question": "What is 'Hick's Law' primarily used for?",
      "options": [
        "Color theory",
        "Decision making time vs options",
        "Animation easing",
        "Server response time"
      ],
      "answer": "Decision making time vs options"
    },
    {
      "id": 60,
      "type": "ui_ux",
      "level": "medium",
      "question": "The 'Rule of Thirds' is applied to UI to...?",
      "options": [
        "Divide code",
        "Create balanced compositions",
        "Split text into 3 columns",
        "Set three colors"
      ],
      "answer": "Create balanced compositions"
    },
    {
      "id": 61,
      "type": "ui_ux",
      "level": "hard",
      "question": "The 'Jacob’s Law' of User Experience suggests that users spend most of their time...?",
      "options": [
        "On your site",
        "On other sites",
        "Looking at logos",
        "Reading footers"
      ],
      "answer": "On other sites"
    },
    {
      "id": 62,
      "type": "ui_ux",
      "level": "easy",
      "question": "A 'Call to Action' should most importantly be...?",
      "options": [
        "Small",
        "Action-oriented",
        "Hidden",
        "In grey color"
      ],
      "answer": "Action-oriented"
    },
    {
      "id": 63,
      "type": "ui_ux",
      "level": "medium",
      "question": "Using a sidebar for filters is an example of...?",
      "options": [
        "Visual noise",
        "Standard patterns",
        "Anti-pattern",
        "Search optimization"
      ],
      "answer": "Standard patterns"
    },
    {
      "id": 64,
      "type": "ui_ux",
      "level": "hard",
      "question": "What is the primary benefit of 'User Journey Mapping'?",
      "options": [
        "Drawing pretty lines",
        "Understanding emotional touches",
        "Planning server architecture",
        "Setting font styles"
      ],
      "answer": "Understanding emotional touches"
    },
    {
      "id": 65,
      "type": "ui_ux",
      "level": "medium",
      "question": "A 'Modal' should be used for...?",
      "options": [
        "Large articles",
        "Secondary navigation",
        "Critical interruptions",
        "Background images"
      ],
      "answer": "Critical interruptions"
    },
    {
      "id": 66,
      "type": "ui_ux",
      "level": "easy",
      "question": "Contrast ratio is important for...?",
      "options": [
        "Loading speed",
        "Readability",
        "Server costs",
        "File size"
      ],
      "answer": "Readability"
    },
    {
      "id": 67,
      "type": "ui_ux",
      "level": "medium",
      "question": "Cards are a popular UI pattern because they...?",
      "options": [
        "Are expensive",
        "Chunk information",
        "Only work on desktop",
        "Require less CSS"
      ],
      "answer": "Chunk information"
    },
    {
      "id": 68,
      "type": "ui_ux",
      "level": "hard",
      "question": "What is 'Miller's Law' about?",
      "options": [
        "Number of colors",
        "Memory capacity (7+/-2)",
        "Button sizes",
        "Typography line height"
      ],
      "answer": "Memory capacity (7+/-2)"
    },
    {
      "id": 69,
      "type": "ui_ux",
      "level": "easy",
      "question": "SVG images are preferred for icons because they are...?",
      "options": [
        "Heavier",
        "Scalable",
        "Blurry",
        "Old"
      ],
      "answer": "Scalable"
    },
    {
      "id": 70,
      "type": "ui_ux",
      "level": "medium",
      "question": "A 'Floating Action Button' (FAB) is a signature of...?",
      "options": [
        "Windows UI",
        "Material Design",
        "Apple HIG",
        "Linux Desktops"
      ],
      "answer": "Material Design"
    },
    {
      "id": 71,
      "type": "ui_ux",
      "level": "hard",
      "question": "What is 'Eye Tracking' data used for in UX?",
      "options": [
        "Checking vision",
        "Determining visual focus",
        "Improving iris scans",
        "Calculating frame rates"
      ],
      "answer": "Determining visual focus"
    },
    {
      "id": 72,
      "type": "ui_ux",
      "level": "medium",
      "question": "Breadcrumbs improve...?",
      "options": [
        "Server SEO",
        "User orientation",
        "Image resolution",
        "Font spacing"
      ],
      "answer": "User orientation"
    },
    {
      "id": 73,
      "type": "ui_ux",
      "level": "easy",
      "question": "Hover states are not available on...?",
      "options": [
        "Large monitors",
        "Touch screens",
        "Gaming consoles",
        "Laptops"
      ],
      "answer": "Touch screens"
    },
    {
      "id": 74,
      "type": "ui_ux",
      "level": "hard",
      "question": "What characterizes 'Minimalist' design?",
      "options": [
        "Lots of icons",
        "Subtracting elements",
        "Extensive gradients",
        "Many fonts"
      ],
      "answer": "Subtracting elements"
    },
    {
      "id": 75,
      "type": "ui_ux",
      "level": "medium",
      "question": "The 'Golden Ratio' is often used to establish...?",
      "options": [
        "Color codes",
        "Layout proportions",
        "Encryption keys",
        "Loading times"
      ],
      "answer": "Layout proportions"
    },
    {
      "id": 76,
      "type": "ui_ux",
      "level": "easy",
      "question": "Which of these provides the best feedback during a long upload?",
      "options": [
        "Spinning circle",
        "Percentage bar",
        "Static text 'Wait'",
        "Empty space"
      ],
      "answer": "Percentage bar"
    },
    {
      "id": 77,
      "type": "ui_ux",
      "level": "hard",
      "question": "A 'stepper' UI is most appropriate for...?",
      "options": [
        "One-click buy",
        "Multi-step forms",
        "Image galleries",
        "Contact pages"
      ],
      "answer": "Multi-step forms"
    },
    {
      "id": 78,
      "type": "ui_ux",
      "level": "medium",
      "question": "Designing for 'the thumb zone' is critical for...?",
      "options": [
        "Keyboard users",
        "Mobile optimization",
        "Mouse precision",
        "Voice UI"
      ],
      "answer": "Mobile optimization"
    },
    {
      "id": 79,
      "type": "ui_ux",
      "level": "easy",
      "question": "Error messages should be colored...?",
      "options": [
        "Blue",
        "Red",
        "Green",
        "Yellow"
      ],
      "answer": "Red"
    },
    {
      "id": 80,
      "type": "ui_ux",
      "level": "hard",
      "question": "What is 'Affordance' in industrial/UI design?",
      "options": [
        "Cost",
        "Function suggested by form",
        "Material weight",
        "Durability"
      ],
      "answer": "Function suggested by form"
    },
    {
      "id": 81,
      "type": "ui_ux",
      "level": "medium",
      "question": "Responsive design uses...?",
      "options": [
        "Fixed pixels",
        "Media queries",
        "Hardcoded width",
        "Flash"
      ],
      "answer": "Media queries"
    },
    {
      "id": 82,
      "type": "ui_ux",
      "level": "easy",
      "question": "A favicon appears in the...?",
      "options": [
        "Browser tab",
        "Page footer",
        "Center of page",
        "URL end"
      ],
      "answer": "Browser tab"
    },
    {
      "id": 83,
      "type": "ui_ux",
      "level": "hard",
      "question": "What characterizes 'Material Design'?",
      "options": [
        "Glossy buttons",
        "Surface, depth, and shadows",
        "80s retro",
        "Text only"
      ],
      "answer": "Surface, depth, and shadows"
    },
    {
      "id": 84,
      "type": "ui_ux",
      "level": "medium",
      "question": "Which file type supports transparency?",
      "options": [
        "JPG",
        "PNG",
        "BMP",
        "TIFF"
      ],
      "answer": "PNG"
    },
    {
      "id": 85,
      "type": "ui_ux",
      "level": "hard",
      "question": "What is the primary motive of A/B Testing?",
      "options": [
        "Compare two layouts",
        "Increase server lag",
        "Test code bugs",
        "Change the logo"
      ],
      "answer": "Compare two layouts"
    },
    {
      "id": 86,
      "type": "ui_ux",
      "level": "medium",
      "question": "Which UX tool is best for documenting user flows?",
      "options": [
        "Photoshop",
        "FigJam/Flowcharting",
        "Excel",
        "NotePad"
      ],
      "answer": "FigJam/Flowcharting"
    },
    {
      "id": 87,
      "type": "ui_ux",
      "level": "easy",
      "question": "Padding is the space...?",
      "options": [
        "Outside an element",
        "Inside an element",
        "Between lines",
        "Under text"
      ],
      "answer": "Inside an element"
    },
    {
      "id": 88,
      "type": "ui_ux",
      "level": "hard",
      "question": "Which UX principle prioritizes user needs over aesthetics?",
      "options": [
        "User-Centric Design",
        "Flat Design",
        "Minimalism",
        "Skeuomorphism"
      ],
      "answer": "User-Centric Design"
    },
    {
      "id": 89,
      "type": "ui_ux",
      "level": "medium",
      "question": "Designing for 'Edge Cases' means...?",
      "options": [
        "Styling corners",
        "Planning for unusual user scenarios",
        "Limiting the width",
        "Cutting margins"
      ],
      "answer": "Planning for unusual user scenarios"
    },
    {
      "id": 90,
      "type": "ui_ux",
      "level": "hard",
      "question": "What's the difference between UI and UX?",
      "options": [
        "None",
        "UI is visual, UX is the experience",
        "UI is code, UX is design",
        "UX is only for mobile"
      ],
      "answer": "UI is visual, UX is the experience"
    },
    {
      "id": 91,
      "type": "ui_ux",
      "level": "medium",
      "question": "A 'Wireframe' is primarily...?",
      "options": [
        "A colorful mockup",
        "A low-fidelity blueprint",
        "Final code",
        "A high-res image"
      ],
      "answer": "A low-fidelity blueprint"
    },
    {
      "id": 92,
      "type": "ui_ux",
      "level": "easy",
      "question": "Which font type is best for modern web UI?",
      "options": [
        "Serif",
        "Sans-Serif",
        "Cursive",
        "Monospace"
      ],
      "answer": "Sans-Serif"
    },
    {
      "id": 93,
      "type": "ui_ux",
      "level": "hard",
      "question": "What's the goal of 'Information Architecture'?",
      "options": [
        "Designing logos",
        "Organizing content logically",
        "Speeding up servers",
        "Writing CSS"
      ],
      "answer": "Organizing content logically"
    },
    {
      "id": 94,
      "type": "ui_ux",
      "level": "medium",
      "question": "The 'Z-Pattern' describes how people...?",
      "options": [
        "Sleep after work",
        "Scan low-content pages",
        "Draw lines",
        "Write code"
      ],
      "answer": "Scan low-content pages"
    },
    {
      "id": 95,
      "type": "ui_ux",
      "level": "hard",
      "question": "In UX, 'Empathy' means...?",
      "options": [
        "Feeling sorry for users",
        "Understanding user's feelings and needs",
        "Giving refunds",
        "Fast support"
      ],
      "answer": "Understanding user's feelings and needs"
    },
    {
      "id": 96,
      "type": "ui_ux",
      "level": "easy",
      "question": "A 'Breadcrumb' ➔ Home > Sale > Shoes is used for...?",
      "options": [
        "SEO",
        "User Path/Navigation",
        "Footer links",
        "Social Media"
      ],
      "answer": "User Path/Navigation"
    },
    {
      "id": 97,
      "type": "ui_ux",
      "level": "medium",
      "question": "Grid systems help maintain...?",
      "options": [
        "Randomness",
        "Alignment and Consistency",
        "High file size",
        "Complex colors"
      ],
      "answer": "Alignment and Consistency"
    },
    {
      "id": 98,
      "type": "ui_ux",
      "level": "hard",
      "question": "What is 'Inclusive Design'?",
      "options": [
        "Design for internal use",
        "Design for as many people as possible",
        "Exclusive design",
        "Paid design"
      ],
      "answer": "Design for as many people as possible"
    },
    {
      "id": 99,
      "type": "ui_ux",
      "level": "medium",
      "question": "Micro-copy refers to...?",
      "options": [
        "Small font sizes",
        "Short instructions like 'Sign up'",
        "Mini design assets",
        "Compact code"
      ],
      "answer": "Short instructions like 'Sign up'"
    },
    {
      "id": 100,
      "type": "ui_ux",
      "level": "hard",
      "question": "The primary goal of a 'Persona' is...?",
      "options": [
        "Market research",
        "Representing user types",
        "Hiring designers",
        "Selling products"
      ],
      "answer": "Representing user types"
    },
    {
      "id": 101,
      "type": "conditional",
      "level": "easy",
      "question": "If x = 5 and y = 10, what is the result of (x > 3 && y < 15)?",
      "options": [
        "true",
        "false",
        "undefined",
        "null"
      ],
      "answer": "true"
    },
    {
      "id": 102,
      "type": "conditional",
      "level": "easy",
      "question": "Which operator is used for 'not equal' in JavaScript?",
      "options": [
        "==",
        "!=",
        "===",
        "<>"
      ],
      "answer": "!="
    },
    {
      "id": 103,
      "type": "conditional",
      "level": "medium",
      "question": "What does (5 == '5') return in JavaScript?",
      "options": [
        "true",
        "false",
        "TypeError",
        "NaN"
      ],
      "answer": "true"
    },
    {
      "id": 104,
      "type": "conditional",
      "level": "medium",
      "question": "What does (5 === '5') return in JavaScript?",
      "options": [
        "true",
        "false",
        "TypeError",
        "NaN"
      ],
      "answer": "false"
    },
    {
      "id": 105,
      "type": "conditional",
      "level": "hard",
      "question": "If (a || b) is true, and a is false, what MUST b be?",
      "options": [
        "true",
        "false",
        "null",
        "undefined"
      ],
      "answer": "true"
    },
    {
      "id": 106,
      "type": "conditional",
      "level": "easy",
      "question": "What is the result of !true?",
      "options": [
        "true",
        "false",
        "0",
        "1"
      ],
      "answer": "false"
    },
    {
      "id": 107,
      "type": "conditional",
      "level": "medium",
      "question": "Which condition checks if a number 'n' is even?",
      "options": [
        "n % 2 == 0",
        "n / 2 == 1",
        "n % 2 != 0",
        "n * 2 == 4"
      ],
      "answer": "n % 2 == 0"
    },
    {
      "id": 108,
      "type": "conditional",
      "level": "hard",
      "question": "What is the output of (false || true && false)?",
      "options": [
        "true",
        "false",
        "TypeError",
        "null"
      ],
      "answer": "false"
    },
    {
      "id": 109,
      "type": "conditional",
      "level": "medium",
      "question": "In an if-else if-else chain, how many blocks can execute?",
      "options": [
        "All of them",
        "Only one",
        "At least two",
        "None of them"
      ],
      "answer": "Only one"
    },
    {
      "id": 110,
      "type": "conditional",
      "level": "easy",
      "question": "What does 'null' represent in a condition?",
      "options": [
        "A string",
        "An object",
        "Absence of value",
        "True"
      ],
      "answer": "Absence of value"
    },
    {
      "id": 111,
      "type": "conditional",
      "level": "hard",
      "question": "What is the 'falsy' value among these?",
      "options": [
        "'0'",
        "[]",
        "{}",
        "0"
      ],
      "answer": "0"
    },
    {
      "id": 112,
      "type": "conditional",
      "level": "medium",
      "question": "The ternary operator is a shorthand for...?",
      "options": [
        "for loop",
        "if-else",
        "switch",
        "while loop"
      ],
      "answer": "if-else"
    },
    {
      "id": 113,
      "type": "conditional",
      "level": "easy",
      "question": "What is 10 > 5 > 2 result in JS?",
      "options": [
        "true",
        "false",
        "1",
        "0"
      ],
      "answer": "false"
    },
    {
      "id": 114,
      "type": "conditional",
      "level": "hard",
      "question": "What is (!!'hello') in JavaScript?",
      "options": [
        "true",
        "false",
        "'hello'",
        "undefined"
      ],
      "answer": "true"
    },
    {
      "id": 115,
      "type": "conditional",
      "level": "medium",
      "question": "Switch statements use...?",
      "options": [
        "Strict equality (===)",
        "Loose equality (==)",
        "Regex",
        "Greater than"
      ],
      "answer": "Strict equality (===)"
    },
    {
      "id": 116,
      "type": "conditional",
      "level": "easy",
      "question": "Which is the logical AND operator?",
      "options": [
        "||",
        "&&",
        "!",
        "&"
      ],
      "answer": "&&"
    },
    {
      "id": 117,
      "type": "conditional",
      "level": "medium",
      "question": "What is the result of (1 && 2)?",
      "options": [
        "1",
        "2",
        "true",
        "false"
      ],
      "answer": "2"
    },
    {
      "id": 118,
      "type": "conditional",
      "level": "medium",
      "question": "What is the result of (0 || 5)?",
      "options": [
        "0",
        "5",
        "true",
        "false"
      ],
      "answer": "5"
    },
    {
      "id": 119,
      "type": "conditional",
      "level": "hard",
      "question": "What is the type of (typeof null)?",
      "options": [
        "'null'",
        "'undefined'",
        "'object'",
        "'string'"
      ],
      "answer": "'object'"
    },
    {
      "id": 120,
      "type": "conditional",
      "level": "easy",
      "question": "Which block executes if the 'if' condition is false?",
      "options": [
        "then",
        "else",
        "finally",
        "catch"
      ],
      "answer": "else"
    },
    {
      "id": 121,
      "type": "conditional",
      "level": "hard",
      "question": "What is result of (true ? 'yes' : 'no')?",
      "options": [
        "'yes'",
        "'no'",
        "true",
        "false"
      ],
      "answer": "'yes'"
    },
    {
      "id": 122,
      "type": "conditional",
      "level": "medium",
      "question": "What does (NaN == NaN) return?",
      "options": [
        "true",
        "false",
        "TypeError",
        "undefined"
      ],
      "answer": "false"
    },
    {
      "id": 123,
      "type": "conditional",
      "level": "easy",
      "question": "How do you write a conditional in CSS?",
      "options": [
        "if()",
        "@media",
        "@if",
        "condition{}"
      ],
      "answer": "@media"
    },
    {
      "id": 124,
      "type": "conditional",
      "level": "medium",
      "question": "Which will be true if 'str' is a non-empty string?",
      "options": [
        "str.length > 0",
        "str == null",
        "!str",
        "str.type == 'string'"
      ],
      "answer": "str.length > 0"
    },
    {
      "id": 125,
      "type": "conditional",
      "level": "hard",
      "question": "What is ([ ] == ![ ])?",
      "options": [
        "true",
        "false",
        "TypeError",
        "undefined"
      ],
      "answer": "true"
    },
    {
      "id": 126,
      "type": "conditional",
      "level": "medium",
      "question": "Short-circuiting in '&&' means...?",
      "options": [
        "Skip if first is true",
        "Skip if first is false",
        "Always run both",
        "None"
      ],
      "answer": "Skip if first is false"
    },
    {
      "id": 127,
      "type": "conditional",
      "level": "easy",
      "question": "What is (1 == 1.0)?",
      "options": [
        "true",
        "false",
        "only in Python",
        "Error"
      ],
      "answer": "true"
    },
    {
      "id": 128,
      "type": "conditional",
      "level": "hard",
      "question": "What is the result of (typeof NaN)?",
      "options": [
        "'NaN'",
        "'number'",
        "'undefined'",
        "'object'"
      ],
      "answer": "'number'"
    },
    {
      "id": 129,
      "type": "conditional",
      "level": "medium",
      "question": "Which can represent a constant condition?",
      "options": [
        "x = 5",
        "while(true)",
        "if(x++)",
        "const x"
      ],
      "answer": "while(true)"
    },
    {
      "id": 130,
      "type": "conditional",
      "level": "easy",
      "question": "Boolean(0) is...?",
      "options": [
        "true",
        "false",
        "1",
        "-1"
      ],
      "answer": "false"
    },
    {
      "id": 131,
      "type": "conditional",
      "level": "hard",
      "question": "What is ('1' + 1 - 1)?",
      "options": [
        "10",
        "1",
        "11",
        "0"
      ],
      "answer": "10"
    },
    {
      "id": 132,
      "type": "conditional",
      "level": "medium",
      "question": "Which operator has high precedence?",
      "options": [
        "+",
        "*",
        "&&",
        "||"
      ],
      "answer": "*"
    },
    {
      "id": 133,
      "type": "conditional",
      "level": "easy",
      "question": "Is (null >= 0) true?",
      "options": [
        "Yes",
        "No",
        "Only on Sundays",
        "Undefined"
      ],
      "answer": "Yes"
    },
    {
      "id": 134,
      "type": "conditional",
      "level": "medium",
      "question": "What is result of (undefined == null)?",
      "options": [
        "true",
        "false",
        "TypeError",
        "NaN"
      ],
      "answer": "true"
    },
    {
      "id": 135,
      "type": "conditional",
      "level": "hard",
      "question": "What is (!![])?",
      "options": [
        "true",
        "false",
        "[]",
        "TypeError"
      ],
      "answer": "true"
    },
    {
      "id": 136,
      "type": "conditional",
      "level": "easy",
      "question": "The '!' operator...?",
      "options": [
        "Adds one",
        "Inverts boolean",
        "Multiplies",
        "Creates a list"
      ],
      "answer": "Inverts boolean"
    },
    {
      "id": 137,
      "type": "conditional",
      "level": "hard",
      "question": "If a=10, b=20, c=30. Condition (a<b<c) result?",
      "options": [
        "true",
        "false",
        "30",
        "10"
      ],
      "answer": "true"
    },
    {
      "id": 138,
      "type": "conditional",
      "level": "medium",
      "question": "Which loop condition is checked AFTER the first run?",
      "options": [
        "for",
        "while",
        "do-while",
        "foreach"
      ],
      "answer": "do-while"
    },
    {
      "id": 139,
      "type": "conditional",
      "level": "easy",
      "question": "Result of (true && false)?",
      "options": [
        "true",
        "false",
        "null",
        "undefined"
      ],
      "answer": "false"
    },
    {
      "id": 140,
      "type": "conditional",
      "level": "hard",
      "question": "JavaScript 'switch' uses which comparison?",
      "options": [
        "==",
        "===",
        "!=",
        "contains"
      ],
      "answer": "==="
    },
    {
      "id": 141,
      "type": "aptitude",
      "level": "easy",
      "question": "What is 15% of 200?",
      "options": [
        "20",
        "30",
        "40",
        "15"
      ],
      "answer": "30"
    },
    {
      "id": 142,
      "type": "aptitude",
      "level": "easy",
      "question": "Complete the series: 2, 4, 8, 16, ...",
      "options": [
        "24",
        "30",
        "32",
        "64"
      ],
      "answer": "32"
    },
    {
      "id": 143,
      "type": "aptitude",
      "level": "medium",
      "question": "A train travels 300km in 5 hours. What is its speed?",
      "options": [
        "50 km/h",
        "60 km/h",
        "70 km/h",
        "80 km/h"
      ],
      "answer": "60 km/h"
    },
    {
      "id": 144,
      "type": "aptitude",
      "level": "medium",
      "question": "If 3x + 5 = 20, what is x?",
      "options": [
        "3",
        "5",
        "6",
        "15"
      ],
      "answer": "5"
    },
    {
      "id": 145,
      "type": "aptitude",
      "level": "hard",
      "question": "What is the square root of 625?",
      "options": [
        "15",
        "25",
        "35",
        "45"
      ],
      "answer": "25"
    },
    {
      "id": 146,
      "type": "aptitude",
      "level": "easy",
      "question": "Which number is prime?",
      "options": [
        "4",
        "9",
        "11",
        "15"
      ],
      "answer": "11"
    },
    {
      "id": 147,
      "type": "aptitude",
      "level": "medium",
      "question": "Average of 10, 20, 30, 40 is...?",
      "options": [
        "20",
        "25",
        "30",
        "50"
      ],
      "answer": "25"
    },
    {
      "id": 148,
      "type": "aptitude",
      "level": "hard",
      "question": "A shirt is $40 after a 20% discount. Original price?",
      "options": [
        "$45",
        "$48",
        "$50",
        "$60"
      ],
      "answer": "$50"
    },
    {
      "id": 149,
      "type": "aptitude",
      "level": "easy",
      "question": "Next prime number after 7 is...?",
      "options": [
        "8",
        "9",
        "11",
        "13"
      ],
      "answer": "11"
    },
    {
      "id": 150,
      "type": "aptitude",
      "level": "medium",
      "question": "Probability of getting Head in a coin toss?",
      "options": [
        "1",
        "0",
        "0.5",
        "0.25"
      ],
      "answer": "0.5"
    },
    {
      "id": 151,
      "type": "aptitude",
      "level": "hard",
      "question": "What is the area of a circle with radius 7 (use pi=22/7)?",
      "options": [
        "154",
        "44",
        "49",
        "100"
      ],
      "answer": "154"
    },
    {
      "id": 152,
      "type": "aptitude",
      "level": "easy",
      "question": "Smallest three digit number is...?",
      "options": [
        "100",
        "101",
        "111",
        "999"
      ],
      "answer": "100"
    },
    {
      "id": 153,
      "type": "aptitude",
      "level": "medium",
      "question": "If 'APPLE' is '12234', 'PLEA' is...?",
      "options": [
        "2341",
        "3421",
        "2331",
        "1234"
      ],
      "answer": "3421"
    },
    {
      "id": 154,
      "type": "aptitude",
      "level": "hard",
      "question": "Volume of a cube with side 4 is...?",
      "options": [
        "16",
        "24",
        "64",
        "12"
      ],
      "answer": "64"
    },
    {
      "id": 155,
      "type": "aptitude",
      "level": "easy",
      "question": "How many minutes in 2 hours?",
      "options": [
        "60",
        "100",
        "120",
        "150"
      ],
      "answer": "120"
    },
    {
      "id": 156,
      "type": "aptitude",
      "level": "medium",
      "question": "Which is greater: 0.5 or 0.05?",
      "options": [
        "0.5",
        "0.05",
        "Equal",
        "None"
      ],
      "answer": "0.5"
    },
    {
      "id": 157,
      "type": "aptitude",
      "level": "hard",
      "question": "Angle of a straight line is...?",
      "options": [
        "90",
        "180",
        "270",
        "360"
      ],
      "answer": "180"
    },
    {
      "id": 158,
      "type": "aptitude",
      "level": "easy",
      "question": "Sum of angles in a triangle?",
      "options": [
        "90",
        "180",
        "360",
        "270"
      ],
      "answer": "180"
    },
    {
      "id": 159,
      "type": "aptitude",
      "level": "medium",
      "question": "1, 1, 2, 3, 5, 8, ...?",
      "options": [
        "10",
        "11",
        "13",
        "15"
      ],
      "answer": "13"
    },
    {
      "id": 160,
      "type": "aptitude",
      "level": "hard",
      "question": "If 'RED' is 27, 'BLUE' is...?",
      "options": [
        "30",
        "40",
        "50",
        "60"
      ],
      "answer": "40"
    }
  ]
};
