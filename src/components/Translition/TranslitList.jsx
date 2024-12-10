import "./styles.css";
import { useCallback, useEffect, useRef, useState } from "react";
import translit from "cyrillic-to-translit-js";
import DeleteSvg from "../../assets/delete.svg?react";

const TranslitList = () => {
  const [inputValue, setInputValue] = useState("");
  const [words, setWords] = useState([
    {
      original: (
        <>
          Привет{" "}
          <span className="hello" style={{ fontSize: "15px" }}>
            👋🏻{" "}
          </span>
        </>
      ),
      transliterated: "Privet",
    },
  ]);
  const leftTextRefs = useRef([]);
  const rightTextRefs = useRef([]);
  const [truncatedStates, setTruncatedStates] = useState({
    left: [],
    right: [],
  });

  const handleAddWord = () => {
    if (inputValue.trim() === "") return;

    const newWord = {
      original: inputValue,
      transliterated: translit().transform(inputValue),
    };

    setWords((prevWords) => [...prevWords, newWord]);
    console.log(newWord);
    setInputValue("");
  };

  const handleDeleteWord = (index) => {
    if (index === 0) return;
    const newWords = words.filter((_, i) => i !== index);
    setWords(newWords);
  };

  const handleResetWords = () => {
    setWords([{ original: "Привет", transliterated: "Privet" }]);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleAddWord();
    }
  };

  const checkTruncation = useCallback(() => {
    const leftStates = words.map((_, index) => {
      const textElement = leftTextRefs.current[index];
      if (textElement) {
        const containerWidth = textElement.clientWidth;
        const textWidth = textElement.scrollWidth;
        return textWidth > containerWidth;
      }
      return false;
    });

    const rightStates = words.map((_, index) => {
      const textElement = rightTextRefs.current[index];
      if (textElement) {
        const containerWidth = textElement.clientWidth;
        const textWidth = textElement.scrollWidth;
        return textWidth > containerWidth;
      }
      return false;
    });

    setTruncatedStates({ left: leftStates, right: rightStates });
  }, [words]);

  useEffect(() => {
    leftTextRefs.current = leftTextRefs.current.slice(0, words.length);
    rightTextRefs.current = rightTextRefs.current.slice(0, words.length);

    checkTruncation();
  }, [words, checkTruncation]);

  return (
    <section className="container">
      <h1>T.R.A.N.S.L.I.T.</h1>
      <div className="addWord">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Начните вводить текст"
        />
        <button className="addBtn" onClick={handleAddWord}>
          Перевести
        </button>
      </div>
      <div className="listWord">
        <div className="leftBlock">
          {words.map((word, index) => (
            <div className="words" key={index}>
              <div
                className="tooltip"
                data-title={
                  truncatedStates.left[index] ? word.original : undefined
                }
              >
                <span className="number">{index + 1}</span>
                <p
                  className={`wordText ${index !== 0 ? "truncate" : ""}`}
                  ref={(el) => (leftTextRefs.current[index] = el)}
                >
                  {word.original}
                </p>
              </div>
              <button
                className="deleteBtnLeftBlock"
                onClick={() => handleDeleteWord(index)}
              >
                <DeleteSvg />
              </button>
            </div>
          ))}
        </div>

        <div className="rightBlock">
          {words.map((word, index) => (
            <div className="words" key={index}>
              <div
                className="tooltip"
                data-title={
                  truncatedStates.right[index] ? word.transliterated : undefined
                }
              >
                <span className="indexRightBlock">{index + 1}</span>
                <p
                  className={`wordText ${index !== 0 ? "truncate" : ""}`}
                  ref={(el) => (rightTextRefs.current[index] = el)}
                >
                  {word.transliterated}
                </p>
              </div>
              <button onClick={() => handleDeleteWord(index)}>
                <DeleteSvg />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button className="reset" onClick={handleResetWords}>
        <DeleteSvg />
        Очистить всё
      </button>
    </section>
  );
};

export default TranslitList;
