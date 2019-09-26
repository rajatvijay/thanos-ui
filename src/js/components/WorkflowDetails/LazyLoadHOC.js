import React, { Component, createRef } from "react";

class LazyLoadHOC extends Component {
  state = {
    inView: false
  };
  rootRef = createRef();

  componentDidMount() {
    // Taking it as a prop, so that the user can decide the threshold of lazy laoding
    // tweak it to load earlier and faster
    const { threshold, bypassObserver } = this.props;

    if (bypassObserver) {
      this.props.onInViewCallback && this.props.onInViewCallback();
      this.setState({ inView: true });
    }
    // Feature detection
    else if ("IntersectionObserver" in window) {
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
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.props.onInViewCallback && this.props.onInViewCallback();
        this.setState({ inView: true });
      }
    });
  };

  componentDidCatch(error) {
    // DO nothing, just don't let it burst
  }

  render() {
    const { children, defaultElement, rootStyle = {} } = this.props;
    const { inView } = this.state;
    return (
      <div style={rootStyle} ref={this.rootRef}>
        {inView ? children : defaultElement}
      </div>
    );
  }
}

export default LazyLoadHOC;
