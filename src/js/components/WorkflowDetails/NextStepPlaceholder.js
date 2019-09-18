import React, { Component, createRef } from "react";
import { css } from "emotion";

class NextStepPlaceholder extends Component {
  rootRef = createRef();

  componentDidMount() {
    const placeholderRootNode = this.rootRef.current;
    const observerConfig = {
      rootMargin: "0px",
      threshold: 1
    };
    const observer = new IntersectionObserver(
      this.onComesInViewport,
      observerConfig
    );
    observer.observe(placeholderRootNode);
  }

  onComesInViewport = entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // let elem = entry.target;
        // this.props.onInView();
      }
    });
  };

  componentDidCatch(error) {
    console.error(error);
  }

  render() {
    const { style = {} } = this.props;
    return (
      <div
        ref={this.rootRef}
        className={css`
          box-shadow: 1px 5px 8px rgba(0, 0, 0, 0.12);
          margin: 25px;
          padding: 20px;
          background: white;
          min-height: 500px;
        `}
        style={style}
      ></div>
    );
  }
}

export default NextStepPlaceholder;
