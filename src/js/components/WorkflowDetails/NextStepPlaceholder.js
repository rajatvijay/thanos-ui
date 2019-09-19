import React, { Component, createRef } from "react";
import { css } from "emotion";

// TODO: Rename
class NextStepPlaceholder extends Component {
  state = {
    inView: false
  };
  rootRef = createRef();

  componentDidMount() {
    // Feature detection
    if ("IntersectionObserver" in window) {
      const placeholderRootNode = this.rootRef.current;
      const observerConfig = {
        rootMargin: "0px",
        threshold: 0.2
      };
      const observer = new IntersectionObserver(
        this.onComesInViewport,
        observerConfig
      );
      observer.observe(placeholderRootNode);
    }
  }

  onComesInViewport = entries => {
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
          entry.intersectionRect
        );

        this.props.onInViewCallback && this.props.onInViewCallback();
        this.setState({ inView: true });
      }
    });
  };

  componentDidCatch(error) {
    console.error(error);
  }

  renderPlaceholderElem = () => {
    return (
      <div
        className={css`
          background: white;
          min-height: 60vh;
          margin-bottom: 40px;
          background-color: white;
          box-shadow: 0 2px 14px 0 rgba(0, 0, 0, 0.09);
        `}
      ></div>
    );
  };

  render() {
    const { children } = this.props;
    const { inView } = this.state;
    return (
      <div ref={this.rootRef}>
        {inView ? (
          // TODO: This styling should not be its part, but can't re style step body form now :pensive:
          <div style={{ marginBottom: 40 }}>{children}</div>
        ) : (
          this.renderPlaceholderElem()
        )}
      </div>
    );
  }
}

export default NextStepPlaceholder;
