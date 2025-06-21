// components/LanguageShowdown.jsx
import { useState, useEffect } from "react";

const lines = [
  "C++… a true chad.",
  "JavaScript => LeetCode lets you. Your interviewer regrets letting you.",
  "Python qck n simple",
  "Java… old reliable.",
  "C… perfect for when you’d rather fight pointers than the actual problem.",
];

export default function LanguageShowdown() {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const full = lines[idx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && displayed.length < full.length) {
      timeout = setTimeout(
        () => setDisplayed(full.slice(0, displayed.length + 1)),
        100
      );
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(
        () => setDisplayed(full.slice(0, displayed.length - 1)),
        50
      );
    } else if (!deleting && displayed.length === full.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIdx((idx + 1) % lines.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, idx]);

  return (
    <div className="mt-6 flex items-center gap-3">
      <span className="font-mono text-lg text-gray-900">
        {displayed}
        <span className="inline-block w-px h-6 bg-gray-900 ml-1 animate-blink" />
      </span>
    </div>
  );
}
