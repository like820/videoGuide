let video = document.getElementById('video');

let index = document.querySelector('.index');
let menuContainer = document.querySelector('.menu-container');
let currentStepTitle = document.querySelector('.current-step-title');

let isMenuOpen = false;

function updateVideoTime(scrollPosition) {
  let steps = document.querySelectorAll('.guide-steps section');
  let currentStep = null;
  let nextStep = null;

  for (let i = 0; i < steps.length; i++) {
    let stepTop = steps[i].offsetTop;
    let stepBottom = stepTop + steps[i].offsetHeight;

    if (scrollPosition >= stepTop && scrollPosition < stepBottom) {
      currentStep = steps[i];
      nextStep = steps[i + 1] || steps[i];
      break;
    }
  }

  if (currentStep && nextStep) {
    let currentTimestamp = parseFloat(currentStep.dataset.timestamp);
    let nextTimestamp = parseFloat(nextStep.dataset.timestamp);
    let stepProgress = (scrollPosition - currentStep.offsetTop) / currentStep.offsetHeight;
    
    let time = currentTimestamp + (nextTimestamp - currentTimestamp) * stepProgress;
    
    if (!isNaN(time) && isFinite(time)) {
      video.currentTime = time;
    }
  }
}

function updateProgressBar(scrollPosition) {
  let docHeight = document.documentElement.scrollHeight - window.innerHeight;
  let scrollPercentage = (scrollPosition / docHeight) * 100;
  document.getElementById('progressBar').style.width = scrollPercentage + '%';
}

function updateCurrentStep() {
  let scrollPosition = window.scrollY + (window.innerHeight / 2);
  let steps = document.querySelectorAll('.guide-steps section');
  let currentStep = null;

  steps.forEach((step) => {
    let stepTop = step.offsetTop;
    let stepBottom = stepTop + step.offsetHeight;

    if (scrollPosition >= stepTop && scrollPosition < stepBottom) {
      currentStep = step;
    }
  });

  if (currentStep) {
    let stepTitle = currentStep.querySelector('h3').textContent;
    currentStepTitle.textContent = stepTitle;
    
    // Remove 'current' class from all steps
    document.querySelectorAll('.index a').forEach(a => a.classList.remove('current'));
    
    // Add 'current' class to the current step
    let currentStepLink = document.querySelector(`.index a[href="#${currentStep.id}"]`);
    if (currentStepLink) {
      currentStepLink.classList.add('current');
    }
  }
}

function smoothScrollToCenter(elementId) {
  let element = document.getElementById(elementId);
  if (element) {
    let elementRect = element.getBoundingClientRect();
    let absoluteElementTop = elementRect.top + window.pageYOffset;
    let middle = absoluteElementTop - (3*window.innerHeight / 4) + (elementRect.height / 2);
    window.scrollTo({
      top: middle,
      behavior: 'smooth'
    });
    
    // Close the menu after clicking a step
    if (isMenuOpen) {
      toggleMenu();
    }
  }
}

// Add click event listeners to the index links
document.querySelectorAll('.index a').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    let targetId = this.getAttribute('href').slice(1);
    smoothScrollToCenter(targetId);
  });
});

window.addEventListener('scroll', function () {
  let scrollPosition = window.scrollY;
  
  updateVideoTime(scrollPosition);
  updateProgressBar(scrollPosition);
  updateCurrentStep();


//menu hide 

  // if (scrollPosition > 0) {
  //   menuContainer.classList.add('scrolled');
  // } else {
  //   menuContainer.classList.remove('scrolled');
  // }
});

// Remove the mousemove event listener since we're not using mouse position anymore

window.addEventListener('load', function() {
  video.pause();
  video.currentTime = 0;
  updateProgressBar(window.scrollY);
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'f') {
    console.log('Current video frame:', video.currentTime);
  }
});
