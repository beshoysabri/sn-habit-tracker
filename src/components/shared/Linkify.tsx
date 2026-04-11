const URL_REGEX = /(https?:\/\/[^\s<>"{}|\\^`[\]]+)/g;

interface LinkifyProps {
  children: string;
}

export function Linkify({ children }: LinkifyProps) {
  if (!children) return null;

  const parts = children.split(URL_REGEX);
  if (parts.length === 1) return <>{children}</>;

  return (
    <>
      {parts.map((part, i) =>
        URL_REGEX.test(part) ? (
          <a
            key={i}
            href={part}
            className="ht-link"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </a>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
