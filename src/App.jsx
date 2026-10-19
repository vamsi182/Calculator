
import { useState } from "react";
import "./App.css";

const buttons = [
  { id: "clear", label: "AC", type: "clear" },
  { id: "divide", label: "/", type: "operator" },
  { id: "multiply", label: "*", type: "operator" },
  { id: "subtract", label: "-", type: "operator" },
  { id: "seven", label: "7", type: "number" },
  { id: "eight", label: "8", type: "number" },
  { id: "nine", label: "9", type: "number" },
  { id: "add", label: "+", type: "operator" },
  { id: "four", label: "4", type: "number" },
  { id: "five", label: "5", type: "number" },
  { id: "six", label: "6", type: "number" },
  { id: "equals", label: "=", type: "equals" },
  { id: "one", label: "1", type: "number" },
  { id: "two", label: "2", type: "number" },
  { id: "three", label: "3", type: "number" },
  { id: "zero", label: "0", type: "number" },
  { id: "decimal", label: ".", type: "number" },
];

function calculate(expression) {
  try {
    const result = Function(
      `"use strict"; return (${expression})`
    )();

    if (typeof result !== "number" || !Number.isFinite(result)) {
      return "Error";
    }

    return String(Number(result.toPrecision(12)));
  } catch {
    return "Error";
  }
}

function App() {
  const [expression, setExpression] = useState("");
  const [display, setDisplay] = useState("0");
  const [finished, setFinished] = useState(false);

  function handleClick(button) {
    const value = button.label;

    if (button.id === "clear") {
      setExpression("");
      setDisplay("0");
      setFinished(false);
      return;
    }

    if (button.id === "equals") {
      if (!expression || /[+\-*/.]$/.test(expression)) return;

      const result = calculate(expression);
      setDisplay(result);
      setExpression(result === "Error" ? "" : result);
      setFinished(true);
      return;
    }

    if (button.type === "number" && value !== ".") {
      let next = finished ? "" : expression;

      if (finished) setFinished(false);

      if (/Error/.test(display)) next = "";

      // Prevent multiple leading zeros.
      if (
        value === "0" &&
        /(?:^|[+\-*/])0$/.test(next)
      ) {
        return;
      }

      next += value;
      setExpression(next);

      const currentNumber = next.split(/[+\-*/]/).pop();
      setDisplay(currentNumber || "0");
      return;
    }

    if (value === ".") {
      let next = finished ? "" : expression;

      if (finished) setFinished(false);
      if (/Error/.test(display)) next = "";

      const currentNumber = next.split(/[+\-*/]/).pop();

      if (currentNumber.includes(".")) return;

      if (!currentNumber) next += "0";
      next += ".";

      setExpression(next);
      setDisplay(next.split(/[+\-*/]/).pop());
      return;
    }

    if (button.type === "operator") {
      let next = expression;

      if (finished) {
        next = display === "Error" ? "" : display;
        setFinished(false);
      }

      if (!next && value !== "-") return;

      // Allow a negative number after another operator.
      if (/[+\-*/]$/.test(next)) {
        if (value === "-" && !next.endsWith("-")) {
          next += "-";
        } else {
          next = next.replace(/[+\-*/]+$/, value);
        }
      } else {
        next += value;
      }

      setExpression(next);
      setDisplay(value);
    }
  }

  return (
    <main className="page">
      <section className="calculator">
        <div className="heading">
          <span className="eyebrow">REACT PROJECT</span>
          <h1>Calculator</h1>
          <p>Simple math. Clear mind.</p>
        </div>

        <div className="screen">
          <div className="expression">
            {expression || "Ready to calculate"}
          </div>

          <div id="display" className="display" aria-live="polite">
            {display}
          </div>
        </div>

        <div className="buttons">
          {buttons.map((button) => (
            <button
              key={button.id}
              id={button.id}
              type="button"
              className={`key ${button.type} ${button.id}`}
              onClick={() => handleClick(button)}
            >
              {button.label}
            </button>
          ))}
        </div>

        <p className="footer">BUILT WITH REACT</p>
      </section>
    </main>
  );
}

export default App;
