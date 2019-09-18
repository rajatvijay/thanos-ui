import React, { Component, createRef } from "react";
import { css } from "emotion";

class NextStepPlaceholder extends Component {
  state = {
    inView: false
  };
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
        this.props.onInViewCallback();
        this.setState({ inView: true });
      }
    });
  };

  componentDidCatch(error) {
    console.error(error);
  }

  render() {
    const { children, style = {} } = this.props;
    const { inView } = this.state;
    return (
      <div
        ref={this.rootRef}
        className={css`
          background: white;
          min-height: 500px;
        `}
        style={style}
      >
        {inView && children}
      </div>
    );
  }
}

export default NextStepPlaceholder;
