(() => {
  class HNBlocklist {
    _removedCount = 0;

    removePatterns = [
      /\.ai\)/g,
      /\bagent[s]?\b/gi,
      /agentic/gi,
      /\bAIs?\b/g,
      /a\.i\./gi,
      /anthropic/gi,
      /apple intelligence/gi,
      /artificial intelligence/gi,
      /\bChatGPT\b/gi,
      /claude/gi,
      /Codex/g,
      /\bcodex\b/gi,
      /\bcopilot\b/gi,
      /\bCursor\b/g,
      /\bDALL-?E\b/gi,
      /\bdeepseek\b/gi,
      /diffusion/gi,
      /\bembedding[s]?\b/gi,
      /\bgemini\b/gi,
      /clawd/gi,
      /generative/gi,
      /GPT/gi,
      /\bfoundation model/gi,
      /\bgrok\b/gi,
      /\binference\b/gi,
      /\bllama\b/gi,
      /LLM[s]?/g,
      /machine learning/gi,
      /MCP/g,
      /\bmidjourney\b/gi,
      /\bmistral\b/gi,
      /\bML\b/g,
      /\bmodels?\b/gi,
      /moltbot/gi,
      /mythos/gi,
      /neural/gi,
      /OpenAI/gi,
      /openclaw/gi,
      /\bopus\b/gi,
      /\bperplexity\b/gi,
      /prompt[s]?\b/gi,
      /\bRAG\b/g,
      /simonwillison/g,
      /\bstable diffusion\b/gi,
      /\btokens?\b/gi,
      /\btransformer[s]?\b/gi,
      /\bvector database/gi,
      /vibe ?code?/gi,
    ];

    showNotification = true;

    urlPatterns = [/news\.ycombinator\.com/i];

    constructor({ removePatterns, showNotification, urlPatterns } = {}) {
      this.removePatterns = removePatterns ?? this.removePatterns;
      this.showNotification = showNotification ?? this.showNotification;
      this.urlPatterns = urlPatterns ?? this.urlPatterns;

      this.run();
    }

    run = () => {
      const {
        location: { href },
      } = window;

      if (
        !this.urlPatterns.some((pattern) => {
          return href.match(pattern);
        })
      ) {
        return;
      }

      const submissions = Array.from(document.querySelectorAll(".submission"));

      for (const submission of submissions) {
        this._testSubmission(submission);
      }

      this._notify();
    };

    _notify = () => {
      if (!this.showNotification || this._removedCount === 0) {
        return;
      }

      const notification = document.createElement("div");
      notification.textContent = `Filtered ${this._removedCount} ${
        this._removedCount === 1 ? "submission" : "submissions"
      }`;

      const timeout = 2500; /* how long to show the notification */
      const transitionLength = 300;

      Object.assign(notification.style, {
        backgroundColor: "#2c5282",
        borderRadius: "6px",
        bottom: "20px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        color: "#ffffff",
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: "15px",
        fontWeight: "500",
        left: "50%",
        opacity: "0",
        padding: "12px 24px",
        position: "fixed",
        transform: "translateX(-50%)",
        transition: `opacity ${transitionLength} ease-in-out`,
        zIndex: "10000",
      });

      document.body.appendChild(notification);

      requestAnimationFrame(() => {
        notification.style.opacity = "1";
      });

      setTimeout(() => {
        notification.style.opacity = "0";
      }, timeout);

      setTimeout(() => {
        notification.remove();
      }, timeout + transitionLength);
    };

    _removeSubmission = (submission) => {
      const removeElements = [
        submission,
        submission.nextSibling,
        submission.nextSibling.nextSibling,
      ].filter(Boolean);

      for (const element of removeElements) {
        element.remove();
      }

      this._removedCount++;
    };

    _testSubmission = (submission) => {
      const title = submission.querySelector(".titleline")?.textContent;

      if (!title) {
        return;
      }

      if (
        !this.removePatterns.some((pattern) => {
          return title.match(pattern);
        })
      ) {
        return;
      }

      this._removeSubmission(submission);
    };
  }

  new HNBlocklist();
})();
