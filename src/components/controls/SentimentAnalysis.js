import PropTypes from "prop-types";
import React from "react";
import { ToolbarButton } from "draftail";
import { postRequest } from "../../utils";

// https://console.bluemix.net/docs/services/tone-analyzer/using-tone.html#tones
// http://kt.ijs.si/data/Emoji_sentiment_ranking/index.html
const TONES = {
  anger: {
    label: "Anger",
    emoji: "😠",
    id: "anger",
    description:
      "Anger is evoked due to injustice, conflict, humiliation, negligence, or betrayal. If anger is active, the individual attacks the target, verbally or physically. If anger is passive, the person silently sulks and feels tension and hostility. (An emotional tone.)",
  },
  fear: {
    label: "Fear",
    emoji: "😨",
    id: "fear",
    description:
      "Fear is a response to impending danger. It is a survival mechanism that is triggered as a reaction to some negative stimulus. Fear can be a mild caution or an extreme phobia. (An emotional tone.)",
  },
  joy: {
    label: "Joy",
    emoji: "😂",
    id: "joy",
    description:
      "Joy (or happiness) has shades of enjoyment, satisfaction, and pleasure. Joy brings a sense of well-being, inner peace, love, safety, and contentment. (An emotional tone.)",
  },
  sadness: {
    label: "Sadness",
    emoji: "😢",
    id: "sadness",
    description:
      "Sadness indicates a feeling of loss and disadvantage. When a person is quiet, less energetic, and withdrawn, it can be inferred that they feel sadness. (An emotional tone.)",
  },
  analytical: {
    label: "Analytical",
    emoji: "🤔",
    id: "analytical",
    description:
      "An analytical tone indicates a person's reasoning and analytical attitude about things. An analytical person might be perceived as intellectual, rational, systematic, emotionless, or impersonal. (A language tone.)",
  },
  confident: {
    label: "Confident",
    emoji: "😎",
    id: "confident",
    description:
      "A confident tone indicates a person's degree of certainty. A confident person might be perceived as assured, collected, hopeful, or egotistical. (A language tone.)",
  },
  tentative: {
    label: "Tentative",
    emoji: "😕",
    id: "tentative",
    description:
      "A tentative tone indicates a person's degree of inhibition. A tentative person might be perceived as questionable, doubtful, or debatable. (A language tone.)",
  },
};

class SentimentAnalysis extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sentiment: null,
    };
  }

  componentDidMount() {
    const { getEditorState } = this.props;

    setInterval(() => {
      const editorState = getEditorState();
      const content = editorState.getCurrentContent();
      const text = content.getPlainText();

      postRequest("/api/tone", { text }, (analysis) => {
        const tone = analysis.document_tone.tones.reduce((best, t) => {
          if (best) {
            return t.score > best.score ? t : best;
          }

          return t;
        }, null);
        this.setState({
          sentiment: TONES[tone.tone_id],
        });
      });
    }, 10000);
  }
  render() {
    const { sentiment } = this.state;

    return (
      <ToolbarButton
        name="SENTIMENT_ANALYSIS"
        label={sentiment ? `${sentiment.label} ${sentiment.emoji}` : "…"}
        onClick={() => {
          // eslint-disable-next-line no-alert
          window.alert(sentiment ? sentiment.description : null);
        }}
      />
    );
  }
}

SentimentAnalysis.propTypes = {
  getEditorState: PropTypes.func.isRequired,
};

export default SentimentAnalysis;
