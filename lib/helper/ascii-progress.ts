export interface ProgressBarOptions {
  total: number;
  width: number;
  completedChar: string;
  incompletedChar: string;
  headChar?: string;
}

const defaults = {
  total: 100,
  width: 30,
  completedChar: '=',
  incompletedChar: '-',
};

export class ProgressBar {
  private readonly _options: ProgressBarOptions;
  private _current = 0;
  private _lastRender?: string;

  constructor(private readonly _format: string, options: Partial<ProgressBarOptions> = {}) {
    if (!this._format.includes(':bar')) {
      throw new Error('At least a :bar token is required.');
    }

    this._options = { ...defaults, ...options };
    this.render();
  }

  get lastRender() {
    return this._lastRender;
  }

  public update(percentage: number, customTokens?: Record<string, string>): string {
    if (percentage > 1) {
      throw new Error('Invalid percentage. Percentages are specified in a range from 0 to 1.');
    }

    const { total } = this._options;
    const goal = Math.floor(percentage * total);
    const delta = goal - this._current;
    return this.tick(delta, customTokens);
  }

  public tick(delta: number, customTokens?: Record<string, string>): string {
    if (delta === 0) {
      return this.render(customTokens);
    }

    if (delta > this._options.total) {
      throw new Error('Invalid delta. Bigger than total value.');
    }

    this._current += delta;
    return this.render(customTokens);
  }

  private render(customTokens?: Record<string, string>): string {
    const { total, width, completedChar, incompletedChar, headChar } = this._options;
    const progress = Math.min(Math.max(this._current / total), 1);
    const percentage = Math.floor(progress * 100);

    const completedLength = Math.round(width * progress);
    const completedChars = Array(completedLength).fill(completedChar);
    const incompletedChars = Array(width - completedLength).fill(incompletedChar);

    if (completedLength > 0 && completedLength !== width && headChar != null) {
      // Add head character
      completedChars[completedChars.length - 1] = headChar;
    }

    // Populate bar template
    let output = this._format
      .replace(':current', String(this._current))
      .replace(':total', String(total))
      .replace(':percent', `${percentage.toFixed(0)}%`)
      .replace(':bar', completedChars.join('') + incompletedChars.join(''));

    // Replace customTokens
    if (customTokens != null) {
      Object.keys(customTokens).forEach((token) => {
        const value = customTokens[token];
        output = output.replace(`:${token}`, value);
      });
    }

    this._lastRender = output;

    return output;
  }
}
