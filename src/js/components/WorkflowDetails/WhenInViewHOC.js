import React, { Component, createRef } from "react";

class WhenInViewHOC extends Component {
  rootRef = createRef();

  componentDidMount() {
    // Feature detection
    if ("IntersectionObserver" in window) {
      const placeholderRootNode = this.rootRef.current;
      const observerConfig = {
        rootMargin: "0px",
        // 400 why? => Making it more sensitive to
        // make the step transition in the left sidebar more accurate
        threshold: buildThresholdList(400)
      };
      const observer = new IntersectionObserver(
        this.whenComesInViewport,
        observerConfig
      );
      observer.observe(placeholderRootNode);
    }
  }

  whenComesInViewport = entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        /**
         * 200px is the distance of the element from top
         * 200 is a good enough aussumption,
         * for the step to appear as focussed in the viewport
         * 60px is the height of the header
         * 40px is the margin between two stepbody element
         * 200 - 60 removes the conflicts between the previous element
         * and the next element to be as current at the same time
         * equality is used with top condition to give the `top` condition
         * so as to prioritise the next element to be as current, when scrolling
         */
        if (
          entry.boundingClientRect.top <= 200 &&
          entry.boundingClientRect.bottom > 200 - 40
        ) {
          this.props.onInViewCallback && this.props.onInViewCallback();
        }
      }
    });
  };

  componentDidCatch(error) {
    // DO nothing, just don't let it burst
  }

  render() {
    // It requires id,
    // to make it `forcefully` come in view
    const { children, id } = this.props;
    return (
      <div id={id} ref={this.rootRef}>
        {children}
      </div>
    );
  }
}

export default WhenInViewHOC;

///////////////////////////////////////////////////////////////////////////
// Utils

function buildThresholdList(numSteps) {
  const thresholds = [];

  for (let i = 1.0; i <= numSteps; i++) {
    const ratio = i / numSteps;
    thresholds.push(ratio);
  }

  thresholds.push(0);
  return thresholds;
}
