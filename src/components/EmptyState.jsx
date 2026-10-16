export default function EmptyState({ icon = "📭", title, message }) {
  return (
    <div className="text-center p-8">
      <div className="text-5xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-700 mb-1">{title}</h3>
      {message && <p className="text-sm text-gray-500">{message}</p>}
    </div>
  );
}
