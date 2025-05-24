// components/ui/card.jsx

export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl overflow-hidden ${className}`}>
      {children}
    </div>
  );
}
