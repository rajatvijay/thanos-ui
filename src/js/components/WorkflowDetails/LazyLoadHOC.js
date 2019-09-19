import React, { Component, createRef } from "react";

class LazyLoadHOC extends Component {
  state = {
    inView: false
  };
  rootRef = createRef();

  componentDidMount() {
    const { threshold } = this.props;
    // Feature detection
    if ("IntersectionObserver" in window) {
      const placeholderRootNode = this.rootRef.current;
      const observerConfig = {
        rootMargin: "0px",
        threshold
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
          "NextStepPlaceholder",
          "boundingClientRect",
          entry.boundingClientRect
        );
        console.log(
          "NextStepPlaceholder",
          "intersectionRatio",
          entry.intersectionRatio
        );
        console.log(
          "NextStepPlaceholder",
          "intersectionRect",
          entry.intersectionRect,
          this.props.extras
        );

        this.props.onInViewCallback && this.props.onInViewCallback();
        this.setState({ inView: true });
      }
    });
  };

  componentDidCatch(error) {
    console.error(error);
  }

  render() {
    const { children, defaultElem, rootStyle = {} } = this.props;
    const { inView } = this.state;
    return (
      <div style={rootStyle} ref={this.rootRef}>
        {inView ? children : defaultElem}
      </div>
    );
  }
}

export default LazyLoadHOC;
