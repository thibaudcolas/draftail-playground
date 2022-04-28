import React, { Component } from "react";

export interface RavenWindow extends Window {
  Raven: any;
}

declare let window: RavenWindow;

type Props = {
  children: React.ReactNode;
};

type State = {
  error?: Error;
};

class SentryBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: undefined };
  }

  componentDidCatch(error: Error, errorInfo: Object) {
    const isRavenAvailable = !!window.Raven;
    this.setState({ error });

    if (isRavenAvailable) {
      window.Raven.captureException(error, { extra: errorInfo });
    }
  }

  render() {
    const { children } = this.props;
    const { error } = this.state;
    const isRavenAvailable = !!window.Raven;

    return error ? (
      <div className="DraftEditor-root">
        <div className="DraftEditor-editorContainer">
          <div className="public-DraftEditor-content">
            <div className="u-text-center">
              <p>Oops. The editor just crashed.</p>
              <p>
                Our team has been notified. You can provide us with more
                information if you want to.
              </p>
              <div>
                {isRavenAvailable ? (
                  <button
                    type="button"
                    onClick={() =>
                      window.Raven.lastEventId() &&
                      window.Raven.showReportDialog()
                    }
                  >
                    Submit a report
                  </button>
                ) : (
                  <a
                    href="https://github.com/thibaudcolas/draftail-playground/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      textDecoration: "underline",
                    }}
                  >
                    Open a GitHub issue
                  </a>
                )}
                <span>&nbsp;</span>
                <button type="button" onClick={() => window.location.reload()}>
                  Reload the page
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      children
    );
  }
}

export default SentryBoundary;
