import "./styles.css";
import { useRef, useState } from "react";
import translit from "cyrillic-to-translit-js";
import DeleteSvg from "../../assets/delete.svg?react";

const TranslitList = () => {
  const [inputValue, setInputValue] = useState("");
  const [words, setWords] = useState([
    { original: "Привет 👋🏻", transliterated: "Privet" },
  ]);
  const [message, setMessage] = useState("");
  const textRefs = useRef([]);

  const handleAddWord = () => {
    if (inputValue.trim() === "") return;

    const newWord = {
      original: inputValue,
      transliterated: translit().transform(inputValue),
    };

    setWords([...words, newWord]);
    setMessage(`Текст ${inputValue} успешно добавлен!`);
    console.log(newWord);
    setInputValue("");
    setTimeout(() => setMessage(""), 2000);
  };

  const handleDeleteWord = (index) => {
    if (index === 0) return;
    const newWords = words.filter((_, i) => i !== index);
    setWords(newWords);
    setMessage(`Текст "${words[index].original}" успешно удален!`);
    setTimeout(() => setMessage(""), 2000);
  };

  const handleResetWords = () => {
    setWords([{ original: "Привет", transliterated: "Privet" }]);
    setMessage(<strong>Список очищен!</strong>);
    setTimeout(() => setMessage(""), 2000);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleAddWord();
    }
  };

  const isTruncated = (index) => {
    const textElement = textRefs.current[index];
    if (textElement) {
      const containerWidth = textElement.clientWidth;
      const textWidth = textElement.scrollWidth;
      return textWidth > containerWidth;
    }
    return false;
  };

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
      {message && <div className="message">{message}</div>}
      <div className="listWord">
        <div className="leftBlock">
          {words.map((word, index) => (
            <div className="words" key={index}>
              <div
                className="tooltip"
                data-title={isTruncated(index) ? word.original : undefined}
              >
                <span>{index + 1}</span>
                <p
                  className="wordText"
                  ref={(el) => (textRefs.current[index] = el)}
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
                  isTruncated(index) ? word.transliterated : undefined
                }
              >
                <span className="indexRightBlock">{index + 1}</span>
                <p
                  className="wordText"
                  ref={(el) => (textRefs.current[index] = el)}
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
