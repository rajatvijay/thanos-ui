import React, { Component, createRef } from "react";

class WhenInViewHOC extends Component {
  rootRef = createRef();

  componentDidMount() {
    // Feature detection
    if ("IntersectionObserver" in window) {
      const placeholderRootNode = this.rootRef.current;
      const observerConfig = {
        rootMargin: "0px",
        threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
      };
      const observer = new IntersectionObserver(
        this.whenComesInViewport,
        observerConfig
      );
      observer.observe(placeholderRootNode);
    }
  }

  whenComesInViewport = entries => {
    console.log("NextStepPlaceholder", entries.length);
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        console.log(
          "outside",
          "boundingClientRect",
          entry.boundingClientRect.top,
          this.props.extra
        );

        // TODO: This condition needs to be more scientific
        if (entry.boundingClientRect.top <= 250) {
          console.log(
            "inside",
            "boundingClientRect",
            entry.boundingClientRect.top,
            this.props.extra
          );
          this.props.onInViewCallback && this.props.onInViewCallback();
        }
      }
    });
  };

  componentDidCatch(error) {
    console.error(error);
  }

  render() {
    const { children } = this.props;
    return <div ref={this.rootRef}>{children}</div>;
  }
}

export default WhenInViewHOC;
