export default function Avatar({ name, size = 40 }) {
  const firstLetter = name?.charAt(0)?.toUpperCase() || "?";

  // Gmail-like color palette
  const colors = [
    "#1E88E5", "#D81B60", "#43A047", "#FB8C00",
    "#8E24AA", "#00897B", "#3949AB", "#F4511E"
  ];

  // Pick color based on hash of name
  const index = name
    ? name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
    : 0;

  const bgColor = colors[index];

  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: bgColor,
      }}
      className="rounded-full flex items-center justify-center text-white font-medium text-lg"
    >
      {firstLetter}
    </div>
  );
}
